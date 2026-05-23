const swiper = new Swiper('.heroSwiper', {
  loop: true,
  autoplay: {
    delay: 2500,
  },
  effect: 'creative',
  creativeEffect: {
    prev: {
      shadow: true,
      translate: ['-20%', 0, -1],
    },
    next: {
      translate: ['100%', 0, 0],
    },
  },
});

window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.floating-card');

  cards.forEach((card, i) => {
    const speed = (i + 1) * 0.08;
    card.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});