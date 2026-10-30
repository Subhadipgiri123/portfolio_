'use strict';
const Navbar = {
  el: null, toggle: null, mobileMenu: null, links: null, isOpen: false,
  init() {
    this.el = document.getElementById('navbar');
    this.toggle = document.getElementById('nav-toggle');
    this.mobileMenu = document.getElementById('mobile-menu') || document.getElementById('nav-mobile') || document.querySelector('.navbar__mobile');
    this.links = document.querySelectorAll('.navbar__link');
    if (!this.el) return;
    this.bindEvents();
    this.onScroll();
  },
  bindEvents() {
    window.addEventListener('scroll', Utils.debounce(() => this.onScroll(), 10), { passive: true });
    if (this.toggle) {
      this.toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }
    document.querySelectorAll('[data-nav-mobile]').forEach(link => link.addEventListener('click', () => this.closeMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.isOpen) this.closeMenu(); });
    this.initSectionObserver();
  },
  onScroll() {
    window.scrollY > 40 ? this.el.classList.add('is-scrolled') : this.el.classList.remove('is-scrolled');
  },
  toggleMenu() { this.isOpen ? this.closeMenu() : this.openMenu(); },
  openMenu() {
    if (!this.mobileMenu || !this.toggle) return;
    this.isOpen = true;
    this.mobileMenu.removeAttribute('hidden');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },
  closeMenu() {
    if (!this.mobileMenu || !this.toggle) return;
    this.isOpen = false;
    this.mobileMenu.setAttribute('hidden', '');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },
  initSectionObserver() {
    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section');
          this.links.forEach(link => link.classList.toggle('is-active', link.getAttribute('data-nav') === id));
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => observer.observe(s));
  }
};