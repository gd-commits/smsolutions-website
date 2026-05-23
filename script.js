/* ============================================
   SPEND MATTERS SOLUTIONS — script.js
   3D Carousel · Reveal · Counter · Nav
   ============================================ */
(function () {
  'use strict';

  /* HEADER SCROLL */
  const hdr = document.getElementById('hdr');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('sh', scrollY > 24);
  }, { passive: true });

  /* HAMBURGER */
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobNav.classList.toggle('open');
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobNav.classList.remove('open');
  }));

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'smooth' });
      }
    });
  });

  /* 3D CAROUSEL */
  const cards = Array.from(document.querySelectorAll('.kard'));
  const dots  = Array.from(document.querySelectorAll('.dot'));
  const total  = cards.length;
  let cur = 0, timer;

  const STATES = ['s-active', 's-next', 's-prev', 's-back'];

  function stateOf(i, c) {
    const d = ((i - c) % total + total) % total;
    if (d === 0) return 's-active';
    if (d === 1) return 's-next';
    if (d === total - 1) return 's-prev';
    return 's-back';
  }

  function go(n) {
    cur = ((n % total) + total) % total;
    cards.forEach((k, i) => { k.className = 'kard ' + k.dataset.color + ' ' + stateOf(i, cur); });
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
  }

  /* store each card's color class on init */
  cards.forEach((k, i) => {
    const cls = Array.from(k.classList).find(c => c.startsWith('kard-'));
    k.dataset.color = cls || '';
  });

  function next() { go(cur + 1); }
  function prev() { go(cur - 1); }
  function resetTimer() { clearInterval(timer); timer = setInterval(next, 3400); }

  document.getElementById('arrR').addEventListener('click', () => { next(); resetTimer(); });
  document.getElementById('arrL').addEventListener('click', () => { prev(); resetTimer(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); resetTimer(); }));

  /* touch */
  let tx = 0;
  const stage = document.querySelector('.stage');
  stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  stage.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 36) dx > 0 ? next() : prev();
    resetTimer();
  }, { passive: true });

  go(0);
  resetTimer();

  /* SCROLL REVEAL */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* COUNTER */
  function animCount(el) {
    const to = +el.dataset.to, dur = 1600, t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.cnt').forEach(el => cio.observe(el));

})();
