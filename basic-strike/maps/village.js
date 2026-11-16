/* BASIC-STRIKE harita: village — game.js içinden ayrıldı */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function helpers(K) {
    var GD = K.GD, GW = K.GW, GX = K.GX, GZ = K.GZ, WALL_H = K.WALL_H, WALL_T = K.WALL_T, addBarrel = K.addBarrel, addCrate = K.addCrate, addRoom = K.addRoom, batchAdd = K.batchAdd, batchMat = K.batchMat, bloom = K.bloom, bmAshlarTint = K.bmAshlarTint, bmCrop = K.bmCrop, bmIron = K.bmIron, bmLampGlow = K.bmLampGlow, bmLeaf = K.bmLeaf, bmSoil = K.bmSoil, bmTrunk = K.bmTrunk, bmWood = K.bmWood, boxGeo = K.boxGeo, groundTint = K.groundTint, mergeGeos = K.mergeGeos, pi = K.pi, props = K.props, texAshlar = K.texAshlar, texDoorWood = K.texDoorWood, texPlaster = K.texPlaster, texPlasterGrey = K.texPlasterGrey, texPlasterOchre = K.texPlasterOchre, texPlasterRust = K.texPlasterRust, texPlasterYellow = K.texPlasterYellow, texRoofTile = K.texRoofTile, walkable = K.walkable, worldRoot = K.worldRoot;

  function house(x, z, w, d, h, wallColor, roofColor) {
    var body = new THREE.BoxGeometry(w, h, d);
    body.translate(x, h / 2, z);
    batchAdd('houseBody_' + wallColor, batchMat(wallColor), body);
    var roofH = Math.max(1.3, h * 0.42);
    var roof = new THREE.ConeGeometry(Math.sqrt(w * w + d * d) / 2 * 1.1, roofH, 4);
    roof.rotateY(Math.PI / 4);
    roof.translate(x, h + roofH / 2, z);
    batchAdd('houseRoof_' + roofColor, batchMat(roofColor), roof);
    var detMat = batchMat(0x4a3524);
    var winW = Math.min(1.0, w * 0.18), winH = Math.min(1.2, h * 0.28);
    for (var sx = -1; sx <= 1; sx += 2) for (var sz = -1; sz <= 1; sz += 2) {
      var win = new THREE.BoxGeometry(winW, winH, 0.12);
      win.translate(x + sx * w * 0.25, h * 0.58, z + sz * (d / 2 + 0.02));
      batchAdd('houseDetail', detMat, win, { cast: false });
    }
    var dw = Math.min(1.9, h * 0.42);
    var door = new THREE.BoxGeometry(0.9, dw, 0.14);
    door.translate(x, dw / 2, z + d / 2 + 0.02);
    batchAdd('houseDetail', detMat, door, { cast: false });
  }
  function tree(x, z, s) {
    s = s || 1;
    var tg = new THREE.CylinderGeometry(0.17 * s, 0.28 * s, 2.3 * s, 8);
    tg.translate(x, 1.15 * s, z);
    batchAdd('treeTrunk', bmTrunk, tg);
    var fol = [[0, 2.7, 0, 1.25], [0.7, 2.2, 0.35, 0.85], [-0.6, 2.3, -0.3, 0.9], [0.1, 3.3, 0.15, 0.75]];
    for (var i = 0; i < fol.length; i++) {
      var f = fol[i];
      var leaf = new THREE.SphereGeometry(f[3] * s, 10, 8);
      leaf.translate(x + f[0] * s, f[1] * s, z + f[2] * s);
      batchAdd('treeLeaf', bmLeaf, leaf);
    }
    props.push({ x0: x - 0.32 * s, x1: x + 0.32 * s, z0: z - 0.32 * s, z1: z + 0.32 * s, y0: 0, y1: 2.3 * s });
  }
  function stall(x, z, rot, color) {
    rot = rot || 0;
    var postGeo = new THREE.BoxGeometry(0.14, 2.1, 0.14);
    var pts = [[-1.25, -0.85], [1.25, -0.85], [-1.25, 0.85], [1.25, 0.85]];
    var woodMat = batchMat(0x7a5a34);
    for (var i = 0; i < pts.length; i++) {
      var pgeo = postGeo.clone();
      pgeo.translate(pts[i][0], 1.05, pts[i][1]);
      pgeo.rotateY(rot);
      pgeo.translate(x, 0, z);
      batchAdd('stallWood', woodMat, pgeo);
    }
    var canopy = new THREE.BoxGeometry(3.05, 0.09, 2.25);
    canopy.rotateZ(0.07);
    canopy.translate(0, 2.12, 0);
    canopy.rotateY(rot);
    canopy.translate(x, 0, z);
    batchAdd('stallTop_' + color, batchMat(color), canopy);
    var table = new THREE.BoxGeometry(2.3, 0.7, 1.05);
    table.translate(0, 0.35, 0.12);
    table.rotateY(rot);
    table.translate(x, 0, z);
    batchAdd('stallWood', woodMat, table);
    var fruit = new THREE.BoxGeometry(0.62, 0.34, 0.52);
    fruit.translate(-0.55, 0.87, 0.12);
    fruit.rotateY(rot);
    fruit.translate(x, 0, z);
    batchAdd('stallFruit', batchMat(0xcf9f3a), fruit, { cast: false });
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
  function villageWell(x, z) {
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var body = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.95, 14), stone);
    body.position.set(x, 0.475, z); body.castShadow = true; body.receiveShadow = true;
    worldRoot.add(body);
    var water = new THREE.Mesh(new THREE.CircleGeometry(0.92, 14),
      new THREE.MeshLambertMaterial({ color: 0x2e5d73 }));
    water.rotation.x = -Math.PI / 2; water.position.set(x, 0.96, z);
    worldRoot.add(water);
    for (var s = -1; s <= 1; s += 2) {
      var post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.3, 0.14), wood);
      post.position.set(x + s * 1.15, 1.15, z);
      post.castShadow = true; worldRoot.add(post);
    }
    var beam = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.14, 0.14), wood);
    beam.position.set(x, 2.3, z); worldRoot.add(beam);
    var rMat = new THREE.MeshLambertMaterial({ map: texRoofTile });
    var roofL = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.09, 0.8), rMat);
    roofL.position.set(x, 2.44, z - 0.33); roofL.rotation.x = -0.52; roofL.castShadow = true; worldRoot.add(roofL);
    var roofR = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.09, 0.8), rMat);
    roofR.position.set(x, 2.44, z + 0.33); roofR.rotation.x = 0.52; roofR.castShadow = true; worldRoot.add(roofR);
    props.push({ x0: x - 1.15, x1: x + 1.15, z0: z - 1.15, z1: z + 1.15, y0: 0, y1: 0.95 });
  }
  function villageHaystack(x, z, s) {
    s = s || 1;
    var base = new THREE.CylinderGeometry(1.15 * s, 1.3 * s, 1.5 * s, 12);
    base.translate(x, 0.75 * s, z);
    batchAdd('hayBase', batchMat(0xc6a75a), base);
    var top = new THREE.ConeGeometry(1.18 * s, 0.95 * s, 12);
    top.translate(x, 1.95 * s, z);
    batchAdd('hayTop', batchMat(0xa98f47), top);
    props.push({ x0: x - 1.25 * s, x1: x + 1.25 * s, z0: z - 1.25 * s, z1: z + 1.25 * s, y0: 0, y1: 1.6 * s });
  }
  function villageCart(x, z, rot) {
    rot = rot || 0;
    var bed = new THREE.BoxGeometry(2.5, 0.16, 1.25);
    bed.translate(0, 0.78, 0); bed.rotateY(rot); bed.translate(x, 0, z);
    batchAdd('cartWood', bmWood, bed);
    for (var s = -1; s <= 1; s += 2) {
      var side = new THREE.BoxGeometry(2.5, 0.42, 0.08);
      side.translate(0, 0.99, s * 0.62); side.rotateY(rot); side.translate(x, 0, z);
      batchAdd('cartWood', bmWood, side);
      var wheel = new THREE.CylinderGeometry(0.6, 0.6, 0.14, 12);
      wheel.rotateZ(Math.PI / 2);
      wheel.translate(s * 0.92, 0.6, 0.68); wheel.rotateY(rot); wheel.translate(x, 0, z);
      batchAdd('cartDark', batchMat(0x4a3220), wheel);
      var shaft = new THREE.BoxGeometry(0.09, 0.09, 1.5);
      shaft.rotateX(-0.22);
      shaft.translate(s * 0.55, 0.6, -1.25); shaft.rotateY(rot); shaft.translate(x, 0, z);
      batchAdd('cartWood', bmWood, shaft);
    }
    var c = Math.abs(Math.cos(rot)), s2 = Math.abs(Math.sin(rot));
    props.push({ x0: x - (c * 1.35 + s2 * 0.75), x1: x + (c * 1.35 + s2 * 0.75),
      z0: z - (s2 * 1.35 + c * 0.75), z1: z + (s2 * 1.35 + c * 0.75), y0: 0, y1: 1.05 });
  }
  function villageBench(x, z, rot) {
    rot = rot || 0;
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot;
    var seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.52), wood);
    seat.position.set(0, 0.46, 0); seat.castShadow = true; g.add(seat);
    var back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.34, 0.08), wood);
    back.position.set(0, 0.72, -0.24); back.castShadow = true; g.add(back);
    for (var s = -1; s <= 1; s += 2) {
      var leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.46, 0.46), wood);
      leg.position.set(s * 0.78, 0.23, 0); g.add(leg);
    }
    worldRoot.add(g);
    var c = Math.abs(Math.cos(rot)), s2 = Math.abs(Math.sin(rot));
    props.push({ x0: x - (c * 1.0 + s2 * 0.3), x1: x + (c * 1.0 + s2 * 0.3),
      z0: z - (s2 * 1.0 + c * 0.3), z1: z + (s2 * 1.0 + c * 0.3), y0: 0, y1: 0.5 });
  }
  function villageFence(x, z, len, alongX) {
    var posts = Math.max(2, Math.round(len / 1.6) + 1);
    for (var i = 0; i < posts; i++) {
      var t = i / (posts - 1);
      var post = new THREE.BoxGeometry(0.12, 1.0, 0.12);
      post.translate(alongX ? t * len : 0, 0.5, alongX ? 0 : t * len);
      post.translate(x, 0, z);
      batchAdd('fenceWood', bmWood, post);
    }
    for (var r = 0; r < 2; r++) {
      var rail = new THREE.BoxGeometry(alongX ? len : 0.07, 0.08, alongX ? 0.07 : len);
      rail.translate(alongX ? len / 2 : 0, 0.38 + r * 0.42, alongX ? 0 : len / 2);
      rail.translate(x, 0, z);
      batchAdd('fenceWood', bmWood, rail);
    }
    props.push(alongX
      ? { x0: x, x1: x + len, z0: z - 0.14, z1: z + 0.14, y0: 0, y1: 1.0 }
      : { x0: x - 0.14, x1: x + 0.14, z0: z, z1: z + len, y0: 0, y1: 1.0 });
  }
  function villageGarden(x, z, w, d) {
    var border = boxGeo(w, 0.62, d, 0.6);
    border.translate(x + w / 2, 0.31, z + d / 2);
    batchAdd('gardenStone', bmAshlarTint, border);
    var inner = new THREE.BoxGeometry(Math.max(0.4, w - 0.5), 0.1, Math.max(0.4, d - 0.5));
    inner.translate(x + w / 2, 0.63, z + d / 2);
    batchAdd('gardenSoil', bmSoil, inner, { cast: false, recv: false });
    var nx = Math.max(1, Math.floor((w - 0.6) / 0.8)), nz = Math.max(1, Math.floor((d - 0.6) / 0.8));
    for (var i = 0; i < nx; i++) for (var j = 0; j < nz; j++) {
      var b = new THREE.SphereGeometry(0.15, 6, 5);
      b.scale(1, 0.7, 1);
      b.translate(x + 0.35 + (i + 0.5) * (w - 0.7) / nx, 0.7, z + 0.35 + (j + 0.5) * (d - 0.7) / nz);
      batchAdd('cropLeaf', bmCrop, b, { cast: false, recv: false });
    }
    props.push({ x0: x, x1: x + w, z0: z, z1: z + d, y0: 0, y1: 0.62 });
  }
  function villageLamp(x, z) {
    var post = new THREE.CylinderGeometry(0.06, 0.09, 3.2, 6);
    post.translate(x, 1.6, z);
    batchAdd('lampIron', bmIron, post);
    var arm = new THREE.BoxGeometry(0.5, 0.06, 0.06);
    arm.translate(x + 0.22, 3.18, z);
    batchAdd('lampIron', bmIron, arm);
    var lamp = new THREE.BoxGeometry(0.18, 0.26, 0.18);
    lamp.translate(x + 0.42, 3.0, z);
    batchAdd('lampGlow', bmLampGlow, lamp, { cast: false, recv: false });
    var cap = new THREE.BoxGeometry(0.26, 0.06, 0.26);
    cap.translate(x + 0.42, 3.16, z);
    batchAdd('lampIron', bmIron, cap);
    props.push({ x0: x - 0.15, x1: x + 0.15, z0: z - 0.15, z1: z + 0.15, y0: 0, y1: 3.2 });
  }
  function villagePlanter(x, z, rot) {
    bananaPlanter(x, z, rot);
    props.push({ x0: x - 0.56, x1: x + 0.56, z0: z - 0.26, z1: z + 0.26, y0: 0, y1: 0.45 });
  }
  function bananaPlanter(x, z, rotY) {
    var wood = new THREE.MeshLambertMaterial({ color: 0x6f4a2c });
    var leaf = new THREE.MeshLambertMaterial({ color: 0x1b3a12 });
    var bloom = new THREE.MeshLambertMaterial({ color: 0x4d100a });
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY || 0;
    var box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 0.46), wood);
    box.position.set(0, 0.21, 0); box.castShadow = true; box.receiveShadow = true; g.add(box);
    for (var i = 0; i < 5; i++) {
      var s = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), (i % 3 === 0 ? bloom : leaf));
      s.position.set(-0.42 + i * 0.21, 0.5 + (i % 2) * 0.05, (i % 2 ? 0.1 : -0.09));
      s.castShadow = true; g.add(s);
    }
    g.traverse(function (o) { if (o.isMesh) o.userData.noHit = true; });
    worldRoot.add(g);
  }
  function villageWindmill(x, z) {
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var tower = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.5, 7.2, 14), stone);
    tower.position.set(x, 3.6, z); tower.castShadow = true; tower.receiveShadow = true; worldRoot.add(tower);
    var cap = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.8, 14), new THREE.MeshLambertMaterial({ map: texRoofTile }));
    cap.position.set(x, 8.1, z); cap.castShadow = true; worldRoot.add(cap);
    var hub = new THREE.Group(); hub.position.set(x, 7.0, z + 2.4);
    for (var i = 0; i < 4; i++) {
      var arm = new THREE.Group(); arm.rotation.z = i * Math.PI / 2;
      var blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.4, 0.07), wood);
      blade.position.set(0, 1.85, 0); blade.castShadow = true; arm.add(blade);
      var rib = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.05), wood);
      rib.position.set(0, 0.6, 0.03); arm.add(rib);
      hub.add(arm);
    }
    worldRoot.add(hub);
    props.push({ x0: x - 2.5, x1: x + 2.5, z0: z - 2.5, z1: z + 2.5, y0: 0, y1: 7.2 });
  }
  function gableRoof(x, z, w, d, h, roofMat, endMat) {
    var rh = Math.max(1.2, Math.min(w, d) * 0.32);
    var ang = Math.atan2(rh, d / 2);
    var len = Math.sqrt((d / 2) * (d / 2) + rh * rh) + 0.5;
    for (var s = -1; s <= 1; s += 2) {
      var slab = new THREE.Mesh(new THREE.BoxGeometry(w + 1.1, 0.2, len), roofMat);
      slab.position.set(x, h + rh / 2, z + s * d / 4);
      slab.rotation.x = s * ang;
      slab.castShadow = true; slab.receiveShadow = true; worldRoot.add(slab);
    }
    var shp = new THREE.Shape();
    shp.moveTo(-d / 2, 0); shp.lineTo(d / 2, 0); shp.lineTo(0, rh); shp.closePath();
    var gableMat = endMat.clone(); gableMat.side = THREE.DoubleSide;
    for (var e = -1; e <= 1; e += 2) {
      var tg = new THREE.ShapeGeometry(shp);
      tg.rotateY(e * Math.PI / 2);
      tg.translate(x + e * w / 2, h, z);
      var gm = new THREE.Mesh(tg, gableMat);
      gm.castShadow = true; worldRoot.add(gm);
    }
  }
  function villageChapel(x, z) {
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var roof = new THREE.MeshLambertMaterial({ map: texRoofTile });
    var dark = new THREE.MeshLambertMaterial({ color: 0x2a2016 });
    var body = new THREE.Mesh(boxGeo(12, 6, 8, 0.7), stone);
    body.position.set(x, 3, z); body.castShadow = true; body.receiveShadow = true; worldRoot.add(body);
    gableRoof(x, z, 12, 8, 6, roof, stone);
    var tx = x + 7.0, tz = z + 2.6;
    var tower = new THREE.Mesh(boxGeo(2.6, 10.5, 2.6, 0.6), stone);
    tower.position.set(tx, 5.25, tz); tower.castShadow = true; tower.receiveShadow = true; worldRoot.add(tower);
    var spire = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.4, 4), roof);
    spire.position.set(tx, 11.7, tz); spire.rotation.y = Math.PI / 4; spire.castShadow = true; worldRoot.add(spire);
    var bellHole = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.1), dark);
    bellHole.position.set(tx, 8.4, tz + 1.33); worldRoot.add(bellHole);
    var door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.12), dark);
    door.position.set(x, 1.7, z + 4.06); worldRoot.add(door);
    for (var wx = -1; wx <= 1; wx += 2) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.1), dark);
      win.position.set(x + wx * 3.4, 3.4, z + 4.06); worldRoot.add(win);
    }
    props.push({ x0: x - 6, x1: x + 6, z0: z - 4, z1: z + 4, y0: 0, y1: 7.2 });
    props.push({ x0: tx - 1.3, x1: tx + 1.3, z0: tz - 1.3, z1: tz + 1.3, y0: 0, y1: 10.5 });
  }
  function villageBarn(x, z) {
    var wood = new THREE.MeshLambertMaterial({ map: texDoorWood });
    var roof = new THREE.MeshLambertMaterial({ map: texRoofTile });
    var body = new THREE.Mesh(boxGeo(14, 5.6, 9, 0.8), wood);
    body.position.set(x, 2.8, z); body.castShadow = true; body.receiveShadow = true; worldRoot.add(body);
    gableRoof(x, z, 14, 9, 5.6, roof, wood);
    var door = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.6, 0.12), new THREE.MeshLambertMaterial({ color: 0x35240f }));
    door.position.set(x, 1.8, z + 4.56); worldRoot.add(door);
    props.push({ x0: x - 7, x1: x + 7, z0: z - 4.5, z1: z + 4.5, y0: 0, y1: 5.8 });
  }
  function villageSightBlock(x, z, w, d, h) {
    var plaster = new THREE.MeshLambertMaterial({ map: texPlaster, color: 0xd8c9a8 });
    var stone = new THREE.MeshLambertMaterial({ map: texAshlar });
    var roof = new THREE.MeshLambertMaterial({ map: texRoofTile });
    var dark = new THREE.MeshLambertMaterial({ color: 0x2a2016 });
    var base = new THREE.Mesh(boxGeo(w, 1.6, d, 0.6), stone);
    base.position.set(x, 0.8, z); base.castShadow = true; base.receiveShadow = true; worldRoot.add(base);
    var body = new THREE.Mesh(boxGeo(w, h - 1.6, d - 0.2, 0.8), plaster);
    body.position.set(x, 1.6 + (h - 1.6) / 2, z); body.castShadow = true; body.receiveShadow = true; worldRoot.add(body);
    gableRoof(x, z, w - 0.2, d - 0.2, h, roof, plaster);
    var door = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.7, 0.12), dark);
    door.position.set(x, 1.35, z + d / 2 + 0.07); worldRoot.add(door);
    for (var ws = -1; ws <= 1; ws += 2) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, 0.1), dark);
      win.position.set(x + ws * w * 0.26, h - 1.9, z + d / 2 + 0.07); worldRoot.add(win);
      var win2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.35, 1.15), dark);
      win2.position.set(x + w / 2 + 0.07, h - 1.9, z + ws * d * 0.22); worldRoot.add(win2);
    }
    props.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0: 0, y1: h });
  }
  function bananaHash(a, b, c) {
    var h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 2246822519)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function bananaStreetScene() {
    var mats = {
      stone: new THREE.MeshLambertMaterial({ map: texAshlar }),
      quoin: new THREE.MeshLambertMaterial({ map: texAshlar, color: 0xb4ae9f }),
      trim: new THREE.MeshLambertMaterial({ map: texAshlar, color: 0xd8d2c3 }),
      yellow: new THREE.MeshLambertMaterial({ map: texPlasterYellow }),
      ochre: new THREE.MeshLambertMaterial({ map: texPlasterOchre }),
      rust: new THREE.MeshLambertMaterial({ map: texPlasterRust }),
      grey: new THREE.MeshLambertMaterial({ map: texPlasterGrey }),
      cream: new THREE.MeshLambertMaterial({ map: texPlaster }),
      roof: new THREE.MeshLambertMaterial({ map: texRoofTile }),
      wood: new THREE.MeshLambertMaterial({ map: texDoorWood }),
      woodDark: new THREE.MeshLambertMaterial({ color: 0x150c04 }),
      iron: new THREE.MeshLambertMaterial({ color: 0x2b2f30 }),
      glass: new THREE.MeshBasicMaterial({ color: 0x04080b }),
      shutterG: new THREE.MeshLambertMaterial({ color: 0x2b4232 }),
      shutterB: new THREE.MeshLambertMaterial({ color: 0x452c17 }),
      leaf: new THREE.MeshLambertMaterial({ color: 0x1b3a12 }),
      bloom: new THREE.MeshLambertMaterial({ color: 0x4d100a }),
      glow: new THREE.MeshBasicMaterial({ color: 0xffd58a }),
      zinc: new THREE.MeshLambertMaterial({ color: 0x6d7274 })
    };
    var FB = {}, up = new THREE.Vector3(0, 1, 0), tmpG;
    function fb(key, w, h, d, lx, ly, lz, uv, rx, F) {
      tmpG = boxGeo(w, h, d, uv || 0.3);
      if (rx) tmpG.rotateX(rx);
      tmpG.translate(lx, ly, lz);
      tmpG.applyMatrix4(F);
      (FB[key] || (FB[key] = [])).push(tmpG);
    }
    function fcyl(key, r, h, lx, ly, lz, F) {
      tmpG = new THREE.CylinderGeometry(r, r, h, 7);
      tmpG.translate(lx, ly, lz);
      tmpG.applyMatrix4(F);
      (FB[key] || (FB[key] = [])).push(tmpG);
    }
    function ftorus(key, rad, tube, lx, ly, lz, F) {
      tmpG = new THREE.TorusGeometry(rad, tube, 6, 14, Math.PI);
      tmpG.translate(lx, ly, lz);
      tmpG.applyMatrix4(F);
      (FB[key] || (FB[key] = [])).push(tmpG);
    }
    var manualDoors = [[-7.0, 21.5], [7.0, -21.5], [-19.7, 11.6]];
    function nearManualDoor(wx, wz) {
      for (var mi = 0; mi < manualDoors.length; mi++) {
        var ddx = wx - manualDoors[mi][0], ddz = wz - manualDoors[mi][1];
        if (ddx * ddx + ddz * ddz < 5.5) return true;
      }
      return false;
    }
    var segs = [], i2, j2, j0, i0, len, wl, wr, wn, ws;
    for (i2 = GX; i2 <= GX + GW; i2++) {
      j2 = GZ;
      while (j2 < GZ + GD) {
        wl = walkable(i2 - 1, j2); wr = walkable(i2, j2);
        if (wl !== wr) {
          j0 = j2;
          while (j2 < GZ + GD && (walkable(i2 - 1, j2) !== walkable(i2, j2))) j2++;
          len = j2 - j0;
          if (wl) segs.push({ ox: i2 - WALL_T / 2, oz: j0, dx: 0, dz: 1, nx: -1, nz: 0, len: len });
          else segs.push({ ox: i2 + WALL_T / 2, oz: j2, dx: 0, dz: -1, nx: 1, nz: 0, len: len });
        } else j2++;
      }
    }
    for (j2 = GZ; j2 <= GZ + GD; j2++) {
      i2 = GX;
      while (i2 < GX + GW) {
        wn = walkable(i2, j2 - 1); ws = walkable(i2, j2);
        if (wn !== ws) {
          i0 = i2;
          while (i2 < GX + GW && (walkable(i2, j2 - 1) !== walkable(i2, j2))) i2++;
          len = i2 - i0;
          if (wn) segs.push({ ox: i2, oz: j2 - WALL_T / 2, dx: -1, dz: 0, nx: 0, nz: -1, len: len });
          else segs.push({ ox: i0, oz: j2 + WALL_T / 2, dx: 1, dz: 0, nx: 0, nz: 1, len: len });
        } else i2++;
      }
    }
    var si, ci, t, chW, seg, F, lC, rA, rB, rC, pk, stoneBuild;
    var plasterKeys = ['yellow', 'ochre', 'cream', 'grey', 'rust'];
    for (si = 0; si < segs.length; si++) {
      seg = segs[si];
      F = new THREE.Matrix4();
      F.makeBasis(new THREE.Vector3(seg.dx, 0, seg.dz), up, new THREE.Vector3(seg.nx, 0, seg.nz));
      F.setPosition(seg.ox, 0, seg.oz);
      t = 0; ci = 0;
      while (t < seg.len - 0.05) {
        chW = 3.6 + bananaHash(si * 17 + seg.ox, seg.oz * 3 + ci, 7) * 3.2;
        if (chW > seg.len - t) chW = seg.len - t;
        if (seg.len - t - chW < 2.0) chW = seg.len - t;
        rA = bananaHash(si * 13 + ci * 7, ci, si);
        rB = bananaHash(ci * 31 + 5, si * 17, 3);
        rC = bananaHash(si + 101, ci + 7, 11);
        lC = t + chW / 2;
        stoneBuild = rA > 0.8;
        pk = stoneBuild ? 'stone' : plasterKeys[Math.floor(rB * plasterKeys.length)];
        var wx0 = seg.ox + seg.dx * lC, wz0 = seg.oz + seg.dz * lC;
        var shutKey = rC < 0.55 ? 'shutterG' : 'shutterB';
        var winY = 4.85;
        // taş taban + sıva gövde
        fb('stone', chW - 0.03, 1.05, 0.1, lC, 0.525, 0.05, 0.3, 0, F);
        if (stoneBuild) fb('stone', chW - 0.03, WALL_H - 1.02, 0.075, lC, 1.02 + (WALL_H - 1.02) / 2, 0.038, 0.2, 0, F);
        else {
          fb(pk, chW - 0.08, WALL_H - 1.37, 0.06, lC, 1.02 + (WALL_H - 1.37) / 2, 0.03, 0.42, 0, F);
          fb('trim', chW - 0.06, 0.12, 0.1, lC, 3.62, 0.05, 0.5, 0, F);
        }
        // köşe taşları (yalnızca parsel uçlarında)
        var segEnd = t + chW >= seg.len - 0.08;
        if (stoneBuild) {
          var endsX = [];
          if (ci === 0) endsX.push(t + 0.3);
          if (segEnd) endsX.push(t + chW - 0.3);
          for (var ei = 0; ei < endsX.length; ei++) {
            for (var qy = 0.36; qy < WALL_H - 0.55; qy += 0.62) {
              var qw = (Math.round(qy / 0.62) % 2) ? 0.56 : 0.38;
              fb('quoin', qw, 0.28, 0.07, endsX[ei], qy, 0.055, 0.9, 0, F);
            }
          }
        }
        // pencere
        var winAt = function (wxw, wyw, wide) {
          var ww = wide ? 1.02 : 0.86, wh = wide ? 1.32 : 1.14;
          fb('trim', 0.14, wh + 0.26, 0.1, wxw - ww / 2 - 0.07, wyw, 0.05, 1, 0, F);
          fb('trim', 0.14, wh + 0.26, 0.1, wxw + ww / 2 + 0.07, wyw, 0.05, 1, 0, F);
          fb('trim', ww + 0.28, 0.14, 0.1, wxw, wyw + wh / 2 + 0.07, 0.05, 1, 0, F);
          fb('trim', ww + 0.28, 0.14, 0.1, wxw, wyw - wh / 2 - 0.07, 0.05, 1, 0, F);
          fb('glass', ww, wh, 0.03, wxw, wyw, 0.075, 1, 0, F);
          fb('woodDark', 0.045, wh, 0.02, wxw, wyw, 0.085, 1, 0, F);
          fb('woodDark', ww, 0.045, 0.02, wxw, wyw, 0.085, 1, 0, F);
          fb(shutKey, 0.4, wh + 0.08, 0.05, wxw - ww / 2 - 0.28, wyw, 0.09, 1, 0, F);
          fb(shutKey, 0.4, wh + 0.08, 0.05, wxw + ww / 2 + 0.28, wyw, 0.09, 1, 0, F);
          fb('trim', ww + 0.42, 0.1, 0.24, wxw, wyw - wh / 2 - 0.2, 0.1, 1, 0, F);
          if (bananaHash(si, ci, Math.round(wxw * 7)) < 0.68) {
            fb('woodDark', ww + 0.2, 0.22, 0.24, wxw, wyw - wh / 2 - 0.36, 0.16, 1, 0, F);
            for (var fi = -1; fi <= 1; fi++) {
              fb('leaf', 0.16, 0.16, 0.16, wxw + fi * 0.24, wyw - wh / 2 - 0.22, 0.24, 1, 0, F);
              if (fi === 0) fb('bloom', 0.13, 0.13, 0.13, wxw, wyw - wh / 2 - 0.14, 0.26, 1, 0, F);
            }
          }
        };
        // kapı (bazı parsellerde)
        if (rA < 0.24 && chW >= 3.2 && !nearManualDoor(wx0, wz0)) {
          var dwx = lC + (rC - 0.5) * Math.max(0, chW - 3.0) * 0.3;
          var dbl = rC > 0.62, darc = rC > 0.84;
          var dw2 = dbl ? 1.72 : 1.06, dh2 = dbl ? 2.45 : 2.24, pi;
          fb('wood', dw2, dh2, 0.08, dwx, dh2 / 2, 0.1, 0.6, 0, F);
          for (pi = 1; pi < (dbl ? 6 : 4); pi++)
            fb('woodDark', 0.035, dh2 - 0.1, 0.02, dwx - dw2 / 2 + dw2 * pi / (dbl ? 6 : 4), dh2 / 2, 0.15, 1, 0, F);
          fb('trim', 0.16, dh2 + 0.16, 0.12, dwx - dw2 / 2 - 0.09, dh2 / 2, 0.12, 1, 0, F);
          fb('trim', 0.16, dh2 + 0.16, 0.12, dwx + dw2 / 2 + 0.09, dh2 / 2, 0.12, 1, 0, F);
          fb('trim', dw2 + 0.42, 0.18, 0.16, dwx, dh2 + 0.08, 0.12, 1, 0, F);
          fb('trim', dw2 + 0.5, 0.09, 0.4, dwx, 0.045, 0.2, 0.8, 0, F);
          if (darc) ftorus('trim', dw2 / 2 + 0.08, 0.1, dwx, dh2 + 0.18, 0.11, F);
          fb('iron', 0.07, 0.1, 0.26, dwx + dw2 / 2 + 0.45, 2.86, 0.1, 1, 0, F);
          fb('glow', 0.16, 0.22, 0.16, dwx + dw2 / 2 + 0.45, 2.72, 0.2, 1, 0, F);
        } else if (rB > 0.42 && chW >= 3.4) {
          winAt(lC, 2.35, false);
          if (chW >= 5.4) winAt(lC + chW * 0.26, 2.35, false);
        }
        // üst kat pencereleri
        if (chW >= 5.4) {
          winAt(lC - chW * 0.23, winY, true);
          winAt(lC + chW * 0.23, winY, true);
        } else if (chW >= 3.2) winAt(lC, winY, false);
        // balkon
        if (rC > 0.78 && chW >= 4.4) {
          var balX = chW >= 5.4 ? lC - chW * 0.23 : lC;
          fb('trim', 2.0, 0.13, 0.85, balX, winY - 0.8, 0.4, 1, 0, F);
          fb('trim', 2.0, 0.1, 0.1, balX, winY - 0.82, 0.78, 1, 0, F);
          for (var bi = 0; bi < 7; bi++)
            fb('iron', 0.045, 1.0, 0.045, balX - 0.88 + bi * 0.293, winY - 0.24, 0.74, 1, 0, F);
          fb('iron', 1.9, 0.06, 0.06, balX, winY + 0.26, 0.74, 1, 0, F);
          fb('iron', 1.9, 0.05, 0.05, balX, winY + 0.02, 0.74, 1, 0, F);
          fb('leaf', 0.42, 0.2, 0.2, balX - 0.55, winY - 0.68, 0.8, 1, 0, F);
          fb('bloom', 0.16, 0.14, 0.16, balX + 0.5, winY - 0.64, 0.8, 1, 0, F);
        }
        // saçak + kiremit çatı
        fb('trim', chW, 0.24, 0.18, lC, WALL_H - 0.31, 0.07, 0.7, 0, F);
        fb('roof', chW + 0.1, 0.12, 2.6, lC, WALL_H + 0.2, -0.55, 0.55, 0.3, F);
        // çatı katı + anten
        if (rB > 0.55) {
          var ah = 0.9 + rC * 1.5;
          fb(pk, chW - 0.3, ah, 2.3, lC, WALL_H + ah / 2, -1.28, 0.4, 0, F);
          fb('roof', chW - 0.1, 0.12, 2.6, lC, WALL_H + ah + 0.14, -1.35, 0.55, 0.28, F);
          if (rA > 0.5) {
            fcyl('zinc', 0.035, 2.0, lC + chW * 0.18, WALL_H + ah + 1.05, -1.3, F);
            for (var ai = 0; ai < 4; ai++)
              fb('zinc', 0.9 - ai * 0.12, 0.03, 0.03, lC + chW * 0.18, WALL_H + ah + 1.5 + ai * 0.22, -1.3, 1, 0, F);
          }
        }
        // yağmur borusu
        if (rC < 0.35) fcyl('zinc', 0.055, WALL_H - 0.5, t + 0.24, (WALL_H - 0.5) / 2, 0.1, F);
        // duvar feneri
        if (rA > 0.86) {
          fb('iron', 0.07, 0.08, 0.24, lC, 3.9, 0.1, 1, 0, F);
          fb('glow', 0.15, 0.2, 0.15, lC, 3.76, 0.2, 1, 0, F);
          fb('iron', 0.2, 0.05, 0.2, lC, 3.88, 0.2, 1, 0, F);
        }
        t += chW; ci++;
      }
    }
    for (var mk in FB) {
      if (!FB[mk].length) continue;
      var mesh = new THREE.Mesh(mergeGeos(FB[mk]), mats[mk]);
      mesh.userData.noHit = true;
      mesh.receiveShadow = true;
      worldRoot.add(mesh);
    }
  }
    return { house: house, tree: tree, stall: stall, fountain: fountain, villageWell: villageWell, villageHaystack: villageHaystack, villageCart: villageCart, villageBench: villageBench, villageFence: villageFence, villageGarden: villageGarden, villageLamp: villageLamp, villagePlanter: villagePlanter, bananaPlanter: bananaPlanter, villageWindmill: villageWindmill, gableRoof: gableRoof, villageChapel: villageChapel, villageBarn: villageBarn, villageSightBlock: villageSightBlock, bananaHash: bananaHash, bananaStreetScene: bananaStreetScene };
  }

  function buildVillage(K) {
    var GD = K.GD, GW = K.GW, GX = K.GX, GZ = K.GZ, WALL_H = K.WALL_H, WALL_T = K.WALL_T, addBarrel = K.addBarrel, addCrate = K.addCrate, addRoom = K.addRoom, batchAdd = K.batchAdd, batchMat = K.batchMat, bloom = K.bloom, bmAshlarTint = K.bmAshlarTint, bmCrop = K.bmCrop, bmIron = K.bmIron, bmLampGlow = K.bmLampGlow, bmLeaf = K.bmLeaf, bmSoil = K.bmSoil, bmTrunk = K.bmTrunk, bmWood = K.bmWood, boxGeo = K.boxGeo, groundTint = K.groundTint, mergeGeos = K.mergeGeos, pi = K.pi, props = K.props, texAshlar = K.texAshlar, texDoorWood = K.texDoorWood, texPlaster = K.texPlaster, texPlasterGrey = K.texPlasterGrey, texPlasterOchre = K.texPlasterOchre, texPlasterRust = K.texPlasterRust, texPlasterYellow = K.texPlasterYellow, texRoofTile = K.texRoofTile, walkable = K.walkable, worldRoot = K.worldRoot;
    var __V = K.MAPS.village.helpers(K);
    var house = __V.house, tree = __V.tree, stall = __V.stall, fountain = __V.fountain, villageWell = __V.villageWell, villageHaystack = __V.villageHaystack, villageCart = __V.villageCart, villageBench = __V.villageBench, villageFence = __V.villageFence, villageGarden = __V.villageGarden, villageLamp = __V.villageLamp, villagePlanter = __V.villagePlanter, bananaPlanter = __V.bananaPlanter, villageWindmill = __V.villageWindmill, gableRoof = __V.gableRoof, villageChapel = __V.villageChapel, villageBarn = __V.villageBarn, villageSightBlock = __V.villageSightBlock;
    // ana cadde + kuzey/güney doğuş alanları
    addRoom(-8, -96, 16, 192, 'Ana Cadde');
    addRoom(-26, 70, 52, 26, 'Mavi Doğuş');
    addRoom(-26, -96, 52, 26, 'Kırmızı Doğuş');
    // merkez: köy alanı ve iki çarşı sokağı
    addRoom(-22, -20, 44, 40, 'Köy Alanı');
    addRoom(-80, -8, 58, 16, 'Batı Çarşı');
    addRoom(22, -6, 56, 16, 'Doğu Çarşı');
    // kuzey/güney yan yollar
    addRoom(-78, -70, 156, 14, 'Kuzey Yolu');
    addRoom(-80, 56, 72, 14, 'Batı Yaka');
    addRoom(8, 56, 72, 14, 'Doğu Yaka');
    // dış bulvarlar
    addRoom(-80, -96, 14, 166, 'Batı Bulvarı');
    addRoom(66, -96, 14, 166, 'Doğu Bulvarı');
    // iç sokaklar (blokları bölüp kuşatma yolları açar)
    addRoom(-52, -70, 12, 62, 'Değirmen Sokağı');
    addRoom(40, -70, 12, 64, 'Çeşme Sokağı');
    addRoom(-52, 8, 12, 62, 'Zeytin Sokağı');
    addRoom(38, 10, 12, 60, 'Bahçe Sokağı');
    // kırmızı doğuş yan sokakları
    addRoom(-80, -84, 54, 14, 'Batı Arka Sokak');
    addRoom(26, -84, 54, 14, 'Doğu Arka Sokak');
    // avlular
    addRoom(28, -50, 34, 30, 'Çan Avlusu');
    addRoom(-62, -50, 30, 30, 'Değirmen Avlusu');
    addRoom(-62, 24, 22, 30, 'Ahır Avlusu');
    addRoom(36, 24, 24, 30, 'Meyve Bahçesi');

    // merkez alanı: çeşme, pazar, ağaçlar
    fountain(0, 0);
    stall(-15, 12, 0.15, 0xd0a03a);
    stall(15, -12, Math.PI + 0.15, 0x3d7fd4);
    stall(-15, -12, -0.15, 0xa33b30);
    stall(15, 12, Math.PI - 0.15, 0x4f7a3a);
    tree(-19, 17, 1.1);
    tree(19, -17, 1.05);
    villageBench(5, 4, Math.PI);
    villageBench(-5, -4, 0);
    addCrate(-19, -17, 2, 2, 0.9);
    addCrate(17, 17, 2.4, 1, 1.0);
    addBarrel(-20, 3); addBarrel(20, -3); addBarrel(19, 2); addBarrel(-19, -2);
    villageLamp(-10, 10);
    villageLamp(10, -10);
    villagePlanter(-21, 8, Math.PI / 2);
    villagePlanter(21, -8, -Math.PI / 2);

    // batı çarşısı
    stall(-75, 5.2, Math.PI, 0x8c5a2e);
    stall(-65, -5.2, 0, 0xd0a03a);
    stall(-55, 5.2, Math.PI, 0x4f7a3a);
    stall(-45, -5.2, 0, 0x3d7fd4);
    stall(-32, 5.2, Math.PI, 0xa33b30);
    villageWell(-68, -3.5);
    villageCart(-58, 1.5, 0.2);
    addCrate(-38, -6.2, 1.8, 1.2, 0.9);
    addBarrel(-36, 5.2); addBarrel(-62, 6.2); addBarrel(-27, -5.6);
    tree(-50, 6.4, 0.95);
    villageLamp(-72, -1);
    villageLamp(-42, 1);

    // doğu çarşısı
    stall(30, -2.5, 0, 0xa33b30);
    stall(40, 8, Math.PI, 0xd0a03a);
    stall(50, -2.5, 0, 0x4f7a3a);
    stall(60, 8, Math.PI, 0x3d7fd4);
    stall(72, -2.5, 0, 0x8c5a2e);
    villageCart(36, 4.2, 1.9);
    villageWell(66, 6.5);
    addCrate(46, -4.6, 1.8, 1.4, 0.9);
    addBarrel(56, 3.2); addBarrel(74, 7.2); addBarrel(26, 8.4);
    tree(54, 9.2, 1.0);
    villageLamp(26, 4);
    villageLamp(70, -1);

    // ana caddede siper ve dolgu (uzun nişan hatlarını kırar)
    addCrate(-6, 40, 2, 1, 0.9);
    addBarrel(6, 34); villageCart(-5, 26, 0.1);
    addCrate(6, -32, 2, 1, 1.0);
    addBarrel(-6, -40); villageCart(5, -52, Math.PI - 0.15);
    addBarrel(6, 60); addCrate(-6, 62, 1.6, 1.6, 0.9);
    addBarrel(-5, -62);
    villageLamp(6, 46);
    villageLamp(-6, 14);
    villageLamp(6, -20);
    villageLamp(-6, -54);
    villagePlanter(-7, 52, Math.PI / 2);
    villagePlanter(7, -8, -Math.PI / 2);

    // merkez: ana caddeyi S kıvrımına sokan iki ev — doğuşlar birbirini göremez
    villageSightBlock(-3.4, 16, 10, 8, 5.4);
    villageSightBlock(3.4, -16, 10, 8, 5.4);
    // cadde ortasına serpiştirilmiş yüksek saman yığınları (uzun görüş hattı kırıcı)
    villageHaystack(0, 40, 1.3);
    villageHaystack(0, -40, 1.3);
    villageHaystack(5, 54, 1.1);
    villageHaystack(-5, -54, 1.1);

    // mavi doğuş alanı
    villageHaystack(-22, 76);
    villageHaystack(-22, 88);
    villageHaystack(22, 90);
    villageCart(-20, 72, 0.5);
    villageWell(20, 86);
    tree(-24, 94, 1.05);
    tree(24, 94, 1.0);
    addCrate(-24, 82, 1.6, 1.6, 0.9);
    addCrate(24, 80, 1.6, 1.6, 0.9);
    addBarrel(-24, 86); addBarrel(24, 84);
    groundTint(36, 18, -14, 83, 0x3d7fd4, 0.10);

    // kırmızı doğuş alanı
    villageHaystack(-22, -76);
    villageHaystack(22, -88);
    villageHaystack(-22, -90);
    villageCart(20, -72, -0.5);
    villageWell(-20, -86);
    tree(24, -94, 1.05);
    tree(-24, -94, 1.0);
    addCrate(24, -82, 1.6, 1.6, 0.9);
    addCrate(-24, -80, 1.6, 1.6, 0.9);
    addBarrel(24, -86); addBarrel(-24, -84);
    groundTint(36, 18, 14, -83, 0xa33b30, 0.10);

    // kuzey yolu
    stall(-20, -58.5, 0, 0xd0a03a);
    stall(-60, -67.5, Math.PI, 0x4f7a3a);
    villageCart(14, -63, 1.4);
    addCrate(-40, -60, 1.8, 1.4, 0.9);
    addCrate(40, -66, 1.6, 1.6, 0.9);
    addBarrel(70, -62); addBarrel(-74, -64);
    tree(-76, -58, 0.95);
    tree(76, -68, 0.95);
    villageLamp(-50, -62);
    villageLamp(50, -62);
    villageGarden(-16, -69, 4, 1.6);
    villageGarden(12, -69, 4, 1.6);

    // batı/doğu yaka yolları
    stall(-60, 60, Math.PI, 0x3d7fd4);
    stall(60, 64, 0, 0xd0a03a);
    villageCart(-30, 64, 0.3);
    villageCart(30, 60, 2.8);
    addCrate(-70, 66, 1.6, 1.6, 0.9);
    addCrate(70, 60, 1.6, 1.6, 0.9);
    addBarrel(-50, 58); addBarrel(50, 66);
    tree(-78, 68, 0.95);
    tree(78, 68, 0.95);
    villageGarden(-40, 64, 5, 1.6);
    villageGarden(40, 64, 5, 1.6);

    // batı bulvarı
    villageLamp(-73, 20);
    villageLamp(-73, -20);
    villageLamp(-73, 44);
    villageLamp(-73, -44);
    addBarrel(-79, 10); addBarrel(-67, -30);
    addCrate(-79, 30, 1.6, 1.6, 0.9);
    addCrate(-67, -10, 1.6, 1.6, 1.0);
    tree(-79, 52, 0.95);
    tree(-67, -52, 0.95);
    villageCart(-73, 60, 0.2);
    villageCart(-73, -60, 0.3);
    villageFence(-80, 2, 6, false);
    villageFence(-66, -40, 5, false);

    // doğu bulvarı
    villageLamp(73, 20);
    villageLamp(73, -20);
    villageLamp(73, 44);
    villageLamp(73, -44);
    addBarrel(79, -10); addBarrel(67, 30);
    addCrate(79, -30, 1.6, 1.6, 0.9);
    addCrate(67, 10, 1.6, 1.6, 1.0);
    tree(79, -52, 0.95);
    tree(67, 52, 0.95);
    villageCart(73, -60, 0.2);
    villageCart(73, 60, 0.3);
    villageFence(80, -6, 6, false);
    villageFence(66, 40, 5, false);

    // iç sokaklar
    addCrate(-50, -55, 1.8, 1.4, 0.9);
    addBarrel(-42, -25);
    villageLamp(-46, -14);
    tree(-50, -62, 0.9);
    addCrate(50, -60, 1.6, 1.6, 0.9);
    addBarrel(41, -25);
    villageLamp(46, -14);
    tree(50, -63, 0.9);
    addCrate(-50, 20, 1.8, 1.8, 0.9);
    addBarrel(-41, 35);
    villageLamp(-46, 46);
    tree(-50, 64, 0.95);
    addCrate(49, 20, 1.8, 1.8, 0.9);
    addBarrel(39, 35);
    villageLamp(44, 50);
    tree(49, 64, 0.95);

    // kırmızı arka sokaklar
    villageHaystack(-70, -78);
    villageHaystack(-50, -74);
    villageCart(-40, -77, 0.2);
    addCrate(-76, -83, 1.8, 1.4, 0.9);
    addBarrel(-60, -81);
    villageHaystack(60, -78);
    villageHaystack(40, -74, 0.9);
    villageCart(70, -77, 0.5);
    addCrate(76, -83, 1.8, 1.4, 0.9);
    addBarrel(50, -81);

    // çan avlusu
    villageChapel(45, -33);
    villageBench(33, -28, 0);
    villageBench(57, -45, Math.PI);
    villageGarden(30, -46, 5, 1.6);
    villageGarden(54, -24, 5, 1.6);
    tree(33, -42, 0.95);
    tree(58, -28, 0.95);
    villagePlanter(30, -24, 0);
    villagePlanter(58, -48, Math.PI);
    addBarrel(36, -23); addBarrel(57, -24);

    // değirmen avlusu
    villageWindmill(-50, -38);
    villageHaystack(-36, -24);
    villageHaystack(-58, -24, 0.9);
    villageCart(-58, -44, 0.4);
    addCrate(-35, -46, 1.6, 1.6, 0.9);
    tree(-36, -46, 0.95);
    villageLamp(-60, -34);
    addBarrel(-40, -23);

    // ahır avlusu
    villageBarn(-51, 42);
    villageHaystack(-44, 28);
    villageHaystack(-58, 30, 0.9);
    villageCart(-44, 52, 1.2);
    villageWell(-58, 50);
    villageFence(-62, 28, 8, false);
    tree(-44, 34, 0.95);
    addBarrel(-40, 32);

    // meyve bahçesi
    tree(40, 30, 0.95); tree(48, 34, 1.0); tree(56, 28, 0.9);
    tree(42, 42, 1.0); tree(52, 46, 0.95); tree(58, 52, 1.0);
    tree(40, 52, 0.9);
    villageCart(50, 26, 2.2);
    villageGarden(44, 50, 4, 1.6);
    villageBench(46, 38, Math.PI / 2);
    villageFence(36, 24, 9, true);
    addBarrel(56, 24);

    // sokak arkası evler (yürünebilir alan dışında; çatıları silüet verir)
    house(0, 106, 12, 8, 6.4, '#d8cbb0', '#8a4b32');
    house(-30, 104, 10, 7, 6.0, '#cfc0a2', '#7c3f2a');
    house(30, 104, 10, 7, 6.0, '#d8cbb0', '#7c3f2a');
    house(0, -106, 12, 8, 6.4, '#cfc0a2', '#7c3f2a');
    house(-30, -104, 10, 7, 6.0, '#d8cbb0', '#8a4b32');
    house(30, -104, 10, 7, 6.0, '#cfc0a2', '#8a4b32');
    house(-92, -40, 9, 8, 6.6, '#d8cbb0', '#7c3f2a');
    house(-92, -10, 9, 8, 6.2, '#cfc0a2', '#8a4b32');
    house(-92, 20, 9, 8, 6.8, '#d8cbb0', '#7c3f2a');
    house(-92, 48, 9, 8, 6.2, '#cfc0a2', '#8a4b32');
    house(92, -40, 9, 8, 6.6, '#d8cbb0', '#8a4b32');
    house(92, -10, 9, 8, 6.2, '#cfc0a2', '#7c3f2a');
    house(92, 20, 9, 8, 6.8, '#d8cbb0', '#8a4b32');
    house(92, 48, 9, 8, 6.2, '#cfc0a2', '#7c3f2a');
    house(-33, -30, 7, 6, 6.0, '#d8cbb0', '#7c3f2a');
    house(-16, -44, 8, 6, 5.8, '#cfc0a2', '#8a4b32');
    house(-33, -50, 7, 6, 6.2, '#d8cbb0', '#8a4b32');
    house(14, -32, 7, 6, 6.0, '#cfc0a2', '#7c3f2a');
    house(16, -48, 8, 6, 5.6, '#d8cbb0', '#7c3f2a');
    house(-32, 28, 8, 6, 5.8, '#cfc0a2', '#8a4b32');
    house(-32, 44, 7, 6, 6.0, '#d8cbb0', '#7c3f2a');
    house(28, 30, 8, 6, 6.0, '#cfc0a2', '#8a4b32');
    house(30, 46, 7, 6, 5.6, '#d8cbb0', '#7c3f2a');
    house(-71, 12, 8, 6, 5.6, '#cfc0a2', '#7c3f2a');
    house(-71, 20, 7, 6, 5.8, '#d8cbb0', '#8a4b32');
    house(61, 12, 8, 6, 5.6, '#cfc0a2', '#8a4b32');
    house(61, 20, 7, 6, 5.8, '#d8cbb0', '#7c3f2a');
    house(-60, -90, 8, 6, 5.8, '#cfc0a2', '#8a4b32');
    house(60, -90, 8, 6, 5.8, '#d8cbb0', '#7c3f2a');
  }

  function villagePostBuild(K) { K.MAPS.village.helpers(K).bananaStreetScene(); }

  M.village = {
      name: 'Köy', desc: 'Büyük TDM köyü · ana cadde, iki bulvar, çarşılar, avlular, değirmen', theme: 'village',
      wallH: 6.8, restricted: false, build: buildVillage, postBuild: villagePostBuild,
      spawns: { blue: { x: -16, z: 84, yaw: 0, name: 'Mavi Doğuş' }, red: { x: 16, z: -84, yaw: Math.PI, name: 'Kırmızı Doğuş' } },
      miniLabels: [{ t: 'MAVİ', x: -16, z: 84 }, { t: 'KIRMIZI', x: 16, z: -84 }],
      routes: {
        blue: [
          [[-16, 74], [-4, 66], [-4, 40], [2, 24], [10, 8], [2, -6], [-6, -24], [-4, -56], [0, -72]],
          [[-16, 74], [22, 62], [46, 62], [46, 20], [46, 8], [46, -40], [46, -58], [14, -62], [0, -72]],
          [[-16, 74], [-22, 62], [-46, 62], [-46, 20], [-46, 8], [-46, -40], [-46, -58], [-14, -62], [0, -72]],
          [[-16, 74], [-73, 62], [-73, 0], [-73, -62], [-73, -80], [-46, -77], [-14, -62], [0, -72]]
        ],
        red: [
          [[16, -74], [4, -66], [4, -40], [-2, -24], [-10, -8], [-2, 6], [6, 24], [4, 56], [0, 72]],
          [[16, -74], [-22, -62], [-46, -62], [-46, -20], [-46, 8], [-46, 40], [-46, 62], [-14, 62], [0, 72]],
          [[16, -74], [22, -62], [46, -62], [46, -20], [46, 8], [46, 40], [46, 62], [14, 62], [0, 72]],
          [[16, -74], [-73, -62], [-73, 0], [-73, 62], [-46, 66], [-14, 62], [0, 72]]
        ]
      }
  };
  M.village.helpers = helpers;
})();
