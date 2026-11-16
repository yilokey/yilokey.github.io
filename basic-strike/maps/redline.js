/* BASIC-STRIKE harita: redline — game.js içinden ayrıldı */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function buildRedline(K) {
    var addBarrel = K.addBarrel, addCrate = K.addCrate, addMetalCrate = K.addMetalCrate, addRoom = K.addRoom, findClearSpot = K.findClearSpot, groundDecal = K.groundDecal, groundTint = K.groundTint, hazardStrip = K.hazardStrip, texWeaponDecal = K.texWeaponDecal, warehouseCeiling = K.warehouseCeiling, worldRoot = K.worldRoot;
    var __V = K.MAPS.awp_lego_2.helpers(K);
    var goldBox = __V.goldBox, plateZone = __V.plateZone, ladderX = __V.ladderX, ladderZ = __V.ladderZ, addClimb = __V.addClimb, archTrimX = __V.archTrimX, darkCeil = __V.darkCeil;
    addRoom(-12, -17, 24, 34, 'Depo Salonu');

    // zemin: takım alanları, silah siluetleri, tehlike şeridi
    groundTint(6.5, 20, -9.0, 0, 0x3d7fd4, 0.12);
    groundTint(6.5, 20, 9.0, 0, 0xa33b30, 0.12);
    groundDecal(texWeaponDecal, 4.0, -5.1, 0, 0.25, true);
    groundDecal(texWeaponDecal, 4.0, 5.1, 0, 0.25 + Math.PI, true);
    groundDecal(texWeaponDecal, 3.6, 0, 5.0, 0.15, true);
    groundDecal(texWeaponDecal, 3.6, 0, -5.0, 0.15 + Math.PI, true);
    groundDecal(texWeaponDecal, 3.2, 4.2, 12.6, -0.5, true);
    groundDecal(texWeaponDecal, 3.2, -4.2, -12.6, -0.5 + Math.PI, true);
    hazardStrip(-11.45, -16, 3.2, 9.5);

    // merkez çelik konteyner
    addMetalCrate(-1.5, -1.2, 3.0, 2.4, 2.3);

    // 180° dönel simetrik siper yerleşimi (her parça eşiyle aynı)
    addCrate(3.8, 8.0, 2.0, 2.0, 1.7);
    addCrate(-5.8, -10.0, 2.0, 2.0, 1.7);
    addCrate(3.6, 5.2, 1.4, 1.4, 0.85);
    addCrate(-5.0, -6.6, 1.4, 1.4, 0.85);
    addMetalCrate(-8.2, 8.4, 2.6, 2.6, 2.3);
    addMetalCrate(5.6, -11.0, 2.6, 2.6, 2.3);
    addCrate(7.2, 9.0, 1.7, 1.7, 0.9);
    addCrate(-8.9, -10.7, 1.7, 1.7, 0.9);
    addCrate(-4.8, 7.0, 1.7, 1.7, 0.9);
    addCrate(3.1, -8.7, 1.7, 1.7, 0.9);
    // istiflenmiş ahşap kasalar
    addCrate(-9.2, 6.0, 2.2, 2.2, 0.9);
    addCrate(-9.0, 6.2, 1.6, 1.6, 0.85, 0.9);
    addCrate(7.0, -8.2, 2.2, 2.2, 0.9);
    addCrate(7.4, -7.8, 1.6, 1.6, 0.85, 0.9);
    // konteyner üstü kasalar
    addCrate(-7.9, 8.7, 1.3, 1.3, 0.7, 2.3);
    addCrate(6.6, -10.0, 1.3, 1.3, 0.7, 2.3);
    // varil çiftleri
    addBarrel(-3.4, 2.6); addBarrel(3.4, -2.6);
    addBarrel(6.0, 6.6); addBarrel(-6.0, -6.6);
    // doğuş önü siper kasaları: mavi sağdan sola, kırmızı soldan sağa
    addCrate(-7.6, 2.6, 1.5, 1.5, 1.8);
    addCrate(-7.6, -2.2, 1.5, 1.5, 1.8);
    addCrate(-7.6, -7.0, 1.5, 1.5, 1.8);
    addCrate(6.1, -2.6, 1.5, 1.5, 1.8);
    addCrate(6.1, 2.2, 1.5, 1.5, 1.8);
    addCrate(6.1, 7.0, 1.5, 1.5, 1.8);

    // tavan + aydınlatma
    warehouseCeiling(-12, -17, 24, 34, 7.5);

    // yüksek pencereler (dekor)
    var glass = new THREE.MeshBasicMaterial({ color: 0xd9e6ea });
    var wframe = new THREE.MeshLambertMaterial({ color: 0x3a3d3e });
    var wz, sx, fx, fr, gl, wx, sz, fz, fr2, gl2;
    for (wz = -12.5; wz <= 12.5; wz += 5) {
      for (sx = -1; sx <= 1; sx += 2) {
        fx = sx * 11.72;
        fr = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 3.4), wframe);
        fr.position.set(fx, 5.15, wz);
        fr.userData.noHit = true; worldRoot.add(fr);
        gl = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.5), glass);
        gl.position.set(fx - sx * 0.09, 5.15, wz);
        gl.rotation.y = -sx * Math.PI / 2;
        gl.userData.noHit = true; worldRoot.add(gl);
      }
    }
    for (wx = -6; wx <= 6; wx += 6) {
      for (sz = -1; sz <= 1; sz += 2) {
        fz = sz * 16.72;
        fr2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.8, 0.14), wframe);
        fr2.position.set(wx, 5.15, fz);
        fr2.userData.noHit = true; worldRoot.add(fr2);
        gl2 = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.5), glass);
        gl2.position.set(wx, 5.15, fz - sz * 0.09);
        if (sz > 0) gl2.rotation.y = Math.PI;
        gl2.userData.noHit = true; worldRoot.add(gl2);
      }
    }
  }

  function redlineSpawnList(K) {
    var addBarrel = K.addBarrel, addCrate = K.addCrate, addMetalCrate = K.addMetalCrate, addRoom = K.addRoom, findClearSpot = K.findClearSpot, groundDecal = K.groundDecal, groundTint = K.groundTint, hazardStrip = K.hazardStrip, texWeaponDecal = K.texWeaponDecal, warehouseCeiling = K.warehouseCeiling, worldRoot = K.worldRoot;
    var __V = K.MAPS.awp_lego_2.helpers(K);
    var goldBox = __V.goldBox, plateZone = __V.plateZone, ladderX = __V.ladderX, ladderZ = __V.ladderZ, addClimb = __V.addClimb, archTrimX = __V.archTrimX, darkCeil = __V.darkCeil;
    var blue = [], red = [], cols = [-11.2, -9.5, -7.8], rows = [5.0, 2.5, 0, -2.5, -5.0, -8.0], i, j, s;
    for (i = 0; i < cols.length; i++)
      for (j = 0; j < rows.length; j++) {
        s = findClearSpot(cols[i], rows[j], 0.55) || { x: cols[i], z: rows[j] };
        blue.push({ x: s.x, z: s.z, yaw: -Math.PI / 2 });
        s = findClearSpot(-cols[i], -rows[j], 0.55) || { x: -cols[i], z: -rows[j] };
        red.push({ x: s.x, z: s.z, yaw: Math.PI / 2 });
      }
    return { blue: blue, red: red };
  }

  M.redline = {
      name: 'Aim Redline', desc: 'Depo salonu · kasa düelloları · hızlı tempo', theme: 'warehouse',
      wallH: 7.5, restricted: false, build: buildRedline, spawnsFn: redlineSpawnList,
      spawns: { blue: { x: -10.4, z: 0, yaw: -Math.PI / 2, name: 'Mavi Spawn' }, red: { x: 10.4, z: 0, yaw: Math.PI / 2, name: 'Kırmızı Spawn' } },
      miniLabels: [{ t: 'MAVİ', x: -4.2, z: 9.5 }, { t: 'KIRMIZI', x: 3.2, z: -9.5 }],
      routes: {
        blue: [
          [[-10, -1.5], [-7, -2.0], [-4.6, -2.6], [-1.8, -3.4], [1.5, -4.2], [4.6, -4.4], [7.5, -4.2], [10, -3.0]],
          [[-10, 1.8], [-7.2, 2.8], [-4.6, 3.9], [-1.2, 4.3], [1.8, 4.4], [4.4, 4.0], [7.4, 3.2], [10, 1.8]],
          [[-10.4, -3.5], [-9.2, -6.2], [-7.4, -7.8], [-4.2, -7.4], [-2.4, -6.2], [-1.6, -4.6], [0.4, -4.3], [3.0, -5.4], [5.4, -6.2], [8.6, -5.2], [10.2, -4.6]],
          [[-10.4, 3.5], [-10.6, 7.0], [-9.4, 10.8], [-6.0, 13.4], [-2.0, 13.6], [2.0, 13.4], [6.0, 12.8], [8.8, 11.6], [10.4, 9.0], [10.6, 5.0], [10.2, 2.0]],
          [[-9.6, 0], [-7.0, 0.2], [-4.5, 0.6], [-2.4, 2.2], [0, 2.3], [2.4, 1.8], [4.8, 1.2], [7.2, 1.0], [9.6, 0.2]]
        ],
        red: [
          [[10, 1.5], [7, 2.0], [4.6, 2.6], [1.8, 3.4], [-1.5, 4.2], [-4.6, 4.4], [-7.5, 4.2], [-10, 3.0]],
          [[10, -1.8], [7.2, -2.8], [4.6, -3.9], [1.2, -4.3], [-1.8, -4.4], [-4.4, -4.0], [-7.4, -3.2], [-10, -1.8]],
          [[10.4, 3.5], [9.2, 6.2], [7.4, 7.8], [4.2, 7.4], [2.4, 6.2], [1.6, 4.6], [-0.4, 4.3], [-3.0, 5.4], [-5.4, 6.2], [-8.6, 5.2], [-10.2, 4.6]],
          [[10.4, -3.5], [10.6, -7.0], [9.4, -10.8], [6.0, -13.4], [2.0, -13.6], [-2.0, -13.4], [-6.0, -12.8], [-8.8, -11.6], [-10.4, -9.0], [-10.6, -5.0], [-10.2, -2.0]],
          [[9.6, 0], [7.0, -0.2], [4.5, -0.6], [2.4, -2.2], [0, -2.3], [-2.4, -1.8], [-4.8, -1.2], [-7.2, -1.0], [-9.6, -0.2]]
        ]
      }
  };
})();
