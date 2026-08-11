/* ============================================================
   SPEND MATTERS — v4
   Scene: pale cables wind into a rope-fold sphere with a SMALL
   warm ember core (v3's core was blowing out to white — fixed
   by shrinking the glow, thickening the rope lines and raising
   strand contrast). Plus: SMS Team chat guide, magnetic buttons.

   Scene tuning:
     STRANDS · PTS   — yarn density
     CABLES          — hanging cables in the hero
     R               — sphere radius
     FOLDS           — wrinkle frequency
     MORPH_SPAN      — scroll fraction for cable→sphere
     CORE_SIZE/ALPHA — ember glow (keep small!)
   ============================================================ */
(function () {
'use strict';

var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
var HOVER = matchMedia('(hover:hover)').matches;

/* ---------- reveals ---------- */
$$('.rv').forEach(function (el) { el.style.transitionDelay = (el.dataset.delay || 0) + 'ms'; });
var io = new IntersectionObserver(function (en) {
  en.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
$$('.rv').forEach(function (el) { io.observe(el); });

/* ---------- smooth anchors ---------- */
$$('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 40,
               behavior: REDUCED ? 'auto' : 'smooth' });
  });
});

/* ---------- magnetic hover on buttons ---------- */
if (HOVER && !REDUCED) {
  $$('.btn-solid,.btn-amber,.btn-glass,.nav-cta').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.14) + 'px,' +
        ((e.clientY - r.top - r.height / 2) * 0.2 - 2) + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });
}

/* ============================================================
   SMS TEAM — scripted chat guide (no backend, no tracking)
   ============================================================ */
(function smsTeamChat() {
  var launch = document.getElementById('fabLaunch');
  var panel  = document.getElementById('fabPanel');
  var log    = document.getElementById('fabLog');
  var chips  = document.getElementById('fabChips');
  var closeB = document.getElementById('fabClose');
  if (!launch || !panel) return;

  var MAIL = 'mailto:INFO@SMSOLUTIONS.NET.IN';

  var TOPICS = {
    who: { label: 'Who are you?', reply:
      "We're Spend Matters Solutions — a textile and apparel sourcing, quality, compliance and AI technology partner. Not a trader, not a traditional buying agent. Roughly 20 years on the sourcing and quality side, plus a technology team that builds around it.",
      next: ['what', 'where', 'ai', 'start'] },
    what: { label: 'What do you do?', reply:
      "Four things, and you can take one or all: 1) Global sourcing — factory identification, qualification, negotiation and follow-up. 2) Independent inspection — fabric and base material through to final, at your AQL. 3) Compliance and traceability — audits, certificates, testing and documentation. 4) Custom AI and SaaS for a specific department. Shipment intelligence runs across all four.",
      next: ['ai', 'inspect', 'where', 'start'] },
    where: { label: 'Which regions?', reply:
      "Our primary qualified regions are India, Bangladesh and China — India for knits, home textile and shorter runs, Bangladesh for volume wovens, outerwear and denim, China for technical fabric, finishing and trims. Where a product points somewhere else, we qualify the supply base there first. The region follows your product, price, quality, compliance and delivery requirement.",
      next: ['what', 'price', 'start'] },
    inspect: { label: 'How does inspection work?', reply:
      "You don't need your own liaison office to control quality. We can run pre-production meetings, fabric and base-material inspection, and inline, midline and final inspections to the AQL level your programme requires — 1.5, 2.0, 4.0 or whatever you specify. You get a structured report online, either through our application or pushed into the system your team already uses.",
      next: ['ai', 'what', 'start'] },
    ai: { label: 'What about the AI?', reply:
      "We don't ask you to adopt one giant supply-chain platform. We build department-specific tools around how your team already works — Outlook, Teams, WhatsApp, Excel, PDFs, lab reports, compliance portals, your ERP. Typical work: reading test reports, extracting results, watching certificate expiry, chasing samples, monitoring ETAs. It can run in your environment or on ours.",
      next: ['deploy', 'what', 'start'] },
    deploy: { label: 'Where does it run?', reply:
      "Two options. Option A — deployed on your own infrastructure, working against your existing systems and access rules. Option B — you use the Spend Matters hosted application and we push reports and alerts back into your systems. The architecture is designed around your organisation's infrastructure, access and security requirements.",
      next: ['ai', 'start', 'price'] },
    price: { label: 'How do you charge?', reply:
      "Openly, and it depends on what you take. Sourcing and inspection are scoped per programme or per inspection; AI and SaaS work is scoped against the workflow once we've seen it. Costs are shown beside the work, not hidden inside a price. The first consultation costs nothing.",
      next: ['start', 'who'] },
    start: { label: 'How do we start?', reply:
      "Start with the problem, not the software. Tell us the sourcing requirement, the quality issue, the compliance gap or the workflow eating your team's week — and we'll come back on how we'd approach it. Want me to open an email for you?",
      next: ['mail', 'price', 'what'] }
  };

  var opened = false;
  function open() {
    panel.classList.add('open');
    launch.classList.add('hide');
    if (!opened) { opened = true; greet(); }
  }
  function close() {
    panel.classList.remove('open');
    launch.classList.remove('hide');
  }
  launch.addEventListener('click', open);
  closeB.addEventListener('click', close);

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt) n.textContent = txt;
    return n;
  }
  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function botSay(text, after) {
    var t = el('div', 'msg bot typing');
    t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
    log.appendChild(t); scrollLog();
    setTimeout(function () {
      t.classList.remove('typing');
      t.textContent = text;
      scrollLog();
      if (after) after();
    }, REDUCED ? 30 : 550 + Math.min(text.length * 6, 700));
  }

  function showChips(keys) {
    chips.innerHTML = '';
    keys.forEach(function (k, i) {
      if (k === 'mail') {
        var a = el('a', null, '✉ Email us now');
        a.href = MAIL + '?subject=Enquiry%20(via%20SMS%20Team%20chat)';
        a.style.animationDelay = (i * 70) + 'ms';
        chips.appendChild(a);
        return;
      }
      var b = el('button', null, TOPICS[k].label);
      b.style.animationDelay = (i * 70) + 'ms';
      b.addEventListener('click', function () { pick(k); });
      chips.appendChild(b);
    });
  }

  function pick(k) {
    chips.innerHTML = '';
    log.appendChild(el('div', 'msg user', TOPICS[k].label));
    scrollLog();
    botSay(TOPICS[k].reply, function () { showChips(TOPICS[k].next); });
  }

  function greet() {
    botSay("Hi! This is the SMS Team guide. Ask about sourcing, inspection, compliance or the AI side — or tell us what's slowing your team down.",
      function () { showChips(['who', 'what', 'inspect', 'ai', 'start']); });
  }

  /* gentle nudge: after 18s on page, wiggle the launcher once */
  if (!REDUCED) setTimeout(function () {
    if (!opened) {
      launch.style.animation = 'none';
      void launch.offsetWidth;
      launch.style.animation = '';
    }
  }, 18000);
})();

/* ============================================================
   SECTION INTERACTIONS
   Accordions (sourcing steps + department modules), deployment
   option tabs, connected-journey selector. Pure DOM, no deps.
   NOTE: must stay ABOVE the WebGL block — that block returns
   early on devices without WebGL.
   ============================================================ */
(function accordions() {
  function wire(itemSel, headSel, openClass) {
    $$(itemSel).forEach(function (item) {
      var head = item.querySelector(headSel);
      if (!head) return;
      head.setAttribute('aria-expanded', item.classList.contains(openClass) ? 'true' : 'false');
      head.addEventListener('click', function () {
        var isOpen = item.classList.toggle(openClass);
        head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }
  wire('.sitem', '.shead', 'open');   /* global sourcing — 01…05      */
  wire('.dept',  '.dhead', 'open');   /* department AI modules        */
})();

(function deploymentOptions() {
  var tabs = $$('.opt-tab');
  if (!tabs.length) return;
  var appName = document.getElementById('flowApp');
  var appSub  = document.getElementById('flowAppSub');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.classList.toggle('is-on', on);
          if (on) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); }
        }
      });
      /* the flow diagram answers back */
      if (appName && tab.dataset.app) appName.textContent = tab.dataset.app;
      if (appSub  && tab.dataset.sub) appSub.textContent  = tab.dataset.sub;
    });
  });
})();

(function connectedJourney() {
  var wrap = document.getElementById('journey-widget');
  if (!wrap) return;
  var steps  = $$('.jstep', wrap);
  var human  = document.getElementById('jHuman');
  var ai     = document.getElementById('jAi');
  if (!steps.length || !human || !ai) return;

  var STAGES = [
    { h: 'Reading the requirement the way a merchandiser would — construction, price reality and what the buyer actually means by "premium".',
      a: 'Past enquiries, quotations and performance surfaced against the new brief, so the shortlist starts from evidence.' },
    { h: 'Visiting, questioning and judging a factory: who owns it, what it really runs, and how it behaves when an order goes wrong.',
      a: 'Audit status, certificate validity and past delivery records held in one supplier record instead of five inboxes.' },
    { h: 'Negotiating across regions with people who know what the cost sheet should look like before it arrives.',
      a: 'FOB, MOQ, material and making cost compared on the same basis, with historical prices for the same construction.' },
    { h: 'Product development, fit and material approvals handled by merchandisers who have run the category before.',
      a: 'Sample status, approval stage and outstanding submissions tracked without anyone chasing an update.' },
    { h: 'A pre-production meeting where expectations, critical points and acceptance levels are agreed in the room.',
      a: 'Specification and tech-pack detail pulled into a structured checklist the inspector works from.' },
    { h: 'Independent inspectors on the floor — fabric, inline, midline and final, at your AQL, reporting to you.',
      a: 'Findings turned into a structured report the same day, with defect patterns compared against previous lots.' },
    { h: 'Production follow-up against the plan, with problems raised while there is still time to fix them.',
      a: 'Critical dates monitored and exceptions raised early rather than reported after the fact.' },
    { h: 'Compliance and documentation handled by people who know which customer asks for what, and when.',
      a: 'Certificates, audits and test reports watched for expiry, gaps and missing tests before shipment.' },
    { h: 'Booking, forwarder and container coordination managed against the delivery you were promised.',
      a: 'Shipment status consolidated from booking to vessel, with alerts when something actually changes.' },
    { h: 'Someone accountable for the arrival — not a tracking link forwarded to your team.',
      a: 'ETA monitoring through third-party tracking services, with change and exception alerts to the responsible person.' }
  ];

  steps.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      steps.forEach(function (b) { b.classList.remove('is-on'); });
      btn.classList.add('is-on');
      var s = STAGES[i] || STAGES[0];
      human.textContent = s.h;
      ai.textContent = s.a;
    });
  });
})();

/* ============================================================
   WEBGL SCENE
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
var STRANDS    = small ? 150 : 240;
var PTS        = small ? 80  : 110;
var CABLES     = small ? 16  : 24;
var R          = small ? 1.45 : 1.85;
var FOLDS      = 7;
var MORPH_SPAN = 1.45;   /* VIEWPORT HEIGHTS of scroll for cable→sphere.
                            v4 used a page fraction (0.42); the v5 page is ~3x
                            longer, which stretched the morph over half the site.
                            Viewport-relative keeps it inside the hero + spacer. */
var CORE_SIZE  = 9;      /* v3 was 26–86 → blowout. Keep ≤ 12. */
var CORE_ALPHA = 0.10;   /* v3 was 0.28 additive → white nova. */

/* ---------------- geometry ---------------- */
var hang = [], sph = [], aT = [], aTip = [], aPole = [], aRnd = [], aShade = [];

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

var THETA0 = 0.16, THETA1 = 2.78;

for (var s = 0; s < STRANDS; s++) {
  var r0 = Math.random();
  var cab = cables[s % CABLES];
  var jx = (Math.random() - 0.5) * 0.10;
  var jz = (Math.random() - 0.5) * 0.10;
  var jl = 0.85 + Math.random() * 0.3;

  var phi = (s / STRANDS) * Math.PI * 2 + (Math.random() - 0.5) * 0.5 / STRANDS;
  var wPhase = Math.random() * Math.PI * 2;
  var rPhase = Math.random() * Math.PI * 2;
  var shade = Math.random() < 0.35 ? 0.15 + Math.random() * 0.25   /* deep crevice strands */
                                   : 0.6 + Math.random() * 0.4;    /* lit rope strands     */

  for (var i = 0; i < PTS; i++) {
    var t = i / (PTS - 1);

    var hy = cab.top - cab.len * jl * t;
    var hx = cab.x + jx + cab.bend * t * t + Math.sin(t * 5 + s) * 0.05;
    var hz = cab.z + jz + Math.cos(t * 4 + s * 2) * 0.04;
    hang.push(hx, hy, hz);

    var th = THETA0 + t * (THETA1 - THETA0);
    var sinT = Math.sin(th), cosT = Math.cos(th);
    var wig = Math.sin(t * FOLDS * Math.PI * 2 + wPhase) * 0.055 * (0.35 + 0.65 * sinT);
    var rip = 1 + 0.05 * Math.sin(t * FOLDS * Math.PI * 3 + rPhase);
    var px = sinT * Math.cos(phi), py = sinT * Math.sin(phi), pz = cosT;
    var tx = -Math.sin(phi), ty = Math.cos(phi);
    sph.push((px * rip + tx * wig) * R,
             (py * rip + ty * wig) * R,
             (pz * rip) * R);

    aT.push(t);
    aTip.push(Math.max(0, (t - 0.9) / 0.1));
    aPole.push(Math.pow(Math.max(0, 1 - th / 0.75), 2));  /* tighter warm zone */
    aRnd.push(r0);
    aShade.push(shade);
  }
}

function fattr(a, n) { return new THREE.Float32BufferAttribute(a, n); }

/* ============================================================
   v5.1 YARN MATERIAL — supporting data (paths above unchanged)
   aTanH/aTanS: per-point strand tangents for the hang and
   sphere states, so sprites can shade as fiber-aligned spun
   yarn. fz*: a decimated stray-fiber (fuzz) layer, desktop
   only — same paths, tiny random radial offsets.
   ============================================================ */
var tanH = new Float32Array(hang.length);
var tanS = new Float32Array(sph.length);
(function () {
  function build(src, dst) {
    for (var st = 0; st < STRANDS; st++) {
      for (var ti = 0; ti < PTS; ti++) {
        var a0 = (st * PTS + Math.max(0, ti - 1)) * 3;
        var a1 = (st * PTS + Math.min(PTS - 1, ti + 1)) * 3;
        var ic = (st * PTS + ti) * 3;
        var dx = src[a1] - src[a0], dy = src[a1 + 1] - src[a0 + 1], dz = src[a1 + 2] - src[a0 + 2];
        var ln = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        dst[ic] = dx / ln; dst[ic + 1] = dy / ln; dst[ic + 2] = dz / ln;
      }
    }
  }
  build(hang, tanH);
  build(sph, tanS);
})();

var fzH = [], fzS = [], fzT = [], fzR = [], fzTH = [], fzTS = [];
if (!small) {
  for (var fs0 = 0; fs0 < STRANDS; fs0 += 2) {          /* every 2nd strand   */
    for (var fi = 2; fi < PTS - 2; fi += 4) {           /* every 4th point    */
      var fidx = fs0 * PTS + fi, f3 = fidx * 3;
      var ox = Math.random() - 0.5, oy = Math.random() - 0.5, oz = Math.random() - 0.5;
      var ol = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
      var od = (0.015 + Math.random() * 0.045) / ol;    /* tiny protrusion    */
      fzH.push(hang[f3] + ox * od, hang[f3 + 1] + oy * od, hang[f3 + 2] + oz * od);
      fzS.push(sph[f3] + ox * od, sph[f3 + 1] + oy * od, sph[f3 + 2] + oz * od);
      fzT.push(aT[fidx]); fzR.push(Math.random());
      fzTH.push(tanH[f3], tanH[f3 + 1], tanH[f3 + 2]);
      fzTS.push(tanS[f3], tanS[f3 + 1], tanS[f3 + 2]);
    }
  }
}

var U = {
  uTime:  { value: 0 },
  uMorph: { value: 0 },
  uSpin:  { value: 0 },
  uLate:  { value: 0 },
  uPR:    { value: DPR },
  cLight: { value: new THREE.Color('#fbf7ee') },   /* ivory — lit fiber      */
  cDark:  { value: new THREE.Color('#96866d') },   /* warm crevice shadow    */
  cAmber: { value: new THREE.Color('#E58A2E') },
  cHot:   { value: new THREE.Color('#f6b25e') }
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
  '            sin(aRnd * 7.0  + aT * 5.0)) * burst * 0.2 * aRnd;',
  '  return p;',
  '}'
].join('\n');

var pMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false,
  blending: THREE.NormalBlending,
  vertexShader: MORPH_VERT + [
    '',
    'uniform float uPR;',
    'attribute vec3 aTanH; attribute vec3 aTanS;',
    'varying float vAng;   /* screen-space fiber direction        */',
    'varying float vDet;   /* macro detail amount (near = more)   */',
    'varying float vTw;    /* helical twist phase along strand    */',
    'void main() {',
    '  vec3 p = morphed();',
    '  /* strand tangent, morphed like the position (spin incl.) */',
    '  float cs2 = cos(uSpin), sn2 = sin(uSpin);',
    '  vec3 tS = aTanS;',
    '  tS.xy = mat2(cs2, -sn2, sn2, cs2) * tS.xy;',
    '  vec3 tn = mix(aTanH, tS, uMorph) + vec3(1e-4);',
    '  vec3 tv = (modelViewMatrix * vec4(normalize(tn), 0.0)).xyz;',
    '  vAng = atan(tv.y, tv.x);',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  /* natural diameter drift along the strand — no perfect cylinders */',
    '  float dia = 0.88 + 0.20 * sin(aT * 37.0 + aRnd * 9.0)',
    '                   + 0.06 * sin(aT * 131.0 + aRnd * 23.0);',
    '  float sz = (1.55 + aTip * 1.8 * (1.0 - uMorph)) * (0.7 + aRnd * 0.6) * dia;',
    '  gl_PointSize = sz * uPR * (120.0 / -mv.z);',
    '  vDet = smoothstep(8.2, 4.6, -mv.z);',
    '  vTw  = aT * 96.0 + aRnd * 6.2831;',
    '  vTip = aTip; vPole = aPole; vRnd = aRnd; vShade = aShade;',
    '  vMorph = uMorph;',
    '  vFade = smoothstep(-14.0, -4.0, mv.z);',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform float uTime, uLate; uniform vec3 cLight, cDark, cAmber, cHot;',
    'varying float vTip; varying float vPole; varying float vRnd;',
    'varying float vShade; varying float vFade; varying float vMorph;',
    'varying float vAng; varying float vDet; varying float vTw;',
    'float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }',
    'void main() {',
    '  vec2 c = gl_PointCoord - 0.5;',
    '  float d = length(c);',
    '  if (d > 0.5) discard;',
    '  /* rotate into the fiber frame: f.x along the yarn, f.y across */',
    '  float ca = cos(vAng), sa = sin(vAng);',
    '  vec2 f = vec2(c.x * ca + c.y * sa, -c.x * sa + c.y * ca);',
    '  /* soft cylindrical yarn body */',
    '  float across = clamp(f.y * 2.2, -1.0, 1.0);',
    '  float prof = sqrt(max(1.0 - across * across, 0.0));',
    (small
      ? '  float tw = sin(vTw + f.x * 22.0 + f.y * 9.0);\n  float fiber = 1.0 - vDet * (0.10 + 0.10 * tw);'
      : ['  /* spun twist: two diagonal striation octaves + fiber grain */',
         '  float tw  = sin(vTw + f.x * 22.0 + f.y * 9.0);',
         '  float tw2 = sin(vTw * 1.7 + f.x * 47.0 - f.y * 13.0 + vRnd * 4.0);',
         '  float grain = hash(floor(f * 26.0) + vec2(vRnd * 7.0));',
         '  float fiber = 1.0 - vDet * (0.09 + 0.08 * tw + 0.05 * tw2 + 0.07 * (grain - 0.5));'
        ].join('\n')),
    '  /* matte studio shading: diffuse wrap + faint anisotropic sheen */',
    '  float lambert = 0.40 + 0.60 * prof;',
    '  float sheen = pow(prof, 3.0) * 0.16 * (0.6 + 0.4 * tw);',
    '  float pulse = 0.92 + 0.08 * sin(uTime * 1.4 + vRnd * 6.283);',
    '  vec3 yarn = mix(cDark, cLight, vShade);',
    '  vec3 col = yarn * lambert * fiber + cLight * sheen;',
    '  /* glow features (amber tips, data nodes) keep the ORIGINAL soft */',
    '  /* radial falloff — only the yarn body gets the cylinder edge.   */',
    '  float tipG = vTip * pulse * (1.0 - vMorph);',
    '  float node = step(0.87, vRnd) * uLate;',            /* a few strands read as data nodes */
    '  float glowMix = clamp(tipG + node, 0.0, 1.0);',
    '  col = mix(col, cAmber, tipG);',
    '  col = mix(col, cHot,  min(vPole * 1.2, 1.0) * vMorph);',
    '  col = mix(col, cAmber, node * 0.8);',
    '  float bodyA = smoothstep(0.5, 0.26, d) * (0.30 + 0.70 * prof) * 0.55;',
    '  float glowA = smoothstep(0.5, 0.10, d) * (0.34 + tipG * 0.30 + node * 0.45);',
    '  float a = mix(bodyA, glowA, glowMix) * (0.45 + vFade * 0.65);',
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
pGeo.setAttribute('aTanH', new THREE.BufferAttribute(tanH, 3));
pGeo.setAttribute('aTanS', new THREE.BufferAttribute(tanS, 3));
group.add(new THREE.Points(pGeo, pMat));

/* ---------- stray-fiber fuzz (desktop only, decimated) ----------
   Macro-photography micro fuzz: faint hair-flecks just off the
   yarn surface, aligned with the local fiber direction, visible
   only when a strand is close to the camera. ~1/8 of the point
   count, one extra draw call. */
if (!small && fzH.length) {
  var fzGeo = new THREE.BufferGeometry();
  fzGeo.setAttribute('position', fattr(fzH, 3));
  fzGeo.setAttribute('aSph',  fattr(fzS, 3));
  fzGeo.setAttribute('aT',    fattr(fzT, 1));
  fzGeo.setAttribute('aRnd',  fattr(fzR, 1));
  fzGeo.setAttribute('aTanH', fattr(fzTH, 3));
  fzGeo.setAttribute('aTanS', fattr(fzTS, 3));
  var fzMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    blending: THREE.NormalBlending,
    vertexShader: [
      'attribute vec3 aSph; attribute float aT; attribute float aRnd;',
      'attribute vec3 aTanH; attribute vec3 aTanS;',
      'uniform float uTime, uMorph, uSpin, uPR;',
      'varying float vAng; varying float vDet; varying float vR;',
      'void main() {',
      '  vec3 h = position;',
      '  float sway = 1.0 - uMorph;',
      '  h.x += sin(uTime * 0.55 + aRnd * 6.283 + aT * 3.0) * 0.13 * aT * sway;',
      '  h.z += cos(uTime * 0.45 + aRnd * 4.0  + aT * 2.2) * 0.09 * aT * sway;',
      '  vec3 w = aSph;',
      '  float cs = cos(uSpin), sn = sin(uSpin);',
      '  w.xy = mat2(cs, -sn, sn, cs) * w.xy;',
      '  vec3 p = mix(h, w, uMorph);',
      '  vec3 tS = aTanS; tS.xy = mat2(cs, -sn, sn, cs) * tS.xy;',
      '  vec3 tn = mix(aTanH, tS, uMorph) + vec3(1e-4);',
      '  vec3 tv = (modelViewMatrix * vec4(normalize(tn), 0.0)).xyz;',
      '  vAng = atan(tv.y, tv.x) + (aRnd - 0.5) * 0.9;',   /* strays drift off the twist */
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position = projectionMatrix * mv;',
      '  vDet = smoothstep(7.6, 4.4, -mv.z);',
      '  gl_PointSize = (2.4 + aRnd * 3.2) * uPR * (120.0 / -mv.z) * (0.25 + 0.75 * vDet);',
      '  vR = aRnd;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 cLight;',
      'varying float vAng; varying float vDet; varying float vR;',
      'void main() {',
      '  vec2 c = gl_PointCoord - 0.5;',
      '  if (length(c) > 0.5) discard;',
      '  float ca = cos(vAng), sa = sin(vAng);',
      '  vec2 f = vec2(c.x * ca + c.y * sa, -c.x * sa + c.y * ca);',
      '  /* one thin hair fleck along the fiber direction */',
      '  float hair = (1.0 - smoothstep(0.02, 0.07, abs(f.y)))',
      '             * (1.0 - smoothstep(0.24, 0.5, abs(f.x)));',
      '  float a = hair * vDet * (0.05 + vR * 0.05);',
      '  if (a < 0.004) discard;',
      '  gl_FragColor = vec4(cLight, a);',
      '}'
    ].join('\n')
  });
  group.add(new THREE.Points(fzGeo, fzMat));
}

/* ---------- rope lines (raised opacity so folds sculpt) ---------- */
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
    'varying float vT;',
    'void main() {',
    '  vec3 p = morphed();',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  vTip = aTip; vPole = aPole; vRnd = aRnd; vShade = aShade;',
    '  vMorph = uMorph; vT = aT;',
    '  vFade = smoothstep(-14.0, -4.0, mv.z);',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform float uLate; uniform vec3 cLight, cDark, cAmber, cHot;',
    'varying float vTip; varying float vPole; varying float vRnd;',
    'varying float vShade; varying float vFade; varying float vMorph;',
    'varying float vT;',
    'void main() {',
    '  vec3 yarn = mix(cDark, cLight, vShade);',
    '  /* faint helical ripple so the fold lines read spun, not drawn */',
    '  float tw = 0.92 + 0.08 * sin(vT * 96.0 + vRnd * 6.2831);',
    '  vec3 col = mix(yarn * tw, cHot, min(vPole * 1.1, 1.0) * vMorph);',
    '  col = mix(col, cAmber, vTip * (1.0 - vMorph) * 0.7);',
    '  float a = (0.34 + vShade * 0.24) * tw * (0.35 + vFade * 0.65) * (1.0 - uLate * 0.3);',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n')
});
group.add(new THREE.LineSegments(lGeo, lMat));

/* ---------- small ember core (deliberately modest) ---------- */
var CORE = 6;
var cp = [], cr = [];
for (var ci = 0; ci < CORE; ci++) {
  var rr = Math.random() * 0.10;
  var aa = Math.random() * Math.PI * 2;
  cp.push(Math.cos(aa) * rr, Math.sin(aa) * rr, R * (0.78 + Math.random() * 0.16));
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
    '  p.xy += vec2(sin(uTime * 0.9 + aRnd * 9.0), cos(uTime * 0.7 + aRnd * 7.0)) * 0.02;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  gl_PointSize = (' + CORE_SIZE.toFixed(1) + ' + aRnd * 14.0) * uPR * (120.0 / -mv.z) * uMorph;',
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
    '  gl_FragColor = vec4(col, glow * glow * ' + CORE_ALPHA.toFixed(2) + ' * pulse * vM);',
    '}'
  ].join('\n')
});
group.add(new THREE.Points(cGeo, cMat));

/* ---------- dust ---------- */
var DUST = small ? 70 : 120;
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
    '  gl_PointSize = (3.0 + aRnd * 8.0) * uPR * (90.0 / -mv.z);',
    '  vR = aRnd;',
    '}'
  ].join('\n'),
  fragmentShader: [
    'varying float vR;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5);',
    '  if (d > 0.5) discard;',
    '  float a = smoothstep(0.5, 0.0, d) * 0.09;',
    '  vec3 col = mix(vec3(1.0,0.99,0.96), vec3(0.94,0.68,0.36), step(0.85, vR));',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n')
});
scene.add(new THREE.Points(dGeo, dMat));

/* ---------- scroll scrub ---------- */
var target = 0, smoothed = 0;      /* page fraction — slow drift across the site */
var mTarget = 0, mSmoothed = 0;    /* viewport-relative — the cable→sphere morph  */
function readScroll() {
  var max = document.documentElement.scrollHeight - innerHeight;
  target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  mTarget = Math.min(1, Math.max(0, scrollY / (innerHeight * MORPH_SPAN)));
}
addEventListener('scroll', readScroll, { passive: true });
readScroll();

var pointer = { x: 0, y: 0 };
if (HOVER) {
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

  smoothed  += (target  - smoothed)  * (REDUCED ? 1 : 0.12);
  mSmoothed += (mTarget - mSmoothed) * (REDUCED ? 1 : 0.12);

  var morph = REDUCED ? 1 : smooth01(mSmoothed);
  /* late: the long, slow drift across the rest of the page — thread becomes
     network becomes data as the visitor moves through sourcing → AI → shipment */
  var late = Math.max(0, (smoothed - 0.12) / 0.88);

  spin += dt * 0.05 * morph;

  U.uTime.value = clock;
  U.uMorph.value = morph;
  U.uSpin.value = spin;
  U.uLate.value = late;

  group.rotation.x = lerp(0.02, -0.10, morph) + late * 0.08 + pointer.y * 0.05;
  group.rotation.y = lerp(-0.05, 0.12, morph) - late * 0.06 + pointer.x * 0.08;
  group.position.x = lerp(0, small ? 0 : 0.3, morph) + late * (small ? 0 : 0.5);
  group.position.y = lerp(0.1, 0.05, morph) - late * 0.3;
  var sc = lerp(1, 0.96, morph) + late * 0.1;   /* v3 grew 0.30 → filled screen */
  group.scale.setScalar(sc);
  cam.position.z = 7 - late * 0.35;

  renderer.render(scene, cam);
  if (!shown) { canvas.classList.add('ready'); shown = true; }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
