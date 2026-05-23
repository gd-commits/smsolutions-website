/* ==========================================
   SPEND MATTERS SOLUTIONS — SCRIPT.JS
   3D Carousel · Scroll Reveal · Counters
   ========================================== */

(function () {
  'use strict';

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  /* ---- 3D CAROUSEL ---- */
  const cards = Array.from(document.querySelectorAll('.card-3d'));
  const dots = Array.from(document.querySelectorAll('.c-dot'));
  let current = 0;
  let autoTimer = null;

  function getState(index, current, total) {
    const diff = ((index - current) % total + total) % total;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === total - 1) return 'prev';
    return 'behind';
  }

  function updateCarousel(newIndex) {
    current = ((newIndex % cards.length) + cards.length) % cards.length;

    cards.forEach((card, i) => {
      const state = getState(i, current, cards.length);
      card.className = 'card-3d card-' + i + ' ' + state;
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { updateCarousel(current + 1); }
  function prev() { updateCarousel(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 3200);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    next();
    startAuto(); // reset timer
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    prev();
    startAuto();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateCarousel(i);
      startAuto();
    });
  });

  // Touch/drag support
  let touchStartX = 0;
  const stage = document.querySelector('.carousel-stage');
  stage.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    startAuto();
  }, { passive: true });

  // Init
  updateCarousel(0);
  startAuto();

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
