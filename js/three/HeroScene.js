'use strict';
const HeroScene = {
  canvas: null, renderer: null, scene: null, camera: null,
  particles: null, panels: [], nodes: [], clock: null,
  mouse: { x:0, y:0 }, targetMouse: { x:0, y:0 }, isVisible: true,

  init() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const w = parent.offsetWidth, h = parent.offsetHeight;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(55, w/h, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.renderer = SceneManager.createRenderer(this.canvas, w, h);
    this.createParticles();
    this.createPanels();
    this.createNodes();
    if (!Utils.isMobile()) {
      window.addEventListener('mousemove', (e) => {
        this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      });
    }
    window.addEventListener('resize', Utils.debounce(() => this.onResize(), 200));
    new IntersectionObserver(entries => { this.isVisible = entries[0].isIntersecting; }).observe(this.canvas);
    this.animate();
  },

  createParticles() {
    const count = Utils.isMobile() ? 80 : 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5)*14; pos[i*3+1] = (Math.random()-0.5)*10; pos[i*3+2] = (Math.random()-0.5)*7;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({ color:0x6C63FF, size:0.045, transparent:true, opacity:0.45, sizeAttenuation:true }));
    this.scene.add(this.particles);

    // Second layer - cyan
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      pos2[i*3] = (Math.random()-0.5)*12; pos2[i*3+1] = (Math.random()-0.5)*9; pos2[i*3+2] = (Math.random()-0.5)*5;
    }
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const pts2 = new THREE.Points(geo2, new THREE.PointsMaterial({ color:0x22D3EE, size:0.03, transparent:true, opacity:0.3, sizeAttenuation:true }));
    this.scene.add(pts2);
  },

  createPanels() {
    if (Utils.isMobile()) return;
    [
      { x:2.5, y:1.2, z:-1, ry:-0.3 }, { x:-2.2, y:-0.8, z:-0.5, ry:0.4 },
      { x:1.8, y:-1.5, z:0.5, ry:0.2 }, { x:-1.5, y:1.5, z:-1.2, ry:-0.2 },
      { x:3.0, y:-0.3, z:-1.8, ry:-0.35 }
    ].forEach((d, i) => {
      const geo = new THREE.PlaneGeometry(0.9+i*0.1, 0.55+i*0.05);
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:0x6C63FF, transparent:true, opacity:0.04, side:THREE.DoubleSide }));
      mesh.position.set(d.x, d.y, d.z); mesh.rotation.y = d.ry;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color:0x6C63FF, transparent:true, opacity:0.25 }));
      mesh.add(edges);
      this.panels.push(mesh); this.scene.add(mesh);
    });
  },

  createNodes() {
    const positions = [[1.2,0.6,0.8],[-0.8,1.0,0.5],[0.4,-1.2,0.3],[-1.4,-0.5,1.0],[2.0,-0.2,-0.5]];
    positions.forEach((pos, i) => {
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.055,0), new THREE.MeshBasicMaterial({ color:0x22D3EE, transparent:true, opacity:0.8 }));
      mesh.position.set(...pos); this.nodes.push(mesh); this.scene.add(mesh);
      if (i < positions.length-1) {
        const pts = [new THREE.Vector3(...pos), new THREE.Vector3(...positions[(i+1)%positions.length])];
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:0x22D3EE, transparent:true, opacity:0.12 }));
        this.scene.add(line);
      }
    });
  },

  animate() {
    if (!this.isVisible) { requestAnimationFrame(() => this.animate()); return; }
    const t = this.clock.getElapsedTime();
    this.mouse.x = Utils.lerp(this.mouse.x, this.targetMouse.x, 0.04);
    this.mouse.y = Utils.lerp(this.mouse.y, this.targetMouse.y, 0.04);
    this.camera.position.x = this.mouse.x * 0.35;
    this.camera.position.y = this.mouse.y * 0.2;
    this.camera.lookAt(0,0,0);
    if (this.particles) { this.particles.rotation.y = t*0.025; this.particles.rotation.x = t*0.012; }
    this.panels.forEach((p,i) => { p.position.y = p.position.y + Math.sin(t*0.4+i*1.3)*0.0006; p.rotation.y += 0.0002; });
    this.nodes.forEach((n,i) => { n.scale.setScalar(1+Math.sin(t*1.5+i)*0.15); });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  },

  onResize() {
    const parent = this.canvas.parentElement;
    const w = parent.offsetWidth, h = parent.offsetHeight;
    this.camera.aspect = w/h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w,h);
  }
};