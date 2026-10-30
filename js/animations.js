'use strict';
const Animations = {
  init() {
    this.initScrollReveal();
    if (!Utils.prefersReducedMotion() && Utils.hasHover() && !Utils.isMobile()) {
      this.initProjectTilt();
    }
  },
  initScrollReveal() {
    if (Utils.prefersReducedMotion()) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0');
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(item => observer.observe(item));
  },
  initProjectTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${Utils.clamp(-y*7,-7,7)}deg) rotateY(${Utils.clamp(x*7,-7,7)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
};