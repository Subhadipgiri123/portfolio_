'use strict';
const SceneManager = {
  createRenderer(canvas, width, height) {
    const isMob = Utils.isMobile();
    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: !isMob, alpha: true, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMob ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    return renderer;
  }
};