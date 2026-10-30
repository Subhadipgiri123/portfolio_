'use strict';
const Utils = {
  debounce(fn, delay) {
    let timer;
    return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
  },
  lerp(a, b, t) { return a + (b - a) * t; },
  clamp(val, min, max) { return Math.min(Math.max(val, min), max); },
  mapRange(val, inMin, inMax, outMin, outMax) { return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin; },
  prefersReducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) { return false; }
  },
  isMobile() { return window.innerWidth <= 768; },
  hasHover() { return window.matchMedia('(hover: hover)').matches; },
  getCenter(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
};