'use strict';

const ThemeManager = {
  theme: 'dark',

  init() {
    // 1. Determine active theme
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      this.theme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.theme = 'light';
    } else {
      this.theme = 'dark';
    }

    // 2. Apply theme without flash
    this.applyTheme(this.theme, false);

    // 3. Bind segmented option clicks ("One button, two options")
    const optionButtons = document.querySelectorAll('[data-theme-set]');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTheme = btn.getAttribute('data-theme-set');
        if (targetTheme && targetTheme !== this.theme) {
          this.applyTheme(targetTheme, true);
        }
      });
    });

    // 4. Legacy togglers if any exist
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });

    // 5. Listen for system theme changes if user hasn't explicitly saved a choice
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }
  },

  toggle() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next, true);
  },

  applyTheme(theme, animate = false) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update active attributes on segmented switches
    const optionButtons = document.querySelectorAll('[data-theme-set]');
    optionButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-theme-set') === theme;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Update legacy togglers
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('data-current-theme', theme);
    });

    // Smooth transition between themes
    if (animate) {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    }
  }
};
