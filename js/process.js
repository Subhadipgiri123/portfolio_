'use strict';
const Process = {
  init() {
    const steps = document.querySelectorAll('.process-card, .process-step');
    if (!steps.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0');
          setTimeout(() => entry.target.classList.add('is-visible'), delay + 100);
        }
      });
    }, { threshold: 0.2 });
    steps.forEach(step => observer.observe(step));
  }
};