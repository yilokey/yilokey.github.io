/* BASIC-STRIKE harita: awp_lego_2 — game.js içinden ayrıldı */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function helpers(K) {
    var PH = K.PH, STEP = K.STEP, addBlock = K.addBlock, addRoom = K.addRoom, boxGeo = K.boxGeo, climbZones = K.climbZones, findClearSpot = K.findClearSpot, ledgeRamps = K.ledgeRamps, part = K.part, props = K.props, ramps = K.ramps, texLegoPlate = K.texLegoPlate, worldMats = K.worldMats, worldRoot = K.worldRoot;
    var LEGO_GOLD_COL = 0xd9a72a;

  function goldBox(x, z, w, d, y0, h) {
    var g = boxGeo(w, h, d, 0.5);
    g.translate(x + w / 2, y0 + h / 2, z + d / 2);
    var m = new THREE.Mesh(g, [worldMats.goldSide, worldMats.goldSide, worldMats.goldTop,
      worldMats.goldSide, worldMats.goldSide, worldMats.goldSide]);
    m.castShadow = true; m.receiveShadow = true;
    worldRoot.add(m);
    props.push({ x0: x, x1: x + w, z0: z, z1: z + d, y0: y0, y1: y0 + h });
  }
  function plateZone(x, z, w, d, color) {
    var t = texLegoPlate.clone();
    t.needsUpdate = true;
    t.repeat.set(w / 2, d / 2);
    var mat = new THREE.MeshLambertMaterial({ map: t, color: color });
    mat.userData.ownMap = true;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x + w / 2, 0.012, z + d / 2);
    m.receiveShadow = true; m.userData.noHit = true;
    worldRoot.add(m);
  }
  function ladderX(x, zc, y0, y1) {
    var mat = worldMats.ladder, i, m, y;
    for (i = -1; i <= 1; i += 2) {
      m = part(0.07, y1 - y0, 0.07, x, (y0 + y1) / 2, zc + i * 0.45, mat);
      m.userData.noHit = true; m.castShadow = false;
    }
    for (y = y0 + 0.2; y < y1 - 0.06; y += 0.3) {
      m = part(0.06, 0.06, 0.96, x, y, zc, mat);
      m.userData.noHit = true; m.castShadow = false;
    }
  }
  function ladderZ(z, xc, y0, y1) {
    var mat = worldMats.ladder, i, m, y;
    for (i = -1; i <= 1; i += 2) {
      m = part(0.07, y1 - y0, 0.07, xc + i * 0.45, (y0 + y1) / 2, z, mat);
      m.userData.noHit = true; m.castShadow = false;
    }
    for (y = y0 + 0.2; y < y1 - 0.06; y += 0.3) {
      m = part(0.96, 0.06, 0.06, xc, y, z, mat);
      m.userData.noHit = true; m.castShadow = false;
    }
  }
  function addClimb(x, z, y0, y1, hx, hz) {
    climbZones.push({ x: x, z: z, y0: y0, y1: y1, hx: hx, hz: hz });
  }
  function archTrimX(xf) {
    var mat = worldMats.trim, s, i, b, t, z, y, dz, dy, len, N = 20, dt = Math.PI / N;
    for (s = -1; s <= 1; s += 2) {
      b = part(0.13, 2.34, 0.22, xf, 1.17, s * 3.06, mat);
      b.userData.noHit = true;
    }
    for (i = 0; i <= N; i++) {
      t = i * dt;
      z = 3.0 * Math.cos(t);
      y = 2.3 + 0.55 * Math.sin(t);
      dz = -3.0 * Math.sin(t) * dt;
      dy = 0.55 * Math.cos(t) * dt;
      len = Math.sqrt(dz * dz + dy * dy) * 1.45 + 0.05;
      b = part(0.13, 0.18, len, xf, y, z, mat);
      b.rotation.x = Math.atan2(-dy, dz);
      b.userData.noHit = true;
    }
  }
  function darkCeil(x, z, w, d) {
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: 0x3a2f1d }));
    m.rotation.x = Math.PI / 2;
    m.position.set(x + w / 2, 2.585, z + d / 2);
    m.userData.noHit = true;
    worldRoot.add(m);
  }
  function addRamp(x0, x1, zA, zB, yA, yB) {
    ramps.push({ x0: x0, x1: x1, zA: zA, zB: zB, yA: yA, yB: yB });
  }
  function rampYAt(r, z) {
    var span = r.zB - r.zA;
    if (Math.abs(span) < 1e-6) return Math.max(r.yA, r.yB);
    var k = (z - r.zA) / span;
    k = Math.max(0, Math.min(1, k));
    return r.yA + (r.yB - r.yA) * k;
  }
  function rampBlocksAt(x, z, y) {
    for (var i = 0; i < ramps.length; i++) {
      var r = ramps[i];
      if (x <= r.x0 || x >= r.x1) continue;
      if (z <= Math.min(r.zA, r.zB) || z >= Math.max(r.zA, r.zB)) continue;
      var ry = rampYAt(r, z);
      if (ry > y + STEP + 0.01 && ry - 0.32 < y + PH) return true;   // gövdeler, alt boşluk açık kalır
    }
    return false;
  }
    return { goldBox: goldBox, plateZone: plateZone, ladderX: ladderX, ladderZ: ladderZ, addClimb: addClimb, archTrimX: archTrimX, darkCeil: darkCeil, addRamp: addRamp, rampYAt: rampYAt, rampBlocksAt: rampBlocksAt };
  }

  function buildLegoRamp(K, dir) {
    var PH = K.PH, STEP = K.STEP, addBlock = K.addBlock, addRoom = K.addRoom, boxGeo = K.boxGeo, climbZones = K.climbZones, findClearSpot = K.findClearSpot, ledgeRamps = K.ledgeRamps, part = K.part, props = K.props, ramps = K.ramps, texLegoPlate = K.texLegoPlate, worldMats = K.worldMats, worldRoot = K.worldRoot;
    var __V = K.MAPS.awp_lego_2.helpers(K);
    var goldBox = __V.goldBox, plateZone = __V.plateZone, ladderX = __V.ladderX, ladderZ = __V.ladderZ, addClimb = __V.addClimb, archTrimX = __V.archTrimX, darkCeil = __V.darkCeil, addRamp = __V.addRamp, rampYAt = __V.rampYAt, rampBlocksAt = __V.rampBlocksAt;
    var s, L = Math.sqrt(12 * 12 + 3.2 * 3.2);
    var th = dir * Math.atan2(3.2, 12);
    var midZ = dir * 16;
    var rg = boxGeo(7, 0.3, L, 0.5);
    var rm = new THREE.Mesh(rg, worldMats.goldTop);
    rm.position.set(0, 1.6 - 0.15 * Math.cos(th), midZ - 0.15 * Math.sin(th));
    rm.rotation.x = th;
    rm.castShadow = true; rm.receiveShadow = true;
    worldRoot.add(rm);
    for (s = -1; s <= 1; s += 2) {
      var cg = boxGeo(0.26, 0.5, L, 0.5);
      var cm = new THREE.Mesh(cg, worldMats.gold);
      cm.position.set(s * 3.73, 1.6 + 0.25 * Math.cos(th), midZ + 0.25 * Math.sin(th));
      cm.rotation.x = th;
      cm.castShadow = true; cm.receiveShadow = true;
      worldRoot.add(cm);
    }
    // tek eğimli yüzey: basamak sarsıntısı yok, rampa altından yürünebilir
    addRamp(-3.5, 3.5, dir * 22, dir * 10, 0, 3.2);
    // korkuluk üst yüzeyleri: üzerinde yürünebilir, ama alt geçişi kapatmaz
    ledgeRamps.push({ x0: -3.95, x1: -3.52, zA: dir * 22, zB: dir * 10, yA: 0.5, yB: 3.7 });
    ledgeRamps.push({ x0: 3.52, x1: 3.95, zA: dir * 22, zB: dir * 10, yA: 0.5, yB: 3.7 });
  }

  function buildAwpLego2(K) {
    var PH = K.PH, STEP = K.STEP, addBlock = K.addBlock, addRoom = K.addRoom, boxGeo = K.boxGeo, climbZones = K.climbZones, findClearSpot = K.findClearSpot, ledgeRamps = K.ledgeRamps, part = K.part, props = K.props, ramps = K.ramps, texLegoPlate = K.texLegoPlate, worldMats = K.worldMats, worldRoot = K.worldRoot;
    var LEGO_GOLD_COL = 0xd9a72a;
    var __V = K.MAPS.awp_lego_2.helpers(K);
    var goldBox = __V.goldBox, plateZone = __V.plateZone, ladderX = __V.ladderX, ladderZ = __V.ladderZ, addClimb = __V.addClimb, archTrimX = __V.archTrimX, darkCeil = __V.darkCeil, addRamp = __V.addRamp, rampYAt = __V.rampYAt, rampBlocksAt = __V.rampBlocksAt;
    addRoom(-30, -26, 60, 52, 'Lego Arena');

    // zemin baseplate bölgeleri
    plateZone(-30, 12, 60, 14, 0x355fc4);
    plateZone(-30, -26, 60, 14, 0xc2352f);
    plateZone(-30, -12, 60, 24, 0x3f9a3a);

    // altın üs: kuzey/güney kütleler + tünel üstü güverte (orta delikli)
    goldBox(-15, -10, 30, 7, 0, 3.2);
    goldBox(-15, 3, 30, 7, 0, 3.2);
    goldBox(-15, -3, 13.4, 6, 2.6, 0.6);
    goldBox(1.6, -3, 13.4, 6, 2.6, 0.6);
    goldBox(-1.6, -3, 3.2, 1.4, 2.6, 0.6);
    goldBox(-1.6, 1.6, 3.2, 1.4, 2.6, 0.6);
    darkCeil(-14.6, -2.85, 13.0, 5.7);
    darkCeil(1.6, -2.85, 13.0, 5.7);
    darkCeil(-1.6, -2.85, 3.2, 1.25);
    darkCeil(-1.6, 1.6, 3.2, 1.25);
    // tünel ağızlarındaki üst kiriş
    goldBox(14.2, -3, 0.8, 6, 2.3, 0.9);
    goldBox(-15, -3, 0.8, 6, 2.3, 0.9);
    archTrimX(15.06);
    archTrimX(-15.06);

    // güverte parapetleri (rampa ve tünel boşlukları açık)
    goldBox(-15, 9.6, 11, 0.4, 3.2, 1.0);
    goldBox(4, 9.6, 11, 0.4, 3.2, 1.0);
    goldBox(-15, -10, 11, 0.4, 3.2, 1.0);
    goldBox(4, -10, 11, 0.4, 3.2, 1.0);
    goldBox(14.6, -10, 0.4, 8.5, 3.2, 1.0);
    goldBox(14.6, 1.5, 0.4, 8.5, 3.2, 1.0);
    goldBox(-15, -10, 0.4, 8.5, 3.2, 1.0);
    goldBox(-15, 1.5, 0.4, 8.5, 3.2, 1.0);
    // tünel üstü boşluklarda alçak eşik
    goldBox(14.6, -1.5, 0.4, 3, 3.2, 0.35);
    goldBox(-15, -1.5, 0.4, 3, 3.2, 0.35);

    // kule: güvertedeki deliğin tam üzerinde, dört kapılı oyuk tuğla gövde + belfry
    goldBox(-4, -4, 2.9, 0.5, 3.2, 3.0);
    goldBox(1.1, -4, 2.9, 0.5, 3.2, 3.0);
    goldBox(-1.1, -4, 2.2, 0.5, 5.4, 0.8);
    goldBox(-4, 3.5, 2.9, 0.5, 3.2, 3.0);
    goldBox(1.1, 3.5, 2.9, 0.5, 3.2, 3.0);
    goldBox(-1.1, 3.5, 2.2, 0.5, 5.4, 0.8);
    goldBox(-4, -3.5, 0.5, 2.4, 3.2, 3.0);
    goldBox(-4, 1.1, 0.5, 2.4, 3.2, 3.0);
    goldBox(-4, -1.1, 0.5, 2.2, 5.4, 0.8);
    goldBox(3.5, -3.5, 0.5, 2.4, 3.2, 3.0);
    goldBox(3.5, 1.1, 0.5, 2.4, 3.2, 3.0);
    goldBox(3.5, -1.1, 0.5, 2.2, 5.4, 0.8);
    var tx2, tz2, tp;
    for (tx2 = -1; tx2 <= 1; tx2 += 2) for (tz2 = -1; tz2 <= 1; tz2 += 2) {
      tp = part(0.55, 2.6, 0.55, tx2 * 3.75, 7.5, tz2 * 3.75, worldMats.gold);
      tp.userData.noHit = true;
    }
    tp = part(7.5, 0.35, 0.7, 0, 8.65, -3.75, worldMats.gold); tp.userData.noHit = true;
    tp = part(7.5, 0.35, 0.7, 0, 8.65, 3.75, worldMats.gold); tp.userData.noHit = true;
    tp = part(0.7, 0.35, 7.5, 3.75, 8.65, 0, worldMats.gold); tp.userData.noHit = true;
    tp = part(0.7, 0.35, 7.5, -3.75, 8.65, 0, worldMats.gold); tp.userData.noHit = true;

    // güvertedeki delik çerçevesi
    addBlock(-1.6, -1.82, 3.2, 0.22, 0.2, LEGO_GOLD_COL, 3.2);
    addBlock(-1.6, 1.6, 3.2, 0.22, 0.2, LEGO_GOLD_COL, 3.2);
    addBlock(-1.82, -1.6, 0.22, 3.2, 0.2, LEGO_GOLD_COL, 3.2);
    addBlock(1.6, -1.6, 0.22, 3.2, 0.2, LEGO_GOLD_COL, 3.2);

    // kırmızı merdivenler: dış cepheler, tünel içi ve güverte deliği
    ladderX(15.08, 4.55, 0.15, 4.35);
    ladderX(-15.08, -4.55, 0.15, 4.35);
    addClimb(15.08, 4.55, 0.15, 4.25, 0.55, 0.9);
    addClimb(-15.08, -4.55, 0.15, 4.25, 0.55, 0.9);
    ladderZ(2.94, -11, 0.15, 2.5);
    ladderZ(-2.94, 11, 0.15, 2.5);
    ladderX(-1.44, 0, 0.15, 3.15);
    addClimb(-1.44, 0, 0.15, 3.2, 0.5, 0.9);

    // iki rampa (güney / kuzey)
    buildLegoRamp(K, 1);
    buildLegoRamp(K, -1);
  }

  function legoSpawnList(K) {
    var PH = K.PH, STEP = K.STEP, addBlock = K.addBlock, addRoom = K.addRoom, boxGeo = K.boxGeo, climbZones = K.climbZones, findClearSpot = K.findClearSpot, ledgeRamps = K.ledgeRamps, part = K.part, props = K.props, ramps = K.ramps, texLegoPlate = K.texLegoPlate, worldMats = K.worldMats, worldRoot = K.worldRoot;
    var __V = K.MAPS.awp_lego_2.helpers(K);
    var goldBox = __V.goldBox, plateZone = __V.plateZone, ladderX = __V.ladderX, ladderZ = __V.ladderZ, addClimb = __V.addClimb, archTrimX = __V.archTrimX, darkCeil = __V.darkCeil, addRamp = __V.addRamp, rampYAt = __V.rampYAt, rampBlocksAt = __V.rampBlocksAt;
    var blue = [], red = [], rows = [23.4, 24.9], step = 2.5, i, j, s;
    for (j = 0; j < rows.length; j++)
      for (i = 0; i < 15; i++) {
        s = findClearSpot(17.5 - i * step, rows[j], 0.55) || { x: 17.5 - i * step, z: rows[j] };
        blue.push({ x: s.x, z: s.z, yaw: 0 });
        s = findClearSpot(-17.5 + i * step, -rows[j], 0.55) || { x: -17.5 + i * step, z: -rows[j] };
        red.push({ x: s.x, z: s.z, yaw: Math.PI });
      }
    return { blue: blue, red: red };
  }

  function legoRoutes() {
    var blue = [
      [[16, 16], [18, 9], [18, 2], [16, 0], [8, 0], [-8, 0], [-16, 0], [-18, -3], [-18, -10], [-14, -16], [-6, -20]],
      [[14, 18], [18, 12], [18, 4], [18, -4], [16, -12], [10, -16], [6, -20]],
      [[10, 20], [6, 24], [-4, 24], [-14, 20], [-18, 12], [-18, 4], [-18, -4], [-18, -12], [-14, -16], [-6, -20]],
      [[12, 16], [16, 10], [18, 3], [16, 0], [10, 0], [0, 0], [-10, 0], [-16, 0], [-18, -4], [-18, -12], [-12, -16], [-6, -20]],
      [[10, 22], [2, 24], [-10, 22], [-16, 16], [-18, 8], [-18, -2], [-16, -10], [-10, -14], [-6, -17], [-6, -21]]
    ];
    var red = [], i, j, r;
    for (i = 0; i < blue.length; i++) {
      r = [];
      for (j = 0; j < blue[i].length; j++) r.push([-blue[i][j][0], -blue[i][j][1]]);
      red.push(r);
    }
    return { blue: blue, red: red };
  }

  M.awp_lego_2 = {
      name: 'AWP Lego 2', desc: 'Lego kalesi · rampa, kule, tünel · AWP + Deagle', theme: 'legofield',
      wallH: 12, restricted: true, build: buildAwpLego2, spawnsFn: legoSpawnList,
      spawns: { blue: { x: 0, z: 23.4, yaw: 0, name: 'Mavi Spawn' },
        red: { x: 0, z: -23.4, yaw: Math.PI, name: 'Kırmızı Spawn' } },
      miniLabels: [{ t: 'MAVİ', x: 21, z: 19 }, { t: 'KIRMIZI', x: -21, z: -19 }],
      routes: legoRoutes()
  };
  M.awp_lego_2.helpers = helpers;
})();
