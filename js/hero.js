'use strict';
const Hero = {
  init() {
    this.runLoadSequence();
    if (Utils.hasHover() && !Utils.isMobile()) this.initMagneticButtons();
  },
  runLoadSequence() {
    const items = document.querySelectorAll('.reveal-item');
    if (Utils.prefersReducedMotion()) {
      items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    items.forEach(el => {
      const delay = parseInt(el.getAttribute('data-reveal-delay') || '0');
      setTimeout(() => el.classList.add('is-revealed'), delay);
    });
  },
  initMagneticButtons() {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width/2)) * 0.2;
        const dy = (e.clientY - (rect.top + rect.height/2)) * 0.2;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
};