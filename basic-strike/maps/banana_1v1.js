/* BASIC-STRIKE harita: banana_1v1 — game.js içinden ayrıldı */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function helpers(K) {
    var addBarrel = K.addBarrel, addCrate = K.addCrate, addRoom = K.addRoom, boxGeo = K.boxGeo, groundDecal = K.groundDecal, groundTint = K.groundTint, labelTexture = K.labelTexture, props = K.props, texAshlar = K.texAshlar, texDoorWood = K.texDoorWood, texGrate = K.texGrate, texSandbag = K.texSandbag, texWoodBarrel = K.texWoodBarrel, worldMats = K.worldMats, worldRoot = K.worldRoot;

  function bananaPallet(x, z, rot) {
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var bag = new THREE.MeshLambertMaterial({ map: texSandbag });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0;
    var i, j, b;
    for (i = 0; i < 4; i++) {
      b = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.06, 0.22), wood);
      b.position.set(0, 0.05, -0.54 + i * 0.36);
      b.receiveShadow = true; g.add(b);
    }
    for (i = -1; i <= 1; i += 2) {
      b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 1.26), wood);
      b.position.set(i * 0.78, 0.03, 0); g.add(b);
    }
    var sackGeo = new THREE.SphereGeometry(0.5, 8, 6);
    for (j = 0; j < 4; j++) for (i = 0; i < 2; i++) {
      b = new THREE.Mesh(sackGeo, bag);
      b.scale.set(0.92, 0.26, 0.58);
      b.position.set((i - 0.5) * 0.88 + (j % 2 ? 0.05 : -0.04), 0.16 + j * 0.17, (j % 2 ? 0.03 : -0.02));
      b.rotation.y = (j % 2 ? 0.06 : -0.05);
      b.castShadow = true; b.receiveShadow = true; g.add(b);
    }
    b = new THREE.Mesh(sackGeo, bag);
    b.scale.set(0.86, 0.26, 0.54);
    b.position.set(0.04, 0.88, 0.01);
    b.rotation.y = 0.12;
    b.castShadow = true; g.add(b);
    worldRoot.add(g);
    var turned = rot && Math.abs(Math.sin(rot)) > 0.5;
    var hx = turned ? 0.66 : 0.94, hz = turned ? 0.94 : 0.66;
    props.push({ x0: x - hx, x1: x + hx, z0: z - hz, z1: z + hz, y0: 0, y1: 1.03 });
  }
  function bananaLowWall(x, z, len, alongX, h) {
    h = h || 1.0;
    var w = alongX ? len : 0.5, d = alongX ? 0.5 : len;
    var body = new THREE.Mesh(boxGeo(w, h, d, 0.55), new THREE.MeshLambertMaterial({ map: texAshlar }));
    body.position.set(x + w / 2, h / 2, z + d / 2);
    body.castShadow = true; body.receiveShadow = true;
    worldRoot.add(body);
    var cap = new THREE.Mesh(boxGeo(w + 0.16, 0.12, d + 0.16, 1.6), new THREE.MeshLambertMaterial({ map: texAshlar, color: 0x8f8a7c }));
    cap.position.set(x + w / 2, h + 0.06, z + d / 2);
    cap.castShadow = true; cap.userData.noHit = true;
    worldRoot.add(cap);
    props.push({ x0: x, x1: x + w, z0: z, z1: z + d, y0: 0, y1: h + 0.12 });
  }
  function bananaPillar(x, z, h) {
    h = h || 2.4;
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var body = new THREE.Mesh(boxGeo(0.68, h, 0.68, 0.6), stone);
    body.position.set(x, h / 2, z);
    body.castShadow = true; body.receiveShadow = true;
    worldRoot.add(body);
    var cap = new THREE.Mesh(boxGeo(0.9, 0.14, 0.9, 1.6), new THREE.MeshLambertMaterial({ map: texAshlar, color: 0x8f8a7c }));
    cap.position.set(x, h + 0.07, z);
    cap.castShadow = true; cap.userData.noHit = true;
    worldRoot.add(cap);
    props.push({ x0: x - 0.34, x1: x + 0.34, z0: z - 0.34, z1: z + 0.34, y0: 0, y1: h + 0.14 });
  }
  function bananaLeanPallet(x, z, rotY) {
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY || 0;
    var lean = 0.2, i;
    for (i = 0; i < 5; i++) {
      var p = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.3, 0.06), wood);
      p.position.set(-0.56 + i * 0.28, 0.63, 0.1);
      p.rotation.x = lean;
      p.castShadow = true; g.add(p);
    }
    for (i = 0; i < 3; i++) {
      var bat = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.1, 0.05), wood);
      bat.position.set(0, 0.33 + i * 0.4, -0.02);
      bat.rotation.x = lean;
      g.add(bat);
    }
    g.traverse(function (o) { if (o.isMesh) o.userData.noHit = true; });
    worldRoot.add(g);
  }
  function bananaLaundry(x1, z1, x2, z2, y) {
    var dx = x2 - x1, dz = z2 - z1;
    var len = Math.sqrt(dx * dx + dz * dz);
    var dir = new THREE.Vector3(dx, 0, dz).normalize();
    var line = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len - 0.2, 4),
      new THREE.MeshLambertMaterial({ color: 0x3a3936 }));
    line.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
    line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    line.userData.noHit = true;
    worldRoot.add(line);
    var cols = [0xdfe3e6, 0x7b95a8, 0xc9b981];
    for (var i = 0; i < 3; i++) {
      var t = 0.28 + i * 0.22;
      var cx = x1 + dx * t, cz = z1 + dz * t;
      var cloth = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.56, 0.03),
        new THREE.MeshLambertMaterial({ color: cols[i] }));
      cloth.position.set(cx, y - 0.32, cz);
      cloth.rotation.y = Math.atan2(-dir.z, dir.x);
      cloth.rotation.z = (i - 1) * 0.05;
      cloth.userData.noHit = true;
      worldRoot.add(cloth);
    }
  }
  function bananaBigDoor(x, z, rotY, double, arched) {
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var iron = new THREE.MeshLambertMaterial({ color: 0x2c3032 });
    var glow = new THREE.MeshBasicMaterial({ color: 0xffd58a });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY || 0;
    var dw = double ? 1.78 : 1.06, dh = double ? 2.5 : 2.24;
    var i;
    var step = new THREE.Mesh(boxGeo(dw + 0.5, 0.12, 0.42, 1), stone);
    step.position.set(0, 0.06, 0.16); step.receiveShadow = true; g.add(step);
    var leaf = new THREE.Mesh(new THREE.BoxGeometry(dw, dh, 0.09), wood);
    leaf.position.set(0, dh / 2 + 0.06, 0.03); g.add(leaf);
    for (i = 1; i < (double ? 6 : 4); i++) {
      var pl = new THREE.Mesh(new THREE.BoxGeometry(0.035, dh - 0.12, 0.02), new THREE.MeshLambertMaterial({ color: 0x3e2814 }));
      pl.position.set(-dw / 2 + dw * i / (double ? 6 : 4), dh / 2 + 0.06, 0.085); g.add(pl);
    }
    if (double) {
      var seam = new THREE.Mesh(new THREE.BoxGeometry(0.05, dh, 0.03), iron);
      seam.position.set(0, dh / 2 + 0.06, 0.09); g.add(seam);
    }
    for (i = -1; i <= 1; i += 2) {
      var jamb = new THREE.Mesh(boxGeo(0.2, dh + 0.2, 0.14, 0.8), stone);
      jamb.position.set(i * (dw / 2 + 0.12), (dh + 0.2) / 2, 0.05); g.add(jamb);
    }
    var lintel = new THREE.Mesh(boxGeo(dw + 0.55, 0.2, 0.18, 0.8), stone);
    lintel.position.set(0, dh + 0.16, 0.05); g.add(lintel);
    if (arched) {
      var arch = new THREE.Mesh(new THREE.TorusGeometry(dw / 2 + 0.1, 0.11, 6, 16, Math.PI), stone);
      arch.position.set(0, dh + 0.26, 0.05); g.add(arch);
      var key = new THREE.Mesh(boxGeo(0.26, 0.3, 0.16, 1), stone);
      key.position.set(0, dh + 0.42, 0.06); g.add(key);
    }
    var bracket = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.3), iron);
    bracket.position.set(dw / 2 + 0.5, 2.95, 0.12); g.add(bracket);
    var lamp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.18), glow);
    lamp.position.set(dw / 2 + 0.5, 2.78, 0.2); g.add(lamp);
    var hood = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.24), iron);
    hood.position.set(dw / 2 + 0.5, 2.92, 0.2); g.add(hood);
    g.traverse(function (o) { if (o.isMesh) { o.userData.noHit = true; o.castShadow = true; } });
    worldRoot.add(g);
  }
  function bananaGate(x, z, rotY) {
    var iron = new THREE.MeshLambertMaterial({ color: 0x2c3032 });
    var red = new THREE.MeshLambertMaterial({ color: 0x87281f });
    var white = new THREE.MeshLambertMaterial({ color: 0xe8e2d2 });
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY || 0;
    var i;
    for (i = -1; i <= 1; i += 2) {
      var post = new THREE.Mesh(boxGeo(0.4, 2.9, 0.4, 0.6), stone);
      post.position.set(i * 1.6, 1.45, 0);
      post.castShadow = true; post.receiveShadow = true; g.add(post);
      var cap = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.52), stone);
      cap.position.set(i * 1.6, 2.96, 0); g.add(cap);
    }
    var rail = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.09, 0.1), iron);
    rail.position.set(0, 2.78, 0); g.add(rail);
    rail = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.09, 0.1), iron);
    rail.position.set(0, 0.14, 0); g.add(rail);
    for (i = -3; i <= 3; i++) {
      var bar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 2.6, 0.09), iron);
      bar.position.set(i * 0.36, 1.46, 0.01); g.add(bar);
      var tip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.17, 5), iron);
      tip.position.set(i * 0.36, 2.88, 0.01); g.add(tip);
    }
    for (i = -1; i <= 1; i += 2) {
      var scroll = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.032, 5, 10, Math.PI), iron);
      scroll.position.set(i * 0.98, 1.92, 0.03); g.add(scroll);
    }
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.085, 8, 20), red);
    ring.position.set(0.85, 1.5, 0.1); g.add(ring);
    for (i = 0; i < 4; i++) {
      var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.1), white);
      stripe.position.set(0.85 + Math.cos(i * Math.PI / 2) * 0.35, 1.5 + Math.sin(i * Math.PI / 2) * 0.35, 0.11);
      stripe.rotation.z = i * Math.PI / 2;
      g.add(stripe);
    }
    g.traverse(function (o) { if (o.isMesh) { o.userData.noHit = true; o.castShadow = false; } });
    worldRoot.add(g);
  }
    return { bananaPallet: bananaPallet, bananaLowWall: bananaLowWall, bananaPillar: bananaPillar, bananaLeanPallet: bananaLeanPallet, bananaLaundry: bananaLaundry, bananaBigDoor: bananaBigDoor, bananaGate: bananaGate };
  }

  function buildBanana1v1(K) {
    var addBarrel = K.addBarrel, addCrate = K.addCrate, addRoom = K.addRoom, boxGeo = K.boxGeo, groundDecal = K.groundDecal, groundTint = K.groundTint, labelTexture = K.labelTexture, props = K.props, texAshlar = K.texAshlar, texDoorWood = K.texDoorWood, texGrate = K.texGrate, texSandbag = K.texSandbag, texWoodBarrel = K.texWoodBarrel, worldMats = K.worldMats, worldRoot = K.worldRoot;
    var __V = K.MAPS.village.helpers(K);
    var house = __V.house, tree = __V.tree, bananaPlanter = __V.bananaPlanter;
    var __V = K.MAPS.banana_1v1.helpers(K);
    var bananaPallet = __V.bananaPallet, bananaLowWall = __V.bananaLowWall, bananaPillar = __V.bananaPillar, bananaLeanPallet = __V.bananaLeanPallet, bananaLaundry = __V.bananaLaundry, bananaBigDoor = __V.bananaBigDoor, bananaGate = __V.bananaGate;
    worldMats.barrel = new THREE.MeshLambertMaterial({ map: texWoodBarrel });
    // dış hat: mavi geçit (kuzey-doğu), üst avlu, kavisli muz yolu, alt kavşak, kırmızı geçit (güney-batı)
    addRoom(7, -25, 8, 8, 'Mavi Geçit');
    addRoom(-4, -17, 21, 12, 'Üst Avlu');
    addRoom(17, -12, 3, 7, 'Doğu Niş');
    addRoom(-4, -5, 8, 4, 'Muz Yolu 1');
    addRoom(-6, -1, 8, 4, 'Muz Yolu 2');
    addRoom(-8, 3, 8, 4, 'Muz Yolu 3');
    addRoom(-13, 7, 7, 2, 'Muz Yolu 4');
    addRoom(-14, 9, 9, 5, 'Alt Kavşak');
    addRoom(-20, 10, 6, 4, 'Sol Çıkmaz');
    addRoom(-15, 14, 8, 10, 'Kırmızı Geçit');

    // zemin: takım alanları ve doğuş yazıları
    groundTint(6.4, 6.4, 10, -22, 0x3d7fd4, 0.2);
    groundTint(6.4, 6.4, -11, 20, 0xa33b30, 0.2);
    groundDecal(labelTexture('MAVİ'), 3.4, 10, -22, 0, true);
    groundDecal(labelTexture('KIRMIZI'), 3.8, -11, 20, 0, true);

    // ana siperler
    addCrate(5.0, -9.5, 2.2, 2.2, 1.6);
    addCrate(-7.2, 9.4, 1.6, 1.6, 1.1);
    bananaPallet(-3.0, -16.2);
    bananaPallet(-3.0, -3.5);
    bananaPallet(-12.0, 7.6);
    bananaPallet(-17.4, 10.75);
    bananaPallet(-13.6, 16.3);
    addBarrel(14.0, -18.1);
    addBarrel(18.6, -7.0);
    addBarrel(-16.4, 12.8);
    addBarrel(-8.2, 18.4);
    addBarrel(13.8, -11.8);
    addBarrel(-14.2, 15.1);
    addBarrel(-8.1, 22.5);

    // taş sütun ve alçak duvarlar (radardaki çıkıntılar)
    bananaPillar(1.2, -10.6, 2.5);
    bananaPillar(-3.6, 4.6, 2.4);
    bananaLowWall(-13.7, 9.4, 3.0, true, 0.95);
    bananaLowWall(16.1, -16.6, 2.6, false, 0.95);
    bananaLowWall(-13.7, 22.8, 4.6, true, 0.9);

    // cephe detayları: saksı, demir kapı, kemerli çift kapılar, yaslanmış paletler
    bananaPlanter(3.0, -16.4, 0);
    bananaPlanter(11.4, -16.4, 0);
    bananaPlanter(-3.55, -1.6, Math.PI / 2);
    bananaPlanter(-13.55, 13.2, -Math.PI / 2);
    bananaGate(-19.6, 11.6, Math.PI / 2);
    bananaBigDoor(-7.34, 21.6, -Math.PI / 2, true, true);
    bananaBigDoor(7.34, -21.6, Math.PI / 2, true, true);
    bananaLeanPallet(-3.62, -13.4, -Math.PI / 2);
    bananaLeanPallet(12.9, -16.45, Math.PI);
    bananaLeanPallet(-14.45, 17.3, -Math.PI / 2);
    bananaLeanPallet(-19.45, 13.3, -Math.PI / 2);

    // sokak detayları: çamaşır ipleri ve mazgallar
    bananaLaundry(-3.7, -3.2, 3.7, -3.2, 4.55);
    bananaLaundry(-5.7, 1.1, 1.7, 1.1, 4.4);
    groundDecal(texGrate, 0.95, 2.6, -6.4, 0.2, true);
    groundDecal(texGrate, 0.95, -8.4, 10.4, 0, true);
    groundDecal(texGrate, 1.15, 9.6, -19.8, 0, true);
    groundDecal(texGrate, 0.9, -11.8, 18.2, 0, true);
    groundDecal(texGrate, 2.0, -10.8, 12.6, 0.15, true);

    // çevredeki köy evleri ve ağaçlar (yürünebilir alanın dışında)
    house(10, -33, 12, 9, 7.6, '#d9ccb2', '#8a4b32');
    house(-12, -25, 9, 8, 7.4, '#d6c6a8', '#7c3f2a');
    house(27, -12, 10, 10, 7.2, '#cfc0a2', '#8a4b32');
    house(25, 3, 8, 9, 7.0, '#d9ccb2', '#7c3f2a');
    house(-27, -2, 8, 10, 7.4, '#c9b795', '#8a4b32');
    house(23, 24, 10, 9, 7.2, '#d6c6a8', '#7c3f2a');
    house(-29, 21, 9, 10, 7.4, '#d9ccb2', '#8a4b32');
    house(1, -42, 14, 9, 8.0, '#cfc0a2', '#8a4b32');
    tree(20.5, -1.5, 1.1);
    tree(-24, 17, 1.0);
    tree(6.5, -30.5, 1.05);
    tree(-25, 6, 0.95);
  }

  function bananaRoutes() {
    var blue = [
      [[10, -22], [10, -18], [6, -14], [1, -9], [-1, -3], [-4, 1], [-7, 5], [-9.5, 8], [-10, 11], [-11, 17], [-11, 20]],
      [[10, -22], [13, -19], [8, -13], [3, -7], [-2, -2], [-6, 2], [-9, 6], [-12, 8], [-12, 12], [-11, 18], [-11, 20]],
      [[10, -22], [8, -20], [5, -15], [0, -8], [-3, -2], [-5, 1], [-8, 4], [-12, 7], [-17, 11], [-14, 13], [-11, 19]]
    ];
    var red = [], i, j, r;
    for (i = 0; i < blue.length; i++) {
      r = [];
      for (j = blue[i].length - 1; j >= 0; j--) r.push(blue[i][j]);
      red.push(r);
    }
    return { blue: blue, red: red };
  }

  function bananaPostBuild(K) { K.MAPS.village.helpers(K).bananaStreetScene(); }

  M.banana_1v1 = {
      name: 'Banana 1v1', desc: '2 kişilik muz sokak düellosu · turlu · her turda doğuşlar yer değiştirir', theme: 'village',
      wallH: 6.8, restricted: false, build: buildBanana1v1, duel: true, street: true, postBuild: bananaPostBuild,
      spawns: {
        blue: { x: 10, z: -22, yaw: Math.PI, name: 'Mavi Doğuş' },
        red: { x: -11, z: 20, yaw: 0, name: 'Kırmızı Doğuş' }
      },
      miniLabels: [{ t: 'MAVİ', x: 10, z: -23.4 }, { t: 'KIRMIZI', x: -11, z: 21.4 }, { t: 'ORTA', x: -7, z: 6 }],
      routes: bananaRoutes()
  };
  M.banana_1v1.helpers = helpers;
})();
