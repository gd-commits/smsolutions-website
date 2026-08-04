/* ============================================================
   SPEND MATTERS — scroll-scrubbed WebGL scene
   Hero: pale hanging cables with warm glowing tips.
   On scroll the cables wind themselves into a sphere of
   yarn folds with a molten amber core — the reference look —
   fully procedural, no video to host or buffer.

   Quick tuning:
     STRANDS · PTS  — yarn density
     CABLES         — hanging cables in the hero
     R              — sphere radius
     FOLDS          — wrinkle frequency of the folds
     MORPH_SPAN     — how much scroll the cable→sphere morph takes
   ============================================================ */
(function () {
'use strict';

var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- reveals: 700ms ease-out, per-element delay ---------- */
$$('.rv').forEach(function (el) { el.style.transitionDelay = (el.dataset.delay || 0) + 'ms'; });
var io = new IntersectionObserver(function (en) {
  en.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
$$('.rv').forEach(function (el) { io.observe(el); });

/* ---------- smooth anchor scroll ---------- */
$$('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 40,
               behavior: REDUCED ? 'auto' : 'smooth' });
  });
});

/* ============================================================
   WEBGL
   ============================================================ */
var canvas = document.getElementById('gl');
var ok = typeof THREE !== 'undefined';
if (ok) {
  try {
    var test = document.createElement('canvas');
    ok = !!(test.getContext('webgl') || test.getContext('experimental-webgl'));
  } catch (e) { ok = false; }
}
if (!ok) { if (canvas) canvas.remove(); return; }

var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
var DPR = Math.min(devicePixelRatio, 2);
renderer.setPixelRatio(DPR);
renderer.setSize(innerWidth, innerHeight);

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 60);
cam.position.set(0, 0, 7);

var group = new THREE.Group();
scene.add(group);

var small = innerWidth < 760;

/* ---------------- tunables ---------------- */
var STRANDS   = small ? 150 : 240;   // yarn strands (sphere meridian folds)
var PTS       = small ? 80  : 110;   // points per strand
var CABLES    = small ? 16  : 24;    // visible hanging cables in the hero
var R         = small ? 1.55 : 2.05; // sphere radius
var FOLDS     = 7;                   // fold wrinkle frequency
var MORPH_SPAN = 0.42;               // scroll fraction for cable→sphere

/* ---------------- build geometry ----------------
   Every vertex carries two homes:
   position = hanging-cable state · aSph = yarn-sphere state          */
var hang = [], sph = [], aT = [], aTip = [], aPole = [], aRnd = [], aShade = [];

/* cable paths the strands bundle into while hanging */
var cables = [];
for (var c = 0; c < CABLES; c++) {
  cables.push({
    x: (Math.random() * 2 - 1) * (small ? 3.0 : 5.0),
    z: (Math.random() * 2 - 1) * 1.5,
    top: 3.4 + Math.random() * 0.8,
    len: 3.4 + Math.random() * 3.0,
    bend: (Math.random() * 2 - 1) * 0.8
  });
}

var THETA0 = 0.10, THETA1 = 2.78; /* from front pole, wrapping past the equator */

for (var s = 0; s < STRANDS; s++) {
  var r0 = Math.random();
  var cab = cables[s % CABLES];
  var jx = (Math.random() - 0.5) * 0.10;   /* bundle jitter → cables read as rope */
  var jz = (Math.random() - 0.5) * 0.10;
  var jl = 0.85 + Math.random() * 0.3;

  var phi = (s / STRANDS) * Math.PI * 2 + (Math.random() - 0.5) * 0.5 / STRANDS;
  var wPhase = Math.random() * Math.PI * 2;
  var rPhase = Math.random() * Math.PI * 2;
  var shade = 0.35 + Math.random() * 0.65;  /* dark strands carve the crevices */

  for (var i = 0; i < PTS; i++) {
    var t = i / (PTS - 1);

    /* --- hanging cable --- */
    var hy = cab.top - cab.len * jl * t;
    var hx = cab.x + jx + cab.bend * t * t + Math.sin(t * 5 + s) * 0.05;
    var hz = cab.z + jz + Math.cos(t * 4 + s * 2) * 0.04;
    hang.push(hx, hy, hz);

    /* --- yarn sphere: meridian fold from the front pole --- */
    var th = THETA0 + t * (THETA1 - THETA0);
    var sinT = Math.sin(th), cosT = Math.cos(th);
    /* lateral wiggle gives the fold its wrinkle */
    var wig = Math.sin(t * FOLDS * Math.PI * 2 + wPhase) * 0.055 * (0.35 + 0.65 * sinT);
    var rip = 1 + 0.045 * Math.sin(t * FOLDS * Math.PI * 3 + rPhase);
    var px = sinT * Math.cos(phi), py = sinT * Math.sin(phi), pz = cosT;
    /* azimuthal tangent for the wiggle direction */
    var tx = -Math.sin(phi), ty = Math.cos(phi);
    sph.push((px * rip + tx * wig) * R,
             (py * rip + ty * wig) * R,
             (pz * rip) * R);

    aT.push(t);
    aTip.push(Math.max(0, (t - 0.9) / 0.1));            /* glowing cable tip  */
    aPole.push(Math.pow(Math.max(0, 1 - th / 0.9), 2)); /* warmth near core   */
    aRnd.push(r0);
    aShade.push(shade);
  }
}

function fattr(a, n) { return new THREE.Float32BufferAttribute(a, n); }

var U = {
  uTime:  { value: 0 },
  uMorph: { value: 0 },
  uSpin:  { value: 0 },
  uPR:    { value: DPR },
  cLight: { value: new THREE.Color('#f7f4ee') },
  cDark:  { value: new THREE.Color('#7d8595') },
  cAmber: { value: new THREE.Color('#E58A2E') },
  cHot:   { value: new THREE.Color('#ffc87f') }
};

var MORPH_VERT = [
  'attribute vec3 aSph; attribute float aT; attribute float aTip;',
  'attribute float aPole; attribute float aRnd; attribute float aShade;',
  'uniform float uTime, uMorph, uSpin;',
  'varying float vTip; varying float vPole; varying float vRnd;',
  'varying float vShade; varying float vFade; varying float vMorph;',
  'vec3 morphed() {',
  '  vec3 h = position;',
  '  float sway = 1.0 - uMorph;',
  '  h.x += sin(uTime * 0.55 + aRnd * 6.283 + aT * 3.0) * 0.13 * aT * sway;',
  '  h.z += cos(uTime * 0.45 + aRnd * 4.0  + aT * 2.2) * 0.09 * aT * sway;',
  '  vec3 w = aSph;',
  '  float cs = cos(uSpin), sn = sin(uSpin);',
  '  w.xy = mat2(cs, -sn, sn, cs) * w.xy;',
  '  w *= 1.0 + 0.012 * sin(uTime * 0.8 + aRnd * 6.283);',
  '  vec3 p = mix(h, w, uMorph);',
  '  float burst = sin(uMorph * 3.14159);',
  '  p += vec3(sin(aRnd * 12.0 + aT * 8.0),',
  '            cos(aRnd * 9.0  + aT * 6.0),',
  '            sin(aRnd * 7.0  + aT * 5.0)) * burst * 0.28 * aRnd;',
  '  return p;',
  '}'
].join('\n');

var pMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false,
  blending: THREE.NormalBlending,
  vertexShader: MORPH_VERT + [
    '',
    'uniform float uPR;',
    'void main() {',
    '  vec3 p = morphed();',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float sz = (1.5 + aTip * 3.2 * (1.0 - uMorph) + aPole * 1.2 * uMorph)',
    '           * (0.7 + aRnd * 0.6);',
    '  gl_PointSize = sz * uPR * (120.0 / -mv.z);',
    '  vTip = aTip; vPole = aPole; vRnd = aRnd; vShade = aShade;',
    '  vMorph = uMorph;',
    '  vFade = smoothstep(-14.0, -4.0, mv.z);',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform float uTime; uniform vec3 cLight, cDark, cAmber, cHot;',
    'varying float vTip; varying float vPole; varying float vRnd;',
    'varying float vShade; varying float vFade; varying float vMorph;',
    'void main() {',
    '  vec2 c = gl_PointCoord - 0.5;',
    '  float d = length(c);',
    '  if (d > 0.5) discard;',
    '  float soft = smoothstep(0.5, 0.08, d);',
    '  float pulse = 0.78 + 0.22 * sin(uTime * 1.8 + vRnd * 6.283);',
    '  vec3 yarn = mix(cDark, cLight, vShade);',
    '  vec3 col = yarn;',
    '  col = mix(col, cAmber, vTip * pulse * (1.0 - vMorph));    /* cable tips */',
    '  col = mix(col, cHot,  vPole * pulse * vMorph);            /* molten core */',
    '  float a = soft * (0.42 + vTip * 0.5 * (1.0 - vMorph) + vPole * 0.5 * vMorph)',
    '          * (0.45 + vFade * 0.65);',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n')
});

var pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', fattr(hang, 3));
pGeo.setAttribute('aSph',   fattr(sph, 3));
pGeo.setAttribute('aT',     fattr(aT, 1));
pGeo.setAttribute('aTip',   fattr(aTip, 1));
pGeo.setAttribute('aPole',  fattr(aPole, 1));
pGeo.setAttribute('aRnd',   fattr(aRnd, 1));
pGeo.setAttribute('aShade', fattr(aShade, 1));
group.add(new THREE.Points(pGeo, pMat));

/* ---------- continuous strand lines (the fold ridges) ---------- */
var lh = [], ls = [], lt = [], ltip = [], lpole = [], lrnd = [], lshade = [];
for (var s2 = 0; s2 < STRANDS; s2++) {
  var base = s2 * PTS;
  for (var i2 = 0; i2 < PTS - 1; i2++) {
    var idx = [base + i2, base + i2 + 1];
    for (var k = 0; k < 2; k++) {
      var v = idx[k];
      lh.push(hang[v * 3], hang[v * 3 + 1], hang[v * 3 + 2]);
      ls.push(sph[v * 3], sph[v * 3 + 1], sph[v * 3 + 2]);
      lt.push(aT[v]); ltip.push(aTip[v]); lpole.push(aPole[v]);
      lrnd.push(aRnd[v]); lshade.push(aShade[v]);
    }
  }
}
var lGeo = new THREE.BufferGeometry();
lGeo.setAttribute('position', fattr(lh, 3));
lGeo.setAttribute('aSph',   fattr(ls, 3));
lGeo.setAttribute('aT',     fattr(lt, 1));
lGeo.setAttribute('aTip',   fattr(ltip, 1));
lGeo.setAttribute('aPole',  fattr(lpole, 1));
lGeo.setAttribute('aRnd',   fattr(lrnd, 1));
lGeo.setAttribute('aShade', fattr(lshade, 1));

var lMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false,
  blending: THREE.NormalBlending,
  vertexShader: MORPH_VERT + [
    '',
    'void main() {',
    '  vec3 p = morphed();',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  vTip = aTip; vPole = aPole; vRnd = aRnd; vShade = aShade;',
    '  vMorph = uMorph;',
    '  vFade = smoothstep(-14.0, -4.0, mv.z);',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform vec3 cLight, cDark, cAmber, cHot;',
    'varying float vTip; varying float vPole; varying float vRnd;',
    'varying float vShade; varying float vFade; varying float vMorph;',
    'void main() {',
    '  vec3 yarn = mix(cDark, cLight, vShade);',
    '  vec3 col = mix(yarn, cHot, vPole * vMorph * 0.8);',
    '  col = mix(col, cAmber, vTip * (1.0 - vMorph) * 0.7);',
    '  float a = (0.30 + vShade * 0.22) * (0.35 + vFade * 0.65);',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n')
});
group.add(new THREE.LineSegments(lGeo, lMat));

/* ---------- molten amber core ---------- */
var CORE = 14;
var cp = [], cr = [];
for (var ci = 0; ci < CORE; ci++) {
  var rr = Math.random() * 0.16;
  var aa = Math.random() * Math.PI * 2;
  cp.push(Math.cos(aa) * rr, Math.sin(aa) * rr, R * (0.62 + Math.random() * 0.3));
  cr.push(Math.random());
}
var cGeo = new THREE.BufferGeometry();
cGeo.setAttribute('position', fattr(cp, 3));
cGeo.setAttribute('aRnd', fattr(cr, 1));
var cMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexShader: [
    'attribute float aRnd; uniform float uTime, uPR, uMorph;',
    'varying float vR; varying float vM;',
    'void main() {',
    '  vec3 p = position;',
    '  p.xy += vec2(sin(uTime * 0.9 + aRnd * 9.0), cos(uTime * 0.7 + aRnd * 7.0)) * 0.03;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  gl_PointSize = (26.0 + aRnd * 60.0) * uPR * (120.0 / -mv.z) * uMorph;',
    '  vR = aRnd; vM = uMorph;',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform float uTime; uniform vec3 cAmber, cHot;',
    'varying float vR; varying float vM;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5);',
    '  if (d > 0.5) discard;',
    '  float glow = smoothstep(0.5, 0.0, d);',
    '  float pulse = 0.8 + 0.2 * sin(uTime * 1.6 + vR * 6.283);',
    '  vec3 col = mix(cAmber, cHot, glow);',
    '  gl_FragColor = vec4(col, glow * glow * 0.28 * pulse * vM);',
    '}'
  ].join('\n')
});
group.add(new THREE.Points(cGeo, cMat));

/* ---------- floating bokeh dust ---------- */
var DUST = small ? 80 : 140;
var dp = [], dr = [];
for (var di = 0; di < DUST; di++) {
  dp.push((Math.random() * 2 - 1) * 7, (Math.random() * 2 - 1) * 4.5, (Math.random() * 2 - 1) * 3);
  dr.push(Math.random());
}
var dGeo = new THREE.BufferGeometry();
dGeo.setAttribute('position', fattr(dp, 3));
dGeo.setAttribute('aRnd', fattr(dr, 1));
var dMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
  vertexShader: [
    'attribute float aRnd; uniform float uTime, uPR;',
    'varying float vR;',
    'void main() {',
    '  vec3 p = position;',
    '  p.y += sin(uTime * 0.22 + aRnd * 6.283) * 0.45;',
    '  p.x += cos(uTime * 0.16 + aRnd * 5.0) * 0.4;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  gl_PointSize = (3.0 + aRnd * 9.0) * uPR * (90.0 / -mv.z);',
    '  vR = aRnd;',
    '}'
  ].join('\n'),
  fragmentShader: [
    'varying float vR;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5);',
    '  if (d > 0.5) discard;',
    '  float a = smoothstep(0.5, 0.0, d) * 0.10;',
    '  vec3 col = mix(vec3(1.0), vec3(0.96, 0.78, 0.52), step(0.85, vR));',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n')
});
scene.add(new THREE.Points(dGeo, dMat));

/* ============================================================
   SCROLL SCRUB — smoothed += (target - smoothed) * 0.12
   ============================================================ */
var target = 0, smoothed = 0;
function readScroll() {
  var max = document.documentElement.scrollHeight - innerHeight;
  target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}
addEventListener('scroll', readScroll, { passive: true });
readScroll();

var pointer = { x: 0, y: 0 };
if (matchMedia('(hover:hover)').matches) {
  addEventListener('mousemove', function (e) {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
}

addEventListener('resize', function () {
  renderer.setSize(innerWidth, innerHeight);
  cam.aspect = innerWidth / innerHeight;
  cam.updateProjectionMatrix();
  readScroll();
});

function smooth01(x) { return x * x * (3 - 2 * x); }

var last = performance.now(), clock = 0, spin = 0, shown = false;
function loop(now) {
  var dt = Math.min((now - last) / 1000, 0.05); last = now;
  clock += dt;

  smoothed += (target - smoothed) * (REDUCED ? 1 : 0.12);

  /* 0 → MORPH_SPAN : cables wind into the yarn sphere
     after          : the sphere drifts, tilts and keeps turning */
  var morph = REDUCED ? 1 : smooth01(Math.min(1, smoothed / MORPH_SPAN));
  var late = Math.max(0, (smoothed - MORPH_SPAN) / (1 - MORPH_SPAN));

  spin += dt * 0.05 * morph;

  U.uTime.value = clock;
  U.uMorph.value = morph;
  U.uSpin.value = spin;

  group.rotation.x = lerp(0.02, -0.10, morph) + late * 0.10 + pointer.y * 0.05;
  group.rotation.y = lerp(-0.05, 0.12, morph) - late * 0.08 + pointer.x * 0.08;
  group.position.x = lerp(0, small ? 0 : 0.45, morph) + late * (small ? 0 : 0.55);
  group.position.y = lerp(0.1, 0.05, morph) - late * 0.35;
  var sc = lerp(1, 0.98, morph) + late * 0.30;
  group.scale.setScalar(sc);
  cam.position.z = 7 - late * 0.6;

  renderer.render(scene, cam);
  if (!shown) { canvas.classList.add('ready'); shown = true; }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
