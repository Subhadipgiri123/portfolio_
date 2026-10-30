'use strict';

// ===== CURSOR =====
const Cursor = {
  dot: null, ring: null, mouseX: 0, mouseY: 0, ringX: 0, ringY: 0,
  init() {
    if (!Utils.hasHover() || Utils.isMobile()) return;
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    if (!this.dot || !this.ring) return;
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX; this.mouseY = e.clientY;
      this.dot.style.left = e.clientX + 'px'; this.dot.style.top = e.clientY + 'px';
    });
    const hoverEls = document.querySelectorAll('a, button, [data-magnetic], [data-tilt], .feature-card, .skill-chip, .tier-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor--click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor--click'));
    this.animate();
  },
  animate() {
    this.ringX = Utils.lerp(this.ringX, this.mouseX, 0.08);
    this.ringY = Utils.lerp(this.ringY, this.mouseY, 0.08);
    this.ring.style.left = this.ringX + 'px'; this.ring.style.top = this.ringY + 'px';
    requestAnimationFrame(() => this.animate());
  }
};

// ===== LOADER =====
const Loader = {
  init() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.remove('loading');
    }, 1600);
  }
};

// ===== CV MODAL =====
const CVModal = {
  modal: null,
  backdrop: null,
  closeBtn: null,
  init() {
    this.modal = document.getElementById('cv-modal');
    this.backdrop = document.getElementById('cv-modal-backdrop');
    this.closeBtn = document.getElementById('cv-modal-close');
    if (!this.modal) return;

    const triggers = document.querySelectorAll('#hero-cv-btn, #floating-cv-btn, [data-open-cv]');
    triggers.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    }));

    if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.hasAttribute('hidden')) this.close();
    });
  },
  open() {
    this.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  },
  close() {
    this.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
};

// ===== BOOTSTRAP =====
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Cursor.init();
  Loader.init();
  Navbar.init();
  Hero.init();
  Animations.init();
  Process.init();
  CVModal.init();
});