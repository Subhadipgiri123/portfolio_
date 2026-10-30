'use strict';
const LifeCartScroll = {
  init() {
    const steps = document.querySelectorAll('.workflow-step');
    if (!steps.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-active'); });
    }, { threshold: 0.4 });
    steps.forEach(step => observer.observe(step));
  }
};