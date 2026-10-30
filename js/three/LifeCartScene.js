'use strict';
const LifeCartScene = {
  canvas: null, renderer: null, scene: null, camera: null, clock: null,
  nodes: [], edges: [], flowParticles: [], raycaster: null, mouse: null,
  hoveredNode: null, isVisible: true,

  nodeData: [
    { id:'engine',  label:'SMART\nENGINE',  x:0,     y:0,    z:0,    color:0x6C63FF, r:0.22, conns:['customer','seller','service','admin','goal','planner','solution'] },
    { id:'customer',label:'CUSTOMER',       x:-3.4,  y:1.4,  z:0,    color:0x22D3EE, r:0.13, conns:['goal'] },
    { id:'seller',  label:'SELLER',         x:3.4,   y:1.4,  z:0,    color:0x22D3EE, r:0.13, conns:['products'] },
    { id:'service', label:'SERVICE\nPROV.', x:3.4,   y:-1.4, z:0,    color:0x22D3EE, r:0.13, conns:['services'] },
    { id:'admin',   label:'ADMIN',          x:-3.4,  y:-1.4, z:0,    color:0x22D3EE, r:0.13, conns:['engine'] },
    { id:'goal',    label:'GOAL',           x:-1.8,  y:2.3,  z:0.4,  color:0xF5B942, r:0.10, conns:['engine'] },
    { id:'planner', label:'PLANNER',        x:-0.7,  y:2.1,  z:0.3,  color:0xF5B942, r:0.10, conns:['engine'] },
    { id:'products',label:'PRODUCTS',       x:1.8,   y:2.3,  z:0.4,  color:0x6C63FF, r:0.10, conns:['engine'] },
    { id:'services',label:'SERVICES',       x:1.8,   y:-2.3, z:0.4,  color:0x6C63FF, r:0.10, conns:['engine'] },
    { id:'solution',label:'SOLUTION',       x:0,     y:-1.8, z:0.5,  color:0x22D3EE, r:0.12, conns:['engine'] },
    { id:'order',   label:'ORDER',          x:-1.0,  y:-2.5, z:0.3,  color:0xF5B942, r:0.09, conns:['solution'] },
    { id:'delivery',label:'DELIVERY',       x:0.8,   y:-2.9, z:0,    color:0xF5B942, r:0.09, conns:['order'] },
    { id:'warranty',label:'WARRANTY',       x:-0.4,  y:-3.3, z:-0.3, color:0x8D93A1, r:0.09, conns:['delivery'] },
    { id:'upgrade', label:'UPGRADE',        x:1.8,   y:-3.2, z:-0.3, color:0x8D93A1, r:0.09, conns:['warranty'] },
  ],

  init() {
    this.canvas = document.getElementById('lifecart-canvas');
    if (!this.canvas || typeof THREE === 'undefined') return;
    const wrap = this.canvas.parentElement;
    const w = wrap.offsetWidth, h = wrap.offsetHeight;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-10, -10);
    this.camera = new THREE.PerspectiveCamera(52, w/h, 0.1, 100);
    this.camera.position.set(0, 0, 10);
    this.renderer = SceneManager.createRenderer(this.canvas, w, h);
    this.buildNodes();
    this.buildEdges();
    this.buildFlowParticles();
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    });
    this.canvas.addEventListener('mouseleave', () => { this.mouse.set(-10,-10); this.resetHighlight(); this.hoveredNode=null; });
    window.addEventListener('resize', Utils.debounce(() => this.onResize(), 200));
    new IntersectionObserver(entries => { this.isVisible = entries[0].isIntersecting; }).observe(this.canvas);
    this.animate();
  },

  buildNodes() {
    this.nodeData.forEach(d => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 16, 16), new THREE.MeshBasicMaterial({ color:d.color, transparent:true, opacity:0.85 }));
      mesh.position.set(d.x, d.y, d.z);
      mesh.userData = { ...d, origY: d.y };
      // Glow ring
      const ringMesh = new THREE.Mesh(new THREE.RingGeometry(d.r*1.5,d.r*2.2,20), new THREE.MeshBasicMaterial({ color:d.color, transparent:true, opacity:0.12, side:THREE.DoubleSide }));
      ringMesh.userData.isRing = true;
      mesh.add(ringMesh);
      this.nodes.push(mesh); this.scene.add(mesh);
    });
  },

  buildEdges() {
    this.nodeData.forEach(d => {
      const fromN = this.nodes.find(n => n.userData.id === d.id);
      if (!fromN) return;
      (d.conns || []).forEach(cid => {
        const toN = this.nodes.find(n => n.userData.id === cid);
        if (!toN) return;
        const pts = [fromN.position.clone(), toN.position.clone()];
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:0x6C63FF, transparent:true, opacity:0.14 }));
        line.userData = { from: d.id, to: cid };
        this.edges.push(line); this.scene.add(line);
      });
    });
  },

  buildFlowParticles() {
    this.edges.forEach(edge => {
      const fromN = this.nodes.find(n => n.userData.id === edge.userData.from);
      const toN   = this.nodes.find(n => n.userData.id === edge.userData.to);
      if (!fromN || !toN) return;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
      const mat = new THREE.PointsMaterial({ color:0x22D3EE, size:0.07, transparent:true, opacity:0 });
      const pt = new THREE.Points(geo, mat);
      pt.userData = { fromPos: fromN.position, toPos: toN.position, t: Math.random(), speed: 0.004 + Math.random()*0.005 };
      this.flowParticles.push(pt); this.scene.add(pt);
    });
  },

  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.nodes);
    if (hits.length > 0) {
      const hit = hits[0].object;
      if (this.hoveredNode !== hit) { this.hoveredNode = hit; this.highlightNode(hit); }
    } else {
      if (this.hoveredNode) { this.hoveredNode = null; this.resetHighlight(); }
    }
  },

  highlightNode(node) {
    const id = node.userData.id;
    const conns = node.userData.conns || [];
    this.nodes.forEach(n => n.material.opacity = 0.22);
    node.material.opacity = 1.0;
    node.material.color.setHex(node.userData.color);
    conns.forEach(cid => { const cn = this.nodes.find(n => n.userData.id === cid); if (cn) { cn.material.opacity = 0.85; } });
    this.edges.forEach(e => {
      const connected = e.userData.from === id || e.userData.to === id;
      e.material.opacity = connected ? 0.65 : 0.04;
      e.material.color.setHex(connected ? 0x22D3EE : 0x6C63FF);
    });
    this.flowParticles.forEach(fp => { fp.material.opacity = 0.9; });
  },

  resetHighlight() {
    this.nodes.forEach(n => n.material.opacity = 0.85);
    this.edges.forEach(e => { e.material.opacity = 0.14; e.material.color.setHex(0x6C63FF); });
    this.flowParticles.forEach(fp => { fp.material.opacity = 0; });
  },

  animate() {
    if (!this.isVisible) { requestAnimationFrame(() => this.animate()); return; }
    const t = this.clock.getElapsedTime();
    this.checkHover();
    this.scene.rotation.y = Math.sin(t * 0.07) * 0.1;
    this.nodes.forEach((n, i) => {
      n.position.y = n.userData.origY + Math.sin(t*0.55 + i*0.9) * 0.05;
      n.children.forEach(c => { if (c.userData.isRing) { c.rotation.z = t * 0.4; } });
    });
    this.flowParticles.forEach(fp => {
      fp.userData.t = (fp.userData.t + fp.userData.speed) % 1;
      const arr = fp.geometry.attributes.position.array;
      arr[0] = Utils.lerp(fp.userData.fromPos.x, fp.userData.toPos.x, fp.userData.t);
      arr[1] = Utils.lerp(fp.userData.fromPos.y, fp.userData.toPos.y, fp.userData.t);
      arr[2] = Utils.lerp(fp.userData.fromPos.z, fp.userData.toPos.z, fp.userData.t);
      fp.geometry.attributes.position.needsUpdate = true;
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  },

  onResize() {
    const wrap = this.canvas.parentElement;
    const w = wrap.offsetWidth, h = wrap.offsetHeight;
    this.camera.aspect = w/h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w,h);
  }
};