/* Dust2 Web Demo — three.js r128 ile FPS gezinti demosu.
   Kontroller: WASD yürü · Fare bak · Space zıpla · Shift yavaş yürü · R başa dön */
(function () {
  'use strict';

  var THREE = window.THREE;
  if (!THREE) {
    var card = document.getElementById('card');
    if (card) card.style.display = 'none';
    var eb = document.getElementById('error');
    if (eb) { eb.style.display = 'block'; eb.innerHTML = 'three.js yüklenemedi. Çevrimdışıysanız <b>libs/three.min.js</b> dosyasının klasörde olduğundan emin olun.'; }
    return;
  }

  /* ---------- küçük yardımcılar ---------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function canvas2d(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return { c: c, g: c.getContext('2d') }; }
  function tex(canvas, rx, ry) {
    var t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    t.encoding = THREE.sRGBEncoding;
    if (rx) t.repeat.set(rx, ry || rx);
    return t;
  }

  /* ---------- prosedürel dokular ---------- */
  function wallTexture() {
    var o = canvas2d(512, 512), g = o.g, i, y, h2, x, rr, grd, k;
    g.fillStyle = '#cdb78e'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 26; i++) {
      y = Math.random() * 512; h2 = 8 + Math.random() * 46;
      g.fillStyle = 'rgba(' + (150 + Math.random() * 45 | 0) + ',' + (128 + Math.random() * 35 | 0) + ',' + (92 + Math.random() * 30 | 0) + ',' + (0.05 + Math.random() * 0.1).toFixed(3) + ')';
      g.fillRect(0, y, 512, h2); g.fillRect(0, y - 512, 512, h2);
    }
    for (i = 0; i < 30; i++) {
      x = Math.random() * 512; y = Math.random() * 512; rr = 20 + Math.random() * 80;
      grd = g.createRadialGradient(x, y, 2, x, y, rr);
      grd.addColorStop(0, Math.random() < 0.6 ? 'rgba(118,98,68,0.18)' : 'rgba(238,226,196,0.15)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.beginPath(); g.arc(x, y, rr, 0, 6.284); g.fill();
      g.beginPath(); g.arc(x - 512, y, rr, 0, 6.284); g.fill();
      g.beginPath(); g.arc(x, y - 512, rr, 0, 6.284); g.fill();
      g.beginPath(); g.arc(x - 512, y - 512, rr, 0, 6.284); g.fill();
    }
    for (i = 0; i < 16; i++) {
      g.fillStyle = 'rgba(96,80,58,' + (0.03 + Math.random() * 0.05).toFixed(3) + ')';
      g.fillRect(Math.random() * 512, 0, 2 + Math.random() * 12, 512);
    }
    g.strokeStyle = 'rgba(90,74,52,0.35)'; g.lineWidth = 1.2;
    for (i = 0; i < 7; i++) {
      x = Math.random() * 512; y = Math.random() * 512;
      g.beginPath(); g.moveTo(x, y);
      for (k = 0; k < 5; k++) { x += rnd(-40, 40); y += rnd(10, 40); g.lineTo(x, y); }
      g.stroke();
    }
    for (i = 0; i < 9000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(96,80,58,0.10)' : 'rgba(246,236,206,0.10)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.6, 1.6);
    }
    return tex(o.c);
  }

  function floorTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y, rr, grd, px, py, r2;
    g.fillStyle = '#b7a074'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 40; i++) {
      x = Math.random() * 512; y = Math.random() * 512; rr = 30 + Math.random() * 90;
      grd = g.createRadialGradient(x, y, 4, x, y, rr);
      grd.addColorStop(0, Math.random() < 0.5 ? 'rgba(150,128,92,0.25)' : 'rgba(214,200,164,0.22)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.beginPath(); g.arc(x, y, rr, 0, 6.284); g.fill();
      g.beginPath(); g.arc(x - 512, y - 512, rr, 0, 6.284); g.fill();
    }
    for (i = 0; i < 14000; i++) {
      g.fillStyle = Math.random() < 0.55 ? 'rgba(112,92,62,0.13)' : 'rgba(232,220,188,0.12)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.7, 1.7);
    }
    for (i = 0; i < 260; i++) {
      px = Math.random() * 512; py = Math.random() * 512; r2 = 1 + Math.random() * 2.2;
      g.fillStyle = 'rgba(120,102,74,0.5)';
      g.beginPath(); g.arc(px + 0.8, py + 1, r2, 0, 6.284); g.fill();
      g.fillStyle = 'rgba(214,200,170,0.75)';
      g.beginPath(); g.arc(px, py, r2, 0, 6.284); g.fill();
    }
    return tex(o.c);
  }

  function crateTexture() {
    var o = canvas2d(256, 256), g = o.g, i, k, x0;
    g.fillStyle = '#a8793f'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 4; i++) {
      x0 = i * 64;
      g.fillStyle = 'rgba(' + (150 + Math.random() * 30 | 0) + ',' + (108 + Math.random() * 22 | 0) + ',' + (54 + Math.random() * 18 | 0) + ',0.85)';
      g.fillRect(x0 + 2, 0, 60, 256);
      g.fillStyle = 'rgba(70,48,24,0.55)'; g.fillRect(x0, 0, 3, 256);
      for (k = 0; k < 26; k++) {
        g.fillStyle = 'rgba(84,58,28,' + (0.05 + Math.random() * 0.12).toFixed(3) + ')';
        g.fillRect(x0 + 4 + Math.random() * 54, Math.random() * 256, 1.6, 8 + Math.random() * 40);
      }
    }
    g.strokeStyle = 'rgba(60,40,20,0.8)'; g.lineWidth = 10; g.strokeRect(5, 5, 246, 246);
    g.fillStyle = 'rgba(130,134,140,0.9)';
    g.fillRect(2, 2, 26, 26); g.fillRect(228, 2, 26, 26); g.fillRect(2, 228, 26, 26); g.fillRect(228, 228, 26, 26);
    g.fillStyle = 'rgba(60,40,20,0.25)';
    for (i = 0; i < 500; i++) g.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
    return tex(o.c);
  }

  function barrelTexture() {
    var o = canvas2d(256, 256), g = o.g, i, x, y, rr, grd;
    g.fillStyle = '#7e8867'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 16; i++) {
      g.fillStyle = 'rgba(60,70,48,' + (0.06 + Math.random() * 0.1).toFixed(3) + ')';
      g.fillRect(Math.random() * 256, 0, 4 + Math.random() * 18, 256);
    }
    g.fillStyle = 'rgba(50,56,40,0.55)'; g.fillRect(0, 0, 256, 10); g.fillRect(0, 246, 256, 10);
    g.fillStyle = 'rgba(120,130,96,0.25)'; g.fillRect(0, 26, 256, 14);
    for (i = 0; i < 34; i++) {
      x = Math.random() * 256; y = Math.random() * 256; rr = 6 + Math.random() * 26;
      grd = g.createRadialGradient(x, y, 1, x, y, rr);
      grd.addColorStop(0, 'rgba(138,74,38,0.5)'); grd.addColorStop(1, 'rgba(138,74,38,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, rr, 0, 6.284); g.fill();
    }
    for (i = 0; i < 700; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(40,46,32,0.12)' : 'rgba(190,196,170,0.08)';
      g.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
    }
    return tex(o.c);
  }

  function letterTexture(ch) {
    var o = canvas2d(256, 256), g = o.g;
    g.clearRect(0, 0, 256, 256);
    g.font = 'bold 200px Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 16; g.strokeStyle = 'rgba(245,240,228,0.9)'; g.strokeText(ch, 128, 136);
    g.fillStyle = '#c0392b'; g.fillText(ch, 128, 136);
    var t = new THREE.CanvasTexture(o.c); t.anisotropy = 4; t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function labelTexture(txt) {
    var o = canvas2d(512, 128), g = o.g;
    g.font = 'bold 74px Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(52,42,28,0.62)';
    g.fillText(txt, 256, 68);
    var t = new THREE.CanvasTexture(o.c); t.anisotropy = 4; t.encoding = THREE.sRGBEncoding;
    return t;
  }

  /* ---------- ek harita dokuları ---------- */
  function concreteTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y, r, grd, px2, py2;
    g.fillStyle = '#8d9094'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 28; i++) {
      g.fillStyle = 'rgba(' + (120 + Math.random() * 30 | 0) + ',' + (122 + Math.random() * 30 | 0) + ',' + (126 + Math.random() * 30 | 0) + ',' + (0.05 + Math.random() * 0.08).toFixed(3) + ')';
      g.fillRect(0, Math.random() * 512, 512, 10 + Math.random() * 50);
    }
    g.strokeStyle = 'rgba(60,63,66,0.55)'; g.lineWidth = 3;
    for (i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke();
    }
    g.fillStyle = 'rgba(50,53,56,0.6)';
    for (px2 = 0; px2 < 4; px2++) for (py2 = 0; py2 < 4; py2++) {
      g.beginPath(); g.arc(px2 * 128 + 14, py2 * 128 + 14, 4, 0, 6.283); g.fill();
      g.beginPath(); g.arc(px2 * 128 + 114, py2 * 128 + 114, 4, 0, 6.283); g.fill();
    }
    // kırmızı sanayi şeridi (redline teması)
    g.fillStyle = 'rgba(178,52,44,0.85)'; g.fillRect(0, 404, 512, 26);
    g.fillStyle = 'rgba(30,32,34,0.5)'; g.fillRect(0, 430, 512, 4);
    for (i = 0; i < 9000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(60,62,64,0.07)' : 'rgba(220,224,228,0.06)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.6, 1.6);
    }
    for (i = 0; i < 20; i++) {
      x = Math.random() * 512; y = Math.random() * 512; r = 20 + Math.random() * 70;
      grd = g.createRadialGradient(x, y, 2, x, y, r);
      grd.addColorStop(0, 'rgba(70,72,75,0.12)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
    }
    return tex(o.c);
  }
  function asphaltTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y;
    g.fillStyle = '#414449'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 15000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(20,22,24,0.18)' : 'rgba(190,194,198,0.09)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.8, 1.8);
    }
    g.strokeStyle = 'rgba(24,26,28,0.5)'; g.lineWidth = 1.4;
    for (i = 0; i < 10; i++) {
      x = Math.random() * 512; y = Math.random() * 512;
      g.beginPath(); g.moveTo(x, y);
      for (var k = 0; k < 4; k++) { x += rnd(-46, 46); y += rnd(8, 40); g.lineTo(x, y); }
      g.stroke();
    }
    g.fillStyle = 'rgba(225,228,232,0.10)';
    for (i = 0; i < 8; i++) g.fillRect(250, i * 64 + 8, 12, 34);
    return tex(o.c);
  }
  function legoWallTexture() {
    var o = canvas2d(512, 512), g = o.g, r, c, i;
    var cols = ['#d23c3c', '#3c6fd2', '#e0b12f', '#4fae4f', '#e07b2a', '#6a4fd2', '#2f9ea8', '#d24f86'];
    g.fillStyle = '#1d2026'; g.fillRect(0, 0, 512, 512);
    for (r = 0; r < 4; r++) {
      for (c = 0; c < 4; c++) {
        var x = c * 128, y = r * 128, col = cols[(r * 4 + c + (Math.random() * 2 | 0)) % cols.length];
        g.fillStyle = col; g.fillRect(x + 3, y + 3, 122, 122);
        g.fillStyle = 'rgba(255,255,255,0.24)'; g.fillRect(x + 3, y + 3, 122, 9);
        g.fillStyle = 'rgba(0,0,0,0.20)'; g.fillRect(x + 3, y + 114, 122, 11);
        g.fillStyle = 'rgba(255,255,255,0.20)';
        g.beginPath(); g.arc(x + 64, y + 64, 26, 0, 6.283); g.fill();
        g.fillStyle = 'rgba(0,0,0,0.12)';
        g.beginPath(); g.arc(x + 64, y + 69, 26, 0.2, 3.0); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.14)';
        for (i = 0; i < 40; i++) g.fillRect(x + 3 + Math.random() * 116, y + 3 + Math.random() * 116, 1.6, 1.6);
      }
    }
    return tex(o.c);
  }
  function legoFloorTexture() {
    var o = canvas2d(512, 512), g = o.g, i;
    g.fillStyle = '#c3c9d6'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(120,128,145,0.55)'; g.lineWidth = 2;
    for (i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke();
    }
    for (i = 0; i < 16; i++) {
      var x = (i % 4) * 128 + 64, y = (Math.floor(i / 4)) * 128 + 64;
      g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.arc(x, y, 20, 0, 6.283); g.fill();
      g.fillStyle = 'rgba(130,140,158,0.25)'; g.beginPath(); g.arc(x, y + 3, 20, 0.2, 3.0); g.fill();
    }
    for (i = 0; i < 5000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(90,98,115,0.06)' : 'rgba(255,255,255,0.08)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    return tex(o.c);
  }
  function legoCrateTexture() {
    var o = canvas2d(256, 256), g = o.g, i;
    g.fillStyle = '#3c6fd2'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(0, 0, 256, 14);
    g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(0, 236, 256, 20);
    g.fillStyle = 'rgba(255,255,255,0.2)';
    for (i = 0; i < 4; i++) { g.beginPath(); g.arc(42 + i * 57, 128, 17, 0, 6.283); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,0.12)';
    for (i = 0; i < 4; i++) { g.beginPath(); g.arc(42 + i * 57, 133, 17, 0.2, 3.0); g.fill(); }
    return tex(o.c);
  }
  function plasterTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y, r, grd;
    g.fillStyle = '#ded3bb'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 34; i++) {
      x = Math.random() * 512; y = Math.random() * 512; r = 20 + Math.random() * 90;
      grd = g.createRadialGradient(x, y, 2, x, y, r);
      grd.addColorStop(0, Math.random() < 0.5 ? 'rgba(170,150,118,0.18)' : 'rgba(246,240,226,0.22)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
    }
    g.strokeStyle = 'rgba(120,102,80,0.28)'; g.lineWidth = 1.3;
    for (i = 0; i < 8; i++) {
      x = Math.random() * 512; y = Math.random() * 512;
      g.beginPath(); g.moveTo(x, y);
      for (var k = 0; k < 5; k++) { x += rnd(-36, 36); y += rnd(8, 36); g.lineTo(x, y); }
      g.stroke();
    }
    for (i = 0; i < 9000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(120,104,82,0.08)' : 'rgba(255,248,232,0.10)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.6, 1.6);
    }
    return tex(o.c);
  }
  function cobbleTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y, w, h;
    g.fillStyle = '#615d55'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(42,40,36,0.55)'; g.lineWidth = 3;
    for (i = 0; i < 150; i++) {
      x = Math.random() * 512; y = Math.random() * 512;
      w = 18 + Math.random() * 34; h = 14 + Math.random() * 26;
      g.fillStyle = 'rgba(' + (120 + Math.random() * 40 | 0) + ',' + (112 + Math.random() * 34 | 0) + ',' + (98 + Math.random() * 30 | 0) + ',0.95)';
      g.beginPath();
      g.moveTo(x + w * 0.2, y); g.lineTo(x + w, y + h * 0.2);
      g.lineTo(x + w * 0.8, y + h); g.lineTo(x, y + h * 0.75);
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.09)';
      g.fillRect(x + 3, y + 3, w * 0.5, 3);
    }
    for (i = 0; i < 4000; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(40,38,34,0.08)' : 'rgba(220,214,198,0.08)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 1.6, 1.6);
    }
    return tex(o.c);
  }
  function grassTexture() {
    var o = canvas2d(512, 512), g = o.g, i, x, y;
    g.fillStyle = '#6f8a4a'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 26; i++) {
      g.fillStyle = 'rgba(' + (80 + Math.random() * 40 | 0) + ',' + (110 + Math.random() * 40 | 0) + ',' + (55 + Math.random() * 30 | 0) + ',0.28)';
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, 20 + Math.random() * 60, 0, 6.283); g.fill();
    }
    g.lineWidth = 1.2;
    for (i = 0; i < 3800; i++) {
      x = Math.random() * 512; y = Math.random() * 512;
      g.strokeStyle = Math.random() < 0.5 ? 'rgba(54,80,36,0.35)' : 'rgba(160,190,100,0.30)';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + rnd(-2, 2), y - 2 - Math.random() * 5); g.stroke();
    }
    for (i = 0; i < 90; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(240,232,180,0.65)' : 'rgba(220,190,90,0.6)';
      g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    return tex(o.c);
  }

  var texWall = wallTexture(), texFloor = floorTexture(), texCrate = crateTexture(), texBarrel = barrelTexture();
  var texConcrete = concreteTexture(), texAsphalt = asphaltTexture();
  var texLegoWall = legoWallTexture(), texLegoFloor = legoFloorTexture(), texLegoCrate = legoCrateTexture();
  var texPlaster = plasterTexture(), texCobble = cobbleTexture(), texGrass = grassTexture();

  /* ---------- render & sahne ---------- */
  var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('app').appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd9c9a4, 55, 235);

  var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.05, 900);
  camera.rotation.order = 'YXZ';
  scene.add(camera);

  // gökyüzü (basit gradyan shader)
  var skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {
      cTop: { value: new THREE.Color(0x4a7db5) },
      cMid: { value: new THREE.Color(0xbcd2e6) },
      cBot: { value: new THREE.Color(0xe6d7b6) }
    },
    vertexShader: 'varying float vh; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vh = normalize(wp.xyz).y; gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader: 'uniform vec3 cTop; uniform vec3 cMid; uniform vec3 cBot; varying float vh; void main(){ vec3 c = vh > 0.10 ? mix(cMid, cTop, smoothstep(0.10, 0.7, vh)) : mix(cBot, cMid, smoothstep(-0.1, 0.10, vh)); gl_FragColor = vec4(c, 1.0); }'
  });
  var sky = new THREE.Mesh(new THREE.SphereGeometry(600, 24, 16), skyMat);
  sky.userData.noHit = true;
  scene.add(sky);

  // ışıklar
  var hemi = new THREE.HemisphereLight(0xcfe0f5, 0x8a7550, 0.75);
  scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffeccb, 1.1);
  sun.position.set(70, 110, 55);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera;
  sc.left = -85; sc.right = 85; sc.top = 85; sc.bottom = -85; sc.near = 20; sc.far = 340;
  sc.updateProjectionMatrix();
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);

  // havada uçuşan toz
  var PCOUNT = 600, pPos = new Float32Array(PCOUNT * 3), pi;
  for (pi = 0; pi < PCOUNT; pi++) {
    pPos[pi * 3] = rnd(-58, 52);
    pPos[pi * 3 + 1] = rnd(0.3, 14);
    pPos[pi * 3 + 2] = rnd(-64, 68);
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var dustPoints = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xe8dcbc, size: 0.09, transparent: true, opacity: 0.4, depthWrite: false
  }));
  scene.add(dustPoints);

/* ================= HARİTA SİSTEMİ =================
   Koordinatlar metre. Kuzey = -Z, Güney = +Z. Mavi takım güneyde, kırmızı kuzeyde. */
  var WALL_H = 4.6, WALL_T = 0.45, STEP = 0.55;
  var ROOMS = [], props = [], grid = null;
  var GX = -60, GZ = -60, GW = 120, GD = 120;
  var wallMesh = null, floor = null;
  var worldRoot = new THREE.Group(); scene.add(worldRoot);
  var worldMats = {}, buildTheme = 'sand';
  var currentMap = null, currentMapId = 'dust2';
  var mapSpawns = { blue: [], red: [] };
  var mmScale = 2;
  var mapCanvas = document.getElementById('minimap');
  var mctx = mapCanvas.getContext('2d');
  var mapBase = document.createElement('canvas');

  function walkable(cx, cz) {
    if (!grid) return false;
    if (cx < GX || cz < GZ || cx >= GX + GW || cz >= GZ + GD) return false;
    return grid[(cz - GZ) * GW + (cx - GX)] === 1;
  }

  // --- 1 m ızgara ---
  function buildGrid() {
    var minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, i, r;
    for (i = 0; i < ROOMS.length; i++) {
      r = ROOMS[i];
      minX = Math.min(minX, r.x); maxX = Math.max(maxX, r.x + r.w);
      minZ = Math.min(minZ, r.z); maxZ = Math.max(maxZ, r.z + r.d);
    }
    var PAD = 2;
    GX = minX - PAD; GZ = minZ - PAD;
    GW = (maxX + PAD) - GX; GD = (maxZ + PAD) - GZ;
    grid = new Uint8Array(GW * GD);
    for (i = 0; i < ROOMS.length; i++) {
      r = ROOMS[i];
      for (var cx = r.x; cx < r.x + r.w; cx++)
        for (var cz = r.z; cz < r.z + r.d; cz++)
          if (cx >= GX && cz >= GZ && cx < GX + GW && cz < GZ + GD)
            grid[(cz - GZ) * GW + (cx - GX)] = 1;
    }
  }

  // --- doku yoğunluğu tutarlı kutu geometrisi ---
  function boxGeo(w, h, d, uvScale) {
    var g = new THREE.BoxGeometry(w, h, d);
    var uv = g.attributes.uv;
    var dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (var f = 0; f < 6; f++) {
      var su = dims[f][0] * uvScale, sv = dims[f][1] * uvScale;
      for (var k = 0; k < 4; k++) {
        var vi = f * 4 + k;
        uv.setXY(vi, uv.getX(vi) * su, uv.getY(vi) * sv);
      }
    }
    return g;
  }

  function mergeGeos(list) {
    var vCount = 0, iCount = 0, k, m;
    for (k = 0; k < list.length; k++) { vCount += list[k].attributes.position.count; iCount += list[k].index.count; }
    var pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), uvs = new Float32Array(vCount * 2);
    var idx = vCount > 65000 ? new Uint32Array(iCount) : new Uint16Array(iCount);
    var vo = 0, io = 0;
    for (k = 0; k < list.length; k++) {
      var g = list[k], ga = g.attributes, gi2 = g.index.array;
      pos.set(ga.position.array, vo * 3);
      nor.set(ga.normal.array, vo * 3);
      uvs.set(ga.uv.array, vo * 2);
      for (m = 0; m < gi2.length; m++) idx[io + m] = gi2[m] + vo;
      vo += ga.position.count; io += gi2.length;
    }
    var out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    return out;
  }

  // malzemeler yeni harita için üretilir
  function makeWorldMaterials(theme) {
    if (theme === 'concrete') return {
      wall: new THREE.MeshLambertMaterial({ map: texConcrete }),
      floor: new THREE.MeshLambertMaterial({ map: texAsphalt }), floorMap: texAsphalt,
      crate: new THREE.MeshLambertMaterial({ map: texCrate, color: 0x969ca3 }),
      barrel: new THREE.MeshLambertMaterial({ map: texBarrel, color: 0x8c949c }),
      door: new THREE.MeshLambertMaterial({ color: 0x8f2f28 }),
      frame: new THREE.MeshLambertMaterial({ color: 0x33383d })
    };
    if (theme === 'lego') return {
      wall: new THREE.MeshLambertMaterial({ map: texLegoWall }),
      floor: new THREE.MeshLambertMaterial({ map: texLegoFloor }), floorMap: texLegoFloor,
      crate: new THREE.MeshLambertMaterial({ map: texLegoCrate }),
      barrel: new THREE.MeshLambertMaterial({ map: texBarrel, color: 0x9ec8ff }),
      door: new THREE.MeshLambertMaterial({ color: 0xd23c3c }),
      frame: new THREE.MeshLambertMaterial({ color: 0x2b4b8f })
    };
    if (theme === 'village') return {
      wall: new THREE.MeshLambertMaterial({ map: texPlaster }),
      floor: new THREE.MeshLambertMaterial({ map: texGrass }), floorMap: texGrass,
      crate: new THREE.MeshLambertMaterial({ map: texCrate }),
      barrel: new THREE.MeshLambertMaterial({ map: texBarrel }),
      door: new THREE.MeshLambertMaterial({ color: 0x6b4a2a }),
      frame: new THREE.MeshLambertMaterial({ color: 0x8c7a5b })
    };
    return {
      wall: new THREE.MeshLambertMaterial({ map: texWall }),
      floor: new THREE.MeshLambertMaterial({ map: texFloor }), floorMap: texFloor,
      crate: new THREE.MeshLambertMaterial({ map: texCrate }),
      barrel: new THREE.MeshLambertMaterial({ map: texBarrel }),
      door: new THREE.MeshLambertMaterial({ color: 0x44604a }),
      frame: new THREE.MeshLambertMaterial({ color: 0x6b5a42 })
    };
  }

  var THEMES = {
    sand: { skyTop: 0x4a7db5, skyMid: 0xbcd2e6, skyBot: 0xe6d7b6, fog: 0xd9c9a4, fogNear: 55, fogFar: 235,
      sunColor: 0xffeccb, sunInt: 1.1, hemiSky: 0xcfe0f5, hemiGround: 0x8a7550, hemiInt: 0.75, dust: 0xe8dcbc,
      miniBg: '#20242b', miniFloor: '#c8b083', miniProp: '#463f36' },
    concrete: { skyTop: 0x5b7c9c, skyMid: 0xaebfcc, skyBot: 0xc9c3b6, fog: 0xb9b6ae, fogNear: 50, fogFar: 200,
      sunColor: 0xfff2dd, sunInt: 1.0, hemiSky: 0xc7d6e2, hemiGround: 0x6f6d66, hemiInt: 0.8, dust: 0xd8d4c8,
      miniBg: '#1d2024', miniFloor: '#7a7f84', miniProp: '#3a3d42' },
    lego: { skyTop: 0x3f7fd6, skyMid: 0x9dc9f0, skyBot: 0xeaf2fb, fog: 0xdbe9f7, fogNear: 70, fogFar: 260,
      sunColor: 0xffffff, sunInt: 1.15, hemiSky: 0xdceafb, hemiGround: 0x8c8f96, hemiInt: 0.9, dust: 0xf0f4f8,
      miniBg: '#252134', miniFloor: '#a9b3cf', miniProp: '#4b4660' },
    village: { skyTop: 0x5a8fbe, skyMid: 0xbfd7e6, skyBot: 0xf0e3c6, fog: 0xdfd6c2, fogNear: 60, fogFar: 220,
      sunColor: 0xffe7bd, sunInt: 1.2, hemiSky: 0xd8e6f2, hemiGround: 0x7c8a5b, hemiInt: 0.85, dust: 0xf2ead2,
      miniBg: '#1f261f', miniFloor: '#9a9a7e', miniProp: '#4c5a3c' }
  };

  function applyTheme(name) {
    var t = THEMES[name] || THEMES.sand;
    skyMat.uniforms.cTop.value.setHex(t.skyTop);
    skyMat.uniforms.cMid.value.setHex(t.skyMid);
    skyMat.uniforms.cBot.value.setHex(t.skyBot);
    scene.fog.color.setHex(t.fog); scene.fog.near = t.fogNear; scene.fog.far = t.fogFar;
    sun.color.setHex(t.sunColor); sun.intensity = t.sunInt;
    hemi.color.setHex(t.hemiSky); hemi.groundColor.setHex(t.hemiGround); hemi.intensity = t.hemiInt;
    dustPoints.material.color.setHex(t.dust);
  }

  // --- yürünebilir spawn noktaları ---
  function findClearSpot(x, z, r) {
    if (walkable(Math.floor(x), Math.floor(z)) && npcClear(x, z, r)) return { x: x, z: z };
    for (var d = 0.6; d <= 7; d += 0.5) {
      for (var a = 0; a < 12; a++) {
        var ang = a * Math.PI / 6;
        var nx = x + Math.cos(ang) * d, nz = z + Math.sin(ang) * d;
        if (walkable(Math.floor(nx), Math.floor(nz)) && npcClear(nx, nz, r)) return { x: nx, z: nz };
      }
    }
    return null;
  }
  function makeSpawnList(sp, n) {
    var list = [], f = { x: -Math.sin(sp.yaw), z: -Math.cos(sp.yaw) }, rgt = { x: Math.cos(sp.yaw), z: -Math.sin(sp.yaw) };
    for (var i = 0; i < n; i++) {
      var x = sp.x, z = sp.z;
      if (i > 0) {
        var row = Math.floor((i - 1) / 5), col = (i - 1) % 5;
        var side = (col - 2) * 1.9, back = 2.0 + row * 2.0;
        x = sp.x + rgt.x * side - f.x * back;
        z = sp.z + rgt.z * side - f.z * back;
      }
      var spot = findClearSpot(x, z, 0.55) || { x: x, z: z };
      list.push({ x: spot.x, z: spot.z, yaw: sp.yaw });
    }
    return list;
  }

  // --- harita inşa yardımcıları ---
  function addRoom(x, z, w, d, name) { ROOMS.push({ x: x, z: z, w: w, d: d, name: name }); }

  function addCrate(x, z, w, d, h) {
    var g = boxGeo(w, h, d, 0.7);
    g.translate(x + w / 2, h / 2, z + d / 2);
    var m = new THREE.Mesh(g, worldMats.crate);
    m.castShadow = true; m.receiveShadow = true;
    worldRoot.add(m);
    props.push({ x0: x, x1: x + w, z0: z, z1: z + d, y0: 0, y1: h });
  }
  function addBarrel(x, z) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.95, 14), worldMats.barrel);
    m.position.set(x, 0.475, z);
    m.castShadow = true; m.receiveShadow = true;
    worldRoot.add(m);
    props.push({ x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5, y0: 0, y1: 0.95 });
  }
  function addStuds(x, z, w, d, y, color) {
    var col = new THREE.Color(color); col.multiplyScalar(1.15);
    var mat = new THREE.MeshLambertMaterial({ color: col });
    var n = Math.max(1, Math.floor(w / 2)), m2 = Math.max(1, Math.floor(d / 2));
    for (var i = 0; i < n; i++) for (var j = 0; j < m2; j++) {
      var stud = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 10), mat);
      stud.position.set(x + (i + 0.5) * (w / n), y + 0.06, z + (j + 0.5) * (d / m2));
      stud.userData.noHit = true;
      worldRoot.add(stud);
    }
  }
  function addBlock(x, z, w, d, h, color, y0) {
    y0 = y0 || 0;
    var mat = new THREE.MeshLambertMaterial({ color: color });
    var m = new THREE.Mesh(boxGeo(w, h, d, 1), mat);
    m.position.set(x + w / 2, y0 + h / 2, z + d / 2);
    m.castShadow = true; m.receiveShadow = true;
    worldRoot.add(m);
    props.push({ x0: x, x1: x + w, z0: z, z1: z + d, y0: y0, y1: y0 + h });
    if (buildTheme === 'lego' && w >= 2 && d >= 2) addStuds(x, z, w, d, y0 + h, color);
  }
  function part(w, h, d, x, y, z, mat) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    worldRoot.add(m);
    return m;
  }
  function groundDecal(texture, size, x, z, rotZ, lit) {
    var mat = lit
      ? new THREE.MeshLambertMaterial({ map: texture, transparent: true, depthWrite: false })
      : new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    m.rotation.x = -Math.PI / 2;
    if (rotZ) m.rotation.z = rotZ;
    m.position.set(x, 0.02, z);
    m.userData.noHit = true;
    worldRoot.add(m);
    return m;
  }
  function groundTint(w, d, x, z, color, opacity) {
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: opacity, depthWrite: false
    }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.014, z);
    m.userData.noHit = true;
    worldRoot.add(m);
  }

  function house(x, z, w, d, h, wallColor, roofColor) {
    var body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: wallColor }));
    body.position.set(x, h / 2, z); body.castShadow = true; body.receiveShadow = true; worldRoot.add(body);
    var roofH = Math.max(1.3, h * 0.42);
    var roof = new THREE.Mesh(new THREE.ConeGeometry(Math.sqrt(w * w + d * d) / 2 * 1.1, roofH, 4),
      new THREE.MeshLambertMaterial({ color: roofColor }));
    roof.position.set(x, h + roofH / 2, z);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true; worldRoot.add(roof);
    var detMat = new THREE.MeshLambertMaterial({ color: 0x4a3524 });
    var winW = Math.min(1.0, w * 0.18), winH = Math.min(1.2, h * 0.28);
    for (var sx = -1; sx <= 1; sx += 2) for (var sz = -1; sz <= 1; sz += 2) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.12), detMat);
      win.position.set(x + sx * w * 0.25, h * 0.58, z + sz * (d / 2 + 0.02));
      worldRoot.add(win);
    }
    var dw = Math.min(1.9, h * 0.42);
    var door = new THREE.Mesh(new THREE.BoxGeometry(0.9, dw, 0.14), detMat);
    door.position.set(x, dw / 2, z + d / 2 + 0.02);
    worldRoot.add(door);
  }
  function tree(x, z, s) {
    s = s || 1;
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * s, 0.28 * s, 2.3 * s, 8),
      new THREE.MeshLambertMaterial({ color: 0x6b4a2a }));
    trunk.position.set(x, 1.15 * s, z); trunk.castShadow = true; worldRoot.add(trunk);
    var leafMat = new THREE.MeshLambertMaterial({ color: 0x4d7a35 });
    var fol = [[0, 2.7, 0, 1.25], [0.7, 2.2, 0.35, 0.85], [-0.6, 2.3, -0.3, 0.9], [0.1, 3.3, 0.15, 0.75]];
    for (var i = 0; i < fol.length; i++) {
      var f = fol[i];
      var leaf = new THREE.Mesh(new THREE.SphereGeometry(f[3] * s, 10, 8), leafMat);
      leaf.position.set(x + f[0] * s, f[1] * s, z + f[2] * s);
      leaf.castShadow = true; worldRoot.add(leaf);
    }
    props.push({ x0: x - 0.32 * s, x1: x + 0.32 * s, z0: z - 0.32 * s, z1: z + 0.32 * s, y0: 0, y1: 2.3 * s });
  }
  function stall(x, z, rot, color) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0;
    var wood = new THREE.MeshLambertMaterial({ color: 0x7a5a34 });
    var postGeo = new THREE.BoxGeometry(0.14, 2.1, 0.14);
    var pts = [[-1.25, -0.85], [1.25, -0.85], [-1.25, 0.85], [1.25, 0.85]];
    for (var i = 0; i < pts.length; i++) {
      var post = new THREE.Mesh(postGeo, wood);
      post.position.set(pts[i][0], 1.05, pts[i][1]); post.castShadow = true; g.add(post);
    }
    var canopy = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.09, 2.25), new THREE.MeshLambertMaterial({ color: color }));
    canopy.position.set(0, 2.12, 0); canopy.rotation.z = 0.07; canopy.castShadow = true; g.add(canopy);
    var table = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.7, 1.05), wood);
    table.position.set(0, 0.35, 0.12); table.castShadow = true; g.add(table);
    var fruit = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 0.52),
      new THREE.MeshLambertMaterial({ color: 0xcf9f3a }));
    fruit.position.set(-0.55, 0.87, 0.12); g.add(fruit);
    worldRoot.add(g);
    props.push({ x0: x - 1.2, x1: x + 1.2, z0: z - 0.55, z1: z + 0.65, y0: 0, y1: 0.7 });
  }
  function fountain(x, z) {
    var stone = new THREE.MeshLambertMaterial({ color: 0x9a9484 });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.75, 22), stone);
    base.position.set(x, 0.375, z); base.castShadow = true; base.receiveShadow = true; worldRoot.add(base);
    var water = new THREE.Mesh(new THREE.CircleGeometry(2.04, 22),
      new THREE.MeshLambertMaterial({ color: 0x3c7d9a, transparent: true, opacity: 0.85 }));
    water.rotation.x = -Math.PI / 2; water.position.set(x, 0.78, z); worldRoot.add(water);
    var col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.0, 10), stone);
    col.position.set(x, 1.75, z); col.castShadow = true; worldRoot.add(col);
    var bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.68, 0.22, 14), stone);
    bowl.position.set(x, 2.55, z); bowl.castShadow = true; worldRoot.add(bowl);
    props.push({ x0: x - 2.3, x1: x + 2.3, z0: z - 2.3, z1: z + 2.3, y0: 0, y1: 0.75 });
  }

  /* ---------------- HARİTA 1: DUST II ---------------- */
  function buildDust2() {
    addRoom(-20, 40, 40, 18, 'T Spawn');
    addRoom(-6, -10, 12, 50, 'Mid');
    addRoom(-6, -32, 12, 22, 'CT Mid');
    addRoom(-16, -52, 32, 20, 'CT Spawn');
    addRoom(-22, 34, 16, 8, 'Mid Doors');
    addRoom(20, 42, 6, 10, 'T Ramp');
    addRoom(26, -16, 12, 68, 'Long A');
    addRoom(6, -8, 14, 8, 'Catwalk');
    addRoom(14, -22, 8, 14, 'Short A');
    addRoom(16, -36, 28, 20, 'A Site');
    addRoom(16, -50, 12, 8, 'CT to A');
    addRoom(20, -42, 8, 8, 'A Ramp');
    addRoom(-30, -48, 14, 12, 'CT to B');
    addRoom(-46, -38, 24, 20, 'B Site');
    addRoom(-34, -24, 10, 66, 'Tunnels');
    addRoom(-32, 42, 12, 10, 'Outside Tunnels');
    addRoom(-44, -18, 6, 70, 'Lower Tunnel');
    addRoom(-44, 50, 30, 8, 'T West');
    // eşyalar
    addBarrel(-17.5, 43); addBarrel(-16, 43.5);
    addCrate(15, 42, 2, 2, 1.7); addCrate(17.2, 42, 1.2, 1.2, 0.85);
    addCrate(-18, 54, 1.4, 1.4, 0.85);
    addCrate(-1, 27, 2, 2, 0.9);
    addBarrel(-4.5, 35); addBarrel(4.5, 35);
    addCrate(17, -6, 1.4, 1.4, 0.85);
    addBarrel(20, -12);
    addCrate(31, 8, 2, 2, 1.7); addCrate(33.5, 9, 2, 2, 0.85);
    addCrate(35, -12, 2, 2, 0.85);
    addCrate(27, 44, 1.4, 1.4, 0.85);
    addCrate(28, -20, 2, 2, 0.85);
    addCrate(35, -22, 2, 2, 1.7); addCrate(33, -22, 2, 2, 0.85);
    addCrate(41, -33, 2, 2, 0.85);
    addBarrel(27.5, -17.6);
    addCrate(11, -50, 2, 2, 1.7); addCrate(13.2, -50, 1.2, 1.2, 0.85);
    addBarrel(-12, -35); addBarrel(-10.6, -35.2);
    addBarrel(-25, -45);
    addBarrel(24, -38);
    addCrate(-32, -23, 3, 2, 1.4);
    addCrate(-40, -30, 2, 2, 1.7); addCrate(-38, -30, 2, 2, 0.85);
    addBarrel(-24, -34); addBarrel(-24.5, -32.5);
    addBarrel(-27.5, 12); addBarrel(-27, 13.6);
    addCrate(-31.5, 20, 2, 2, 1.7);
    addBarrel(-41, 32);
    addCrate(-30, 47, 2, 2, 1.7);
    // kapı çerçeveleri
    var dm = worldMats.door, fm = worldMats.frame;
    part(12, 0.35, 0.4, 0, 2.92, 32, fm);
    part(0.5, 2.9, 0.5, -5.75, 1.45, 32, fm);
    part(0.5, 2.9, 0.5, 5.75, 1.45, 32, fm);
    part(2.7, 2.6, 0.14, -4.35, 1.3, 32, dm);
    part(2.7, 2.6, 0.14, 4.35, 1.3, 32, dm);
    part(0.4, 0.35, 10, 23, 2.92, 47, fm);
    part(0.5, 2.9, 0.5, 23, 1.45, 42.25, fm);
    part(0.5, 2.9, 0.5, 23, 1.45, 51.75, fm);
    part(0.14, 2.6, 2.6, 23, 1.3, 43.4, dm);
    part(0.14, 2.6, 2.6, 23, 1.3, 50.6, dm);
    part(0.4, 0.35, 12, -24, 2.92, -42, fm);
    part(0.5, 2.9, 0.5, -24, 1.45, -47.75, fm);
    part(0.5, 2.9, 0.5, -24, 1.45, -36.25, fm);
    part(0.14, 2.6, 2.6, -24, 1.3, -46.6, dm);
    part(0.14, 2.6, 2.6, -24, 1.3, -37.4, dm);
    // zemin işaretleri
    groundDecal(letterTexture('A'), 8, 30, -26, 0, true);
    groundDecal(letterTexture('B'), 8, -34, -28, 0, true);
    groundDecal(labelTexture('T SPAWN'), 10, -6, 51, 0, true);
    groundDecal(labelTexture('CT SPAWN'), 10, 2, -44, 0, true);
    groundTint(30, 10, 0, 49, 0x3d7fd4, 0.12);
    groundTint(26, 10, 0, -42, 0xa33b30, 0.12);
  }

  /* ---------------- HARİTA 2: AIM REDLINE ---------------- */
  function buildRedline() {
    addRoom(-15, 12, 30, 14, 'Mavi Spawn');
    addRoom(-15, -26, 30, 14, 'Kırmızı Spawn');
    addRoom(-15, -12, 12, 24, 'Sol Hat');
    addRoom(3, -12, 12, 24, 'Sağ Hat');
    // merkez duvarı (x -3..3, z -12..12) odalara dahil değil -> duvar olur
    addCrate(-13, -6, 2.4, 3, 1.2);
    addCrate(10.6, -6, 2.4, 3, 1.2);
    addCrate(-13, 3, 2.4, 3, 0.9);
    addCrate(10.6, 3, 2.4, 3, 0.9);
    addCrate(-6, -15, 4, 2, 2.2);
    addCrate(2, 13, 4, 2, 2.2);
    addBarrel(-8, 8); addBarrel(-8.5, 9.4);
    addBarrel(8, -8); addBarrel(8.4, -9.3);
    groundTint(0.22, 22, -9, 0, 0xb23a32, 0.5);
    groundTint(0.22, 22, 9, 0, 0xb23a32, 0.5);
    groundTint(18, 8, 0, 20, 0x3d7fd4, 0.16);
    groundTint(18, 8, 0, -20, 0xa33b30, 0.16);
    groundDecal(labelTexture('AIM'), 8, 0, 21, 0, true);
    groundDecal(labelTexture('REDLINE'), 9, 0, -21, Math.PI, true);
  }

  /* ---------------- HARİTA 3: AWP_LEGO2 ---------------- */
  function buildLego2() {
    addRoom(-11, -35, 22, 13, 'Kırmızı Spawn');
    addRoom(-8, -22, 16, 44, 'Ana Hat');
    addRoom(-11, 22, 22, 13, 'Mavi Spawn');
    addRoom(-11, -5, 3, 10, 'Batı Niş');
    addRoom(8, -5, 3, 10, 'Doğu Niş');
    addBlock(-6, -4, 4, 2, 2.4, 0xd23c3c);
    addBlock(2, 1, 4, 2, 2.4, 0x3c6fd2);
    addBlock(-3, 8, 3, 2, 1.2, 0xe0b12f);
    addBlock(1, -10, 3, 2, 1.2, 0x4fae4f);
    addBlock(-7.5, 5, 1.5, 1.5, 1.0, 0xe0b12f);
    addBlock(6, -5.5, 1.5, 1.5, 1.0, 0xd23c3c);
    addBlock(-10.5, -1, 1.6, 1.6, 1.2, 0x4fae4f);
    addBlock(8.9, -1, 1.6, 1.6, 1.2, 0x3c6fd2);
    addBlock(-7, 25, 3, 2, 2.0, 0x3c6fd2);
    addBlock(4, 25, 3, 2, 2.0, 0xe0b12f);
    addBlock(-7, -27, 3, 2, 2.0, 0xd23c3c);
    addBlock(4, -27, 3, 2, 2.0, 0x4fae4f);
    addBlock(-9.5, 30, 2, 2, 1.2, 0x6a4fd2);
    addBlock(7.5, -32, 2, 2, 1.2, 0xd24f86);
    groundTint(20, 10, 0, 29, 0x3f7fd6, 0.2);
    groundTint(20, 10, 0, -29, 0xd23c3c, 0.2);
    groundDecal(labelTexture('AWP'), 8, 0, 30, 0, true);
    groundDecal(labelTexture('LEGO2'), 9, 0, -30, Math.PI, true);
  }

  /* ---------------- HARİTA 4: MEYDAN KÖY ---------------- */
  function buildVillage() {
    addRoom(-16, -16, 32, 32, 'Meydan');
    addRoom(-31, -4, 15, 8, 'Batı Çarşı');
    addRoom(16, -4, 15, 8, 'Doğu Çarşı');
    addRoom(-27, 8, 11, 16, 'Batı Avlu');
    addRoom(16, 8, 11, 16, 'Doğu Avlu');
    addRoom(-27, -24, 11, 16, 'Batı Kışla');
    addRoom(16, -24, 11, 16, 'Doğu Kışla');
    addRoom(-7, 16, 14, 18, 'Mavi Yol');
    addRoom(-7, -34, 14, 18, 'Kırmızı Yol');
    fountain(0, 0);
    stall(-11, 6, 0.2, 0xd0a03a);
    stall(11, -6, Math.PI + 0.2, 0x3d7fd4);
    stall(-11, -6, -0.25, 0xa33b30);
    stall(11, 6, Math.PI - 0.25, 0x4f7a3a);
    addCrate(-13, -11, 2, 2, 0.9);
    addCrate(11, 11, 2, 2, 1.2);
    addCrate(-4, 11, 3, 0.8, 0.9);
    addCrate(1, -11, 3, 0.8, 0.9);
    addBarrel(-14, 1); addBarrel(14, -1); addBarrel(-14, -1.5);
    addBlock(6, -13, 2.5, 1, 1.0, 0xa89f88);
    addBlock(-8, 13, 2.5, 1, 1.0, 0xa89f88);
    tree(-14, 14, 1.05);
    tree(14, -14, 1.1);
    tree(-14, -14, 0.95);
    tree(14, 14, 1.0);
    // dekoratif evler (yürünebilir alan dışında)
    house(-24, 6, 8, 3.2, 4.2, '#d8cbb0', '#8a4b32');
    house(24, -6, 8, 3.2, 4.2, '#d8cbb0', '#8a4b32');
    house(-40, 16, 9, 8, 5.2, '#cfc0a2', '#7c3f2a');
    house(40, -16, 9, 8, 5.2, '#cfc0a2', '#7c3f2a');
    house(0, 42, 12, 8, 5.0, '#d8cbb0', '#8a4b32');
    house(0, -42, 12, 8, 5.0, '#cfc0a2', '#7c3f2a');
    house(-40, -20, 8, 9, 4.6, '#d8cbb0', '#7c3f2a');
    house(40, 20, 8, 9, 4.6, '#d8cbb0', '#7c3f2a');
    groundTint(13, 10, 0, 27, 0x3d7fd4, 0.14);
    groundTint(13, 10, 0, -27, 0xa33b30, 0.14);
    groundDecal(labelTexture('MEYDAN'), 12, 0, 6, 0, true);
  }

  var MAP_DEFS = {
    dust2: {
      name: 'Dust II', desc: 'Klasik çöl haritası · A/B bölgeleri, uzun ve tünel hatları', theme: 'sand',
      awpOnly: false, build: buildDust2,
      spawns: { blue: { x: -2, z: 50, yaw: 0, name: 'T Spawn' }, red: { x: 2, z: -42, yaw: Math.PI, name: 'CT Spawn' } },
      miniLabels: [{ t: 'A', x: 30, z: -26 }, { t: 'B', x: -34, z: -28 }],
      routes: {
        blue: [
          [[24, 48], [28, 34], [30, 10], [33, -8], [27, -22], [35, -30]],
          [[0, 38], [0, 20], [4, 6], [8, -2], [14, -8], [18, -16]],
          [[-26, 48], [-28, 40], [-28, 25], [-28, 5], [-30, -15], [-38, -30]],
          [[0, 38], [0, 20], [8, 8], [6, -2], [14, -6], [18, -16], [22, -24]],
          [[28, 30], [30, 10], [28, -6], [31, -14]]
        ],
        red: [
          [[20, -38], [24, -30], [28, -20], [26, -6], [28, 10], [28, 22]],
          [[2, -32], [0, -16], [0, 0], [0, 14], [2, 28]],
          [[-22, -38], [-25, -30], [-30, -20], [-30, 0], [-28, 20], [-27, 35]],
          [[14, -38], [18, -28], [16, -18], [16, -8], [18, -2]],
          [[28, -24], [30, -6], [31, 8], [26, 20]]
        ]
      }
    },
    redline: {
      name: 'Aim Redline', desc: 'Simetrik aim haritası · iki hat, merkez duvarı, hızlı çatışma', theme: 'concrete',
      awpOnly: false, build: buildRedline,
      spawns: { blue: { x: 0, z: 16, yaw: 0, name: 'Mavi Spawn' }, red: { x: 0, z: -16, yaw: Math.PI, name: 'Kırmızı Spawn' } },
      miniLabels: [{ t: 'MAVİ', x: 0, z: 22 }, { t: 'KIRMIZI', x: 0, z: -22 }],
      routes: {
        blue: [
          [[-9, 12], [-9, 2], [-9, -8], [-9, -15]],
          [[9, 12], [9, 2], [9, -8], [9, -15]],
          [[-13, 12], [-11, 6], [-11, -4], [-13, -12]],
          [[13, 12], [11, 6], [11, -4], [13, -12]]
        ],
        red: [
          [[-9, -15], [-9, -8], [-9, 2], [-9, 12]],
          [[9, -15], [9, -8], [9, 2], [9, 12]],
          [[-13, -12], [-11, -4], [-11, 6], [-13, 12]],
          [[13, -12], [11, -4], [11, 6], [13, 12]]
        ]
      }
    },
    lego2: {
      name: 'AWP Lego2', desc: 'Renkli lego blokları · uzun koridor · sadece AWP', theme: 'lego',
      awpOnly: true, build: buildLego2,
      spawns: { blue: { x: 0, z: 27, yaw: 0, name: 'Mavi Spawn' }, red: { x: 0, z: -27, yaw: Math.PI, name: 'Kırmızı Spawn' } },
      miniLabels: [{ t: 'MAVİ', x: 0, z: 31 }, { t: 'KIRMIZI', x: 0, z: -31 }],
      routes: {
        blue: [
          [[0, 20], [-4, 10], [-4, 0], [-2, -10], [-2, -18]],
          [[5, 20], [5, 8], [7, 4], [7, -4], [3, -8], [2, -18]],
          [[0, 20], [-6, 6], [-7.5, 0], [-2, -8], [0, -18]],
          [[3, 20], [7, 12], [7, 4], [6, -6], [2, -14]]
        ],
        red: [
          [[0, -20], [-4, -10], [-4, 0], [-2, 10], [-2, 18]],
          [[5, -20], [5, -8], [7, -4], [7, 4], [3, 8], [2, 18]],
          [[0, -20], [-6, -6], [-7.5, 0], [-2, 8], [0, 18]],
          [[3, -20], [7, -12], [7, -4], [6, 6], [2, 14]]
        ]
      }
    },
    village: {
      name: 'Meydan Köy', desc: 'Kendi tasarımım · çeşmeli köy meydanı, pazar tezgahları, iki avlu', theme: 'village',
      awpOnly: false, build: buildVillage,
      spawns: { blue: { x: 0, z: 27, yaw: 0, name: 'Mavi Yol' }, red: { x: 0, z: -27, yaw: Math.PI, name: 'Kırmızı Yol' } },
      miniLabels: [{ t: 'MEYDAN', x: 0, z: 6 }, { t: 'MAVİ', x: 0, z: 27 }, { t: 'KIRMIZI', x: 0, z: -27 }],
      routes: {
        blue: [
          [[-4, 16], [-7, 8], [-9, 0], [-6, -8], [-2, -12]],
          [[4, 16], [8, 8], [9, 0], [6, -8], [2, -12]],
          [[0, 18], [0, 12], [-11, 10], [-13, 4], [-12, -4]],
          [[0, 18], [0, 12], [11, 10], [13, 4], [12, -4]]
        ],
        red: [
          [[4, -16], [7, -8], [9, 0], [6, 8], [2, 12]],
          [[-4, -16], [-8, -8], [-9, 0], [-6, 8], [-2, 12]],
          [[0, -18], [0, -12], [11, -10], [13, -4], [12, 4]],
          [[0, -18], [0, -12], [-11, -10], [-13, -4], [-12, 4]]
        ]
      }
    }
  };

  function buildWallsAndFloor() {
    var wallGeos = [], i2, j2, j0, i0, len, gg;
    for (i2 = GX; i2 <= GX + GW; i2++) {
      j2 = GZ;
      while (j2 < GZ + GD) {
        if (walkable(i2 - 1, j2) !== walkable(i2, j2)) {
          j0 = j2;
          while (j2 < GZ + GD && walkable(i2 - 1, j2) !== walkable(i2, j2)) j2++;
          len = j2 - j0;
          gg = boxGeo(WALL_T, WALL_H, len, 0.5);
          gg.translate(i2, WALL_H / 2, j0 + len / 2);
          wallGeos.push(gg);
        } else j2++;
      }
    }
    for (j2 = GZ; j2 <= GZ + GD; j2++) {
      i2 = GX;
      while (i2 < GX + GW) {
        if (walkable(i2, j2 - 1) !== walkable(i2, j2)) {
          i0 = i2;
          while (i2 < GX + GW && walkable(i2, j2 - 1) !== walkable(i2, j2)) i2++;
          len = i2 - i0;
          gg = boxGeo(len, WALL_H, WALL_T, 0.5);
          gg.translate(i0 + len / 2, WALL_H / 2, j2);
          wallGeos.push(gg);
        } else i2++;
      }
    }
    wallMesh = new THREE.Mesh(mergeGeos(wallGeos), worldMats.wall);
    wallMesh.castShadow = true; wallMesh.receiveShadow = true;
    worldRoot.add(wallMesh);

    if (currentMap.theme === 'village') {
      var fw = GW + 70, fd = GD + 70;
      texGrass.repeat.set(fw / 9, fd / 9);
      floor = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), worldMats.floor);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(GX + GW / 2, 0, GZ + GD / 2);
      floor.receiveShadow = true;
      worldRoot.add(floor);
      for (var r = 0; r < ROOMS.length; r++) {
        var room = ROOMS[r];
        var ct = texCobble.clone();
        ct.needsUpdate = true;
        ct.wrapS = ct.wrapT = THREE.RepeatWrapping;
        ct.repeat.set(room.w / 3.2, room.d / 3.2);
        var padMat = new THREE.MeshLambertMaterial({ map: ct });
        padMat.userData.ownMap = true;
        var pad = new THREE.Mesh(new THREE.PlaneGeometry(room.w, room.d), padMat);
        pad.rotation.x = -Math.PI / 2;
        pad.position.set(room.x + room.w / 2, 0.012, room.z + room.d / 2);
        pad.receiveShadow = true; pad.userData.noHit = true;
        worldRoot.add(pad);
      }
    } else {
      var fw2 = GW + 50, fd2 = GD + 50;
      worldMats.floorMap.repeat.set(fw2 / 6, fd2 / 6);
      floor = new THREE.Mesh(new THREE.PlaneGeometry(fw2, fd2), worldMats.floor);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(GX + GW / 2, 0, GZ + GD / 2);
      floor.receiveShadow = true;
      worldRoot.add(floor);
    }
  }

  function buildMinimap() {
    var t = THEMES[currentMap.theme] || THEMES.sand;
    mmScale = Math.min(150 / GW, 150 / GD);
    mapCanvas.width = Math.max(30, Math.round(GW * mmScale));
    mapCanvas.height = Math.max(30, Math.round(GD * mmScale));
    mapBase.width = mapCanvas.width; mapBase.height = mapCanvas.height;
    var bg = mapBase.getContext('2d'), mi, mj, i, p;
    bg.fillStyle = t.miniBg; bg.fillRect(0, 0, mapBase.width, mapBase.height);
    bg.fillStyle = t.miniFloor;
    for (mi = 0; mi < GW; mi++)
      for (mj = 0; mj < GD; mj++)
        if (walkable(GX + mi, GZ + mj))
          bg.fillRect(mi * mmScale, mj * mmScale, Math.ceil(mmScale), Math.ceil(mmScale));
    bg.fillStyle = t.miniProp;
    for (i = 0; i < props.length; i++) {
      p = props[i];
      bg.fillRect((p.x0 - GX) * mmScale, (p.z0 - GZ) * mmScale,
        Math.max(1, (p.x1 - p.x0) * mmScale), Math.max(1, (p.z1 - p.z0) * mmScale));
    }
    bg.textAlign = 'center'; bg.textBaseline = 'middle';
    bg.font = 'bold ' + Math.max(8, Math.round(10 * mmScale)) + 'px Arial, sans-serif';
    if (currentMap.miniLabels) {
      for (i = 0; i < currentMap.miniLabels.length; i++) {
        var lb = currentMap.miniLabels[i];
        bg.fillStyle = 'rgba(20,22,26,0.55)';
        var tw = bg.measureText(lb.t).width;
        bg.fillRect((lb.x - GX) * mmScale - tw / 2 - 2, (lb.z - GZ) * mmScale - 7, tw + 4, 14);
        bg.fillStyle = '#e8eef5';
        bg.fillText(lb.t, (lb.x - GX) * mmScale, (lb.z - GZ) * mmScale);
      }
    }
    // spawn renkleri
    var spb = currentMap.spawns.blue, spr = currentMap.spawns.red;
    bg.fillStyle = '#4a9eff';
    bg.beginPath(); bg.arc((spb.x - GX) * mmScale, (spb.z - GZ) * mmScale, Math.max(2.5, mmScale * 1.4), 0, 6.283); bg.fill();
    bg.fillStyle = '#ff5a4a';
    bg.beginPath(); bg.arc((spr.x - GX) * mmScale, (spr.z - GZ) * mmScale, Math.max(2.5, mmScale * 1.4), 0, 6.283); bg.fill();
  }

  function clearWorld() {
    for (var i = worldRoot.children.length - 1; i >= 0; i--) {
      var o = worldRoot.children[i];
      worldRoot.remove(o);
      o.traverse(function (m) {
        if (m.isMesh) {
          if (m.geometry) m.geometry.dispose();
          if (m.material && m.material.userData && m.material.userData.ownMap && m.material.map) m.material.map.dispose();
        }
      });
    }
    props.length = 0;
    ROOMS.length = 0;
    grid = null;
    wallMesh = null; floor = null;
    if (typeof clearBots === 'function') clearBots();
    if (typeof clearEffects === 'function') clearEffects();
  }

  function rebuildHittables() {
    hittables = [];
    if (wallMesh) hittables.push(wallMesh);
    if (floor) hittables.push(floor);
    scene.traverse(function (o) {
      if (!o.isMesh) return;
      if (o === wallMesh || o === floor || o === sky) return;
      if (o.userData.noHit) return;
      if (o.userData.part === 'nohit') return;
      hittables.push(o);
    });
  }

  function loadMap(id) {
    var def = MAP_DEFS[id] || MAP_DEFS.dust2;
    currentMap = def;
    currentMapId = MAP_DEFS[id] ? id : 'dust2';
    clearWorld();
    worldMats = makeWorldMaterials(def.theme);
    buildTheme = def.theme;
    applyTheme(def.theme);
    def.build();
    buildGrid();
    buildWallsAndFloor();
    buildMinimap();
    mapSpawns.blue = makeSpawnList(def.spawns.blue, 15);
    mapSpawns.red = makeSpawnList(def.spawns.red, 15);
    if (typeof respawn === 'function') respawn();
    rebuildHittables();
    if (typeof updateMapHud === 'function') updateMapHud();
  }

/* ================= OYUNCU ================= */
  var PR = 0.42, PH = 1.8, EYE = 1.62;
  var GRAV = 20, JUMP = 6.4, RUN = 4.7, WALK = 2.5;
  var SPAWN_PROTECT = 3, RESPAWN_DELAY = 10;
  var noclip = false;

  var player = {
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    yaw: 0, pitch: 0, grounded: true, crouch: 0,
    hp: 100, armor: 100, protectUntil: 0, team: 'blue'
  };

  function circleHitsWall(x, z) {
    var i0 = Math.floor(x - PR), i1 = Math.floor(x + PR);
    var j0 = Math.floor(z - PR), j1 = Math.floor(z + PR);
    for (var cx = i0; cx <= i1; cx++) {
      for (var cz = j0; cz <= j1; cz++) {
        if (!walkable(cx, cz)) {
          var nx = Math.max(cx, Math.min(x, cx + 1));
          var nz = Math.max(cz, Math.min(z, cz + 1));
          var dx = x - nx, dz = z - nz;
          if (dx * dx + dz * dz < PR * PR) return true;
        }
      }
    }
    return false;
  }
  function propBlocks(p, x, z, y) {
    if (x + PR <= p.x0 || x - PR >= p.x1 || z + PR <= p.z0 || z - PR >= p.z1) return false;
    if (p.y1 <= y + STEP + 0.001) return false;   // basamak olarak çıkılabilir
    if (p.y0 >= y + PH) return false;             // baş üstünde kalır
    return true;
  }
  function hitsProp(x, z, y) {
    for (var k = 0; k < props.length; k++) if (propBlocks(props[k], x, z, y)) return true;
    return false;
  }
  function groundHeight(x, z, y) {
    var g = 0;
    for (var k = 0; k < props.length; k++) {
      var p = props[k];
      if (x + PR > p.x0 && x - PR < p.x1 && z + PR > p.z0 && z - PR < p.z1) {
        if (p.y1 <= y + STEP + 0.001 && p.y1 > g) g = p.y1;
      }
    }
    return g;
  }
  function teamSpawnDef(team) {
    if (currentMap && currentMap.spawns[team]) return currentMap.spawns[team];
    if (currentMap && currentMap.spawns.blue) return currentMap.spawns.blue;
    return { x: 0, z: 0, yaw: 0, name: 'Spawn' };
  }
  function respawn() {
    var sp = teamSpawnDef(player.team);
    player.x = sp.x; player.y = 0; player.z = sp.z;
    player.vx = player.vy = player.vz = 0;
    player.yaw = sp.yaw || 0; player.pitch = 0;
    player.crouch = 0;
    player.hp = 100; player.armor = 100;
    nades.smoke = 1; nades.flash = 2; nades.he = 1;
    if (typeof updateHudNades === 'function') updateHudNades();
    player.protectUntil = performance.now() / 1000 + SPAWN_PROTECT;
    if (typeof deathT !== 'undefined') deathT = 0;
    if (typeof deathEl !== 'undefined' && deathEl) deathEl.style.display = 'none';
    if (typeof cancelSniperBolt === 'function') cancelSniperBolt();
    if (typeof scopeLevel !== 'undefined') {
      scopeLevel = 0;
      if (typeof applyScope === 'function') applyScope();
    }
    if (typeof updateHudHealth === 'function') updateHudHealth();
    if (typeof updateTeamHud === 'function') updateTeamHud();
  }

  /* ================= SES (WebAudio, prosedürel) ================= */
  var actx = null, masterGain = null;
  function initAudio() {
    if (!actx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { actx = new AC(); masterGain = actx.createGain(); masterGain.gain.value = vol; masterGain.connect(actx.destination); }
    }
    if (actx && actx.state === 'suspended') actx.resume();
  }
  function noiseBuffer(dur) {
    var n = Math.max(1, Math.floor(actx.sampleRate * dur));
    var buf = actx.createBuffer(1, n, actx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  function env(t0, peak, attack, decay) {
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    return g;
  }
  function playShot(kind, vol) {
    if (!actx) return;
    vol = vol === undefined ? 1 : Math.max(0, Math.min(1, vol));
    if (vol <= 0.02) return;
    var t0 = actx.currentTime;
    var cfg = kind === 'sniper' ? { g: 0.6, dur: 0.28, lp0: 1600, lp1: 400, hp: 120, thump: 70 }
      : kind === 'pistol' ? { g: 0.35, dur: 0.1, lp0: 3000, lp1: 900, hp: 300, thump: 140 }
      : kind === 'pistol2' ? { g: 0.55, dur: 0.18, lp0: 2100, lp1: 420, hp: 150, thump: 64 }
      : kind === 'rifle2' ? { g: 0.42, dur: 0.13, lp0: 2900, lp1: 700, hp: 240, thump: 100 }
      : { g: 0.45, dur: 0.15, lp0: 2600, lp1: 650, hp: 220, thump: 95 };
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(cfg.dur + 0.1);
    var lp = actx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(cfg.lp0, t0);
    lp.frequency.exponentialRampToValueAtTime(cfg.lp1, t0 + cfg.dur);
    var hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = cfg.hp;
    var g1 = env(t0, cfg.g * vol, 0.003, cfg.dur);
    src.connect(hp); hp.connect(lp); lp.connect(g1); g1.connect(masterGain);
    src.start(t0); src.stop(t0 + cfg.dur + 0.12);
    var o = actx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(cfg.thump, t0);
    o.frequency.exponentialRampToValueAtTime(38, t0 + 0.1);
    var g2 = env(t0, 0.42 * vol, 0.002, 0.11);
    o.connect(g2); g2.connect(masterGain);
    o.start(t0); o.stop(t0 + 0.14);
  }
  function playTick(freq, gain, dur) {
    if (!actx) return;
    var t0 = actx.currentTime;
    var o = actx.createOscillator(); o.type = 'square'; o.frequency.value = freq;
    var g = env(t0, gain, 0.001, dur);
    o.connect(g); g.connect(masterGain); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function playStep(low, quiet) {
    if (!actx) return;
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(0.09);
    var lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = low ? 650 : 1050;
    var g = env(t0, quiet ? 0.05 : 0.1, 0.005, 0.085);
    src.connect(lp); lp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 0.12);
  }
  function playDink(head) {
    if (!actx) return;
    var t0 = actx.currentTime;
    var o = actx.createOscillator(); o.type = 'sine';
    o.frequency.value = head ? 1750 : 1100;
    var g = env(t0, 0.22, 0.001, head ? 0.1 : 0.05);
    o.connect(g); g.connect(masterGain);
    o.start(t0); o.stop(t0 + (head ? 0.18 : 0.09));
  }
  function playKill() {
    if (!actx) return;
    var t0 = actx.currentTime;
    var o = actx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(900, t0);
    o.frequency.setValueAtTime(1350, t0 + 0.08);
    var g = env(t0, 0.2, 0.002, 0.16);
    o.connect(g); g.connect(masterGain); o.start(t0); o.stop(t0 + 0.25);
  }
  function playHurt() {
    if (!actx) return;
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(0.22);
    var lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    var g = env(t0, 0.3, 0.004, 0.18);
    src.connect(lp); lp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 0.26);
    var o = actx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(180, t0);
    o.frequency.exponentialRampToValueAtTime(90, t0 + 0.18);
    var g2 = env(t0, 0.22, 0.003, 0.16);
    o.connect(g2); g2.connect(masterGain); o.start(t0); o.stop(t0 + 0.22);
  }
  function playThrow() {
    if (!actx) return;
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(0.3);
    var bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(900, t0);
    bp.frequency.exponentialRampToValueAtTime(2600, t0 + 0.25); bp.Q.value = 1.2;
    var g = env(t0, 0.12, 0.01, 0.24);
    src.connect(bp); bp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 0.34);
  }
  function playHiss() {
    if (!actx) return;
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(1.4);
    var bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 0.8;
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.3);
    src.connect(bp); bp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 1.45);
  }
  function playFlashRing(vol) {
    if (!actx) return;
    vol = Math.max(0.05, Math.min(1, vol));
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(0.4);
    var hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    var g = env(t0, 0.5 * vol, 0.002, 0.3);
    src.connect(hp); hp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 0.45);
    var o = actx.createOscillator(); o.type = 'sine'; o.frequency.value = 2100;
    var g2 = actx.createGain();
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(0.25 * vol, t0 + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);
    o.connect(g2); g2.connect(masterGain); o.start(t0); o.stop(t0 + 2.5);
  }
  function playBoom(vol) {
    if (!actx) return;
    vol = Math.max(0.05, Math.min(1, vol));
    var t0 = actx.currentTime;
    var src = actx.createBufferSource(); src.buffer = noiseBuffer(0.7);
    var lp = actx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, t0);
    lp.frequency.exponentialRampToValueAtTime(120, t0 + 0.6);
    var g = env(t0, 0.9 * vol, 0.004, 0.6);
    src.connect(lp); lp.connect(g); g.connect(masterGain);
    src.start(t0); src.stop(t0 + 0.75);
    var o = actx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(90, t0);
    o.frequency.exponentialRampToValueAtTime(30, t0 + 0.4);
    var g2 = env(t0, 0.5 * vol, 0.003, 0.4);
    o.connect(g2); g2.connect(masterGain); o.start(t0); o.stop(t0 + 0.45);
  }

  /* ================= SİLAHLAR ================= */
  var DEG = Math.PI / 180;
  var WEAPONS = [
    { id: 'rifle', name: 'AK-47', auto: true, dmg: 36, headMul: 4, rpm: 600, magSize: 30, reserveMax: 90,
      spread: 0.010, bloom: 0.006, bloomMax: 0.05, kickUp: 0.75, kickSide: 0.3, reloadTime: 2.4, moveSpread: 0.032,
      pos: { x: 0.33, y: -0.24, z: -0.62 }, muzzle: { x: 0.24, y: -0.17, z: -0.86 } },
    { id: 'pistol', name: 'USP', auto: false, dmg: 25, headMul: 4, rpm: 380, magSize: 12, reserveMax: 60,
      spread: 0.009, bloom: 0.011, bloomMax: 0.055, kickUp: 0.8, kickSide: 0.35, reloadTime: 2.1, moveSpread: 0.026,
      pos: { x: 0.30, y: -0.23, z: -0.52 }, muzzle: { x: 0.16, y: -0.17, z: -0.62 } },
    { id: 'sniper', name: 'AWP', auto: false, dmg: 115, headMul: 4, rpm: 41, magSize: 10, reserveMax: 30,
      spread: 0.002, bloom: 0.03, bloomMax: 0.09, kickUp: 2.6, kickSide: 0.5, reloadTime: 3.0, zoom: true, moveSpread: 0.09,
      pos: { x: 0.34, y: -0.25, z: -0.66 }, muzzle: { x: 0.2, y: -0.16, z: -1.0 } },
    { id: 'rifle2', name: 'M4A4', auto: true, dmg: 33, headMul: 4, rpm: 666, magSize: 30, reserveMax: 90,
      spread: 0.009, bloom: 0.0055, bloomMax: 0.047, kickUp: 0.7, kickSide: 0.28, reloadTime: 2.6, moveSpread: 0.03,
      pos: { x: 0.33, y: -0.24, z: -0.6 }, muzzle: { x: 0.24, y: -0.16, z: -0.88 } },
    { id: 'pistol2', name: 'Deagle', auto: false, dmg: 53, headMul: 4, rpm: 267, magSize: 7, reserveMax: 35,
      spread: 0.011, bloom: 0.021, bloomMax: 0.1, kickUp: 1.7, kickSide: 0.55, reloadTime: 2.3, moveSpread: 0.033,
      pos: { x: 0.3, y: -0.23, z: -0.54 }, muzzle: { x: 0.16, y: -0.16, z: -0.68 } }
  ];
  var ammo = [], reserve = [], curW = 0, scoped = false, wi;
  for (wi = 0; wi < WEAPONS.length; wi++) { ammo.push(WEAPONS[wi].magSize); reserve.push(WEAPONS[wi].reserveMax); }

  var weaponGroups = {};
  // --- prosedürel silah kaplamaları (metal / ahşap / polimer) ---
  function gunTex(base, streak, streakN, dots) {
    var c = document.createElement('canvas'); c.width = 64; c.height = 64;
    var x = c.getContext('2d');
    x.fillStyle = base; x.fillRect(0, 0, 64, 64);
    x.globalAlpha = 0.4; x.strokeStyle = streak; x.lineWidth = 1;
    for (var i = 0; i < streakN; i++) {
      x.beginPath();
      var py = Math.random() * 64;
      x.moveTo(0, py); x.lineTo(64, py);
      x.stroke();
    }
    if (dots) {
      x.globalAlpha = 0.16; x.fillStyle = streak;
      for (var j = 0; j < 180; j++) x.fillRect(Math.random() * 64, Math.random() * 64, 1, 1);
    }
    x.globalAlpha = 1;
    return new THREE.CanvasTexture(c);
  }
  function woodTex() {
    var c = document.createElement('canvas'); c.width = 64; c.height = 64;
    var x = c.getContext('2d');
    x.fillStyle = '#6f4b25'; x.fillRect(0, 0, 64, 64);
    for (var i = 0; i < 26; i++) {
      x.globalAlpha = 0.22 + Math.random() * 0.3;
      x.strokeStyle = i % 3 ? '#4a3116' : '#84603a';
      x.lineWidth = 1 + Math.random();
      var y0 = Math.random() * 64;
      x.beginPath(); x.moveTo(0, y0);
      x.bezierCurveTo(21, y0 + 5, 42, y0 - 5, 64, y0 + (Math.random() - 0.5) * 7);
      x.stroke();
    }
    x.globalAlpha = 1;
    return new THREE.CanvasTexture(c);
  }
  var mMat = new THREE.MeshLambertMaterial({ map: gunTex('#3a414b', '#20242a', 26, true) });
  var wMat = new THREE.MeshLambertMaterial({ map: woodTex() });
  var bMat = new THREE.MeshLambertMaterial({ map: gunTex('#23272c', '#14171a', 30, false) });
  var oMat = new THREE.MeshLambertMaterial({ map: gunTex('#49512f', '#333a22', 18, true) });
  var kMat = new THREE.MeshLambertMaterial({ map: gunTex('#2c3137', '#191d21', 16, false) });
  function wp(g, w, h, d, x, y, z, mat) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.userData.noHit = true;
    g.add(m);
    return m;
  }
  // --- birinci şahıs eldiven/kollar (CS2 esintili operatör görünümü) ---
  var gloveMat = new THREE.MeshLambertMaterial({ color: 0x17191a });
  var glovePadMat = new THREE.MeshLambertMaterial({ color: 0x2e3233 });
  var viewAccentMat = new THREE.MeshLambertMaterial({ color: 0x2f5f9e });
  var viewSkinMat = new THREE.MeshLambertMaterial({ color: 0xb98562 });

  function addGlove(g, x, y, z, scale, flip) {
    var palm = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.085, 0.14), gloveMat);
    palm.position.set(x, y, z); palm.scale.setScalar(scale || 1);
    palm.userData.noHit = true; g.add(palm);
    var pad = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.025, 0.075), glovePadMat);
    pad.position.set(x, y + 0.048, z - 0.005); pad.scale.setScalar(scale || 1);
    pad.userData.noHit = true; g.add(pad);
    for (var fi = 0; fi < 3; fi++) {
      var finger = new THREE.Mesh(new THREE.BoxGeometry(0.021, 0.035, 0.075), gloveMat);
      finger.position.set(x - 0.032 + fi * 0.032, y - 0.005, z - 0.095);
      finger.scale.setScalar(scale || 1);
      finger.userData.noHit = true; g.add(finger);
    }
    var cuff = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.045, 0.115), viewAccentMat);
    cuff.position.set(x + (flip ? 0.035 : -0.02), y + 0.03, z + 0.085);
    cuff.rotation.x = 0.35; cuff.scale.setScalar(scale || 1);
    cuff.userData.noHit = true; g.add(cuff);
  }
  function addViewArms(g, kind) {
    var cfg = {
      rifle: { rel: [0.40, -0.72, 0.18], rh: [0.012, -0.125, 0.035], lel: [-0.44, -0.74, 0.15], lh: [0.0, 0.045, -0.26] },
      pistol: { rel: [0.36, -0.66, 0.16], rh: [0.0, -0.09, 0.04], lel: [-0.42, -0.70, 0.12], lh: [-0.025, -0.075, -0.035] },
      sniper: { rel: [0.42, -0.74, 0.20], rh: [0.0, -0.125, 0.025], lel: [-0.46, -0.76, 0.16], lh: [0.0, 0.012, -0.49] },
      rifle2: { rel: [0.40, -0.72, 0.18], rh: [0.012, -0.125, 0.035], lel: [-0.44, -0.74, 0.15], lh: [0.0, 0.045, -0.26] },
      pistol2: { rel: [0.36, -0.66, 0.16], rh: [0.0, -0.09, 0.04], lel: [-0.42, -0.70, 0.12], lh: [-0.025, -0.075, -0.035] }
    }[kind];
    if (!cfg) return;
    // Uzun kol boruları kamera uzayında yapay görünüyordu; sadece eldiven/bilek tutuşu bırakıldı.
    addGlove(g, cfg.rh[0], cfg.rh[1], cfg.rh[2], 1, false);
    addGlove(g, cfg.lh[0], cfg.lh[1], cfg.lh[2], 0.93, true);
    // bilek eklemleri
    var wristR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.07, 0.065), viewSkinMat);
    wristR.position.set(cfg.rh[0] + 0.02, cfg.rh[1] + 0.055, cfg.rh[2] + 0.07);
    wristR.rotation.x = 0.3; wristR.userData.noHit = true; g.add(wristR);
    var watch = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.028, 0.06), bMat);
    watch.position.set(cfg.lh[0] + 0.045, cfg.lh[1] + 0.05, cfg.lh[2] + 0.075);
    watch.userData.noHit = true; g.add(watch);
  }

  function buildRifle() {
    var g = new THREE.Group();
    wp(g, 0.085, 0.115, 0.46, 0, 0, -0.08, mMat);            // gövde
    wp(g, 0.045, 0.045, 0.42, 0, 0.02, -0.52, bMat);         // namlu
    wp(g, 0.05, 0.022, 0.44, 0, 0.058, -0.48, mMat);         // gaz borusu
    wp(g, 0.03, 0.062, 0.05, 0, 0.09, -0.7, bMat);           // arpacık
    wp(g, 0.062, 0.055, 0.24, 0, 0.052, -0.28, wMat);        // el kundağı
    wp(g, 0.05, 0.09, 0.10, -0.005, -0.06, 0.14, wMat);      // kısa dipçik (kamera arkasında kalır)
    wp(g, 0.058, 0.16, 0.075, 0, -0.13, 0.02, mMat);         // kabza
    var mag = wp(g, 0.05, 0.19, 0.095, 0, -0.14, -0.15, kMat); // şarjör
    mag.userData.baseY = -0.14;
    g.userData.mag = mag;
    wp(g, 0.022, 0.05, 0.02, 0, 0.075, 0.05, mMat);          // sürgü kolu
    var mzR = new THREE.Object3D(); mzR.position.set(0, 0.02, -0.76); g.add(mzR); g.userData.muzzle = mzR;
    return g;
  }
  function buildPistol() {
    var g = new THREE.Group();
    wp(g, 0.05, 0.075, 0.26, 0, 0.03, -0.07, mMat);          // sürgü
    wp(g, 0.042, 0.048, 0.1, 0, 0.02, -0.24, bMat);          // namlu
    wp(g, 0.052, 0.052, 0.1, 0, 0.032, -0.31, bMat);         // susturucu
    wp(g, 0.05, 0.135, 0.07, 0, -0.085, 0.03, bMat);         // kabza
    var mag = wp(g, 0.046, 0.05, 0.032, 0, -0.028, 0.005, kMat);
    mag.userData.baseY = -0.028;
    g.userData.mag = mag;
    var mzP = new THREE.Object3D(); mzP.position.set(0, 0.032, -0.37); g.add(mzP); g.userData.muzzle = mzP;
    return g;
  }
  function buildSniper() {
    var g = new THREE.Group();
    wp(g, 0.07, 0.09, 0.62, 0, 0, -0.16, mMat);              // gövde
    wp(g, 0.04, 0.04, 0.58, 0, 0.012, -0.74, bMat);          // namlu
    var scope = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.3, 14), bMat);
    scope.rotation.x = Math.PI / 2; scope.position.set(0, 0.1, -0.22);
    scope.userData.noHit = true; g.add(scope);
    wp(g, 0.02, 0.055, 0.02, 0, 0.055, -0.06, mMat);         // dürbün yüzüğü
    wp(g, 0.052, 0.11, 0.12, 0, -0.06, 0.14, oMat);          // kısa dipçik (kamera arkasında kalır)
    var bolt = wp(g, 0.05, 0.05, 0.085, 0.042, 0.045, 0.05, mMat); // sürgü kolu
    bolt.userData.baseZ = bolt.position.z;
    bolt.userData.baseRotZ = bolt.rotation.z;
    var boltKnob = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), bMat);
    boltKnob.position.set(0.055, 0, 0.045); boltKnob.userData.noHit = true; bolt.add(boltKnob);
    g.userData.bolt = bolt;
    wp(g, 0.058, 0.15, 0.07, 0, -0.125, 0.02, mMat);         // kabza
    var mag = wp(g, 0.05, 0.16, 0.085, 0, -0.115, -0.12, kMat);
    mag.userData.baseY = -0.115;
    g.userData.mag = mag;
    var mzS = new THREE.Object3D(); mzS.position.set(0, 0.012, -1.05); g.add(mzS); g.userData.muzzle = mzS;
    return g;
  }
  function buildRifle2() {
    var g = new THREE.Group();
    wp(g, 0.085, 0.115, 0.46, 0, 0, -0.08, mMat);            // gövde
    wp(g, 0.045, 0.045, 0.42, 0, 0.02, -0.52, bMat);         // namlu
    wp(g, 0.035, 0.075, 0.26, 0, 0.075, -0.3, bMat);         // taşıma kolu
    wp(g, 0.025, 0.05, 0.02, 0, 0.105, -0.72, bMat);         // arpacık (kol üstü)
    wp(g, 0.058, 0.05, 0.22, 0, 0.05, -0.3, bMat);           // el kundağı
    wp(g, 0.055, 0.075, 0.16, 0, -0.035, 0.13, bMat);        // katlanır dipçik
    wp(g, 0.058, 0.16, 0.075, 0, -0.13, 0.02, mMat);         // kabza
    var mag = wp(g, 0.05, 0.18, 0.09, 0, -0.145, -0.15, kMat); // şarjör
    mag.userData.baseY = -0.145;
    g.userData.mag = mag;
    wp(g, 0.022, 0.05, 0.02, 0.05, 0.075, 0.05, mMat);       // sürgü kolu
    var mzR2 = new THREE.Object3D(); mzR2.position.set(0, 0.02, -0.78); g.add(mzR2); g.userData.muzzle = mzR2;
    return g;
  }
  function buildPistol2() {
    var g = new THREE.Group();
    wp(g, 0.055, 0.085, 0.32, 0, 0.035, -0.1, mMat);         // büyük sürgü
    wp(g, 0.044, 0.05, 0.16, 0, 0.028, -0.33, bMat);         // kalın namlu
    wp(g, 0.052, 0.145, 0.075, 0, -0.09, 0.035, bMat);       // kabza
    wp(g, 0.02, 0.035, 0.02, 0, 0.075, 0.06, mMat);          // horoz
    var mag = wp(g, 0.048, 0.055, 0.034, 0, -0.03, 0.005, kMat);
    mag.userData.baseY = -0.03;
    g.userData.mag = mag;
    var mzP2 = new THREE.Object3D(); mzP2.position.set(0, 0.035, -0.45); g.add(mzP2); g.userData.muzzle = mzP2;
    return g;
  }
  weaponGroups.rifle = buildRifle(); weaponGroups.pistol = buildPistol(); weaponGroups.sniper = buildSniper();
  weaponGroups.rifle2 = buildRifle2(); weaponGroups.pistol2 = buildPistol2();
  addViewArms(weaponGroups.rifle, 'rifle');
  addViewArms(weaponGroups.pistol, 'pistol');
  addViewArms(weaponGroups.sniper, 'sniper');
  addViewArms(weaponGroups.rifle2, 'rifle2');
  addViewArms(weaponGroups.pistol2, 'pistol2');
  var wid;
  for (wid in weaponGroups) {
    weaponGroups[wid].scale.set(0.62, 0.62, 0.62);
    weaponGroups[wid].visible = false;
    camera.add(weaponGroups[wid]);
  }
  var raiseT = 1, gunKick = 0, bloom = 0, reloading = false, reloadEnd = 0;
  var nextShotTime = 0, triggerHeld = false, triggerQueued = false;
  var baseFov = 90, scopeLevel = 0;
  var AWP_BOLT_TIME = 0.9, awpBoltT = 0, awpRescopeLevel = 0, awpRescopePending = false, awpBoltSnd = 0;
  var swayX = 0, swayY = 0, throwAnimT = 0;

  function currentWeapon() { return WEAPONS[curW]; }
  function scopeFovFor(level) {
    if (level <= 0) return baseFov;
    return Math.max(8, Math.round(baseFov * (level === 1 ? 0.36 : 0.14)));
  }
  function applyScope() {
    scoped = scopeLevel > 0;
    camera.fov = scopeFovFor(scopeLevel);
    camera.updateProjectionMatrix();
    if (typeof scopeEl !== 'undefined' && scopeEl) scopeEl.style.display = scoped ? 'block' : 'none';
    if (typeof crossEl !== 'undefined' && crossEl) crossEl.style.display = scoped ? 'none' : 'block';
    weaponGroups[currentWeapon().id].visible = !scoped;
    updateHudAmmo();
  }
  function resetBoltHandle() {
    var gw = weaponGroups.sniper;
    var bolt = gw && gw.userData.bolt;
    if (bolt) {
      bolt.position.z = bolt.userData.baseZ;
      bolt.rotation.z = bolt.userData.baseRotZ || 0;
    }
  }
  function cancelSniperBolt() {
    awpBoltT = 0;
    awpRescopePending = false;
    awpRescopeLevel = 0;
    awpBoltSnd = 0;
    resetBoltHandle();
  }
  function beginSniperBolt(scopeBeforeShot) {
    awpBoltT = AWP_BOLT_TIME;
    awpRescopeLevel = scopeBeforeShot || 0;
    awpRescopePending = scopeBeforeShot > 0;
    awpBoltSnd = 0;
    scopeLevel = 0;
    applyScope();
    playTick(360, 0.05, 0.025);
    updateHudAmmo();
  }
  function setScoped(on) {
    if (on && !currentWeapon().zoom) on = false;
    if (awpBoltT > 0) awpRescopePending = false;
    scopeLevel = on ? 1 : 0;
    applyScope();
  }
  // AWP: 1. basış 1x, 2. basış 2x, 3. basış dürbünden çıkar
  function cycleScope() {
    if (!currentWeapon().zoom || reloading) return;
    if (awpBoltT > 0) awpRescopePending = false; // kullanıcı müdahale etti
    scopeLevel = (scopeLevel + 1) % 3;
    applyScope();
    playTick(scopeLevel ? 950 - scopeLevel * 120 : 620, 0.035, 0.02);
  }
  function switchWeapon(idx, instant, force) {
    if (idx < 0 || idx >= WEAPONS.length) return;
    if (currentMap && currentMap.awpOnly && WEAPONS[idx].id !== 'sniper') {
      playTick(300, 0.03, 0.03);
      return;
    }
    if (idx === curW && !force) return;   // zaten elde: kaldırma animasyonu yok
    cancelSniperBolt();
    reloading = false;
    curW = idx;
    for (var id2 in weaponGroups) weaponGroups[id2].visible = false;
    scopeLevel = 0;
    applyScope();
    raiseT = instant ? 1 : 0;
    if (!instant) playTick(700, 0.04, 0.03);
    updateHudAmmo();
  }
  function startReload() {
    var w = currentWeapon();
    if (reloading || ammo[curW] >= w.magSize || (reserve[curW] <= 0 && !infAmmo)) return;
    cancelSniperBolt();
    reloading = true;
    reloadEnd = performance.now() / 1000 + w.reloadTime;
    if (scopeLevel) { scopeLevel = 0; applyScope(); }
    playTick(520, 0.06, 0.03);
    updateHudAmmo();
  }

  // hareket/eğilme/dürbüne göre anlık nişan saçılması (radyan)
  function computeSpread() {
    var w = currentWeapon();
    var crouch = player.crouch || 0;
    if (scoped) return w.spread * (scopeLevel === 2 ? 0.12 : 0.25) * (1 - crouch * 0.3);
    var s = (w.spread + bloom) * (1 - crouch * 0.35);
    var mv = Math.min(1, Math.max(0, moveAmt));
    s += mv * w.moveSpread * (keys['shift'] ? 0.45 : 1) * (1 - crouch * 0.45);
    if (!player.grounded) s += w.moveSpread * 0.9 + 0.012;
    return s;
  }

  /* ================= VURUŞ EFEKTLERİ ================= */
  var decalGeo = new THREE.PlaneGeometry(0.13, 0.13);
  var decalMat = new THREE.MeshBasicMaterial({ color: 0x241c12, transparent: true, opacity: 0.85, depthWrite: false });
  var decals = [];
  function addDecal(point, normal) {
    var m = new THREE.Mesh(decalGeo, decalMat);
    m.userData.noHit = true;
    m.position.copy(point).addScaledVector(normal, 0.012);
    m.lookAt(m.position.clone().add(normal));
    m.rotateZ(Math.random() * Math.PI * 2);
    scene.add(m);
    decals.push(m);
    if (decals.length > 64) scene.remove(decals.shift());
  }

  var PUFF_N = 260;
  var puffPos = new Float32Array(PUFF_N * 3), puffVel = new Float32Array(PUFF_N * 3), puffLife = new Float32Array(PUFF_N);
  for (var pk = 0; pk < PUFF_N; pk++) puffPos[pk * 3 + 1] = -50;
  var puffGeo = new THREE.BufferGeometry();
  puffGeo.setAttribute('position', new THREE.BufferAttribute(puffPos, 3));
  var puffPts = new THREE.Points(puffGeo, new THREE.PointsMaterial({ color: 0xd6c7a4, size: 0.07, transparent: true, opacity: 0.8, depthWrite: false }));
  puffPts.frustumCulled = false;
  scene.add(puffPts);
  var puffHead = 0;
  function spawnPuff(point, normal) {
    for (var k = 0; k < 8; k++) {
      var i3 = puffHead % PUFF_N; puffHead++;
      puffPos[i3 * 3] = point.x; puffPos[i3 * 3 + 1] = point.y; puffPos[i3 * 3 + 2] = point.z;
      var sp = 0.7 + Math.random() * 1.6;
      puffVel[i3 * 3] = normal.x * sp + (Math.random() - 0.5) * 1.2;
      puffVel[i3 * 3 + 1] = normal.y * sp + Math.random() * 0.9;
      puffVel[i3 * 3 + 2] = normal.z * sp + (Math.random() - 0.5) * 1.2;
      puffLife[i3] = 0.25 + Math.random() * 0.25;
    }
    puffGeo.attributes.position.needsUpdate = true;
  }
  function updatePuffs(dt) {
    var dirty = false;
    for (var i4 = 0; i4 < PUFF_N; i4++) {
      if (puffLife[i4] > 0) {
        puffLife[i4] -= dt; dirty = true;
        if (puffLife[i4] <= 0) { puffPos[i4 * 3 + 1] = -50; continue; }
        puffPos[i4 * 3] += puffVel[i4 * 3] * dt;
        puffPos[i4 * 3 + 1] += puffVel[i4 * 3 + 1] * dt;
        puffPos[i4 * 3 + 2] += puffVel[i4 * 3 + 2] * dt;
        puffVel[i4 * 3 + 1] -= 3.2 * dt;
        puffVel[i4 * 3] *= (1 - 1.6 * dt);
        puffVel[i4 * 3 + 2] *= (1 - 1.6 * dt);
      }
    }
    if (dirty) puffGeo.attributes.position.needsUpdate = true;
  }

  var tracerPool = [], TRACER_N = 10;
  for (var tkk = 0; tkk < TRACER_N; tkk++) {
    var tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    var tline = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0, depthWrite: false }));
    tline.frustumCulled = false; tline.visible = false; tline.userData.noHit = true;
    scene.add(tline);
    tracerPool.push({ line: tline, life: 0 });
  }
  var tracerHead = 0;
  function spawnTracer(from, to) {
    var tr = tracerPool[tracerHead % TRACER_N]; tracerHead++;
    var pa = tr.line.geometry.attributes.position;
    pa.setXYZ(0, from.x, from.y, from.z);
    pa.setXYZ(1, to.x, to.y, to.z);
    pa.needsUpdate = true;
    tr.life = 0.055;
    tr.line.visible = true;
    tr.line.material.opacity = 0.9;
  }
  function updateTracers(dt) {
    for (var i5 = 0; i5 < TRACER_N; i5++) {
      var tr2 = tracerPool[i5];
      if (tr2.life > 0) {
        tr2.life -= dt;
        tr2.line.material.opacity = Math.max(0, tr2.life / 0.055) * 0.9;
        if (tr2.life <= 0) tr2.line.visible = false;
      }
    }
  }

  /* ================= SİS BOMBASI ================= */
  function smokeTexture() {
    var c = document.createElement('canvas'); c.width = 64; c.height = 64;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
    g.addColorStop(0, 'rgba(238,238,234,0.85)');
    g.addColorStop(0.45, 'rgba(226,224,218,0.55)');
    g.addColorStop(0.8, 'rgba(214,211,204,0.22)');
    g.addColorStop(1, 'rgba(210,208,200,0)');
    x.fillStyle = g; x.beginPath(); x.arc(32, 32, 31, 0, Math.PI * 2); x.fill();
    // hafif iç doku
    x.globalCompositeOperation = 'destination-out';
    for (var i = 0; i < 14; i++) {
      x.globalAlpha = 0.05 + Math.random() * 0.08;
      x.beginPath();
      x.arc(Math.random() * 64, Math.random() * 64, 3 + Math.random() * 7, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 1;
    return new THREE.CanvasTexture(c);
  }
  var smokeTex = smokeTexture();
  function radialTex(r, g, b) {
    var c = document.createElement('canvas'); c.width = 64; c.height = 64;
    var x = c.getContext('2d');
    var gr = x.createRadialGradient(32, 32, 2, 32, 32, 31);
    gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
    gr.addColorStop(0.45, 'rgba(' + r + ',' + g + ',' + b + ',0.78)');
    gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    x.fillStyle = gr; x.beginPath(); x.arc(32, 32, 31, 0, Math.PI * 2); x.fill();
    return new THREE.CanvasTexture(c);
  }
  var flashTex = radialTex(255, 252, 238);
  var boomTex = radialTex(255, 166, 58);
  var grenades = [], smokes = [], flashes = [], booms = [];
  var nades = { smoke: 1, flash: 2, he: 1 };
  var nextThrowTime = 0;
  var flashBlind = 0, flashBlindT = 0;
  function gInProp(x, z, y) {
    for (var k = 0; k < props.length; k++) {
      var p = props[k];
      if (x > p.x0 - 0.1 && x < p.x1 + 0.1 && z > p.z0 - 0.1 && z < p.z1 + 0.1 && y > p.y0 - 0.05 && y < p.y1 + 0.05) return true;
    }
    return false;
  }
  function throwGrenade(type) {
    var nowS2 = performance.now() / 1000;
    if (nowS2 < nextThrowTime || player.hp <= 0) return;
    if (!nades[type] || nades[type] <= 0) { playTick(820, 0.06, 0.02); updateHudNades(); return; }
    nades[type]--;
    nextThrowTime = nowS2 + 0.8;
    throwAnimT = 0.4;
    playThrow();
    var fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    var pos = camera.position.clone().addScaledVector(fwd, 0.55);
    var cols = { smoke: 0x3b4449, flash: 0x9aa4ab, he: 0x59623e };
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8),
      new THREE.MeshLambertMaterial({ color: cols[type] || 0x3b4449 }));
    mesh.userData.noHit = true;
    mesh.position.copy(pos);
    scene.add(mesh);
    var gr = { mesh: mesh, type: type, team: player.team, vel: fwd.clone().multiplyScalar(15).add(new THREE.Vector3(0, 2.6, 0)), fuse: 1.15 };
    grenades.push(gr);
    if (mpConnected && mpRole) {
      mpSend({ t: 'gn', ty: type, kt: player.team, x: pos.x, y: pos.y, z: pos.z, vx: gr.vel.x, vy: gr.vel.y, vz: gr.vel.z });
    }
    updateHudNades();
  }
  function throwSmoke() { throwGrenade('smoke'); }
  function throwFlash() { throwGrenade('flash'); }
  function throwHE() { throwGrenade('he'); }
  function losClear(ax, ay, az, bx, by, bz) {
    var dx = bx - ax, dy = by - ay, dz = bz - az;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    var steps = Math.max(2, Math.ceil(dist / 0.6));
    for (var i = 1; i < steps; i++) {
      var f = i / steps;
      var x = ax + dx * f, y = ay + dy * f, z = az + dz * f;
      if (y < WALL_H && !walkable(Math.floor(x), Math.floor(z))) return false;
      for (var k = 0; k < props.length; k++) {
        var p = props[k];
        if (x > p.x0 && x < p.x1 && z > p.z0 && z < p.z1 && y > p.y0 && y < p.y1) return false;
      }
    }
    return true;
  }
  function startFlash(x, z) {
    var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, transparent: true, opacity: 0.95, depthWrite: false }));
    spr.userData.noHit = true;
    spr.position.set(x, 1.2, z);
    spr.scale.set(0.6, 0.6, 1);
    scene.add(spr);
    flashes.push({ s: spr, age: 0, dur: 0.55 });
    var dx = player.x - x, dy = (player.y + 1.5) - 1.4, dz = player.z - z;
    var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d < 26) {
      var eff;
      if (d < 2) eff = Math.max(0, 1 - d / 26);            // ayakucunda: yön şartı yok
      else {
        var toFlash = new THREE.Vector3(dx / d, dy / d, dz / d);
        var fwd = new THREE.Vector3(); camera.getWorldDirection(fwd);
        var dot = toFlash.dot(fwd);
        eff = Math.max(0, (dot - 0.25) / 0.75) * Math.max(0, 1 - d / 26);
      }
      if (eff > 0.04) {
        flashBlind = Math.min(1, eff * (d < 6 ? 1.1 : 0.9));
        flashBlindT = 1.1 + 2.4 * eff;
        playFlashRing(Math.max(0.1, eff));
      }
    }
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (t.isRemote || t.isGhost) continue;
      if (t.state !== 'alive') continue;
      var bdx = t.group.position.x - x, bdz = t.group.position.z - z;
      var bd = Math.sqrt(bdx * bdx + bdz * bdz);
      if (bd < 24 && losClear(x, 1.4, z, t.group.position.x, 1.2, t.group.position.z)) {
        var face = bd < 2 ? 1 : (-Math.sin(t.group.rotation.y) * bdx - Math.cos(t.group.rotation.y) * bdz) / bd;
        var seff = Math.max(0, (face - 0.2) / 0.8) * Math.max(0, 1 - bd / 24);
        if (seff > 0.1) {
          t.stunT = Math.max(t.stunT || 0, 1.2 + seff * 2.6);
          t.target = null;
          t.group.rotation.y += (Math.random() - 0.5) * 1.4;
        }
      }
    }
  }
  function startHE(x, z, throwerTeam) {
    var tt = throwerTeam || player.team;
    var dxp = player.x - x, dzp = player.z - z;
    var dp = Math.sqrt(dxp * dxp + dzp * dzp);
    playBoom(Math.max(0.12, 1 - dp / 40));
    var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: boomTex, transparent: true, opacity: 1, depthWrite: false }));
    spr.userData.noHit = true;
    spr.position.set(x, 1.1, z);
    spr.scale.set(1.2, 1.2, 1);
    scene.add(spr);
    booms.push({ s: spr, age: 0, dur: 0.6 });
    var sc = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({ color: 0x14100c, transparent: true, opacity: 0.55, depthWrite: false }));
    sc.userData.noHit = true;
    sc.rotation.x = -Math.PI / 2;
    sc.position.set(x, 0.02, z);
    scene.add(sc);
    booms.push({ s: sc, age: 0, dur: 18, scorch: true });
    var R = 6.5, maxDmg = 88;
    if (player.hp > 0 && dp < R + 0.6 && losClear(x, 1.0, z, player.x, 1.2, player.z)) {
      var heWasAlive = player.hp > 0;
      hurtPlayer(maxDmg * Math.max(0, 1 - dp / R), false);
      if (heWasAlive && player.hp <= 0 && mpConnected && mpRole) {
        // HE'den ölüm: ağdaki tek diğer atıcı karşı oyuncudur
        addKillFeed(mpPeerName, 'SEN', mpRemote ? mpRemote.team : (player.team === 'blue' ? 'red' : 'blue'), player.team, false, true);
        if (mpRole === 'host') addTeamScore(mpRemote.team, 1);
        mpSend({ t: 'dk', k: mpPeerName, head: false, kt: mpRemote ? mpRemote.team : (player.team === 'blue' ? 'red' : 'blue') });
      }
      if (dp < 10) shakeT = Math.max(shakeT, 0.4 * (1 - dp / 10));
    }
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (t.isRemote || t.isGhost) continue;
      if (t.state !== 'alive' || t.team === tt) continue;
      var bdx = t.group.position.x - x, bdz = t.group.position.z - z;
      var bd = Math.sqrt(bdx * bdx + bdz * bdz);
      if (bd < R + 0.6 && losClear(x, 1.0, z, t.group.position.x, 1.2, t.group.position.z)) {
        damageTarget(t, maxDmg * Math.max(0, 1 - bd / R), false, true);
      }
    }
  }
  function detonateGrenade(gr, x, y, z) {
    if (gr.type === 'flash') startFlash(x, z);
    else if (gr.type === 'he') startHE(x, z, gr.team);
    else startSmoke(x, z);
  }
  function smokeBlocks(ax, ay, az, bx, by, bz) {
    for (var i = 0; i < smokes.length; i++) {
      var s = smokes[i];
      if (s.age < 1.4 || s.age > s.dur - 2) continue;
      var dx = bx - ax, dy = by - ay, dz = bz - az;
      var len2 = dx * dx + dy * dy + dz * dz;
      var t = len2 > 0 ? ((s.x - ax) * dx + (s.y - ay) * dy + (s.z - az) * dz) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      var cx2 = ax + dx * t - s.x, cy2 = ay + dy * t - s.y, cz2 = az + dz * t - s.z;
      if (cx2 * cx2 + cy2 * cy2 + cz2 * cz2 < 3.4 * 3.4) return true;
    }
    return false;
  }
  function startSmoke(x, z) {
    var grp = new THREE.Group();
    var parts = [];
    for (var i = 0; i < 26; i++) {
      var m = new THREE.Sprite(new THREE.SpriteMaterial({
        map: smokeTex, transparent: true, opacity: 0, depthWrite: false
      }));
      m.userData.noHit = true;
      var a = Math.random() * Math.PI * 2, r = Math.random() * 3.0;
      m.position.set(Math.cos(a) * r, Math.random() * 2.0, Math.sin(a) * r);
      m.scale.set(3.2, 3.2, 1);
      // hafif ton farkı — gerçekçi duman görünümü
      var tone = 0.72 + Math.random() * 0.22;
      m.material.color.setRGB(tone, tone * 0.995, tone * 0.97);
      m.userData.rise = 0.15 + Math.random() * 0.4;
      m.userData.flip = Math.random() * Math.PI * 2;
      grp.add(m); parts.push(m);
    }
    grp.position.set(x, 0.25, z);
    scene.add(grp);
    smokes.push({ x: x, y: 1.4, z: z, group: grp, parts: parts, age: 0, dur: 16 });
    playHiss();
    while (smokes.length > 3) { var old = smokes.shift(); scene.remove(old.group); }
  }
  function updateSmokes(dt) {
    for (var i = grenades.length - 1; i >= 0; i--) {
      var gr = grenades[i];
      gr.fuse -= dt;
      gr.vel.y -= 20 * dt;
      var px2 = gr.mesh.position.x, py2 = gr.mesh.position.y, pz2 = gr.mesh.position.z;
      var nx3 = px2 + gr.vel.x * dt;
      var ny3 = py2 + gr.vel.y * dt;
      var nz3 = pz2 + gr.vel.z * dt;
      if (!walkable(Math.floor(nx3), Math.floor(pz2)) || gInProp(nx3, pz2, py2)) { gr.vel.x *= -0.4; nx3 = px2; }
      if (!walkable(Math.floor(px2), Math.floor(nz3)) || gInProp(px2, nz3, py2)) { gr.vel.z *= -0.4; nz3 = pz2; }
      if (ny3 < 0.1) {
        ny3 = 0.1;
        if (Math.abs(gr.vel.y) < 0.8) gr.vel.y = 0; else gr.vel.y = Math.abs(gr.vel.y) * 0.35;
        gr.vel.x *= 0.6; gr.vel.z *= 0.6;
      }
      gr.mesh.position.set(nx3, ny3, nz3);
      if (gr.fuse <= 0) {
        scene.remove(gr.mesh);
        grenades.splice(i, 1);
        detonateGrenade(gr, nx3, ny3, nz3);
      }
    }
    for (var f = flashes.length - 1; f >= 0; f--) {
      var fl = flashes[f];
      fl.age += dt;
      var q = Math.min(1, fl.age / fl.dur);
      fl.s.scale.setScalar(0.6 + q * 7);
      fl.s.material.opacity = Math.max(0, 0.95 * (1 - q));
      if (fl.age >= fl.dur) { scene.remove(fl.s); fl.s.material.dispose(); flashes.splice(f, 1); }
    }
    for (var b = booms.length - 1; b >= 0; b--) {
      var bm = booms[b];
      bm.age += dt;
      if (bm.scorch) {
        if (bm.age >= bm.dur) { scene.remove(bm.s); bm.s.material.dispose(); booms.splice(b, 1); }
      } else {
        var q2 = Math.min(1, bm.age / bm.dur);
        bm.s.scale.setScalar(1.2 + q2 * 6.5);
        bm.s.material.opacity = Math.max(0, 1 - q2);
        if (bm.age >= bm.dur) { scene.remove(bm.s); bm.s.material.dispose(); booms.splice(b, 1); }
      }
    }
    if (flashBlindT > 0) {
      flashBlindT -= dt;
      if (flashOvEl) flashOvEl.style.opacity = String(flashBlindT > 0 ? Math.min(1, flashBlind * Math.min(1, flashBlindT / 1.2)) : 0);
      if (flashBlindT <= 0) flashBlind = 0;
    }
    for (var s = smokes.length - 1; s >= 0; s--) {
      var sm = smokes[s];
      sm.age += dt;
      var grow = Math.min(1, sm.age / 2.6);
      var fade = sm.age > sm.dur - 3 ? Math.max(0, (sm.dur - sm.age) / 3) : Math.min(1, sm.age / 1.2);
      for (var p = 0; p < sm.parts.length; p++) {
        var pt = sm.parts[p];
        pt.scale.setScalar(2.6 + grow * 3.4);
        pt.material.opacity = 0.3 * fade;
        pt.position.y += pt.userData.rise * dt * 0.5;
      }
      sm.group.rotation.y += dt * 0.07;
      if (sm.age >= sm.dur) { scene.remove(sm.group); smokes.splice(s, 1); }
    }
  }
  function clearEffects() {
    for (var i = 0; i < decals.length; i++) scene.remove(decals[i]);
    decals.length = 0;
    for (var g = 0; g < grenades.length; g++) scene.remove(grenades[g].mesh);
    grenades.length = 0;
    for (var s = 0; s < smokes.length; s++) {
      scene.remove(smokes[s].group);
      smokes[s].group.traverse(function (o) { if (o.isSprite && o.material) o.material.dispose(); });
    }
    smokes.length = 0;
    for (var f = 0; f < flashes.length; f++) { scene.remove(flashes[f].s); flashes[f].s.material.dispose(); }
    flashes.length = 0;
    for (var b = 0; b < booms.length; b++) { scene.remove(booms[b].s); booms[b].s.material.dispose(); }
    booms.length = 0;
    flashBlind = 0; flashBlindT = 0;
    if (typeof flashOvEl !== 'undefined' && flashOvEl) flashOvEl.style.opacity = '0';
    for (var p = 0; p < PUFF_N; p++) { puffLife[p] = 0; puffPos[p * 3 + 1] = -50; }
    if (typeof puffGeo !== 'undefined' && puffGeo.attributes.position) puffGeo.attributes.position.needsUpdate = true;
    for (var t = 0; t < tracerPool.length; t++) { tracerPool[t].life = 0; tracerPool[t].line.visible = false; }
    if (typeof flashGroup !== 'undefined') flashGroup.visible = false;
    if (typeof hitmarkerEl !== 'undefined' && hitmarkerEl) hitmarkerEl.style.opacity = '0';
    if (typeof hitmarkerT !== 'undefined') hitmarkerT = 0;
  }

  // --- namlu alevi: prosedürel alev dokusu + iki katmanlı parlama ---
  function flameTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d');
    // yıldız biçimli çekirdek: ince merkez, uzun alev kolları
    var g = x.createRadialGradient(32, 32, 1, 32, 32, 20);
    g.addColorStop(0, 'rgba(255,252,225,1)');
    g.addColorStop(0.3, 'rgba(255,224,130,0.9)');
    g.addColorStop(0.65, 'rgba(255,158,45,0.55)');
    g.addColorStop(1, 'rgba(255,90,10,0)');
    x.fillStyle = g; x.beginPath(); x.arc(32, 32, 20, 0, Math.PI * 2); x.fill();
    x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 7; i++) {
      var a = i / 7 * Math.PI * 2 + 0.35;
      var len = 26 + (i % 3) * 5;
      var lg = x.createLinearGradient(32, 32, 32 + Math.cos(a) * len, 32 + Math.sin(a) * len);
      lg.addColorStop(0, 'rgba(255,242,190,0.95)');
      lg.addColorStop(0.55, 'rgba(255,190,70,0.5)');
      lg.addColorStop(1, 'rgba(255,110,10,0)');
      x.strokeStyle = lg; x.lineWidth = 2.5 + (i % 2) * 1.5;
      x.beginPath();
      x.moveTo(32 + Math.cos(a) * 3, 32 + Math.sin(a) * 3);
      x.lineTo(32 + Math.cos(a) * len, 32 + Math.sin(a) * len);
      x.stroke();
    }
    return new THREE.CanvasTexture(c);
  }
  var flashMat = new THREE.MeshBasicMaterial({ map: flameTexture(), transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
  var flashGroup = new THREE.Group();
  var flashPlaneA = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), flashMat);
  var flashPlaneB = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), flashMat);
  flashPlaneA.userData.noHit = true; flashPlaneB.userData.noHit = true;
  flashPlaneB.rotation.z = Math.PI / 4;
  flashPlaneB.position.z = -0.01;
  flashGroup.add(flashPlaneA); flashGroup.add(flashPlaneB);
  flashGroup.visible = false;
  camera.add(flashGroup);
  var flashLight = new THREE.PointLight(0xffb060, 0, 9);
  scene.add(flashLight);
  var flashT = 0;
  function showFlash(camLocalMuzzle) {
    flashT = 0.06;
    flashGroup.position.copy(camLocalMuzzle);
    flashGroup.rotation.z = Math.random() * Math.PI * 2;
    flashPlaneA.scale.setScalar(0.85 + Math.random() * 0.45);
    flashPlaneB.scale.setScalar(0.7 + Math.random() * 0.3);
    flashMat.opacity = 0.95;
    flashGroup.visible = true;
    var worldPos = camera.localToWorld(camLocalMuzzle.clone());
    flashLight.position.copy(worldPos);
    flashLight.intensity = 2.2;
  }
  function updateFlash(dt) {
    if (flashT > 0) {
      flashT -= dt;
      var p = Math.max(0, flashT / 0.06);
      flashMat.opacity = p * 0.95;
      flashGroup.scale.setScalar(0.95 + (1 - p) * 0.45);
      flashLight.intensity = p * 2.2;
      if (flashT <= 0) { flashGroup.visible = false; flashLight.intensity = 0; }
    }
  }

  /* ================= NPC'LER (takım savaşı botları) ================= */
  var targets = [];
  var botIdSeq = 1;
  var tMatBody = new THREE.MeshLambertMaterial({ color: 0xb0623a });
  var tMatHead = new THREE.MeshLambertMaterial({ color: 0xc58f69 });
  var tMatBlue = new THREE.MeshLambertMaterial({ color: 0x2f609b });
  var tMatBlueDark = new THREE.MeshLambertMaterial({ color: 0x1b3552 });
  var tMatRed = new THREE.MeshLambertMaterial({ color: 0xa53a2e });
  var tMatRedDark = new THREE.MeshLambertMaterial({ color: 0x592019 });
  var nMatPants = new THREE.MeshLambertMaterial({ color: 0x373b38 });
  var nMatShirt = new THREE.MeshLambertMaterial({ color: 0x4a4e44 });
  var nMatBoot = new THREE.MeshLambertMaterial({ color: 0x141617 });
  var nMatKnee = new THREE.MeshLambertMaterial({ color: 0x25282a });
  var nMatGlove = new THREE.MeshLambertMaterial({ color: 0x191b1c });
  var nMatStrap = new THREE.MeshLambertMaterial({ color: 0x222522 });
  var nMatGoggle = new THREE.MeshLambertMaterial({ color: 0x0f1418 });
  var nLensMat = new THREE.MeshLambertMaterial({ color: 0x527783, emissive: 0x102126, emissiveIntensity: 0.8 });
  var nMatMask = new THREE.MeshLambertMaterial({ color: 0x262a2b });
  var nMatHelmet = new THREE.MeshLambertMaterial({ color: 0x2c322f });
  var botFlashMat = new THREE.SpriteMaterial({ map: flashMat.map, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false });
  var BOT_NAMES = ['ATLAS', 'BORA', 'CENGİZ', 'DEMİR', 'EFE', 'FIRTINA', 'GÖKÇE', 'HAN', 'KARTAL', 'MERT',
    'POYRAZ', 'SAVAŞ', 'TUNÇ', 'UĞUR', 'VOLKAN', 'YİĞİT', 'ZEYNEP', 'ŞAHİN', 'DENİZ', 'ALP'];
  var botNameSeq = 0;

  function npcClear(x, z, r) {
    var i0 = Math.floor(x - r), i1 = Math.floor(x + r), j0 = Math.floor(z - r), j1 = Math.floor(z + r);
    for (var cx = i0; cx <= i1; cx++) {
      for (var cz = j0; cz <= j1; cz++) {
        if (!walkable(cx, cz)) {
          var nx = Math.max(cx, Math.min(x, cx + 1)), nz = Math.max(cz, Math.min(z, cz + 1));
          var dx = x - nx, dz = z - nz;
          if (dx * dx + dz * dz < r * r) return false;
        }
      }
    }
    for (var k = 0; k < props.length; k++) {
      var p = props[k];
      if (x + r > p.x0 && x - r < p.x1 && z + r > p.z0 && z - r < p.z1 && p.y1 > 0.25) return false;
    }
    return true;
  }
  function drawBotBar(t) {
    var x = t.bar.ctx, c = t.bar.canvas;
    var nowS = performance.now() / 1000;
    var prot = t.state === 'alive' && t.protectUntil > nowS ? 1 : 0;
    if (t.bar.lastHp === t.hp && t.bar.lastArmor === t.armor && t.bar.lastProt === prot) return;
    t.bar.lastHp = t.hp; t.bar.lastArmor = t.armor; t.bar.lastProt = prot;
    x.clearRect(0, 0, c.width, c.height);
    // takım şeridi
    x.fillStyle = t.team === 'blue' ? '#4a9eff' : '#ff5a4a';
    x.fillRect(0, 6, 4, 28);
    // can barı
    x.fillStyle = 'rgba(8,10,12,0.78)'; x.fillRect(5, 6, 119, 12);
    var hpW = Math.max(0, Math.min(1, t.hp / t.maxHp)) * 115;
    x.fillStyle = t.hp > 60 ? '#54c24a' : t.hp > 25 ? '#d8a434' : '#cf4436';
    x.fillRect(7, 8, hpW, 8);
    // armor barı
    x.fillStyle = 'rgba(8,10,12,0.78)'; x.fillRect(5, 22, 119, 12);
    var arW = Math.max(0, Math.min(1, t.armor / t.maxArmor)) * 115;
    x.fillStyle = '#5b9fd4';
    x.fillRect(7, 24, arW, 8);
    x.strokeStyle = prot ? '#7fe0ff' : 'rgba(255,255,255,0.25)';
    x.lineWidth = prot ? 1.8 : 1;
    x.strokeRect(5.5, 6.5, 118, 11);
    x.strokeRect(5.5, 22.5, 118, 11);
    t.bar.tex.needsUpdate = true;
  }

  function makeNPC(path, speed, team) {
    var p0 = path[0];
    var t = { id: 'b' + (botIdSeq++), hp: 100, maxHp: 100, armor: 100, maxArmor: 100, dead: false, state: 'alive', fallT: 0, downUntil: 0,
      group: new THREE.Group(), path: path, wp: 1, speed: speed, dwell: Math.random() * 0.8, dwellTime: 0.6,
      home: { x: p0[0], z: p0[1] }, team: team || 'blue', name: BOT_NAMES[botNameSeq++ % BOT_NAMES.length],
      target: null, nextThink: 0, burstLeft: 0, nextShot: 0, walkPhase: 0,
      protectUntil: 0, recoil: 0, flashT: 0, stuckT: 0, aimPitch: 0, seed: Math.random() * 10, upper: null,
      lastSeenX: 0, lastSeenZ: 0, lastSeenT: 0, retreatT: 0, stunT: 0, scanA: 0, moveSpread: 0, strafeT: 0 };
    var g = t.group;
    var teamMat = team === 'red' ? tMatRed : tMatBlue;
    var teamDark = team === 'red' ? tMatRedDark : tMatBlueDark;
    function part(mesh, p, parent) {
      mesh.userData.part = p || 'body'; mesh.__tgt = t;
      (parent || g).add(mesh); return mesh;
    }
    function box(parent, w, h, d, x, y, z, mat, p) {
      var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      return part(mesh, p, parent);
    }
    // --- bacaklar: üst bacak + diz + alt bacak + taktik bot ---
    function makeLeg(side) {
      var hip = new THREE.Group(); hip.position.set(side * 0.14, 0.74, 0); g.add(hip);
      var thigh = part(new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.38, 0.20), nMatPants), 'body', hip);
      thigh.position.y = -0.19;
      var pocket = part(new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.15, 0.055), nMatPants), 'body', hip);
      pocket.position.set(side * 0.105, -0.22, -0.075);
      var lower = new THREE.Group(); lower.position.y = -0.38; hip.add(lower);
      var shin = part(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), nMatPants), 'body', lower);
      shin.position.y = -0.18;
      var knee = part(new THREE.Mesh(new THREE.BoxGeometry(0.175, 0.12, 0.075), nMatKnee), 'body', lower);
      knee.position.set(0, -0.01, -0.09);
      var boot = part(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.27), nMatBoot), 'body', lower);
      boot.position.set(0, -0.28, -0.055);
      var sole = part(new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.035, 0.29), nMatKnee), 'body', lower);
      sole.position.set(0, -0.357, -0.055);
      return { hip: hip, lower: lower, knee: knee };
    }
    var legL = makeLeg(-1), legR = makeLeg(1);
    // --- üst gövde grubu ---
    var up = new THREE.Group(); up.position.y = 0.78; g.add(up); t.upper = up;
    var torso = part(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.53, 0.26), nMatShirt), 'body', up);
    torso.position.y = 0.255;
    var shoulders = part(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 0.30), nMatShirt), 'body', up);
    shoulders.position.y = 0.45;
    // plaka yelek + takım renkli göğüs plakası + cepler
    var vest = part(new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.36, 0.33), teamDark), 'body', up);
    vest.position.y = 0.31;
    var plate = part(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.035), teamMat), 'body', up);
    plate.position.set(0, 0.34, -0.185);
    for (var pi = -1; pi <= 1; pi++) {
      var pouch = part(new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.12, 0.07), nMatStrap), 'body', up);
      pouch.position.set(pi * 0.14, 0.19, -0.19);
    }
    var belt = part(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.29), nMatStrap), 'body', up);
    belt.position.y = 0.045;
    var beltBuckle = part(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.02), teamMat), 'body', up);
    beltBuckle.position.set(0, 0.045, -0.155);
    // sırt çantası + telsiz anteni
    var pack = part(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.16), nMatStrap), 'body', up);
    pack.position.set(0, 0.29, 0.21);
    var packPatch = part(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.02), teamMat), 'body', up);
    packPatch.position.set(-0.06, 0.32, 0.296);
    var antenna = part(new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.32, 5), nMatBoot), 'body', up);
    antenna.position.set(0.13, 0.48, 0.22);
    var antennaTip = part(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.045, 0.025), teamMat), 'body', up);
    antennaTip.position.set(0.13, 0.66, 0.22);
    // --- kollar: omuzdan öne uzanır, dirsek pedli ---
    var armGeo = new THREE.BoxGeometry(0.125, 0.46, 0.135); armGeo.translate(0, -0.23, 0);
    var armL = part(new THREE.Mesh(armGeo, nMatShirt), 'body', up); armL.position.set(-0.30, 0.50, -0.015);
    var armR = part(new THREE.Mesh(armGeo, nMatShirt), 'body', up); armR.position.set(0.30, 0.50, -0.015);
    armL.rotation.x = -1.32; armL.rotation.y = 0.22;
    armR.rotation.x = -1.10; armR.rotation.y = -0.18;
    var elbowPadL = part(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.10), nMatKnee), 'body', up);
    elbowPadL.position.set(-0.31, 0.46, -0.20); elbowPadL.rotation.x = -1.2;
    var elbowPadR = part(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.10), nMatKnee), 'body', up);
    elbowPadR.position.set(0.31, 0.46, -0.18); elbowPadR.rotation.x = -1.0;
    // taktik eldivenler (silah üzerinde)
    var handL = part(new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.095, 0.13), nMatGlove), 'body', up);
    handL.position.set(-0.20, 0.42, -0.40);
    var handR = part(new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.095, 0.13), nMatGlove), 'body', up);
    handR.position.set(0.19, 0.35, -0.22);
    var knuckleL = part(new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.03, 0.08), nMatKnee), 'body', up);
    knuckleL.position.set(-0.20, 0.468, -0.41);
    var knuckleR = part(new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.03, 0.08), nMatKnee), 'body', up);
    knuckleR.position.set(0.19, 0.398, -0.23);
    // takım bandı + omuz arma
    var band = part(new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.065, 0.15), teamMat), 'body', up);
    band.position.set(-0.30, 0.31, -0.015);
    var patch = part(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.075, 0.02), teamMat), 'body', up);
    patch.position.set(-0.28, 0.45, -0.16);
    // --- tüfek silüeti ---
    var gunG = new THREE.Group();
    function gunPart(w, h, d, x, y, z, mat) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.userData.noHit = true; gunG.add(m); return m;
    }
    gunPart(0.065, 0.085, 0.40, 0, 0, -0.05, mMat);          // gövde
    gunPart(0.055, 0.055, 0.17, 0, 0.012, -0.22, wMat);      // el kundağı
    gunPart(0.032, 0.032, 0.32, 0, 0.016, -0.42, bMat);      // namlu
    gunPart(0.045, 0.14, 0.07, 0, -0.105, -0.06, kMat);      // şarjör
    gunPart(0.055, 0.09, 0.22, 0, -0.005, 0.22, teamDark);   // dipçik
    gunPart(0.05, 0.075, 0.06, 0, 0.07, -0.10, nMatBoot);    // nişangah
    var gunGrip = gunPart(0.05, 0.12, 0.06, 0, -0.09, 0.055, mMat);
    gunGrip.rotation.x = 0.26;
    gunG.position.set(0.06, 0.46, -0.30);
    gunG.rotation.y = -0.06;
    up.add(gunG); t.gunG = gunG;
    // --- baş: balaklava, gözlük, taktik kask, kulaklık ---
    var neck = part(new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.09, 0.115), tMatHead), 'body', up);
    neck.position.y = 0.565;
    var head = part(new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), tMatHead), 'head', up);
    head.position.y = 0.68;
    var mask = part(new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.125, 0.075), nMatMask), 'head', up);
    mask.position.set(0, 0.625, -0.135);
    var helmet = part(new THREE.Mesh(new THREE.SphereGeometry(0.178, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.05), teamDark), 'head', up);
    helmet.position.y = 0.705;
    var helmetRim = part(new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.025, 0.03), nMatStrap), 'head', up);
    helmetRim.position.set(0, 0.72, -0.16);
    var goggleFrame = part(new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.062, 0.045), nMatGoggle), 'head', up);
    goggleFrame.position.set(0, 0.695, -0.155);
    var lens = part(new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.038, 0.012), nLensMat), 'head', up);
    lens.position.set(0, 0.695, -0.181);
    var earL = part(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.095, 0.095), nMatStrap), 'head', up);
    earL.position.set(-0.165, 0.665, 0.0);
    var earR = part(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.095, 0.095), nMatStrap), 'head', up);
    earR.position.set(0.165, 0.665, 0.0);
    var mic = part(new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, 0.15), nMatBoot), 'head', up);
    mic.position.set(-0.14, 0.625, -0.07); mic.rotation.x = -0.18;
    var helmetPatch = part(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.02), teamMat), 'head', up);
    helmetPatch.position.set(0.13, 0.75, -0.07);
    t.legL = legL.hip; t.legR = legR.hip; t.kneeL = legL.lower; t.kneeR = legR.lower;
    t.armL = armL; t.armR = armR;
    // can + armor barı (üstte billboard sprite)
    var bc = document.createElement('canvas'); bc.width = 128; bc.height = 40;
    t.bar = { canvas: bc, ctx: bc.getContext('2d'), tex: new THREE.CanvasTexture(bc), lastHp: -1, lastArmor: -1, lastProt: -1 };
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.bar.tex, transparent: true, depthWrite: false }));
    sp.scale.set(1.15, 0.36, 1);
    sp.position.set(0, 2.16, 0);
    g.add(sp);
    t.bar.sprite = sp;
    drawBotBar(t);
    // bot namlu ateşi
    t.flash = new THREE.Sprite(botFlashMat);
    t.flash.scale.set(0.42, 0.42, 1);
    t.flash.visible = false;
    scene.add(t.flash);
    g.position.set(p0[0], 0, p0[1]);
    if (path.length > 1) g.rotation.y = Math.atan2(-(path[1][0] - p0[0]), -(path[1][1] - p0[1]));
    scene.add(g);
    targets.push(t);
    return t;
  }

  function clearBots() {
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      scene.remove(t.group);
      if (t.flash) scene.remove(t.flash);
      t.group.traverse(function (o) {
        if (o.isMesh && o.geometry) o.geometry.dispose();
      });
      if (t.bar && t.bar.tex) t.bar.tex.dispose();
    }
    targets.length = 0;
  }

  function routeJitter(base, idx, n) {
    var jx = 0, jz = 0;
    if (idx >= n) { jx = (Math.random() * 2 - 1) * 2.2; jz = (Math.random() * 2 - 1) * 2.2; }
    var out = [];
    for (var i = 0; i < base.length; i++) {
      var x = base[i][0], z = base[i][1];
      if (jx || jz) {
        var nx = x + jx, nz = z + jz;
        if (walkable(Math.floor(nx), Math.floor(nz)) && npcClear(nx, nz, 0.4)) { x = nx; z = nz; }
      }
      out.push([x, z]);
    }
    return out;
  }

  function spawnBotsForMatch() {
    clearBots();
    if (!currentMap) return;
    var teams = ['blue', 'red'];
    for (var ti = 0; ti < 2; ti++) {
      var team = teams[ti];
      var count = team === 'blue' ? matchBots.blue : matchBots.red;
      var spots = mapSpawns[team];
      if (!spots || !spots.length) { mapSpawns[team] = makeSpawnList(currentMap.spawns[team], 15); spots = mapSpawns[team]; }
      var startIdx = team === player.team ? 1 : 0;
      var routes = currentMap.routes[team];
      for (var i = 0; i < count; i++) {
        var spot = spots[Math.min(spots.length - 1, startIdx + i)] || spots[0];
        var route = routeJitter(routes[i % routes.length], i, routes.length);
        var path = [[spot.x, spot.z]].concat(route);
        var bot = makeNPC(path, 1.35 + Math.random() * 0.55, team);
        bot.spawnPos = { x: spot.x, z: spot.z };
        bot.spawnYaw = spot.yaw;
        bot.protectUntil = performance.now() / 1000 + SPAWN_PROTECT;
        bot.wp = 1;
      }
    }
    rebuildHittables();
  }

  /* ---- bot savaşı: hedef bulma, görüş hattı, ateş ---- */
  var BOT_RANGE = 42;
  var BOT_DIFF = {
    easy:   { dmgMin: 5,  dmgMax: 9,  spread: 0.024, think: 0.55, pause: 1.0, pauseJitter: 1.2, burst: 1 },
    normal: { dmgMin: 8,  dmgMax: 13, spread: 0.014, think: 0.34, pause: 0.55, pauseJitter: 0.9, burst: 3 },
    hard:   { dmgMin: 11, dmgMax: 17, spread: 0.0085, think: 0.20, pause: 0.34, pauseJitter: 0.55, burst: 4 }
  };
  function botTuning() { return BOT_DIFF[botDifficulty] || BOT_DIFF.normal; }
  function botMuzzle(t) {
    var ry = t.group.rotation.y, c = Math.cos(ry), s = Math.sin(ry);
    var lx = 0.06, lz = -0.78;
    return new THREE.Vector3(
      t.group.position.x + lx * c + lz * s,
      1.24,
      t.group.position.z - lx * s + lz * c
    );
  }
  function botLosClear(t, tx, ty, tz) {
    var g = t.group.position;
    var ax = g.x, ay = 1.2, az = g.z;
    var dx = tx - ax, dy = ty - ay, dz = tz - az;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    var steps = Math.max(2, Math.ceil(dist / 0.9));
    for (var i = 1; i < steps; i++) {
      var f = i / steps;
      var x = ax + dx * f, y = ay + dy * f, z = az + dz * f;
      if (y < WALL_H && !walkable(Math.floor(x), Math.floor(z))) return false;
      for (var k = 0; k < props.length; k++) {
        var p = props[k];
        if (x > p.x0 && x < p.x1 && z > p.z0 && z < p.z1 && y > p.y0 && y < p.y1) return false;
      }
    }
    return !smokeBlocks(ax, ay, az, tx, ty, tz);
  }
  function botFindTarget(t) {
    var best = null, bestD = BOT_RANGE;
    var g = t.group.position;
    if (startedOnce && player.hp > 0 && player.team !== t.team) {
      var pd = Math.sqrt(Math.pow(player.x - g.x, 2) + Math.pow(player.z - g.z, 2));
      if (pd < bestD && botLosClear(t, player.x, 1.2, player.z)) { best = { kind: 'player', d: pd }; bestD = pd; }
    }
    for (var i = 0; i < targets.length; i++) {
      var o = targets[i];
      if (o === t || o.state !== 'alive' || o.team === t.team) continue;
      var d2 = Math.sqrt(Math.pow(o.group.position.x - g.x, 2) + Math.pow(o.group.position.z - g.z, 2));
      if (d2 < bestD && botLosClear(t, o.group.position.x, 1.2, o.group.position.z)) {
        best = { kind: 'bot', bot: o, d: d2 }; bestD = d2;
      }
    }
    return best;
  }
  function botShoot(t, tgt) {
    if (!tgt) return;
    var tgtTeam = tgt.kind === 'player' ? player.team : (tgt.bot ? tgt.bot.team : null);
    if (tgtTeam === t.team) return;   // dost ateşi yok
    var mz = botMuzzle(t);
    t.recoil = 1;
    t.flashT = 0.06;
    if (t.flash) { t.flash.position.set(mz.x, mz.y, mz.z); t.flash.visible = true; }
    var tx, ty, tz;
    if (tgt.kind === 'player') { tx = player.x; ty = 1.25; tz = player.z; }
    else { tx = tgt.bot.group.position.x; ty = 1.2; tz = tgt.bot.group.position.z; }
    var dx = tx - mz.x, dy = ty - mz.y, dz = tz - mz.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 0.1) return;
    var dir = new THREE.Vector3(dx / dist, dy / dist, dz / dist);
    var D = botTuning();
    var sp = D.spread + dist * 0.00035 + (t.moveSpread || 0);
    dir.x += (Math.random() - 0.5) * 2 * sp;
    dir.y += (Math.random() - 0.5) * 2 * sp;
    dir.z += (Math.random() - 0.5) * 2 * sp;
    dir.normalize();
    raycaster.set(mz, dir);
    raycaster.far = 90;
    var hits = raycaster.intersectObjects(hittables, false);
    var wallDist = hits.length ? hits[0].distance : 90;
    var end = mz.clone().addScaledVector(dir, wallDist);
    var dmg = D.dmgMin + Math.random() * (D.dmgMax - D.dmgMin);
    if (tgt.kind === 'bot') {
      if (hits.length && hits[0].object.__tgt) {
        var hitBot = hits[0].object.__tgt;
        if (hitBot.state === 'alive' && hitBot.team !== t.team) {
          var isHead = hits[0].object.userData.part === 'head';
          if (hitBot.isRemote) {
            // karşı oyuncu: hasarı onun istemcisi uygular
            mpSend({ t: 'pd', dmg: dmg * (isHead ? 2.5 : 1), head: isHead, w: 'rifle', k: t.name, kt: t.team });
          } else {
            damageTarget(hitBot, dmg * (isHead ? 3 : 1), isHead, false, t.team, t.name);
          }
          end.copy(hits[0].point);
        }
      }
    } else {
      var toP = new THREE.Vector3(player.x - mz.x, 1.2 - mz.y, player.z - mz.z);
      var tAlong = toP.dot(dir);
      if (tAlong > 0 && tAlong < wallDist) {
        var closest = mz.clone().addScaledVector(dir, tAlong);
        var hm = Math.sqrt(Math.pow(closest.x - player.x, 2) + Math.pow(closest.z - player.z, 2));
        if (hm < 0.45 && Math.abs(closest.y - 1.2) < 0.95) {
          var headHit = closest.y > 1.45;
          var wasAlive = player.hp > 0;
          hurtPlayer(dmg * (headHit ? 2.5 : 1), headHit);
          if (wasAlive && player.hp <= 0) {
            addKillFeed(t.name, 'SEN', t.team, player.team, headHit, true);
            addTeamScore(t.team, 1);
          }
          end.copy(closest);
        }
      }
    }
    var pdist = Math.sqrt(Math.pow(player.x - mz.x, 2) + Math.pow(player.z - mz.z, 2));
    playShot('rifle', Math.max(0.04, Math.min(1, 1 - pdist / 55)));
    spawnTracer(mz, end);
  }

  var stats = { kills: 0, headshots: 0 };
  var hitmarkerT = 0, hitmarkerEl = document.getElementById('hitmarker');
  function showHitmarker(head, kill) {
    hitmarkerT = kill ? 0.3 : 0.14;
    if (hitmarkerEl) {
      hitmarkerEl.style.color = head ? '#ff9a6a' : '#e8e8e8';
      hitmarkerEl.style.opacity = '1';
    }
  }
  function damageTarget(t, dmg, head, byPlayer, attackerTeam, attackerName) {
    if (!t || t.state !== 'alive') return;
    var nowS = performance.now() / 1000;
    if (t.protectUntil > nowS) return;             // doğuş koruması
    if (byPlayer && t.team === player.team) return; // dost ateşi kapalı
    if (t.armor > 0) {
      var absorbed = Math.min(t.armor, dmg * (head ? 0.25 : 0.5));
      t.armor -= absorbed;
      dmg -= absorbed;
    }
    t.hp -= dmg;
    if (byPlayer && t.hp > 0) {           // vurulan bot atışın geldiği yeri hatırlar
      t.lastSeenX = player.x; t.lastSeenZ = player.z; t.lastSeenT = nowS;
      if (t.hp < 40) t.retreatT = Math.max(t.retreatT || 0, 2.5);
    }
    if (t.hp <= 0) {
      t.hp = 0;
      t.dead = true; t.state = 'falling'; t.fallT = 0;
      t.protectUntil = 0;
      t.flashT = 0;
      if (t.flash) t.flash.visible = false;
      if (byPlayer) { stats.kills++; if (head) stats.headshots++; playKill(); showHitmarker(head, true); updateHudScore(); }
      var killerTeam = byPlayer ? player.team : attackerTeam;
      if (killerTeam && killerTeam !== t.team) {
        addKillFeed(byPlayer ? 'SEN' : (attackerName || 'BOT'), t.name || 'BOT', killerTeam, t.team, head, byPlayer);
        addTeamScore(killerTeam, 1);
      }
      drawBotBar(t);
      return;
    }
    if (byPlayer) {
      playDink(head);
      showHitmarker(head, false);
    }
    drawBotBar(t);
  }
  // botların birbirinin ve oyuncunun içinden geçmesini engelle
  function botBlocked(nx, nz, self) {
    if (player.hp > 0) {
      var pdx = nx - player.x, pdz = nz - player.z;
      if (pdx * pdx + pdz * pdz < 0.55 * 0.55) return true;
    }
    for (var bi = 0; bi < targets.length; bi++) {
      var o = targets[bi];
      if (o === self || o.state !== 'alive') continue;
      var dx = nx - o.group.position.x, dz = nz - o.group.position.z;
      if (dx * dx + dz * dz < 0.62 * 0.62) return true;
    }
    return false;
  }
  function updateTargets(dt) {
    var nowS = performance.now() / 1000;
    for (var i6 = 0; i6 < targets.length; i6++) {
      var t = targets[i6];
      if (t.bar && t.bar.sprite) {
        t.bar.sprite.visible = t.state === 'alive';
        // yakındaki botların barları ekranı kaplamasın: mesafeye göre ölçekle
        var bdx = t.group.position.x - player.x, bdz = t.group.position.z - player.z;
        var bd = Math.sqrt(bdx * bdx + bdz * bdz);
        var bs = Math.max(0.26, Math.min(1.15, bd * 0.06));
        t.bar.sprite.scale.set(bs, bs * 0.313, 1);
      }
      drawBotBar(t);
      if (paused) continue;   // menü / konsol açıkken botlar donar
      var moving = false;
      var tgt = null;
      if (t.state === 'alive') {
        if (t.isRemote || t.isGhost) {
          // ağdan gelen hedefe yumuşak interpolasyon (yapay zeka yok)
          if (t.nx !== undefined) {
            var ddx = t.nx - t.group.position.x, ddz = t.nz - t.group.position.z;
            var dd = Math.sqrt(ddx * ddx + ddz * ddz);
            if (dd > 0.02) {
              var stepN = Math.min(dd, Math.max(dd * 0.4, 5 * dt));
              t.group.position.x += (ddx / dd) * stepN;
              t.group.position.z += (ddz / dd) * stepN;
              if (dd > 0.15) moving = true;
            }
            var dyy = t.nyaw - t.group.rotation.y;
            while (dyy > Math.PI) dyy -= Math.PI * 2;
            while (dyy < -Math.PI) dyy += Math.PI * 2;
            t.group.rotation.y += dyy * Math.min(1, dt * 14);
          }
          if (t.netCrouch > 0.5) t.group.position.y = -0.42; else t.group.position.y = 0;
        } else {
        if (t.stunT > 0) {
          t.stunT -= dt;
          t.group.rotation.y += (Math.random() - 0.5) * 0.05;   // sersemlemiş: hafif yön savrulması
        }
        if (t.nextThink <= nowS) {
          t.nextThink = nowS + botTuning().think + Math.random() * 0.35;
          t.target = botFindTarget(t);
        }
        tgt = t.target;
        if (tgt && tgt.kind === 'bot' && tgt.bot.state !== 'alive') { tgt = null; t.target = null; }
        if (tgt && tgt.kind === 'player' && player.hp <= 0) { tgt = null; t.target = null; }
        if (t.retreatT > 0) t.retreatT -= dt;
        if (tgt && t.stunT <= 0) {
          var tx, tz;
          if (tgt.kind === 'player') { tx = player.x; tz = player.z; }
          else { tx = tgt.bot.group.position.x; tz = tgt.bot.group.position.z; }
          // son görülen konumu hatırla (köşe tutma / baskı için)
          t.lastSeenX = tx; t.lastSeenZ = tz; t.lastSeenT = nowS;
          var lowHp = t.hp < 38 || t.retreatT > 0;
          var wantYaw2 = Math.atan2(-(tx - t.group.position.x), -(tz - t.group.position.z));
          var dy2 = wantYaw2 - t.group.rotation.y;
          while (dy2 > Math.PI) dy2 -= Math.PI * 2;
          while (dy2 < -Math.PI) dy2 += Math.PI * 2;
          t.group.rotation.y += dy2 * Math.min(1, dt * (lowHp ? 6 : 7));
          if (lowHp) {
            // --- geri çekilme: hedeften uzaklaşırken ateş etmeye devam ---
            var ax2 = t.group.position.x - tx, az2 = t.group.position.z - tz;
            var al = Math.sqrt(ax2 * ax2 + az2 * az2) || 1;
            var stepR = Math.min(al, t.speed * 0.75 * dt);
            var nxR = t.group.position.x + (ax2 / al) * stepR;
            var nzR = t.group.position.z + (az2 / al) * stepR;
            if (npcClear(nxR, t.group.position.z, 0.4) && !botBlocked(nxR, t.group.position.z, t)) { t.group.position.x = nxR; moving = true; }
            if (npcClear(t.group.position.x, nzR, 0.4) && !botBlocked(t.group.position.x, nzR, t)) { t.group.position.z = nzR; moving = true; }
            t.moveSpread = 0.045;
          } else {
            t.moveSpread = 0;
            // zor botlar çatışma sırasında yan adım atar
            if (botDifficulty === 'hard' && Math.abs(dy2) < 0.5) {
              if (!t.strafeT || t.strafeT <= 0) {
                t.strafeT = 0.25 + Math.random() * 0.5;
                t.strafeDir = Math.random() < 0.5 ? 1 : -1;
              }
              t.strafeT -= dt;
              var sx2 = -Math.cos(t.group.rotation.y) * t.strafeDir;
              var sz2 = Math.sin(t.group.rotation.y) * t.strafeDir;
              var stepS = t.speed * 0.45 * dt;
              var nxS = t.group.position.x + sx2 * stepS;
              var nzS = t.group.position.z + sz2 * stepS;
              if (npcClear(nxS, t.group.position.z, 0.4) && !botBlocked(nxS, t.group.position.z, t)) { t.group.position.x = nxS; moving = true; }
              if (npcClear(t.group.position.x, nzS, 0.4) && !botBlocked(t.group.position.x, nzS, t)) { t.group.position.z = nzS; moving = true; }
              t.moveSpread = 0.025;
            }
          }
          if (Math.abs(dy2) < 0.28) {
            if (t.burstLeft > 0) {
              if (nowS >= t.nextShot) {
                t.burstLeft--;
                var tune = botTuning();
                t.nextShot = t.burstLeft > 0 ? nowS + 0.1 : nowS + tune.pause + Math.random() * tune.pauseJitter;
                botShoot(t, tgt);
              }
            } else if (nowS >= t.nextShot) {
              t.burstLeft = 2 + botTuning().burst + (Math.random() * 2 | 0);
              t.nextShot = nowS + 0.05;
            }
          }
        } else {
          t.moveSpread = 0;
          var held = 0;
          // --- can düşükken doğuş noktasına çekil ---
          if (t.retreatT > 0 && (t.spawnPos || t.home)) {
            var home2 = t.spawnPos || t.home;
            var dxh0 = home2.x - t.group.position.x, dzh0 = home2.z - t.group.position.z;
            var dh0 = Math.sqrt(dxh0 * dxh0 + dzh0 * dzh0);
            if (dh0 > 1.2) {
              var stepH = Math.min(dh0, t.speed * 0.9 * dt);
              var nxH = t.group.position.x + (dxh0 / dh0) * stepH;
              var nzH = t.group.position.z + (dzh0 / dh0) * stepH;
              if (npcClear(nxH, t.group.position.z, 0.4) && !botBlocked(nxH, t.group.position.z, t)) { t.group.position.x = nxH; moving = true; }
              if (npcClear(t.group.position.x, nzH, 0.4) && !botBlocked(t.group.position.x, nzH, t)) { t.group.position.z = nzH; moving = true; }
              var wantYawH0 = Math.atan2(-dxh0, -dzh0);
              var dyh0 = wantYawH0 - t.group.rotation.y;
              while (dyh0 > Math.PI) dyh0 -= Math.PI * 2;
              while (dyh0 < -Math.PI) dyh0 += Math.PI * 2;
              t.group.rotation.y += dyh0 * Math.min(1, dt * 8);
              held = 1;
            }
          }
          // --- köşe tutma / baskı: son görülen düşman konumu ---
          if (!held && t.lastSeenT && nowS - t.lastSeenT < 5) {
            var hx = t.lastSeenX, hz = t.lastSeenZ;
            var dxh = hx - t.group.position.x, dzh = hz - t.group.position.z;
            var dh = Math.sqrt(dxh * dxh + dzh * dzh);
            var hard = botDifficulty === 'hard';
            if (dh > 4 && botDifficulty !== 'easy') {
              // baskı: son görülen noktaya temkinli ilerle
              var stepP = Math.min(dh, t.speed * (hard ? 0.8 : 0.55) * dt);
              var nxP = t.group.position.x + (dxh / dh) * stepP;
              var nzP = t.group.position.z + (dzh / dh) * stepP;
              if (npcClear(nxP, t.group.position.z, 0.4) && !botBlocked(nxP, t.group.position.z, t)) { t.group.position.x = nxP; moving = true; }
              if (npcClear(t.group.position.x, nzP, 0.4) && !botBlocked(t.group.position.x, nzP, t)) { t.group.position.z = nzP; moving = true; }
              var wantYawH = Math.atan2(-dxh, -dzh);
              var dyh = wantYawH - t.group.rotation.y;
              while (dyh > Math.PI) dyh -= Math.PI * 2;
              while (dyh < -Math.PI) dyh += Math.PI * 2;
              t.group.rotation.y += dyh * Math.min(1, dt * 8);
              if (hard && nowS >= t.nextShot) {
                // bastırma ateşi: ilerlerken geniş saçılmalı atış
                t.nextShot = nowS + 0.7 + Math.random() * 0.8;
                t.recoil = 1; t.flashT = 0.06;
                var mzs2 = botMuzzle(t);
                if (t.flash) { t.flash.position.set(mzs2.x, mzs2.y, mzs2.z); t.flash.visible = true; }
                var dirS = new THREE.Vector3(dxh, 0.15, dzh).normalize();
                dirS.x += (Math.random() - 0.5) * 0.28; dirS.z += (Math.random() - 0.5) * 0.28;
                var endS = mzs2.clone().addScaledVector(dirS, 60);
                spawnTracer(mzs2, endS);
                playShot('rifle', Math.max(0.04, Math.min(1, 1 - dh / 55)));
              }
            } else {
              // köşe tutma: nişanı köşede tut, hafifçe tara
              t.scanA = (t.scanA || 0) + dt * 0.35;
              var wantYawH2 = Math.atan2(-dxh, -dzh) + Math.sin(t.scanA) * 0.22;
              var dyh2 = wantYawH2 - t.group.rotation.y;
              while (dyh2 > Math.PI) dyh2 -= Math.PI * 2;
              while (dyh2 < -Math.PI) dyh2 += Math.PI * 2;
              t.group.rotation.y += dyh2 * Math.min(1, dt * 3.2);
              if (nowS >= t.nextShot && Math.random() < 0.004) {
                // uyarı atışı: köşeye doğru tek el
                t.nextShot = nowS + 2 + Math.random() * 3;
                t.recoil = 1; t.flashT = 0.06;
                var mzs3 = botMuzzle(t);
                if (t.flash) { t.flash.position.set(mzs3.x, mzs3.y, mzs3.z); t.flash.visible = true; }
                var dirW = new THREE.Vector3(dxh, 0.2, dzh).normalize();
                var endW = mzs3.clone().addScaledVector(dirW, 60);
                spawnTracer(mzs3, endW);
                playShot('rifle', Math.max(0.04, Math.min(1, 1 - dh / 55)));
              }
            }
            held = 1;
          }
          // --- devriye hareketi ---
          if (!held && t.stunT <= 0 && t.path && t.path.length > 1) {
            if (t.dwell > 0) t.dwell -= dt;
            else {
              var wp = t.path[t.wp % t.path.length];
              var dx = wp[0] - t.group.position.x, dz = wp[1] - t.group.position.z;
              var dist = Math.sqrt(dx * dx + dz * dz);
              if (dist < 0.25) {
                t.wp = (t.wp + 1) % t.path.length;
                t.dwell = 0.25 + Math.random() * t.dwellTime;
                t.stuckT = 0;
              } else {
                var step = Math.min(dist, t.speed * dt);
                var ux = dx / dist, uz = dz / dist;
                var nx2 = t.group.position.x + ux * step;
                var nz2 = t.group.position.z + uz * step;
                if (npcClear(nx2, t.group.position.z, 0.4) && !botBlocked(nx2, t.group.position.z, t)) { t.group.position.x = nx2; moving = true; }
                if (npcClear(t.group.position.x, nz2, 0.4) && !botBlocked(t.group.position.x, nz2, t)) { t.group.position.z = nz2; moving = true; }
                var wantYaw = Math.atan2(-ux, -uz);
                var dyaw = wantYaw - t.group.rotation.y;
                while (dyaw > Math.PI) dyaw -= Math.PI * 2;
                while (dyaw < -Math.PI) dyaw += Math.PI * 2;
                t.group.rotation.y += dyaw * Math.min(1, dt * 8);
                if (!moving) {
                  t.stuckT += dt;
                  if (t.stuckT > 1.4) { t.wp = (t.wp + 1) % t.path.length; t.stuckT = 0; t.dwell = 0; }
                } else t.stuckT = 0;
              }
            }
          }
        }
        }
        // --- animasyonlar ---
        t.recoil = Math.max(0, t.recoil - dt * 6.5);
        if (t.flashT > 0) {
          t.flashT -= dt;
          if (t.flashT <= 0 && t.flash) t.flash.visible = false;
        }
        if (moving) t.walkPhase += dt * (2.2 + t.speed * 2.6);
        var swing = moving ? Math.sin(t.walkPhase) * 0.5 : 0;
        t.legL.rotation.x += (swing - t.legL.rotation.x) * Math.min(1, dt * 10);
        t.legR.rotation.x += (-swing - t.legR.rotation.x) * Math.min(1, dt * 10);
        var kneeL = moving ? Math.max(0, Math.sin(t.walkPhase + 2.6)) * 0.52 : 0;
        var kneeR = moving ? Math.max(0, Math.sin(t.walkPhase + 2.6 + Math.PI)) * 0.52 : 0;
        if (t.kneeL) t.kneeL.rotation.x += (kneeL - t.kneeL.rotation.x) * Math.min(1, dt * 12);
        if (t.kneeR) t.kneeR.rotation.x += (kneeR - t.kneeR.rotation.x) * Math.min(1, dt * 12);
        var bob = moving ? Math.abs(Math.sin(t.walkPhase)) * 0.022 : Math.sin(nowS * 1.6 + t.seed) * 0.007;
        t.upper.position.y = 0.78 + bob;
        t.upper.rotation.x = -t.recoil * 0.05;
        // nişan yüksekliği (hedefe doğru namlu eğimi)
        var desiredPitch = (t.netPitch !== undefined && t.netPitch) ? -t.netPitch * 0.7 : 0;
        if (tgt) {
          var tty = tgt.kind === 'player' ? 1.25 : 1.2;
          var thd = Math.sqrt(Math.pow((tgt.kind === 'player' ? player.x : tgt.bot.group.position.x) - t.group.position.x, 2) +
                              Math.pow((tgt.kind === 'player' ? player.z : tgt.bot.group.position.z) - t.group.position.z, 2));
          desiredPitch = Math.atan2(tty - 1.24, Math.max(0.4, thd));
          desiredPitch = Math.max(-0.55, Math.min(0.55, desiredPitch));
        }
        t.aimPitch += (desiredPitch - t.aimPitch) * Math.min(1, dt * 6);
        t.gunG.rotation.x = t.aimPitch;
        t.gunG.position.z = -0.3 - t.recoil * 0.06;
        var armSwing = (!tgt && moving) ? Math.sin(t.walkPhase) * 0.2 : 0;
        var wantAL = tgt ? -1.42 : -1.3 + armSwing;
        var wantAR = tgt ? -1.24 : -1.12 - armSwing;
        t.armL.rotation.x += (wantAL - t.armL.rotation.x) * Math.min(1, dt * 8);
        t.armR.rotation.x += (wantAR - t.armR.rotation.x) * Math.min(1, dt * 8);
      }
      if (t.state === 'falling') {
        t.upper.position.y = 0.78;
        t.upper.rotation.x = 0;
        t.fallT += dt / 0.35;
        var k = Math.min(1, t.fallT);
        t.group.rotation.x = -1.5708 * (k * k * (3 - 2 * k));
        if (k >= 1) { t.state = 'down'; t.downUntil = nowS + 9.35; }
      } else if (t.state === 'down') {
        if (nowS >= t.downUntil) t.state = 'rising';
      } else if (t.state === 'rising') {
        t.fallT -= dt / 0.3;
        var k2 = Math.max(0, t.fallT);
        t.group.rotation.x = -1.5708 * (k2 * k2 * (3 - 2 * k2));
        if (k2 <= 0) {
          t.state = 'alive'; t.hp = t.maxHp; t.armor = t.maxArmor; t.dead = false;
          var sp = t.spawnPos || t.home;
          t.group.position.set(sp.x, 0, sp.z);
          t.group.rotation.set(0, t.spawnYaw !== undefined ? t.spawnYaw : 0, 0);
          t.protectUntil = nowS + SPAWN_PROTECT;
          t.target = null; t.burstLeft = 0; t.nextShot = nowS + 1.2;
          t.recoil = 0; t.flashT = 0; t.aimPitch = 0; t.stuckT = 0;
          t.lastSeenT = 0; t.retreatT = 0; t.stunT = 0; t.scanA = 0; t.moveSpread = 0; t.strafeT = 0;
          if (t.flash) t.flash.visible = false;
          t.upper.position.y = 0.78; t.upper.rotation.x = 0;
          t.gunG.rotation.x = 0; t.gunG.position.z = -0.3;
          t.legL.rotation.x = 0; t.legR.rotation.x = 0;
          if (t.kneeL) t.kneeL.rotation.x = 0;
          if (t.kneeR) t.kneeR.rotation.x = 0;
          t.armL.rotation.x = -1.3; t.armR.rotation.x = -1.12;
          t.wp = 1; t.dwell = 0.4 + Math.random() * t.dwellTime;
          drawBotBar(t);
        }
      }
    }
  }

  /* ================= ATEŞ ================= */
  var hittables = [];
  var raycaster = new THREE.Raycaster();

  function fireShot() {
    var w = currentWeapon();
    if (player.hp <= 0) return;
    if (reloading || raiseT < 0.9) return;
    if (w.id === 'sniper' && awpBoltT > 0) return;
    var wasScoped = scopeLevel;
    var nowS = performance.now() / 1000;
    if (nowS < nextShotTime) return;
    if (ammo[curW] <= 0) { nextShotTime = nowS + 0.35; playTick(820, 0.06, 0.02); return; }
    nextShotTime = nowS + 60 / w.rpm;
    if (infAmmo) ammo[curW] = w.magSize; else ammo[curW]--;
    updateHudAmmo();
    playShot(w.id);
    bloom = Math.min(bloom + w.bloom, w.bloomMax);
    player.pitch = Math.min(player.pitch + w.kickUp * DEG, 1.45);
    player.yaw += (Math.random() - 0.5) * 2 * w.kickSide * DEG;
    gunKick = 1;
    camera.updateMatrixWorld(true);
    var spread = computeSpread();
    var fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    var rgt = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    var upv = new THREE.Vector3().crossVectors(rgt, fwd).normalize();
    var ang = Math.random() * Math.PI * 2, rad = Math.random() * spread;
    var dir = fwd.clone().addScaledVector(rgt, Math.cos(ang) * rad).addScaledVector(upv, Math.sin(ang) * rad).normalize();
    var gw3 = weaponGroups[w.id];
    var muzzleWorld;
    if (gw3.userData.muzzle) {
      muzzleWorld = gw3.userData.muzzle.getWorldPosition(new THREE.Vector3());
    } else {
      muzzleWorld = new THREE.Vector3(w.muzzle.x, w.muzzle.y, w.muzzle.z).applyMatrix4(gw3.matrixWorld);
    }
    showFlash(camera.worldToLocal(muzzleWorld.clone()));
    raycaster.set(camera.position, dir);
    raycaster.far = 220;
    var hits = raycaster.intersectObjects(hittables, false);
    var end = camera.position.clone().addScaledVector(dir, 90);
    if (hits.length) {
      var hit = hits[0];
      end.copy(hit.point);
      var nrm = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize() : dir.clone().negate();
      var tgt = hit.object.__tgt;
      if (tgt) {
        if (tgt.team !== player.team) {
          var isHead = hit.object.userData.part === 'head';
          if (tgt.isRemote) {
            mpSend({ t: 'pd', dmg: w.dmg * (isHead ? w.headMul : 1), head: isHead, w: w.id, k: mpName, kt: player.team });
            playDink(isHead);
            showHitmarker(isHead, false);
          } else if (tgt.isGhost) {
            mpSend({ t: 'bd', id: tgt.id, dmg: w.dmg * (isHead ? w.headMul : 1), head: isHead, w: w.id });
            playDink(isHead);
            showHitmarker(isHead, false);
          } else {
            damageTarget(tgt, w.dmg * (isHead ? w.headMul : 1), isHead, true);
          }
        }
      } else {
        addDecal(hit.point, nrm);
        spawnPuff(hit.point, nrm);
      }
    }
    spawnTracer(muzzleWorld, end);
    if (mpConnected && mpRole) {
      mpSend({ t: 'pf', x: muzzleWorld.x, y: muzzleWorld.y, z: muzzleWorld.z, dx: dir.x, dy: dir.y, dz: dir.z, w: w.id });
    }
    if (w.id === 'sniper' && !matchEnded) beginSniperBolt(wasScoped);
  }

  /* ================= HUD / CROSSHAIR ================= */
  var ammoEl = document.getElementById('ammo');
  var wepEl = document.getElementById('wepname');
  var nadesEl = document.getElementById('nades');
  var flashOvEl = document.getElementById('flashov');
  var scoreEl = document.getElementById('score');
  var hpBarEl = document.getElementById('hpbar');
  var armorBarEl = document.getElementById('armorbar');
  var hpNumEl = document.getElementById('hpnum');
  var armorNumEl = document.getElementById('armornum');
  var dmgFlashEl = document.getElementById('dmgflash');
  var deathEl = document.getElementById('deathmsg');
  var deathCountEl = document.getElementById('deathcount');
  var teamBadgeEl = document.getElementById('teambadge');
  var protectEl = document.getElementById('protecthint');
  var chDotEl = document.getElementById('ch-dot');
  var matchbarEl = document.getElementById('matchbar');
  var blueScoreEl = document.getElementById('blueScore');
  var redScoreEl = document.getElementById('redScore');
  var matchTimerEl = document.getElementById('matchTimer');
  var matchGoalEl = document.getElementById('matchGoal');
  var killFeedEl = document.getElementById('killfeed');
  var dmgFlashT = 0, deathT = 0, shakeT = 0;
  var chEls = {
    up: document.getElementById('ch-up'), down: document.getElementById('ch-down'),
    left: document.getElementById('ch-left'), right: document.getElementById('ch-right')
  };
  var lastGap = -1;
  function updateCrosshair(spreadPx) {
    var cfg = (typeof chCfg !== 'undefined' && chCfg) ? chCfg : { size: 7, thickness: 2, gap: 4, dynamic: 1 };
    var gap = cfg.gap + (cfg.dynamic ? (spreadPx || 0) : 0);
    if (gap < 0) gap = 0;
    if (gap > 46) gap = 46;
    if (Math.abs(gap - lastGap) < 0.3) return;
    lastGap = gap;
    if (!chEls.up || !chEls.down || !chEls.left || !chEls.right) return;
    chEls.up.style.top = (-gap - cfg.size) + 'px';
    chEls.down.style.top = gap + 'px';
    chEls.left.style.left = (-gap - cfg.size) + 'px';
    chEls.right.style.left = gap + 'px';
  }
  function updateHudNades() {
    if (!nadesEl) return;
    nadesEl.textContent = 'Sis ' + nades.smoke + ' · Flaş ' + nades.flash + ' · HE ' + nades.he;
  }
  function updateHudAmmo() {
    if (!ammoEl || !wepEl) return;
    ammoEl.textContent = (reloading ? '⟳ ' : '') + ammo[curW] + ' / ' + (infAmmo ? '∞' : reserve[curW]);
    var suf = scopeLevel === 2 ? ' · 2x' : scopeLevel === 1 ? ' · 1x' : '';
    if (currentWeapon().id === 'sniper' && awpBoltT > 0) suf += ' · SÜRGÜ';
    wepEl.textContent = currentWeapon().name + suf;
    updateHudNades();
  }
  function updateHudScore() {
    if (scoreEl) scoreEl.textContent = (currentMap ? currentMap.name + ' · ' : '') + stats.kills + ' öldürme · ' + stats.headshots + ' kafa';
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.ceil(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function updateTeamScoreHud() {
    if (blueScoreEl) blueScoreEl.textContent = matchScore.blue;
    if (redScoreEl) redScoreEl.textContent = matchScore.red;
    if (matchGoalEl) matchGoalEl.textContent = killLimit > 0 ? 'HEDEF ' + killLimit : 'HEDEF SINIRSIZ';
    if (matchTimerEl) {
      matchTimerEl.textContent = timeLimit > 0 ? fmtClock(matchTimeLeft) : fmtClock(matchClock);
    }
    var bsEl = document.getElementById('briefScore');
    if (bsEl && startedOnce) bsEl.textContent = 'Skor  ' + matchScore.blue + ' : ' + matchScore.red;
  }
  function updateMatchHudVisibility() {
    if (!matchbarEl) return;
    matchbarEl.style.display = (startedOnce && !matchEnded && overlayMode !== 'lobby' && overlayMode !== 'end') ? 'flex' : 'none';
  }
  function addTeamScore(team, n) {
    if (!startedOnce || matchEnded) return;
    if (mpRole === 'guest') return;                    // skor yetkisi ana makinede
    if (team !== 'blue' && team !== 'red') return;
    matchScore[team] += (n || 1);
    updateTeamScoreHud();
    checkMatchEnd();
  }
  function clearKillFeed() {
    if (killFeedEl) killFeedEl.innerHTML = '';
  }
  function addKillFeed(killerName, victimName, killerTeam, victimTeam, head, involvedPlayer) {
    if (!killFeedEl || !startedOnce || matchEnded) return;
    var row = document.createElement('div');
    row.className = 'kf';
    function nameEl(txt, team, isPlayer) {
      var s = document.createElement('span');
      s.className = isPlayer ? 'kf-you' : (team === 'red' ? 'kf-red' : 'kf-blue');
      s.textContent = txt;
      return s;
    }
    row.appendChild(nameEl(killerName, killerTeam, involvedPlayer && killerName === 'SEN'));
    var ico = document.createElement('span'); ico.className = 'kfico'; ico.textContent = '▸'; row.appendChild(ico);
    row.appendChild(nameEl(victimName, victimTeam, involvedPlayer && victimName === 'SEN'));
    if (head) {
      var hs = document.createElement('span'); hs.className = 'kfhs'; hs.textContent = 'KAFA'; row.appendChild(hs);
    }
    killFeedEl.appendChild(row);
    while (killFeedEl.children.length > 5) killFeedEl.removeChild(killFeedEl.firstChild);
    setTimeout(function () { if (row.parentNode) row.parentNode.removeChild(row); }, 5200);
  }
  function updateViewTeam(team) {
    if (viewAccentMat) viewAccentMat.color.setHex(team === 'red' ? 0xa33b2e : 0x2f5f9e);
  }
  function updateTeamHud() {
    updateViewTeam(player.team);
    if (teamBadgeEl) {
      teamBadgeEl.textContent = player.team === 'blue' ? 'MAVİ TAKIM' : 'KIRMIZI TAKIM';
      teamBadgeEl.className = 'teambadge ' + player.team;
    }
    var avatarEl = document.querySelector('.brand .avatar');
    if (avatarEl) {
      avatarEl.textContent = player.team === 'blue' ? 'B' : 'R';
      avatarEl.style.background = player.team === 'red'
        ? 'linear-gradient(145deg,#7e3027,#3d1814)' : 'linear-gradient(145deg,#325f8f,#1b2d43)';
      avatarEl.style.borderColor = player.team === 'red' ? 'rgba(255,160,145,.35)' : 'rgba(130,190,255,.3)';
      avatarEl.style.color = player.team === 'red' ? '#ffd3cb' : '#cbe6ff';
    }
  }
  function updateMapHud() {
    updateHudScore();
    updateTeamHud();
  }
  function updateHudHealth() {
    if (hpBarEl) {
      hpBarEl.style.width = Math.max(0, player.hp) + '%';
      hpBarEl.style.background = player.hp > 60 ? '#57c04b' : player.hp > 25 ? '#d8a434' : '#cf4436';
    }
    if (armorBarEl) armorBarEl.style.width = Math.max(0, player.armor) + '%';
    if (hpNumEl) hpNumEl.textContent = Math.max(0, Math.round(player.hp));
    if (armorNumEl) armorNumEl.textContent = Math.max(0, Math.round(player.armor));
  }
  function hurtPlayer(dmg, head) {
    if (player.hp <= 0 || godMode) return;
    if (!startedOnce) return;                                    // başlamadan ölümsüzlük
    if (performance.now() / 1000 < player.protectUntil) return;  // doğuş koruması
    if (player.armor > 0) {
      var absorbed = Math.min(player.armor, dmg * (head ? 0.25 : 0.5));
      player.armor -= absorbed;
      dmg -= absorbed;
    }
    player.hp = Math.max(0, player.hp - dmg);
    dmgFlashT = 0.55;
    if (dmgFlashEl) dmgFlashEl.style.opacity = '0.5';
    playHurt();
    updateHudHealth();
    if (player.hp <= 0) playerDie();
  }
  function playerDie() {
    player.hp = 0;
    deathT = RESPAWN_DELAY;
    if (deathEl) deathEl.style.display = 'block';
    if (deathCountEl) deathCountEl.textContent = 'Yeniden doğuş: ' + Math.ceil(deathT) + ' sn · ' + teamSpawnDef(player.team).name;
    triggerHeld = false; triggerQueued = false;
    cancelSniperBolt();
    scopeLevel = 0; applyScope();
    updateHudHealth();
  }

  function updateWeapon(dt) {
    if (raiseT < 1) raiseT = Math.min(1, raiseT + dt / 0.28);
    gunKick = Math.max(0, gunKick - dt * 7);
    bloom = Math.max(0, bloom - dt * 0.09);
    if (throwAnimT > 0) throwAnimT = Math.max(0, throwAnimT - dt);
    var w = currentWeapon();
    // --- AWP sürgü döngüsü + otomatik yeniden dürbünleme ---
    var boltAnim = 0;
    if (awpBoltT > 0) {
      if (!paused) awpBoltT = Math.max(0, awpBoltT - dt);
      var q = 1 - awpBoltT / AWP_BOLT_TIME;
      var pull = q < 0.46 ? (q / 0.46) : (1 - (q - 0.46) / 0.54);
      pull = Math.max(0, Math.min(1, pull));
      var bolt = weaponGroups.sniper.userData.bolt;
      if (bolt) {
        bolt.position.z = bolt.userData.baseZ + pull * 0.105;
        bolt.rotation.z = bolt.userData.baseRotZ - pull * 0.72;
      }
      boltAnim = Math.sin(Math.PI * Math.max(0, Math.min(1, q)));
      if (!paused && awpBoltSnd === 0 && q > 0.18) { awpBoltSnd = 1; playTick(330, 0.045, 0.022); }
      if (!paused && awpBoltSnd === 1 && q > 0.64) { awpBoltSnd = 2; playTick(520, 0.04, 0.018); }
      if (awpBoltT <= 0) {
        resetBoltHandle();
        if (awpRescopePending && player.hp > 0 && !reloading && currentWeapon().id === 'sniper') {
          scopeLevel = awpRescopeLevel;
          applyScope();
          playTick(980, 0.035, 0.02);
        }
        awpRescopePending = false;
        awpRescopeLevel = 0;
        awpBoltSnd = 0;
        updateHudAmmo();
      }
    }
    if (reloading && performance.now() / 1000 >= reloadEnd) {
      reloading = false;
      var need = w.magSize - ammo[curW];
      var take = infAmmo ? need : Math.min(need, reserve[curW]);
      ammo[curW] += take;
      if (!infAmmo) reserve[curW] -= take;
      playTick(660, 0.06, 0.03);
      updateHudAmmo();
    }
    var active = !paused && player.hp > 0;
    if (active && (w.auto ? triggerHeld : triggerQueued)) fireShot();
    triggerQueued = false;
    var gw = weaponGroups[w.id];
    if (gw) {
      var nowS = performance.now() / 1000;
      var rl = reloading ? Math.max(0, Math.min(1, 1 - (reloadEnd - nowS) / w.reloadTime)) : 0;
      var dip = Math.sin(Math.PI * rl);
      var sprint = (!scoped && !reloading && player.grounded && !paused)
        ? Math.min(1, moveAmt) * (keys['shift'] ? 0.35 : 0.75) : 0;
      var breath = Math.sin(nowS * 1.7) * 0.0016;
      var throwDip = throwAnimT > 0 ? Math.sin(Math.PI * Math.min(1, (0.4 - throwAnimT) / 0.4)) : 0;
      var sw = scoped ? 0.3 : 1;
      swayX *= Math.max(0, 1 - dt * 5);
      swayY *= Math.max(0, 1 - dt * 5);
      var base = w.pos;
      gw.position.set(
        base.x + Math.sin(bobT * 0.5) * 0.01 * bobAmt + swayX * sw - sprint * 0.05,
        base.y + Math.cos(bobT) * 0.012 * bobAmt - (1 - raiseT) * 0.3 - player.crouch * 0.02 + breath + swayY * sw - dip * 0.15 - throwDip * 0.12 - boltAnim * 0.07,
        base.z + gunKick * 0.07 + sprint * 0.05 - throwDip * 0.06 + boltAnim * 0.045
      );
      gw.rotation.x = gunKick * 0.09 + dip * 0.55 + sprint * 0.1 + throwDip * 0.7 + boltAnim * 0.33;
      gw.rotation.z = -0.4 * dip + sprint * 0.09 + swayX * sw * 2.5 - boltAnim * 0.2;
      if (gw.userData.mag) gw.userData.mag.position.y = gw.userData.mag.userData.baseY - dip * 0.16;
    }
  }

  /* ================= GİRDİ / AYARLAR / MENÜ ================= */
  var keys = {}, locked = false, sens = 1, dragFallback = false, dragging = false, dragMoved = 0;
  var paused = true, startedOnce = false, menuWeapon = 0, vol = 0.5;
  var godMode = false, infAmmo = false, brightness = 1;
  var chCfg = { color: '#4dff88', size: 7, thickness: 2, gap: 4, dot: 0, dynamic: 1 };
  var devConsoleEnabled = false, consoleOpen = false, consolePrevPaused = true;
  var matchTeam = 'blue', matchBots = { blue: 4, red: 4 }, selectedMapId = 'dust2';
  var botDifficulty = 'normal', killLimit = 30, timeLimit = 0;
  var matchScore = { blue: 0, red: 0 }, matchEnded = false, matchTimeLeft = 0, matchClock = 0;
  var selectedMenuTab = 'play';
  var overlayMode = 'lobby', leaveGuard = true;
  var overlayEl = document.getElementById('overlay');
  var sensEl = document.getElementById('sens');
  var playEl = document.getElementById('play');
  var resumeEl = document.getElementById('resume');
  var toLobbyEl = document.getElementById('toLobby');
  var scopeEl = document.getElementById('scope');
  var crossEl = document.getElementById('crosshair');
  var areaEl = document.getElementById('area');
  var statsEl = document.getElementById('stats');
  var volEl = document.getElementById('vol');
  var fovEl = document.getElementById('fov');
  var sensValEl = document.getElementById('sensVal');
  var volValEl = document.getElementById('volVal');
  var fovValEl = document.getElementById('fovVal');
  var brightEl = document.getElementById('bright');
  var brightValEl = document.getElementById('brightVal');
  var botsBlueEl = document.getElementById('botsBlue');
  var botsRedEl = document.getElementById('botsRed');
  var botsBlueValEl = document.getElementById('botsBlueVal');
  var botsRedValEl = document.getElementById('botsRedVal');
  var teamTotalsEl = document.getElementById('teamtotals');
  var mapNoteEl = document.getElementById('mapdesc');
  var mapBadgeEl = document.getElementById('mapnote');
  var teamBtns = Array.prototype.slice.call(document.querySelectorAll('.tsel'));
  var mapCards = Array.prototype.slice.call(document.querySelectorAll('.mcard'));
  var wcards = Array.prototype.slice.call(document.querySelectorAll('.wcard'));
  var chColorEl = document.getElementById('chColor');
  var chSizeEl = document.getElementById('chSize');
  var chThickEl = document.getElementById('chThick');
  var chGapEl = document.getElementById('chGap');
  var chSizeValEl = document.getElementById('chSizeVal');
  var chThickValEl = document.getElementById('chThickVal');
  var chGapValEl = document.getElementById('chGapVal');
  var chDotCfgEl = document.getElementById('chDot');
  var chDynEl = document.getElementById('chDyn');
  var devChkEl = document.getElementById('devconsole');
  var godEl = document.getElementById('god');
  var infEl = document.getElementById('inf');
  var navBtns = Array.prototype.slice.call(document.querySelectorAll('.navbtn'));
  var tabPanes = Array.prototype.slice.call(document.querySelectorAll('.tabpane'));
  var profileMetaEl = document.getElementById('profileMeta');
  var playChipEl = document.getElementById('playChip');
  var footHintEl = document.getElementById('footHint');
  var loadoutNameEl = document.getElementById('loadoutName');
  var loadoutTagEl = document.getElementById('loadoutTag');
  var loadoutDmgEl = document.getElementById('loadoutDmg');
  var loadoutRpmEl = document.getElementById('loadoutRpm');
  var loadoutMagEl = document.getElementById('loadoutMag');
  var loadoutNoteEl = document.getElementById('loadoutNote');
  var loadoutChipEl = document.getElementById('loadoutChip');
  var sumBlueEl = document.getElementById('sumBlue');
  var sumRedEl = document.getElementById('sumRed');
  var sumMapEl = document.getElementById('sumMap');
  var sumTeamEl = document.getElementById('sumTeam');
  var sumBotsEl = document.getElementById('sumBots');
  var sumDiffEl = document.getElementById('sumDiff');
  var sumGoalEl = document.getElementById('sumGoal');
  var sumTimeEl = document.getElementById('sumTime');
  var briefMapEl = document.getElementById('briefMap');
  var briefSubEl = document.getElementById('briefSub');
  var endcardEl = document.getElementById('endcard');
  var endWinnerEl = document.getElementById('endWinner');
  var endReasonEl = document.getElementById('endReason');
  var endBlueEl = document.getElementById('endBlue');
  var endRedEl = document.getElementById('endRed');
  var endMapEl = document.getElementById('endMap');
  var endKillsEl = document.getElementById('endKills');
  var endHeadshotsEl = document.getElementById('endHeadshots');
  var rematchEl = document.getElementById('rematch');
  var endLobbyEl = document.getElementById('endLobby');
  var openConsoleEl = document.getElementById('openConsole');
  var devMsgEl = document.getElementById('devMsg');
  var devStateEl = document.getElementById('devState');
  var devStateLabelEl = document.getElementById('devStateLabel');
  var chPrev = {
    up: document.getElementById('chPrevUp'), down: document.getElementById('chPrevDown'),
    left: document.getElementById('chPrevLeft'), right: document.getElementById('chPrevRight'),
    dot: document.getElementById('chPrevDot')
  };

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  // --- ayarlar: yükle / kaydet ---
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem('dust2-settings-r6') || '{}') || {}; } catch (e) { stored = {}; }
  if (typeof stored.sens === 'number') sens = stored.sens;
  if (typeof stored.fov === 'number') baseFov = stored.fov;
  if (typeof stored.vol === 'number') vol = stored.vol;
  if (stored.weapon >= 0 && stored.weapon < WEAPONS.length) menuWeapon = stored.weapon;
  if (typeof stored.god === 'boolean') godMode = stored.god;
  if (typeof stored.inf === 'boolean') infAmmo = stored.inf;
  if (typeof stored.brightness === 'number') brightness = Math.max(0.6, Math.min(1.8, stored.brightness));
  if (stored.map && MAP_DEFS[stored.map]) selectedMapId = stored.map;
  if (stored.team === 'blue' || stored.team === 'red') matchTeam = stored.team;
  player.team = matchTeam;
  if (typeof stored.botsBlue === 'number') matchBots.blue = stored.botsBlue | 0;
  if (typeof stored.botsRed === 'number') matchBots.red = stored.botsRed | 0;
  if (stored.crosshair && typeof stored.crosshair === 'object') {
    var sc2 = stored.crosshair;
    if (typeof sc2.color === 'string') chCfg.color = sc2.color;
    if (typeof sc2.size === 'number') chCfg.size = Math.max(2, Math.min(14, sc2.size));
    if (typeof sc2.thickness === 'number') chCfg.thickness = Math.max(1, Math.min(5, sc2.thickness));
    if (typeof sc2.gap === 'number') chCfg.gap = Math.max(0, Math.min(12, sc2.gap));
    if (typeof sc2.dot === 'number') chCfg.dot = sc2.dot ? 1 : 0;
    if (typeof sc2.dynamic === 'number') chCfg.dynamic = sc2.dynamic ? 1 : 0;
  }
  if (typeof stored.devconsole === 'boolean') devConsoleEnabled = stored.devconsole;
  if (stored.difficulty === 'easy' || stored.difficulty === 'normal' || stored.difficulty === 'hard') botDifficulty = stored.difficulty;
  if (stored.killLimit === 0 || stored.killLimit === 15 || stored.killLimit === 30 || stored.killLimit === 50) killLimit = stored.killLimit;
  if (stored.timeLimit === 0 || stored.timeLimit === 5 || stored.timeLimit === 10 || stored.timeLimit === 15) timeLimit = stored.timeLimit;
  function clampBotCounts() {
    var mb = matchTeam === 'blue' ? 14 : 15;
    var mr = matchTeam === 'red' ? 14 : 15;
    matchBots.blue = Math.max(0, Math.min(mb, matchBots.blue | 0));
    matchBots.red = Math.max(0, Math.min(mr, matchBots.red | 0));
  }
  clampBotCounts();

  function persistSettings() {
    try {
      localStorage.setItem('dust2-settings-r6', JSON.stringify({
        sens: sens, fov: baseFov, vol: vol, weapon: menuWeapon, god: godMode, inf: infAmmo,
        brightness: brightness, crosshair: chCfg, devconsole: devConsoleEnabled,
        map: selectedMapId, team: matchTeam, botsBlue: matchBots.blue, botsRed: matchBots.red,
        difficulty: botDifficulty, killLimit: killLimit, timeLimit: timeLimit
      }));
    } catch (e) {}
  }
  function syncSettingLabels() {
    if (sensEl) sensEl.value = sens;
    if (fovEl) fovEl.value = baseFov;
    if (volEl) volEl.value = vol;
    if (brightEl) brightEl.value = brightness;
    if (sensValEl) sensValEl.textContent = sens.toFixed(2);
    if (fovValEl) fovValEl.textContent = baseFov;
    if (volValEl) volValEl.textContent = Math.round(vol * 100) + '%';
    if (brightValEl) brightValEl.textContent = brightness.toFixed(2);
  }
  function syncCrosshairUI() {
    if (chColorEl) chColorEl.value = chCfg.color;
    if (chSizeEl) chSizeEl.value = chCfg.size;
    if (chThickEl) chThickEl.value = chCfg.thickness;
    if (chGapEl) chGapEl.value = chCfg.gap;
    if (chSizeValEl) chSizeValEl.textContent = chCfg.size;
    if (chThickValEl) chThickValEl.textContent = chCfg.thickness;
    if (chGapValEl) chGapValEl.textContent = chCfg.gap;
    if (chDotCfgEl) chDotCfgEl.checked = !!chCfg.dot;
    if (chDynEl) chDynEl.checked = !!chCfg.dynamic;
  }
  var DIFF_TR = { easy: 'Kolay', normal: 'Normal', hard: 'Zor' };
  var WEAPON_TAGS = { rifle: 'BİRİNCİL · TÜFEK', pistol: 'YEDEK · TABANCA', sniper: 'BİRİNCİL · KESKİN NİŞANCI',
    rifle2: 'BİRİNCİL · TÜFEK', pistol2: 'YEDEK · AĞIR TABANCA' };
  var WEAPON_NOTES = {
    rifle: 'Dengeli hasar ve yüksek atış hızı. Orta mesafede seri ateş için ideal; uzun mesafede kısa aralıklarla ateş et.',
    pistol: 'Hafif ve isabetli yedek silah. Yakın mesafede hızlı tıklamalarla etkili; hareket halinde saçılması artar.',
    sniper: 'Tek isabetle öldüren ağır keskin nişancı. Ateş sonrası sürgü animasyonu oynar ve otomatik olarak yeniden dürbünlenir.',
    rifle2: 'AK-47\'den daha isabetli, daha yumuşak geri tepmeli tüfek. Orta-uzun mesafede kısa serilerle parlaktır.',
    pistol2: 'Ağır tabanca: gövdeye 2, kafaya 1 mermi yeter. Geri tepmesi yüksektir; her atış arasında nişanı toparla.'
  };
  function updateLoadoutDetail() {
    var w = WEAPONS[menuWeapon];
    if (!w) return;
    if (loadoutNameEl) loadoutNameEl.textContent = w.name;
    if (loadoutTagEl) loadoutTagEl.textContent = WEAPON_TAGS[w.id] || '';
    if (loadoutDmgEl) loadoutDmgEl.textContent = w.dmg;
    if (loadoutRpmEl) loadoutRpmEl.textContent = w.rpm;
    if (loadoutMagEl) loadoutMagEl.textContent = w.magSize;
    if (loadoutNoteEl) loadoutNoteEl.textContent = WEAPON_NOTES[w.id] || '';
    if (loadoutChipEl) loadoutChipEl.textContent = w.name;
  }
  function syncWeaponCards() {
    for (var i = 0; i < wcards.length; i++) {
      wcards[i].classList.toggle('sel', i === menuWeapon);
      var dis = currentMap && currentMap.awpOnly && WEAPONS[i] && WEAPONS[i].id !== 'sniper';
      wcards[i].classList.toggle('disabled', !!dis);
    }
    updateLoadoutDetail();
  }
  function syncRulesUI() {
    var diffBtns = document.querySelectorAll('#diffSeg .segbtn');
    for (var i = 0; i < diffBtns.length; i++)
      diffBtns[i].classList.toggle('active', diffBtns[i].getAttribute('data-diff') === botDifficulty);
    var limitBtns = document.querySelectorAll('#limitSeg .segbtn');
    for (var j = 0; j < limitBtns.length; j++)
      limitBtns[j].classList.toggle('active', parseInt(limitBtns[j].getAttribute('data-limit'), 10) === killLimit);
    var timeBtns = document.querySelectorAll('#timeSeg .segbtn');
    for (var k = 0; k < timeBtns.length; k++)
      timeBtns[k].classList.toggle('active', parseInt(timeBtns[k].getAttribute('data-time'), 10) === timeLimit);
  }
  function syncLobbyUI() {
    clampBotCounts();
    if (botsBlueEl) {
      botsBlueEl.max = matchTeam === 'blue' ? 14 : 15;
      botsBlueEl.value = matchBots.blue;
    }
    if (botsRedEl) {
      botsRedEl.max = matchTeam === 'red' ? 14 : 15;
      botsRedEl.value = matchBots.red;
    }
    if (botsBlueValEl) botsBlueValEl.textContent = matchBots.blue;
    if (botsRedValEl) botsRedValEl.textContent = matchBots.red;
    var bTot = matchBots.blue + (matchTeam === 'blue' ? 1 : 0);
    var rTot = matchBots.red + (matchTeam === 'red' ? 1 : 0);
    if (teamTotalsEl) {
      teamTotalsEl.textContent = 'Mavi ' + bTot + '/15 · Kırmızı ' + rTot + '/15 · sen ' + (matchTeam === 'blue' ? 'mavi' : 'kırmızı');
    }
    for (var i = 0; i < teamBtns.length; i++)
      teamBtns[i].classList.toggle('sel', teamBtns[i].getAttribute('data-team') === matchTeam);
    for (var m = 0; m < mapCards.length; m++)
      mapCards[m].classList.toggle('sel', mapCards[m].getAttribute('data-map') === selectedMapId);
    var mapName = currentMap ? currentMap.name : 'Dust II';
    var mapDesc = currentMap ? currentMap.desc : '';
    if (mapNoteEl) mapNoteEl.textContent = mapDesc;
    if (mapBadgeEl) mapBadgeEl.textContent = currentMap && currentMap.awpOnly ? 'SADECE AWP' : '';
    if (playChipEl) playChipEl.textContent = currentMap && currentMap.awpOnly ? 'SADECE AWP' : 'LOBİ HAZIR';
    if (sumBlueEl) sumBlueEl.textContent = bTot;
    if (sumRedEl) sumRedEl.textContent = rTot;
    if (sumMapEl) sumMapEl.textContent = mapName;
    if (sumTeamEl) sumTeamEl.textContent = matchTeam === 'blue' ? 'Mavi Takım' : 'Kırmızı Takım';
    if (sumBotsEl) sumBotsEl.textContent = bTot + 'v' + rTot;
    if (sumDiffEl) sumDiffEl.textContent = DIFF_TR[botDifficulty] || 'Normal';
    if (sumGoalEl) sumGoalEl.textContent = killLimit > 0 ? killLimit + ' öldürme' : 'Sınırsız';
    if (sumTimeEl) sumTimeEl.textContent = timeLimit > 0 ? timeLimit + ' dakika' : 'Sınırsız';
    if (briefMapEl) briefMapEl.textContent = mapName.toUpperCase();
    if (briefSubEl) briefSubEl.textContent = mapDesc;
    if (profileMetaEl) profileMetaEl.textContent = (matchTeam === 'blue' ? 'Mavi Takım' : 'Kırmızı Takım') + ' · rütbe 07';
    if (footHintEl) footHintEl.textContent = startedOnce && !matchEnded
      ? 'Maç devam ediyor · ' + mapName + ' · ' + matchScore.blue + ':' + matchScore.red
      : 'Lobi hazır · 4 harita · 5 silah · LAN MP';
    if (devChkEl) devChkEl.checked = devConsoleEnabled;
    if (godEl) godEl.checked = godMode;
    if (infEl) infEl.checked = infAmmo;
    syncRulesUI();
    syncWeaponCards();
    updateTeamScoreHud();
  }
  function applySettings() {
    if (masterGain) masterGain.gain.value = vol;
    if (!scoped) { camera.fov = baseFov; camera.updateProjectionMatrix(); }
    if (renderer.domElement) renderer.domElement.style.filter = 'brightness(' + brightness.toFixed(2) + ')';
  }
  function applyCrosshair() {
    if (!chEls || !chEls.up) return;
    var c = chCfg.color, t = chCfg.thickness, sz = chCfg.size;
    chEls.up.style.width = t + 'px'; chEls.up.style.height = sz + 'px';
    chEls.down.style.width = t + 'px'; chEls.down.style.height = sz + 'px';
    chEls.left.style.width = sz + 'px'; chEls.left.style.height = t + 'px';
    chEls.right.style.width = sz + 'px'; chEls.right.style.height = t + 'px';
    var all = [chEls.up, chEls.down, chEls.left, chEls.right];
    for (var i = 0; i < all.length; i++) {
      all[i].style.background = c;
      all[i].style.boxShadow = '0 0 0 1px rgba(0,0,0,0.6)';
    }
    if (chDotEl) {
      chDotEl.style.display = chCfg.dot ? 'block' : 'none';
      chDotEl.style.background = c;
      chDotEl.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.6)';
      var ds = Math.max(2, t) + 'px';
      chDotEl.style.width = ds; chDotEl.style.height = ds;
    }
    // menüdeki canlı nişan önizlemesi
    if (chPrev.up) {
      var gap = Math.max(0, chCfg.gap);
      var psz = Math.min(14, sz), pt = Math.min(5, t);
      var setLine = function (el, w2, h2, left2, top2) {
        el.style.width = w2 + 'px'; el.style.height = h2 + 'px';
        el.style.left = left2; el.style.top = top2;
        el.style.transform = 'translate(-50%,-50%)';
        el.style.background = c;
        el.style.boxShadow = '0 0 0 1px rgba(0,0,0,.7)';
        el.style.display = 'block';
      };
      setLine(chPrev.up, pt, psz, '50%', 'calc(50% - ' + (gap + psz / 2) + 'px)');
      setLine(chPrev.down, pt, psz, '50%', 'calc(50% + ' + (gap + psz / 2) + 'px)');
      setLine(chPrev.left, psz, pt, 'calc(50% - ' + (gap + psz / 2) + 'px)', '50%');
      setLine(chPrev.right, psz, pt, 'calc(50% + ' + (gap + psz / 2) + 'px)', '50%');
      if (chPrev.dot) {
        chPrev.dot.style.display = chCfg.dot ? 'block' : 'none';
        chPrev.dot.style.width = Math.max(2, pt) + 'px';
        chPrev.dot.style.height = Math.max(2, pt) + 'px';
        chPrev.dot.style.background = c;
        chPrev.dot.style.boxShadow = '0 0 0 1px rgba(0,0,0,.7)';
      }
    }
    lastGap = -1;
    updateCrosshair(0);
  }
  syncSettingLabels();
  syncCrosshairUI();

  // --- sınırsız şarjör / ölümsüzlük / konsol anahtarları ---
  function syncToggles() {
    if (godEl) godEl.checked = godMode;
    if (infEl) infEl.checked = infAmmo;
    if (devChkEl) devChkEl.checked = devConsoleEnabled;
    if (devMsgEl) devMsgEl.textContent = devConsoleEnabled
      ? 'Konsol etkin. Oyun içinde " tuşuyla veya aşağıdaki düğmeyle açabilirsin.'
      : 'Konsol kapalıyken " tuşu çalışmaz. Önce buradan etkinleştir.';
    if (openConsoleEl) openConsoleEl.disabled = !devConsoleEnabled;
    updateHudAmmo();
  }
  if (godEl) godEl.addEventListener('change', function () { godMode = !!godEl.checked; persistSettings(); });
  if (infEl) infEl.addEventListener('change', function () { infAmmo = !!infEl.checked; persistSettings(); syncToggles(); });
  if (devChkEl) devChkEl.addEventListener('change', function () {
    devConsoleEnabled = !!devChkEl.checked;
    if (!devConsoleEnabled && consoleOpen) dcClose();
    persistSettings();
    syncToggles();
  });
  syncToggles();

  // --- sekmeler ---
  function setMenuTab(name) {
    var found = false;
    for (var i = 0; i < tabPanes.length; i++) {
      var on = tabPanes[i].getAttribute('data-pane') === name;
      tabPanes[i].classList.toggle('active', on);
      if (on) found = true;
    }
    if (!found) return;
    selectedMenuTab = name;
    for (var j = 0; j < navBtns.length; j++)
      navBtns[j].classList.toggle('active', navBtns[j].getAttribute('data-tab') === name);
    var contentEl = document.querySelector('.content');
    if (contentEl) contentEl.scrollTop = 0;
    if (name === 'dev') updateDevState();
  }
  for (var nbI = 0; nbI < navBtns.length; nbI++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        setMenuTab(btn.getAttribute('data-tab'));
        playTick(620, 0.03, 0.02);
      });
    })(navBtns[nbI]);
  }
  setMenuTab('play');

  // --- maç kuralları ---
  function setDifficulty(v) {
    if (!BOT_DIFF[v]) return false;
    botDifficulty = v;
    syncLobbyUI();
    persistSettings();
    return true;
  }
  function setKillLimit(v) {
    v = parseInt(v, 10);
    if (v !== 0 && v !== 15 && v !== 30 && v !== 50) return false;
    killLimit = v;
    if (startedOnce && !matchEnded) { matchScore.blue = 0; matchScore.red = 0; }
    syncLobbyUI();
    persistSettings();
    updateTeamScoreHud();
    return true;
  }
  function setTimeLimit(v) {
    v = parseInt(v, 10);
    if (v !== 0 && v !== 5 && v !== 10 && v !== 15) return false;
    timeLimit = v;
    if (startedOnce) matchTimeLeft = v * 60;
    syncLobbyUI();
    persistSettings();
    updateTeamScoreHud();
    return true;
  }
  var diffBtns = document.querySelectorAll('#diffSeg .segbtn');
  for (var dbI = 0; dbI < diffBtns.length; dbI++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        setDifficulty(btn.getAttribute('data-diff'));
        playTick(660, 0.03, 0.02);
      });
    })(diffBtns[dbI]);
  }
  var limitBtns = document.querySelectorAll('#limitSeg .segbtn');
  for (var lbI = 0; lbI < limitBtns.length; lbI++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        setKillLimit(btn.getAttribute('data-limit'));
        playTick(640, 0.03, 0.02);
      });
    })(limitBtns[lbI]);
  }
  var timeBtns = document.querySelectorAll('#timeSeg .segbtn');
  for (var tbI2 = 0; tbI2 < timeBtns.length; tbI2++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        setTimeLimit(btn.getAttribute('data-time'));
        playTick(640, 0.03, 0.02);
      });
    })(timeBtns[tbI2]);
  }

  // --- silah seçim kartları ---
  function selectMenuWeapon(idx) {
    idx = Math.max(0, Math.min(WEAPONS.length - 1, idx | 0));
    if (currentMap && currentMap.awpOnly && WEAPONS[idx].id !== 'sniper') return false;
    menuWeapon = idx;
    syncWeaponCards();
    persistSettings();
    return true;
  }
  wcards.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      initAudio();
      if (selectMenuWeapon(i)) playTick(700, 0.04, 0.03);
      else playTick(300, 0.03, 0.03);
    });
  });

  // --- harita / takım / bot seçimi ---
  function setBotCounts(team, n) {
    if (team !== 'blue' && team !== 'red') return false;
    n = Math.max(0, Math.min(team === matchTeam ? 14 : 15, n | 0));
    matchBots[team] = n;
    syncLobbyUI();
    persistSettings();
    if (startedOnce) { spawnBotsForMatch(); updateMapHud(); }
    return true;
  }
  function setTeam(team) {
    if (team !== 'blue' && team !== 'red') return;
    matchTeam = team;
    player.team = team;
    clampBotCounts();
    if (startedOnce) {
      spawnBotsForMatch();
      respawn();
    } else {
      var sp = teamSpawnDef(team);
      player.x = sp.x; player.y = 0; player.z = sp.z;
      player.yaw = sp.yaw || 0; player.pitch = 0;
    }
    syncLobbyUI();
    updateTeamHud();
    updateMapHud();
    persistSettings();
  }
  function selectMap(id, restart) {
    if (!MAP_DEFS[id]) return false;
    var changed = id !== currentMapId || !currentMap;
    selectedMapId = id;
    if (changed) loadMap(id);
    if (currentMap.awpOnly) menuWeapon = 2;
    syncLobbyUI();
    syncWeaponCards();
    if (startedOnce) {
      clearBots();
      if (typeof clearEffects === 'function') clearEffects();
      spawnBotsForMatch();
      respawn();
      switchWeapon(currentMap.awpOnly ? 2 : menuWeapon, true, true);
      updateMapHud();
    }
    persistSettings();
    updateHudAmmo();
    return true;
  }
  for (var mcI = 0; mcI < mapCards.length; mcI++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        selectMap(btn.getAttribute('data-map'), false);
        playTick(600, 0.035, 0.03);
      });
    })(mapCards[mcI]);
  }
  for (var tbI = 0; tbI < teamBtns.length; tbI++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        setTeam(btn.getAttribute('data-team'));
        playTick(720, 0.04, 0.03);
      });
    })(teamBtns[tbI]);
  }
  if (botsBlueEl) botsBlueEl.addEventListener('input', function () { setBotCounts('blue', parseInt(botsBlueEl.value, 10)); });
  if (botsRedEl) botsRedEl.addEventListener('input', function () { setBotCounts('red', parseInt(botsRedEl.value, 10)); });

  // --- oyun başlat / devam / lobi ---
  function startMatch() {
    initAudio(); applySettings();
    if (!currentMap || (mpRole && currentMapId !== selectedMapId)) loadMap(selectedMapId);
    startedOnce = true;
    matchEnded = false;
    matchScore = { blue: 0, red: 0 };
    matchClock = 0;
    matchTimeLeft = timeLimit * 60;
    clearKillFeed();
    if (!mpRole) clearBots();
    if (typeof clearEffects === 'function') clearEffects();
    stats.kills = 0; stats.headshots = 0;
    clampBotCounts();
    player.team = matchTeam;
    if (mpRole) mpSpawnNetEntities(); else spawnBotsForMatch();
    respawn();
    if (currentMap.awpOnly) menuWeapon = 2;
    switchWeapon(currentMap.awpOnly ? 2 : menuWeapon, true, true);
    updateHudHealth(); updateMapHud(); updateHudAmmo();
    updateTeamScoreHud();
    updateMatchHudVisibility();
    resumeGame();
  }
  function resumeGame() {
    if (!startedOnce) { startMatch(); return; }
    if (matchEnded) return;
    initAudio(); applySettings();
    overlayEl.style.display = 'none';
    overlayMode = 'playing';
    paused = false;
    dragging = false;
    dragFallback = false;
    updateMatchHudVisibility();
    syncLobbyUI();
    requestLock();
    setTimeout(function () {
      if (!locked && !dragFallback && !paused) enableDragFallback();
    }, 900);
  }
  function toLobby() {
    startedOnce = false;
    matchEnded = false;
    matchScore = { blue: 0, red: 0 };
    matchClock = 0;
    matchTimeLeft = timeLimit * 60;
    clearKillFeed();
    dragFallback = false;
    clearBots();
    if (typeof clearEffects === 'function') clearEffects();
    paused = true;
    triggerHeld = false; triggerQueued = false;
    for (var kk in keys) keys[kk] = false;
    respawn();
    updateMapHud();
    showOverlay('lobby');
    persistSettings();
  }
  function showOverlay(mode) {
    overlayMode = mode;
    paused = true;
    triggerHeld = false; triggerQueued = false;
    for (var kk2 in keys) keys[kk2] = false;
    overlayEl.className = 'mode-' + mode;
    overlayEl.style.display = 'flex';
    if (!consoleOpen && document.pointerLockElement && document.exitPointerLock) {
      try { document.exitPointerLock(); } catch (e4) {}
    }
    if (mode === 'lobby' || mode === 'pause') setMenuTab('play');
    syncLobbyUI();
    syncSettingLabels();
    updateMatchHudVisibility();
    var pmEl = document.getElementById('pausemap');
    if (pmEl) pmEl.textContent = currentMap ? currentMap.name : '';
    applySettings();
  }
  function checkMatchEnd() {
    if (!startedOnce || matchEnded) return;
    if (mpRole === 'guest') return;                    // bitişi ana makine duyurur
    if (killLimit > 0 && (matchScore.blue >= killLimit || matchScore.red >= killLimit)) {
      endMatch('Öldürme hedefi doldu');
    } else if (timeLimit > 0 && matchTimeLeft <= 0) {
      endMatch('Süre doldu');
    }
  }
  function endMatch(reason) {
    if (!startedOnce || matchEnded) return;
    matchEnded = true;
    paused = true;
    triggerHeld = false; triggerQueued = false;
    for (var ek in keys) keys[ek] = false;
    cancelSniperBolt();
    scopeLevel = 0;
    applyScope();
    if (document.pointerLockElement && document.exitPointerLock) {
      try { document.exitPointerLock(); } catch (e5) {}
    }
    overlayMode = 'end';
    overlayEl.className = 'mode-end';
    overlayEl.style.display = 'flex';
    var winner = matchScore.blue === matchScore.red ? 'BERABERE'
      : (matchScore.blue > matchScore.red ? 'MAVİ TAKIM KAZANDI' : 'KIRMIZI TAKIM KAZANDI');
    if (endWinnerEl) {
      endWinnerEl.textContent = winner;
      endWinnerEl.style.color = matchScore.blue === matchScore.red ? '#ffe0a2'
        : (matchScore.blue > matchScore.red ? '#9dcfff' : '#ffb2a9');
    }
    if (endReasonEl) endReasonEl.textContent = reason + ' · ' + fmtClock(matchClock) + ' maç süresi';
    if (endBlueEl) endBlueEl.textContent = matchScore.blue;
    if (endRedEl) endRedEl.textContent = matchScore.red;
    if (mpRole === 'host' && mpConnected) {
      mpSend({ t: 'end', r: reason, sc: matchScore });
    }
    if (endMapEl) endMapEl.textContent = currentMap ? currentMap.name : '-';
    if (endKillsEl) endKillsEl.textContent = stats.kills;
    if (endHeadshotsEl) endHeadshotsEl.textContent = stats.headshots;
    updateTeamScoreHud();
    updateMatchHudVisibility();
    syncLobbyUI();
    playKill();
    setMenuTab('play');
  }
  function tickMatchClock(dt) {
    if (!startedOnce || paused || matchEnded) return;
    matchClock += dt;
    if (timeLimit > 0) {
      matchTimeLeft = Math.max(0, matchTimeLeft - dt);
      if (matchTimeLeft <= 0) checkMatchEnd();
    }
  }
  function updateDevState() {
    if (!devStateEl) return;
    var aliveB = 0, aliveR = 0;
    for (var di = 0; di < targets.length; di++) {
      if (targets[di].state === 'alive') {
        if (targets[di].team === 'blue') aliveB++; else aliveR++;
      }
    }
    var state = overlayMode === 'end' ? 'Maç sonu' : (startedOnce ? (paused ? 'Duraklatıldı' : 'Maçta') : 'Lobi');
    devStateEl.textContent = 'Harita: ' + (currentMap ? currentMap.name : '-') + '\n' +
      'Takım: ' + (player.team === 'blue' ? 'Mavi' : 'Kırmızı') + '\n' +
      'Silah: ' + currentWeapon().name + '\n' +
      'Durum: ' + state + '\n' +
      'Skor: ' + matchScore.blue + ' : ' + matchScore.red + ' · ' + (killLimit > 0 ? killLimit + ' hedef' : 'sınırsız') + '\n' +
      'Canlı bot: ' + aliveB + ' mavi / ' + aliveR + ' kırmızı\n' +
      'Konsol: ' + (devConsoleEnabled ? 'etkin' : 'kapalı') + ' · FPS: ' + (typeof fpsVal === 'number' ? fpsVal.toFixed(0) : '-');
    if (devStateLabelEl) devStateLabelEl.textContent = state.toUpperCase();
  }
  function beginPlay() { if (!startedOnce) startMatch(); else resumeGame(); }
  function openMenu() {
    if (consoleOpen) return;
    if (overlayEl.style.display === 'flex') return;
    showOverlay(startedOnce ? 'pause' : 'lobby');
  }
  if (playEl) playEl.addEventListener('click', function () { initAudio(); startMatch(); });
  if (resumeEl) resumeEl.addEventListener('click', function () { initAudio(); resumeGame(); });
  if (toLobbyEl) toLobbyEl.addEventListener('click', function () { initAudio(); toLobby(); });
  if (rematchEl) rematchEl.addEventListener('click', function () { initAudio(); startMatch(); });
  if (endLobbyEl) endLobbyEl.addEventListener('click', function () { initAudio(); toLobby(); });
  if (openConsoleEl) openConsoleEl.addEventListener('click', function () {
    initAudio();
    if (!devConsoleEnabled) { syncToggles(); return; }
    setMenuTab('dev');
    dcOpen();
  });

  function requestLock() {
    if (dragFallback) return;
    try {
      var p = renderer.domElement.requestPointerLock ? renderer.domElement.requestPointerLock() : null;
      if (p && p.catch) p.catch(function () { enableDragFallback(); });
    } catch (e2) { enableDragFallback(); }
  }
  function enableDragFallback() {
    if (!startedOnce) return;
    dragFallback = true;
    paused = false;
    overlayEl.style.display = 'none';
    overlayMode = 'playing';
  }
  renderer.domElement.addEventListener('click', function () {
    if (!locked && !paused && !consoleOpen) { initAudio(); requestLock(); }
  });
  document.addEventListener('pointerlockerror', function () { if (!paused) enableDragFallback(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  renderer.domElement.addEventListener('mousedown', function (e) {
    if (consoleOpen) return;
    initAudio();
    if (e.button === 1) { e.preventDefault(); return; }
    if (paused) return;
    if (e.button === 0) { triggerHeld = true; triggerQueued = true; }
    else if (e.button === 2) {
      if (locked) cycleScope();
      else { dragging = true; dragMoved = 0; }
    }
  });
  window.addEventListener('mouseup', function (e) {
    if (e.button === 0) triggerHeld = false;
    if (e.button === 2) {
      if (dragging && !locked && dragMoved < 6) cycleScope();
      dragging = false;
    }
  });
  window.addEventListener('blur', function () {
    triggerHeld = false; dragging = false;
    for (var kb in keys) keys[kb] = false;
  });

  document.addEventListener('pointerlockchange', function () {
    locked = document.pointerLockElement === renderer.domElement;
    if (locked) {
      if (startedOnce) {
        paused = false;
        overlayEl.style.display = 'none';
        overlayMode = 'playing';
      }
    } else if (!dragFallback && !consoleOpen && overlayEl.style.display !== 'flex') {
      openMenu();
    }
  });
  document.addEventListener('mousemove', function (e) {
    if (dragging) dragMoved += Math.abs(e.movementX) + Math.abs(e.movementY);
    if (paused || consoleOpen) return;
    if (!locked && !(dragFallback && dragging)) return;
    var zoomFactor = camera.fov / baseFov;          // dürbün seviyesine göre hassasiyet
    var s = 0.0022 * sens * Math.max(0.12, zoomFactor);
    player.yaw -= e.movementX * s;
    player.pitch -= e.movementY * s;
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch));
    // silah sallanması (sway)
    swayX = Math.max(-0.03, Math.min(0.03, swayX + e.movementX * 0.00045));
    swayY = Math.max(-0.025, Math.min(0.025, swayY + e.movementY * 0.0004));
  });

  sensEl.addEventListener('input', function () {
    sens = Math.max(0.2, Math.min(3, parseFloat(sensEl.value) || 1));
    syncSettingLabels(); persistSettings();
  });
  if (volEl) volEl.addEventListener('input', function () {
    vol = Math.max(0, Math.min(1, parseFloat(volEl.value)));
    if (masterGain) masterGain.gain.value = vol;
    syncSettingLabels(); persistSettings();
  });
  if (fovEl) fovEl.addEventListener('input', function () {
    baseFov = parseInt(fovEl.value, 10) || 90;
    applySettings();
    syncSettingLabels(); persistSettings();
  });
  if (brightEl) brightEl.addEventListener('input', function () {
    brightness = Math.max(0.6, Math.min(1.8, parseFloat(brightEl.value) || 1));
    applySettings();
    syncSettingLabels(); persistSettings();
  });
  function onChInput() {
    if (chColorEl) chCfg.color = chColorEl.value || '#4dff88';
    if (chSizeEl) chCfg.size = Math.max(2, Math.min(14, parseInt(chSizeEl.value, 10) || 7));
    if (chThickEl) chCfg.thickness = Math.max(1, Math.min(5, parseInt(chThickEl.value, 10) || 2));
    if (chGapEl) chCfg.gap = Math.max(0, Math.min(12, parseInt(chGapEl.value, 10) || 4));
    if (chDotCfgEl) chCfg.dot = chDotCfgEl.checked ? 1 : 0;
    if (chDynEl) chCfg.dynamic = chDynEl.checked ? 1 : 0;
    applyCrosshair();
    syncCrosshairUI();
    persistSettings();
  }
  if (chColorEl) chColorEl.addEventListener('input', onChInput);
  if (chSizeEl) chSizeEl.addEventListener('input', onChInput);
  if (chThickEl) chThickEl.addEventListener('input', onChInput);
  if (chGapEl) chGapEl.addEventListener('input', onChInput);
  if (chDotCfgEl) chDotCfgEl.addEventListener('change', onChInput);
  if (chDynEl) chDynEl.addEventListener('change', onChInput);

  /* ================= GELİŞTİRİCİ KONSOLU ================= */
  var dcEl = document.getElementById('devpanel');
  var dcOutEl = document.getElementById('dcOut');
  var dcInEl = document.getElementById('dcIn');
  var dcHistory = [], dcHistIdx = -1;
  function dcLog(text, cls) {
    if (!dcOutEl) return;
    var row = document.createElement('div');
    row.className = 'dcline' + (cls ? ' ' + cls : '');
    row.textContent = text;
    dcOutEl.appendChild(row);
    while (dcOutEl.children.length > 240) dcOutEl.removeChild(dcOutEl.firstChild);
    dcOutEl.scrollTop = dcOutEl.scrollHeight;
  }
  function dcHelp() {
    dcLog('— KOMUTLAR —', 'ok');
    dcLog('sens <0.2-3>                 fare hassasiyeti');
    dcLog('brightness <0.6-1.8>         ekran parlaklığı');
    dcLog('volume <0-1> · fov <60-120>  ses ve görüş açısı');
    dcLog('crosshair color <#hex> · size 2-14 · thickness 1-5 · gap 0-12');
    dcLog('crosshair dot 0/1 · dynamic 0/1 · reset');
    dcLog('map dust2 | redline | lego2 | village');
    dcLog('bots blue|red <0-15> · team blue|red');
    dcLog('difficulty easy|normal|hard · killlimit 15/30/50/0 · timelimit 5/10/15/0');
    dcLog('god 0/1 · infammo 0/1 · noclip 0/1 · spawnprotect <sn>');
    dcLog('respawn · heal · kill · tp <x> <z> · scope 0|1|2 · stats');
    dcLog('give (cephane+bomba doldur)');
    dcLog('clear · exit (konsolu kapat)', 'dim');
  }
  function dcOpen() {
    if (!devConsoleEnabled || consoleOpen) return;
    consoleOpen = true;
    consolePrevPaused = paused;
    paused = true;
    triggerHeld = false; triggerQueued = false;
    for (var kk3 in keys) keys[kk3] = false;
    if (dcEl) dcEl.style.display = 'flex';
    dcLog('Geliştirici konsolu açıldı. Komut listesi: help', 'ok');
    dcLog('Örnek: sens 1.2 · brightness 1.1 · crosshair color #00ff66 · map redline · bots blue 8 · team red · god 1 · tp 0 0', 'dim');
    if (dcInEl) {
      dcInEl.value = '';
      setTimeout(function () { try { dcInEl.focus(); } catch (e3) {} }, 20);
    }
  }
  function dcClose() {
    if (!consoleOpen) return;
    consoleOpen = false;
    if (dcEl) dcEl.style.display = 'none';
    paused = consolePrevPaused;
    if (dcInEl) dcInEl.blur();
  }
  function dcBool(v, cur) {
    if (v === undefined) return !cur;
    v = String(v).toLowerCase();
    return v === '1' || v === 'true' || v === 'on' || v === 'evet' || v === 'açık' || v === 'acik';
  }
  function dcNum(v, def) { var n = parseFloat(v); return isFinite(n) ? n : def; }
  function runCommand(raw) {
    var line = String(raw || '').trim();
    if (!line) return;
    dcLog('> ' + line, 'cmd');
    var p = line.split(/\s+/), c = p[0].toLowerCase(), a = p.slice(1);
    switch (c) {
      case 'help': case '?': dcHelp(); break;
      case 'clear': if (dcOutEl) dcOutEl.innerHTML = ''; break;
      case 'exit': case 'quit': case 'close': dcClose(); break;
      case 'sens': {
        var s2 = dcNum(a[0], sens);
        sens = Math.max(0.2, Math.min(3, s2));
        syncSettingLabels(); persistSettings();
        dcLog('sens = ' + sens.toFixed(2), 'ok'); break;
      }
      case 'brightness': case 'parlaklik': {
        brightness = Math.max(0.6, Math.min(1.8, dcNum(a[0], brightness)));
        applySettings(); syncSettingLabels(); persistSettings();
        dcLog('brightness = ' + brightness.toFixed(2), 'ok'); break;
      }
      case 'volume': case 'vol': {
        vol = Math.max(0, Math.min(1, dcNum(a[0], vol)));
        if (masterGain) masterGain.gain.value = vol;
        syncSettingLabels(); persistSettings();
        dcLog('volume = ' + Math.round(vol * 100) + '%', 'ok'); break;
      }
      case 'fov': {
        baseFov = Math.max(60, Math.min(120, Math.round(dcNum(a[0], baseFov))));
        applySettings(); syncSettingLabels(); persistSettings();
        dcLog('fov = ' + baseFov, 'ok'); break;
      }
      case 'crosshair': case 'ch': {
        var sub = (a[0] || 'show').toLowerCase();
        if (sub === 'color' || sub === 'renk') {
          var col = a[1] || '#4dff88';
          if (!/^#[0-9a-f]{6}$/i.test(col)) { dcLog('Geçerli renk: #00ff66 gibi 6 haneli hex.', 'err'); break; }
          chCfg.color = col;
        } else if (sub === 'size' || sub === 'boyut') {
          chCfg.size = Math.max(2, Math.min(14, Math.round(dcNum(a[1], chCfg.size))));
        } else if (sub === 'thickness' || sub === 'thick' || sub === 'kalınlık') {
          chCfg.thickness = Math.max(1, Math.min(5, Math.round(dcNum(a[1], chCfg.thickness))));
        } else if (sub === 'gap' || sub === 'boşluk') {
          chCfg.gap = Math.max(0, Math.min(12, Math.round(dcNum(a[1], chCfg.gap))));
        } else if (sub === 'dot' || sub === 'nokta') {
          chCfg.dot = dcBool(a[1], !!chCfg.dot) ? 1 : 0;
        } else if (sub === 'dynamic' || sub === 'dinamik') {
          chCfg.dynamic = dcBool(a[1], !!chCfg.dynamic) ? 1 : 0;
        } else if (sub === 'reset' || sub === 'sifirla') {
          chCfg = { color: '#4dff88', size: 7, thickness: 2, gap: 4, dot: 0, dynamic: 1 };
        } else if (sub !== 'show') {
          dcLog('crosshair color|size|thickness|gap|dot|dynamic|reset', 'err'); break;
        }
        applyCrosshair(); syncCrosshairUI(); persistSettings();
        dcLog('crosshair: ' + chCfg.color + ' · size ' + chCfg.size + ' · thick ' + chCfg.thickness +
          ' · gap ' + chCfg.gap + ' · dot ' + chCfg.dot + ' · dynamic ' + chCfg.dynamic, 'ok');
        break;
      }
      case 'map': {
        var id2 = (a[0] || '').toLowerCase();
        if (!MAP_DEFS[id2]) { dcLog('Haritalar: dust2, redline, lego2, village', 'err'); break; }
        selectMap(id2, true);
        dcLog('Harita yüklendi: ' + currentMap.name + (startedOnce ? ' — botlar yeniden doğdu.' : ''), 'ok');
        break;
      }
      case 'bots': case 'bot': {
        var team2 = (a[0] || '').toLowerCase();
        var n2 = parseInt(a[1], 10);
        if ((team2 !== 'blue' && team2 !== 'red') || !isFinite(n2)) {
          dcLog('Kullanım: bots blue|red <0-15>  (senin takımında en fazla 14)', 'err'); break;
        }
        setBotCounts(team2, n2);
        dcLog(team2 + ' bot sayısı = ' + matchBots[team2] + (startedOnce ? ' (yeniden doğdular)' : ''), 'ok');
        break;
      }
      case 'team': case 'takim': {
        var tm = (a[0] || '').toLowerCase();
        if (tm !== 'blue' && tm !== 'red') { dcLog('Kullanım: team blue|red', 'err'); break; }
        setTeam(tm);
        dcLog('Takım: ' + (tm === 'blue' ? 'MAVİ' : 'KIRMIZI'), 'ok');
        break;
      }
      case 'god': case 'tanri': {
        godMode = dcBool(a[0], godMode);
        syncToggles(); persistSettings();
        dcLog('god = ' + (godMode ? 'açık' : 'kapalı'), 'ok'); break;
      }
      case 'inf': case 'infammo': case 'sınırsız': {
        infAmmo = dcBool(a[0], infAmmo);
        syncToggles(); persistSettings();
        dcLog('infammo = ' + (infAmmo ? 'açık' : 'kapalı'), 'ok'); break;
      }
      case 'respawn': case 'dog': {
        respawn();
        dcLog('Yeniden doğdun: ' + teamSpawnDef(player.team).name, 'ok'); break;
      }
      case 'heal': case 'can': {
        player.hp = 100; player.armor = 100;
        updateHudHealth();
        dcLog('Can ve zırh yenilendi.', 'ok'); break;
      }
      case 'give': case 'cephane': {
        for (var wi2 = 0; wi2 < WEAPONS.length; wi2++) {
          ammo[wi2] = WEAPONS[wi2].magSize;
          reserve[wi2] = WEAPONS[wi2].reserveMax;
        }
        nades.smoke = 1; nades.flash = 2; nades.he = 1;
        updateHudAmmo(); updateHudNades();
        dcLog('Cephane ve bombalar yenilendi.', 'ok'); break;
      }
      case 'kill': case 'oldur': {
        player.hp = 0; playerDie();
        dcLog('Öldürüldün. 10 saniye içinde yeniden doğacaksın.', 'ok'); break;
      }
      case 'tp': case 'isik': {
        var tx2 = dcNum(a[0], NaN), tz2 = dcNum(a[1], NaN);
        if (!isFinite(tx2) || !isFinite(tz2)) { dcLog('Kullanım: tp <x> <z>', 'err'); break; }
        player.x = tx2; player.z = tz2; player.y = 0; player.vx = player.vz = 0;
        dcLog('Işınlandın: ' + tx2.toFixed(1) + ', ' + tz2.toFixed(1) +
          (walkable(Math.floor(tx2), Math.floor(tz2)) ? '' : ' (dikkat: katı bölge)'), 'ok');
        break;
      }
      case 'noclip': case 'uc': {
        noclip = dcBool(a[0], noclip);
        dcLog('noclip = ' + (noclip ? 'açık' : 'kapalı'), 'ok'); break;
      }
      case 'scope': case 'zoom': {
        if (currentWeapon().id !== 'sniper') { dcLog('Dürbün sadece AWP için.', 'err'); break; }
        scopeLevel = Math.max(0, Math.min(2, Math.round(dcNum(a[0], 0))));
        applyScope();
        dcLog('scope = ' + scopeLevel + 'x', 'ok'); break;
      }
      case 'difficulty': case 'zorluk': {
        var dif = (a[0] || '').toLowerCase();
        if (!BOT_DIFF[dif]) { dcLog('Kullanım: difficulty easy|normal|hard', 'err'); break; }
        setDifficulty(dif);
        dcLog('Bot zorluğu = ' + DIFF_TR[dif] + (startedOnce ? ' (yeni davranış hemen geçerli)' : ''), 'ok');
        break;
      }
      case 'killlimit': case 'hedef': {
        var kl = parseInt(a[0], 10);
        if (kl !== 0 && kl !== 15 && kl !== 30 && kl !== 50) { dcLog('Kullanım: killlimit 15|30|50|0', 'err'); break; }
        setKillLimit(kl);
        dcLog('Öldürme hedefi = ' + (kl || 'sınırsız') + (startedOnce ? ' (skor sıfırlandı)' : ''), 'ok');
        break;
      }
      case 'timelimit': case 'süre': {
        var tl = parseInt(a[0], 10);
        if (tl !== 0 && tl !== 5 && tl !== 10 && tl !== 15) { dcLog('Kullanım: timelimit 5|10|15|0', 'err'); break; }
        setTimeLimit(tl);
        dcLog('Maç süresi = ' + (tl ? tl + ' dk' : 'sınırsız'), 'ok');
        break;
      }
      case 'endmatch': case 'bitir': {
        if (!startedOnce) { dcLog('Önce bir maç başlat.', 'err'); break; }
        dcClose();
        endMatch('Konsoldan bitirildi');
        break;
      }
      case 'spawnprotect': case 'koruma': {
        SPAWN_PROTECT = Math.max(0, Math.min(15, dcNum(a[0], SPAWN_PROTECT)));
        dcLog('Doğuş koruması = ' + SPAWN_PROTECT.toFixed(1) + ' sn', 'ok'); break;
      }
      case 'stats': case 'durum': {
        var aliveB = 0, aliveR = 0;
        for (var bi = 0; bi < targets.length; bi++) {
          if (targets[bi].state === 'alive') { if (targets[bi].team === 'blue') aliveB++; else aliveR++; }
        }
        dcLog('Harita: ' + (currentMap ? currentMap.name : '-') + ' · Takım: ' + player.team);
        dcLog('Can: ' + Math.round(player.hp) + ' · Zırh: ' + Math.round(player.armor) + ' · Koruma: ' +
          Math.max(0, player.protectUntil - performance.now() / 1000).toFixed(1) + ' sn', 'dim');
        dcLog('Bomba: sis ' + nades.smoke + ' · flaş ' + nades.flash + ' · HE ' + nades.he, 'dim');
        dcLog('Canlı botlar — mavi: ' + aliveB + ' · kırmızı: ' + aliveR + ' · FPS: ' + (typeof fpsVal === 'number' ? fpsVal.toFixed(0) : '-'), 'dim');
        break;
      }
      case 'start': case 'baslat': {
        if (!startedOnce) { dcClose(); startMatch(); } else dcLog('Maç zaten devam ediyor.', 'err');
        break;
      }
      default:
        dcLog('Bilinmeyen komut: "' + c + '". "help" yazabilirsin.', 'err');
    }
  }
  if (dcInEl) {
    dcInEl.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        var val = dcInEl.value;
        if (val.trim()) {
          dcHistory.push(val);
          if (dcHistory.length > 60) dcHistory.shift();
          dcHistIdx = -1;
          runCommand(val);
          dcInEl.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (dcHistory.length) {
          if (dcHistIdx < 0) dcHistIdx = dcHistory.length - 1;
          else dcHistIdx = Math.max(0, dcHistIdx - 1);
          dcInEl.value = dcHistory[dcHistIdx];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (dcHistIdx >= 0) {
          dcHistIdx = Math.min(dcHistory.length - 1, dcHistIdx + 1);
          dcInEl.value = dcHistory[dcHistIdx];
        }
      }
    });
  }
  if (dcEl) dcEl.addEventListener('mousedown', function (e) {
    if (e.target === dcEl && dcInEl) dcInEl.focus();
  });
  window.addEventListener('keydown', function (e) {
    if (!consoleOpen) return;
    if (e.key === 'Escape' || e.key === '"' || e.key === "'" || e.code === 'Quote' || e.code === 'Backquote') {
      e.preventDefault();
      e.stopImmediatePropagation();
      dcClose();
    }
  }, true);

  /* ================= ÇOK OYUNCULU (LAN · WebRTC eşler arası) ================= */
  var mpRole = null;               // 'host' | 'guest' | null (tek oyunculu)
  var mpName = null, mpPeerName = null;
  var mpPeer = null, mpChan = null, mpConnected = false;
  var mpRemote = null;             // karşı oyuncunun avatarı (targets içinde)
  var mpBotGhosts = {};            // botId -> hayalet bot (sadece konukta)
  var mpStateAcc = 0, mpWorldAcc = 0;
  var mpStatusEl = document.getElementById('mpStatus');
  var mpHostCodeEl = document.getElementById('mpHostCode');
  var mpAnswerCodeEl = document.getElementById('mpAnswerCode');
  var mpJoinCodeEl = document.getElementById('mpJoinCode');
  var mpJoinAnswerEl = document.getElementById('mpJoinAnswer');

  function mpSetStatus(txt, err) {
    if (mpStatusEl) {
      mpStatusEl.textContent = txt;
      mpStatusEl.style.color = err ? '#ff9c8a' : '';
    }
  }
  function mpSend(obj) {
    if (mpChan && mpChan.readyState === 'open') {
      try { mpChan.send(JSON.stringify(obj)); } catch (e) {}
    }
  }
  function mpCleanup() {
    if (mpPeer) { try { mpPeer.close(); } catch (e) {} }
    mpPeer = null; mpChan = null;
    mpConnected = false;
    var ct = targets.length;
    while (ct--) {
      var co = targets[ct];
      if (co.isRemote || co.isGhost) {
        scene.remove(co.group);
        if (co.flash) scene.remove(co.flash);
        co.group.traverse(function (x) { if (x.isMesh && x.geometry) x.geometry.dispose(); });
        if (co.bar && co.bar.tex) co.bar.tex.dispose();
        targets.splice(ct, 1);
      }
    }
    mpRemote = null;
    mpBotGhosts = {};
    mpRole = null;
  }
  function mpLeave() {
    if (mpConnected) mpSend({ t: 'bye' });
    mpCleanup();
    if (startedOnce && overlayMode === 'playing') toLobby();
    mpSetStatus('Ağdan ayrıldın. Tek oyunculu lobi kullanılabilir.');
  }
  function mpOnDisconnect(msg) {
    if (!mpRole) return;
    mpCleanup();
    if (startedOnce && overlayMode === 'playing') toLobby();
    mpSetStatus(msg || 'Ağ bağlantısı kesildi.');
  }
  function mpWireChannel(ch) {
    ch.onopen = function () {
      mpConnected = true;
      if (mpRole === 'host') {
        mpSend({ t: 'hello', map: selectedMapId, team: matchTeam,
          bots: { blue: matchBots.blue, red: matchBots.red },
          diff: botDifficulty, kill: killLimit, time: timeLimit, name: mpName });
        mpSetStatus('Rakip bağlandı. Maç başlatılıyor…');
      }
    };
    ch.onmessage = function (ev) {
      var m = null;
      try { m = JSON.parse(ev.data); } catch (e2) { return; }
      mpOnMessage(m);
    };
    ch.onclose = function () { mpOnDisconnect('Bağlantı kapandı.'); };
  }
  function mpCreateHost() {
    if (mpRole) mpCleanup();
    if (typeof RTCPeerConnection === 'undefined') { mpSetStatus('Tarayıcın WebRTC desteklemiyor.', true); return; }
    mpRole = 'host';
    mpName = 'ANA MAKİNE';
    mpSetStatus('Davet kodu hazırlanıyor…');
    try { mpPeer = new RTCPeerConnection({ iceServers: [] }); }
    catch (e3) { mpSetStatus('WebRTC başlatılamadı: ' + e3.message, true); mpRole = null; return; }
    mpChan = mpPeer.createDataChannel('d2arena', { ordered: true });
    mpWireChannel(mpChan);
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      var code = btoa(JSON.stringify({ sdp: mpPeer.localDescription }));
      if (mpHostCodeEl) mpHostCodeEl.value = code;
      mpSetStatus('Davet kodu hazır. Bu kodu aynı ağdaki arkadaşına gönder; onun cevap kodunu alttaki kutuya yapıştır.');
    };
    mpPeer.onicecandidate = function (e) { if (!e.candidate) setTimeout(finish, 400); };
    mpPeer.onicegatheringstatechange = function () { if (mpPeer.iceGatheringState === 'complete') finish(); };
    mpPeer.onconnectionstatechange = function () {
      if (mpPeer && mpPeer.connectionState === 'failed' && !mpConnected) {
        mpSetStatus('Bağlantı kurulamadı. İki cihaz da aynı yerel ağda olmalı.', true);
      }
    };
    mpPeer.createOffer().then(function (o) { return mpPeer.setLocalDescription(o); })
      .catch(function (e4) { mpSetStatus('Davet kodu oluşturulamadı: ' + e4.message, true); });
  }
  function mpJoinFromCode() {
    var raw = (mpJoinCodeEl ? mpJoinCodeEl.value : '').trim();
    var offer = null;
    try { offer = JSON.parse(atob(raw)); } catch (e5) {}
    if (!offer || !offer.sdp) { mpSetStatus('Davet kodu geçersiz. Kodu eksiksiz yapıştır.', true); return; }
    if (mpRole) mpCleanup();
    mpRole = 'guest';
    mpName = 'KATILIMCI';
    mpSetStatus('Bağlanılıyor, cevap kodu hazırlanıyor…');
    mpPeer = new RTCPeerConnection({ iceServers: [] });
    mpPeer.ondatachannel = function (e) { mpChan = e.channel; mpWireChannel(mpChan); };
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      var code = btoa(JSON.stringify({ sdp: mpPeer.localDescription }));
      if (mpJoinAnswerEl) mpJoinAnswerEl.value = code;
      mpSetStatus('Cevap kodu hazır. Bu kodu ana makineye gönder — maç otomatik başlayacak.');
    };
    mpPeer.onicecandidate = function (e) { if (!e.candidate) setTimeout(finish, 400); };
    mpPeer.onicegatheringstatechange = function () { if (mpPeer.iceGatheringState === 'complete') finish(); };
    mpPeer.onconnectionstatechange = function () {
      if (mpPeer && mpPeer.connectionState === 'connected') mpSetStatus('Bağlandı! Ana makine maçı başlatacak…');
      if (mpPeer && mpPeer.connectionState === 'failed' && !mpConnected) {
        mpSetStatus('Bağlantı kurulamadı. Aynı ağda olduğunuzdan emin ol.', true);
      }
    };
    mpPeer.setRemoteDescription(offer.sdp).then(function () {
      return mpPeer.createAnswer();
    }).then(function (a) {
      return mpPeer.setLocalDescription(a);
    }).catch(function (e6) { mpSetStatus('Katılım hatası: ' + e6.message, true); });
  }
  function mpAcceptAnswer() {
    var raw = (mpAnswerCodeEl ? mpAnswerCodeEl.value : '').trim();
    var ans = null;
    try { ans = JSON.parse(atob(raw)); } catch (e7) {}
    if (!mpPeer || mpRole !== 'host') { mpSetStatus('Önce davet kodu oluştur.', true); return; }
    if (!ans || !ans.sdp) { mpSetStatus('Cevap kodu geçersiz.', true); return; }
    mpSetStatus('Cevap alındı, bağlanılıyor…');
    mpPeer.setRemoteDescription(ans.sdp).catch(function (e8) { mpSetStatus('Bağlantı hatası: ' + e8.message, true); });
  }
  function mpSpawnRemote() {
    var opp = player.team === 'blue' ? 'red' : 'blue';
    var sp = teamSpawnDef(opp);
    var bot = makeNPC([[sp.x, sp.z]], 1.6, opp);
    bot.isRemote = true;
    bot.id = 'remote';
    bot.name = mpPeerName || 'RAKİP';
    bot.nx = sp.x; bot.nz = sp.z; bot.nyaw = sp.yaw || 0;
    bot.spawnPos = { x: sp.x, z: sp.z };
    bot.spawnYaw = sp.yaw || 0;
    bot.netCrouch = 0; bot.netPitch = 0;
    bot.hp = 100; bot.armor = 100;
    mpRemote = bot;
    drawBotBar(bot);
  }
  function mpSpawnNetEntities() {
    if (mpRole === 'host') {
      spawnBotsForMatch();     // clearBots + iki takımın botları
      mpSpawnRemote();
    } else {
      clearBots();
      mpBotGhosts = {};
      mpSpawnRemote();
    }
    rebuildHittables();
  }
  function mpStartNetMatch() {
    if (startedOnce && overlayMode === 'playing') return;
    startMatch();
  }
  function mpMakeGhost(b) {
    var sp = teamSpawnDef(b.tm);
    var gh = makeNPC([[b.x, b.z]], 1.6, b.tm);
    gh.isGhost = true;
    gh.id = b.id;
    gh.name = b.nm || gh.name;
    gh.nx = b.x; gh.nz = b.z; gh.nyaw = b.ya || 0;
    gh.spawnPos = { x: sp.x, z: sp.z };
    gh.spawnYaw = sp.yaw || 0;
    gh.hp = b.hp; gh.armor = b.ar;
    gh.netFiring = false;
    drawBotBar(gh);
    return gh;
  }
  function mpGhostApply(gh, b) {
    gh.nx = b.x; gh.nz = b.z; gh.nyaw = b.ya || 0;
    gh.hp = b.hp; gh.armor = b.ar;
    if (b.st !== gh.state) {
      var nowS = performance.now() / 1000;
      if (b.st === 'falling') { gh.state = 'falling'; gh.fallT = 0; }
      else if (b.st === 'down') { gh.state = 'down'; gh.downUntil = nowS + 9.35; }
      else if (b.st === 'rising') { gh.state = 'rising'; }
      else {
        gh.state = 'alive'; gh.fallT = 0; gh.dead = false;
        gh.group.rotation.x = 0;
        gh.group.position.set(b.x, 0, b.z);
        gh.group.rotation.y = b.ya || 0;
      }
    }
    if (b.fl) {
      if (!gh.netFiring) {
        gh.netFiring = true;
        gh.recoil = 1; gh.flashT = 0.06;
        var mzg = botMuzzle(gh);
        if (gh.flash) { gh.flash.position.set(mzg.x, mzg.y, mzg.z); gh.flash.visible = true; }
        var pdg = Math.sqrt(Math.pow(mzg.x - player.x, 2) + Math.pow(mzg.z - player.z, 2));
        playShot('rifle', Math.max(0.04, Math.min(1, 1 - pdg / 55)));
      }
    } else gh.netFiring = false;
    drawBotBar(gh);
  }
  function mpRemoteUpdate(p) {
    if (!mpRemote) return;
    mpRemote.nx = p.x; mpRemote.nz = p.z; mpRemote.nyaw = p.ya;
    mpRemote.netCrouch = p.c || 0;
    mpRemote.netPitch = p.pi || 0;
    mpRemote.hp = p.hp; mpRemote.armor = p.ar;
    var alive = mpRemote.state === 'alive';
    if (p.hp <= 0) {
      if (alive) { mpRemote.state = 'falling'; mpRemote.fallT = 0; }
    } else if (!alive) {
      mpRemote.state = 'alive'; mpRemote.fallT = 0; mpRemote.dead = false;
      mpRemote.group.rotation.x = 0;
      mpRemote.group.position.set(p.x, 0, p.z);
      mpRemote.group.rotation.y = p.ya;
    }
    drawBotBar(mpRemote);
  }
  function mpWorldUpdate(m) {
    mpRemoteUpdate(m.p);
    var seen = {};
    for (var gi = 0; gi < m.bots.length; gi++) {
      var b = m.bots[gi];
      seen[b.id] = 1;
      var gh = mpBotGhosts[b.id];
      if (!gh) { gh = mpMakeGhost(b); mpBotGhosts[b.id] = gh; }
      mpGhostApply(gh, b);
    }
    for (var gid in mpBotGhosts) {
      if (!seen[gid]) {
        var rm = mpBotGhosts[gid];
        scene.remove(rm.group);
        if (rm.flash) scene.remove(rm.flash);
        rm.group.traverse(function (o) { if (o.isMesh && o.geometry) o.geometry.dispose(); });
        if (rm.bar && rm.bar.tex) rm.bar.tex.dispose();
        var idx = targets.indexOf(rm);
        if (idx >= 0) targets.splice(idx, 1);
        delete mpBotGhosts[gid];
      }
    }
    if (m.sc) {
      matchScore.blue = m.sc.blue; matchScore.red = m.sc.red;
      updateTeamScoreHud();
    }
    if (typeof m.tl === 'number' && m.tl > 0) matchTimeLeft = m.tl;
  }
  function mpNetTick(dt) {
    if (!mpConnected || !mpRole || !startedOnce || matchEnded) return;
    if (mpRole === 'guest') {
      mpStateAcc += dt;
      if (mpStateAcc < 0.05) return;
      mpStateAcc = 0;
      mpSend({ t: 'st', x: +player.x.toFixed(2), y: +player.y.toFixed(2), z: +player.z.toFixed(2),
        ya: +player.yaw.toFixed(3), pi: +player.pitch.toFixed(3), c: +player.crouch.toFixed(2),
        hp: Math.round(player.hp), ar: Math.round(player.armor), w: curW, g: scopeLevel });
    } else {
      mpWorldAcc += dt;
      if (mpWorldAcc < 0.085) return;
      mpWorldAcc = 0;
      var bots = [];
      for (var wi = 0; wi < targets.length; wi++) {
        var wb = targets[wi];
        if (wb.isRemote || wb.isGhost) continue;
        bots.push({ id: wb.id, tm: wb.team, nm: wb.name,
          x: +wb.group.position.x.toFixed(2), z: +wb.group.position.z.toFixed(2),
          ya: +wb.group.rotation.y.toFixed(3), st: wb.state,
          hp: Math.round(wb.hp), ar: Math.round(wb.armor), fl: wb.flashT > 0 ? 1 : 0 });
      }
      mpSend({ t: 'wd', bots: bots,
        p: { x: +player.x.toFixed(2), y: +player.y.toFixed(2), z: +player.z.toFixed(2),
          ya: +player.yaw.toFixed(3), pi: +player.pitch.toFixed(3), c: +player.crouch.toFixed(2),
          hp: Math.round(player.hp), ar: Math.round(player.armor), w: curW, g: scopeLevel },
        sc: { blue: matchScore.blue, red: matchScore.red },
        tl: timeLimit > 0 ? +matchTimeLeft.toFixed(1) : 0 });
    }
  }
  function mpOnMessage(m) {
    if (m.t === 'hello') {
      selectedMapId = m.map || 'dust2';
      matchTeam = m.team === 'blue' ? 'red' : 'blue';
      matchBots.blue = m.bots.blue || 0;
      matchBots.red = m.bots.red || 0;
      botDifficulty = m.diff || 'normal';
      killLimit = m.kill || 0;
      timeLimit = m.time || 0;
      mpPeerName = m.name || 'RAKİP';
      mpSetStatus('Ayarlar alındı (harita: ' + (m.map || 'dust2') + ', takım: ' + (matchTeam === 'blue' ? 'mavi' : 'kırmızı') + '). Ana makine bekleniyor…');
      syncLobbyUI(); syncSettingLabels();
      mpSend({ t: 'ready', name: mpName });
      return;
    }
    if (m.t === 'ready') {
      mpPeerName = m.name || 'RAKİP';
      var oppT = matchTeam === 'blue' ? 'red' : 'blue';
      if (matchBots[oppT] > 0) matchBots[oppT]--;
      mpSetStatus('Rakip hazır: ' + mpPeerName + '. Maç başlıyor…');
      mpSend({ t: 'start', bots: { blue: matchBots.blue, red: matchBots.red } });
      mpStartNetMatch();
      return;
    }
    if (m.t === 'start') {
      if (m.bots) { matchBots.blue = m.bots.blue; matchBots.red = m.bots.red; }
      mpStartNetMatch();
      return;
    }
    if (m.t === 'st') { mpRemoteUpdate(m); return; }
    if (m.t === 'wd') { mpWorldUpdate(m); return; }
    if (m.t === 'pf') {
      var mz = new THREE.Vector3(m.x, m.y, m.z);
      var d2 = new THREE.Vector3(m.dx, m.dy, m.dz);
      spawnTracer(mz, mz.clone().addScaledVector(d2, 60));
      var pd2 = Math.sqrt(Math.pow(m.x - player.x, 2) + Math.pow(m.y - (player.y + 1.5), 2) + Math.pow(m.z - player.z, 2));
      playShot(m.w, Math.max(0.05, Math.min(1, 1 - pd2 / 55)));
      if (mpRemote) {
        mpRemote.recoil = 1; mpRemote.flashT = 0.06;
        if (mpRemote.flash) { mpRemote.flash.position.set(m.x, m.y, m.z); mpRemote.flash.visible = true; }
      }
      return;
    }
    if (m.t === 'pd') {
      var wasAlive = player.hp > 0;
      hurtPlayer(m.dmg, m.head);
      if (wasAlive && player.hp <= 0) {
        addKillFeed(m.k, 'SEN', m.kt, player.team, m.head, true);
        if (mpRole === 'host') addTeamScore(m.kt, 1);
        mpSend({ t: 'dk', k: m.k, head: m.head, kt: m.kt });
      }
      return;
    }
    if (m.t === 'dk') {
      var iAmKiller = (m.k === mpName);
      var oppT2 = mpRemote ? mpRemote.team : (player.team === 'blue' ? 'red' : 'blue');
      if (mpRole === 'host' && !iAmKiller) addTeamScore(m.kt, 1);
      addKillFeed(iAmKiller ? 'SEN' : m.k, mpPeerName, m.kt, oppT2, m.head, iAmKiller);
      if (iAmKiller) {
        stats.kills++; if (m.head) stats.headshots++;
        playKill(); showHitmarker(m.head, true); updateHudScore();
      }
      return;
    }
    if (m.t === 'bd') {
      if (mpRole !== 'host') return;
      var bt = null;
      for (var bqi = 0; bqi < targets.length; bqi++) {
        if (targets[bqi].id === m.id && !targets[bqi].isRemote) { bt = targets[bqi]; break; }
      }
      if (bt && bt.state === 'alive') {
        damageTarget(bt, m.dmg, m.head, false, mpRemote ? mpRemote.team : null, mpPeerName);
        mpSend({ t: 'ba', id: m.id, killed: bt.state !== 'alive' ? 1 : 0, head: m.head });
      }
      return;
    }
    if (m.t === 'ba') {
      if (m.killed) {
        var gh2 = mpBotGhosts[m.id];
        addKillFeed('SEN', gh2 ? gh2.name : 'BOT', player.team, gh2 ? gh2.team : (player.team === 'blue' ? 'red' : 'blue'), m.head, true);
        stats.kills++; if (m.head) stats.headshots++;
        playKill(); showHitmarker(m.head, true); updateHudScore();
      } else {
        playDink(m.head); showHitmarker(m.head, false);
      }
      return;
    }
    if (m.t === 'gn') {
      if (!startedOnce) return;
      var colsG = { smoke: 0x3b4449, flash: 0x9aa4ab, he: 0x59623e };
      var meshG = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8),
        new THREE.MeshLambertMaterial({ color: colsG[m.ty] || 0x3b4449 }));
      meshG.userData.noHit = true;
      meshG.position.set(m.x, m.y, m.z);
      scene.add(meshG);
      grenades.push({ mesh: meshG, type: m.ty, team: m.kt, vel: new THREE.Vector3(m.vx, m.vy, m.vz), fuse: 1.15 });
      playThrow();
      return;
    }
    if (m.t === 'end') {
      matchScore.blue = m.sc.blue; matchScore.red = m.sc.red;
      endMatch('Ana makine bitirdi: ' + m.r);
      return;
    }
    if (m.t === 'bye') { mpOnDisconnect('Rakip ağdan ayrıldı.'); return; }
  }
  (function () {
    var hb = document.getElementById('mpHost');
    var ab = document.getElementById('mpAccept');
    var jb = document.getElementById('mpJoin');
    var lb = document.getElementById('mpLeave');
    var lb2 = document.getElementById('mpLeave2');
    if (hb) hb.addEventListener('click', mpCreateHost);
    if (ab) ab.addEventListener('click', mpAcceptAnswer);
    if (jb) jb.addEventListener('click', mpJoinFromCode);
    if (lb) lb.addEventListener('click', mpLeave);
    if (lb2) lb2.addEventListener('click', mpLeave);
  })();

  // --- oyun sırasında tarayıcı kısayollarını/scroll'u engelle ---
  window.addEventListener('keydown', function (e) {
    if (consoleOpen) return;
    var tag = (e.target && e.target.tagName) ? e.target.tagName : '';
    if (devConsoleEnabled && (e.key === '"' || e.key === "'" || e.code === 'Quote' || e.code === 'Backquote') &&
        tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      e.preventDefault();
      e.stopPropagation();
      openDevConsole();
      return;
    }
    var k = e.key.toLowerCase();
    initAudio();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (paused) {
      if (k === ' ' || k === 'tab') e.preventDefault();
      return;
    }
    var combo = e.ctrlKey || e.metaKey || e.altKey;
    var devKey = k === 'f12' || (combo && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'));
    if (!devKey) e.preventDefault();
    keys[k] = true;
    if (k === '1') switchWeapon(0);
    if (k === '2') switchWeapon(1);
    if (k === '3') switchWeapon(2);
    if (k === '4') switchWeapon(3);
    if (k === '5') switchWeapon(4);
    if (k === 'r') startReload();
    if (k === 'g') throwSmoke();
    if (k === 'f') throwFlash();
    if (k === 'h') throwHE();
    if (k === 'escape') openMenu();
  });
  function openDevConsole() { dcOpen(); }
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
  window.addEventListener('beforeunload', function (e) {
    if (leaveGuard && startedOnce && !paused) {
      e.preventDefault();
      e.returnValue = 'Maç devam ediyor. Sayfadan ayrılmak istediğine emin misin?';
      return e.returnValue;
    }
  });

  window.addEventListener('wheel', function (e) { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  window.addEventListener('dragstart', function (e) { e.preventDefault(); });
  window.addEventListener('selectstart', function (e) { e.preventDefault(); });
  window.addEventListener('auxclick', function (e) { e.preventDefault(); });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ================= GÜNCELLEME ================= */
  function updatePlayer(dt) {
    var wasX = player.x, wasZ = player.z;
    var dead = player.hp <= 0;
    var crTarget = (!paused && !dead && keys['control']) ? 1 : 0;
    player.crouch += (crTarget - player.crouch) * Math.min(1, dt * (crTarget ? 10 : 8));
    if (player.crouch < 0.002) player.crouch = 0;
    var f = (!paused && !dead && (keys['w'] || keys['arrowup']) ? 1 : 0) - (!paused && !dead && (keys['s'] || keys['arrowdown']) ? 1 : 0);
    var s = (!paused && !dead && (keys['d'] || keys['arrowright']) ? 1 : 0) - (!paused && !dead && (keys['a'] || keys['arrowleft']) ? 1 : 0);
    var speed = (keys['shift'] ? WALK : RUN) * (1 - player.crouch * 0.62);
    var wx = 0, wz = 0;
    var len = Math.sqrt(f * f + s * s);
    if (len > 0) {
      f /= len; s /= len;
      var sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
      wx = (-sy * f + cy * s) * speed;
      wz = (-cy * f - sy * s) * speed;
    }
    var acc = player.grounded ? 1 - Math.exp(-16 * dt) : 1 - Math.exp(-4 * dt);
    player.vx += (wx - player.vx) * acc;
    player.vz += (wz - player.vz) * acc;

    var nx = player.x + player.vx * dt;
    if (noclip || (!circleHitsWall(nx, player.z) && !hitsProp(nx, player.z, player.y))) player.x = nx;
    else player.vx *= 0.2;
    var nz = player.z + player.vz * dt;
    if (noclip || (!circleHitsWall(player.x, nz) && !hitsProp(player.x, nz, player.y))) player.z = nz;
    else player.vz *= 0.2;

    var g0 = groundHeight(player.x, player.z, player.y);
    if (g0 > player.y && g0 - player.y <= STEP + 0.01) player.y = g0;

    if (!paused && !dead && keys[' '] && player.grounded) { player.vy = JUMP * (1 - player.crouch * 0.15); player.grounded = false; }
    player.vy -= GRAV * dt;
    var ny = player.y + player.vy * dt;

    if (player.vy > 0) {
      for (var k = 0; k < props.length; k++) {
        var p = props[k];
        if (player.x + PR > p.x0 && player.x - PR < p.x1 && player.z + PR > p.z0 && player.z - PR < p.z1) {
          if (player.y + PH <= p.y0 + 0.001 && ny + PH > p.y0) { ny = p.y0 - PH; player.vy = 0; }
        }
      }
    }
    if (player.vy <= 0) {
      var gy = groundHeight(player.x, player.z, player.y + 0.001);
      if (ny <= gy) { ny = gy; player.vy = 0; player.grounded = true; }
      else player.grounded = false;
    } else player.grounded = false;
    player.y = ny;

    // hareket miktarı (sekmeye etki) + baş sallanması — render döngüsünden bağımsız hesaplanır
    var movedDist = Math.sqrt((player.x - wasX) * (player.x - wasX) + (player.z - wasZ) * (player.z - wasZ));
    moveAmt = Math.min(movedDist / dt / RUN, 1) * (player.grounded ? 1 : 0);
    if (!isFinite(moveAmt)) moveAmt = 0;
    bobAmt += (moveAmt - bobAmt) * Math.min(1, dt * 8);
    bobT += dt * 10 * Math.max(bobAmt, 0.001);
  }

  function currentArea() {
    var best = null, bestA = Infinity;
    for (var k = 0; k < ROOMS.length; k++) {
      var r = ROOMS[k];
      if (player.x >= r.x && player.x < r.x + r.w && player.z >= r.z && player.z < r.z + r.d) {
        var a = r.w * r.d;
        if (a < bestA) { bestA = a; best = r; }
      }
    }
    if (best) return best.name;
    if (currentMap) return currentMap.name;
    return 'Dust II';
  }

  function drawMinimap() {
    mctx.drawImage(mapBase, 0, 0);
    for (var d = 0; d < targets.length; d++) {
      var nt = targets[d];
      if (nt.state !== 'alive') continue;
      mctx.fillStyle = nt.team === 'blue' ? '#4a9eff' : '#ff5a4a';
      mctx.beginPath();
      mctx.arc((nt.group.position.x - GX) * mmScale, (nt.group.position.z - GZ) * mmScale, 2.2, 0, Math.PI * 2);
      mctx.fill();
    }
    var px = (player.x - GX) * mmScale, py = (player.z - GZ) * mmScale;
    mctx.save();
    mctx.translate(px, py);
    mctx.rotate(-player.yaw);
    mctx.fillStyle = player.team === 'blue' ? '#9fd1ff' : '#ff9a8e';
    mctx.strokeStyle = 'rgba(10,12,14,0.8)';
    mctx.lineWidth = 1;
    mctx.beginPath();
    mctx.moveTo(0, -6); mctx.lineTo(4.5, 5); mctx.lineTo(-4.5, 5);
    mctx.closePath(); mctx.fill(); mctx.stroke();
    mctx.restore();
  }

  /* ================= DÖNGÜ ================= */
  var clock = new THREE.Clock();
  var fpsAcc = 0, fpsFrames = 0, fpsVal = 60, hudAcc = 0;
  var bobT = 0, bobAmt = 0, stepAcc = 0, stepFlip = false, moveAmt = 0;

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;

    var wasX = player.x, wasZ = player.z;
    updatePlayer(dt);
    tickMatchClock(dt);
    var movedDist = Math.sqrt((player.x - wasX) * (player.x - wasX) + (player.z - wasZ) * (player.z - wasZ));

    var eye = EYE - player.crouch * (EYE - 1.02);
    var bob = Math.sin(bobT) * 0.038 * bobAmt * (1 - player.crouch * 0.55);
    camera.position.set(player.x, player.y + eye + bob, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0);
    if (shakeT > 0) {
      shakeT = Math.max(0, shakeT - dt);
      var sh = shakeT * 0.38;
      camera.position.x += (Math.random() - 0.5) * sh;
      camera.position.y += (Math.random() - 0.5) * sh * 0.6;
      camera.position.z += (Math.random() - 0.5) * sh;
    }

    if (player.grounded && movedDist > 0.0004) {
      stepAcc += movedDist;
      if (stepAcc >= (keys['shift'] ? 1.9 : 2.6)) { stepAcc = 0; stepFlip = !stepFlip; playStep(stepFlip, !!keys['shift']); }
    }
    updateWeapon(dt);
    updateTargets(dt);
    mpNetTick(dt);
    updatePuffs(dt);
    updateTracers(dt);
    updateFlash(dt);
    updateSmokes(dt);
    if (dmgFlashT > 0) {
      dmgFlashT -= dt;
      if (dmgFlashEl) dmgFlashEl.style.opacity = String(Math.max(0, dmgFlashT / 0.55) * 0.5);
    }
    if (deathT > 0) {
      if (!paused) deathT -= dt;
      if (deathT <= 0) {
        respawn();
        if (deathEl) deathEl.style.display = 'none';
        updateHudHealth();
      } else if (deathCountEl) {
        deathCountEl.textContent = 'Yeniden doğuş: ' + Math.ceil(deathT) + ' sn · ' + teamSpawnDef(player.team).name;
      }
    }
    if (protectEl) {
      var protLeft = player.protectUntil - performance.now() / 1000;
      if (startedOnce && player.hp > 0 && protLeft > 0) {
        protectEl.style.display = 'block';
        protectEl.textContent = '🛡 DOĞUŞ KORUMASI ' + protLeft.toFixed(1) + ' sn';
      } else protectEl.style.display = 'none';
    }
    updateCrosshair(computeSpread() * 780);
    if (hitmarkerT > 0) { hitmarkerT -= dt; if (hitmarkerT <= 0 && hitmarkerEl) hitmarkerEl.style.opacity = '0'; }

    dustPoints.position.x = Math.sin(t * 0.07) * 1.5;
    dustPoints.position.z = Math.cos(t * 0.05) * 1.5;

    drawMinimap();

    fpsAcc += dt; fpsFrames++;
    if (fpsAcc >= 0.5) { fpsVal = fpsFrames / fpsAcc; fpsAcc = 0; fpsFrames = 0; }
    hudAcc += dt;
    if (hudAcc >= 0.25) {
      hudAcc = 0;
      if (areaEl) areaEl.textContent = currentArea();
      if (statsEl) statsEl.textContent = fpsVal.toFixed(0) + ' FPS · X:' + player.x.toFixed(0) + ' Z:' + player.z.toFixed(0);
      updateHudAmmo();
      updateTeamScoreHud();
      if (overlayEl.style.display === 'flex' && selectedMenuTab === 'dev') updateDevState();
    }

    renderer.render(scene, camera);
  }

  loadMap(selectedMapId);
  player.team = matchTeam;
  if (currentMap && currentMap.awpOnly) menuWeapon = 2;
  selectMenuWeapon(menuWeapon);
  switchWeapon(currentMap && currentMap.awpOnly ? 2 : menuWeapon, true, true);
  applySettings();
  applyCrosshair();
  syncLobbyUI();
  syncToggles();
  updateHudHealth();
  updateMapHud();
  updateHudAmmo();
  camera.position.set(player.x, EYE, player.z);
  camera.rotation.set(0, 0, 0);
  showOverlay('lobby');
  animate();

  /* geliştirici kancası — konsoldan test/inceleme için */
  window.__dust2 = {
    player: player, keys: keys, updatePlayer: updatePlayer, respawn: respawn,
    walkable: walkable, npcClear: npcClear, ROOMS: ROOMS, props: props,
    GX: GX, GZ: GZ, GW: GW, GD: GD,
    renderer: renderer, scene: scene, camera: camera,
    weapons: WEAPONS, targets: targets, stats: stats,
    switchWeapon: switchWeapon, setScoped: setScoped, cycleScope: cycleScope, reload: startReload,
    fire: function () { fireShot(); },
    throwSmoke: throwSmoke, throwFlash: throwFlash, throwHE: throwHE, hurt: hurtPlayer, smokes: smokes,
    grenades: grenades, nades: nades, damageTarget: damageTarget,
    startFlash: startFlash, startHE: startHE,
    mp: function () {
      return { role: mpRole, connected: mpConnected, peer: mpPeerName, name: mpName,
        remote: mpRemote ? { x: +mpRemote.group.position.x.toFixed(2), z: +mpRemote.group.position.z.toFixed(2), hp: mpRemote.hp, st: mpRemote.state } : null,
        ghosts: Object.keys(mpBotGhosts).length };
    },
    mpSend: mpSend, mpCreateHost: mpCreateHost, mpJoinFromCode: mpJoinFromCode, mpAcceptAnswer: mpAcceptAnswer, mpLeave: mpLeave,
    setGod: function (v) { godMode = !!v; persistSettings(); syncToggles(); },
    setInf: function (v) { infAmmo = !!v; persistSettings(); syncToggles(); },
    beginPlay: beginPlay, openMenu: openMenu, selectMenuWeapon: selectMenuWeapon,
    startMatch: startMatch, resume: resumeGame, toLobby: toLobby, showOverlay: showOverlay,
    selectMap: selectMap, setTeam: setTeam, setBotCounts: setBotCounts, spawnBots: spawnBotsForMatch, clearBots: clearBots,
    setDifficulty: setDifficulty, setKillLimit: setKillLimit, setTimeLimit: setTimeLimit,
    setMenuTab: setMenuTab, syncLobbyUI: syncLobbyUI, endMatch: endMatch, checkMatchEnd: checkMatchEnd,
    getMap: function () { return currentMap; }, maps: MAP_DEFS, mapSpawns: mapSpawns,
    getTeam: function () { return matchTeam; }, getBots: function () { return matchBots; },
    getScore: function () { return { blue: matchScore.blue, red: matchScore.red, ended: matchEnded }; },
    getRules: function () { return { difficulty: botDifficulty, killLimit: killLimit, timeLimit: timeLimit }; },
    consoleOpen: function () { return consoleOpen; }, consoleRun: runCommand, consoleToggle: function () { if (consoleOpen) dcClose(); else dcOpen(); },
    mode: function () { return { locked: locked, dragFallback: dragFallback, paused: paused, overlay: overlayEl.style.display, overlayMode: overlayMode, console: consoleOpen, tab: selectedMenuTab }; },
    setPaused: function (v) { paused = !!v; }, setSens: function (v) { sens = v; },
    spread: computeSpread,
    botFire: function (i) { return botFindTarget(targets[i]); },
    npcInfo: function () {
      return targets.map(function (t) {
        return { x: +t.group.position.x.toFixed(2), z: +t.group.position.z.toFixed(2), st: t.state, hp: Math.round(t.hp), armor: Math.round(t.armor), team: t.team, name: t.name,
          tgt: t.target ? (t.target.kind === 'player' ? 'player' : 'bot') : null,
          tgtTeam: t.target ? (t.target.kind === 'player' ? player.team : t.target.bot.team) : null,
          prot: +Math.max(0, t.protectUntil - performance.now() / 1000).toFixed(2),
          spawn: t.spawnPos ? [+t.spawnPos.x.toFixed(1), +t.spawnPos.z.toFixed(1)] : null };
      });
    },
    tick: function (dt) {
      tickMatchClock(dt);
      if (deathT > 0) { deathT -= dt; if (deathT <= 0) { respawn(); if (deathEl) deathEl.style.display = 'none'; updateHudHealth(); } }
      updateWeapon(dt); updateTargets(dt); mpNetTick(dt);
      updatePuffs(dt); updateTracers(dt); updateFlash(dt); updateSmokes(dt);
      updateTeamScoreHud();
    },
    state: function () {
      return {
        weapon: currentWeapon().id, ammo: ammo[curW], reserve: reserve[curW],
        bloom: +bloom.toFixed(4), spread: +computeSpread().toFixed(4), reloading: reloading, scoped: scoped,
        scopeLevel: scopeLevel, bolt: +awpBoltT.toFixed(2), boltPending: awpRescopePending, god: godMode, inf: infAmmo, noclip: noclip,
        crouch: +player.crouch.toFixed(3), paused: paused, moveAmt: +moveAmt.toFixed(3),
        kills: stats.kills, headshots: stats.headshots, raise: +raiseT.toFixed(2),
        hp: Math.round(player.hp), armor: Math.round(player.armor),
        protect: +Math.max(0, player.protectUntil - performance.now() / 1000).toFixed(2),
        spawn: teamSpawnDef(player.team).name, deathT: +Math.max(0, deathT).toFixed(2),
        map: currentMapId, mapName: currentMap ? currentMap.name : '', team: player.team,
        botsBlue: matchBots.blue, botsRed: matchBots.red, difficulty: botDifficulty,
        scoreBlue: matchScore.blue, scoreRed: matchScore.red, matchEnded: matchEnded,
        killLimit: killLimit, timeLimit: timeLimit, matchTimeLeft: +matchTimeLeft.toFixed(1), matchClock: +matchClock.toFixed(1),
        menuTab: selectedMenuTab,
        console: consoleOpen, overlay: overlayMode,
        smokes: smokes.length, grenades: grenades.length,
        nades: { smoke: nades.smoke, flash: nades.flash, he: nades.he },
        mp: mpRole ? { role: mpRole, connected: mpConnected, peer: mpPeerName } : null,
        targetHp: targets.map(function (t) { return Math.round(t.hp); }),
        targetArmor: targets.map(function (t) { return Math.round(t.armor); }),
        targetStates: targets.map(function (t) { return t.state; })
      };
    }
  };
})();
