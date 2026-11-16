/* BASIC-STRIKE silah: BIÇAK (knife) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr;
    var mMat = K.mMat, bMat = K.bMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat;
    // CS duruşu: sapa göre ucu yukarı, hafif içe ve yüzü kameraya dönük
    var POSE = { rx: 0.64, ry: 0.42, rz: -0.16 };
    var root = new THREE.Group();
    var g = new THREE.Group();
    g.rotation.set(POSE.rx, POSE.ry, POSE.rz);
    var pivot = new THREE.Vector3(0, 0.004, 0.055);           // kabza kavrama noktası yerinde kalsın
    var pr = pivot.clone().applyEuler(g.rotation);
    g.position.set(pivot.x - pr.x, pivot.y - pr.y, pivot.z - pr.z);
    root.add(g);
    // el, bıçakla aynı eksende kavrasın: avuç kabzanın üstüne oturur
    var grip = new THREE.Vector3(0.010, 0.004, 0.030);
    var gripW = grip.clone().sub(pivot).applyEuler(g.rotation).add(pivot);
    var handW = gripW.clone()
      .add(new THREE.Vector3(0, 0.046, 0.020).applyEuler(g.rotation));
    var wristW = new THREE.Vector3(0, 0.004, 0.078).applyEuler(g.rotation).add(handW);
    root.userData.armPose = {
      hand: [handW.x, handW.y, handW.z],
      wrist: [wristW.x, wristW.y, wristW.z],
      elbow: [handW.x + 0.20, handW.y - 0.37, handW.z + 0.30],
      rot: [POSE.rx, POSE.ry, POSE.rz - 0.70]      // bilek kabza etrafında döner, parmaklar öne sarar
    };
    bladeEdgeMat.side = THREE.DoubleSide;

    /* ---- sap: tam geçmeli çelik + polimer kabza ---- */
    wp(g, 0.008, 0.044, 0.238, 0, 0.004, 0.040, steelDarkMat);        // tang
    wp(g, 0.030, 0.050, 0.190, 0, 0.004, 0.034, kMat);                // kabza gövdesi
    wp(g, 0.034, 0.044, 0.016, 0, 0.004, -0.060, kMat);               // ön bilezik
    wp(g, 0.048, 0.070, 0.030, 0, 0.002, -0.082, steelMat);           // balçak (parmak koruması)
    wp(g, 0.044, 0.026, 0.022, 0, 0.042, -0.082, steelMat);           // balçak üst omuz
    // tutuş kanalları
    for (var f = 0; f < 4; f++) {
      wp(g, 0.033, 0.007, 0.012, 0, -0.023, -0.030 + f * 0.036, bMat);
      wp(g, 0.033, 0.007, 0.012, 0, 0.030, -0.012 + f * 0.036, bMat);
    }
    // topuz + bağ halkası
    wp(g, 0.036, 0.058, 0.026, 0, 0.004, 0.142, steelMat);
    wp(g, 0.042, 0.012, 0.030, 0, -0.024, 0.146, steelDarkMat);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.011, 0.0035, 8, 14), steelMat);
    ring.position.set(0, -0.006, 0.160); ring.rotation.y = Math.PI / 2;
    g.add(ring);
    // perçinler
    var riv1 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.038, 10), steelDarkMat);
    riv1.rotation.z = Math.PI / 2; riv1.position.set(0, 0.004, 0.010); g.add(riv1);
    var riv2 = riv1.clone(); riv2.position.set(0, 0.004, 0.100); g.add(riv2);

    /* ---- bıçak: profilli damla uç, kanal, parlak ağız ---- */
    var bladeG = new THREE.Group();
    bladeG.position.set(0, 0.006, 0);
    bladeG.rotation.x = 0.10;
    g.add(bladeG);

    var T = 0.0068;
    var sh = new THREE.Shape();
    sh.moveTo(-0.072, -0.018);       // topuk alt
    sh.lineTo(-0.072, 0.040);        // topuk üst / ricasso
    sh.lineTo(-0.236, 0.053);        // sırt
    sh.lineTo(-0.312, 0.045);        // klip başlangıcı
    sh.lineTo(-0.402, 0.000);        // uç
    sh.lineTo(-0.336, -0.034);       // karın
    sh.lineTo(-0.150, -0.029);       // ağız
    sh.closePath();
    var bladeGeo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false, steps: 1 });
    var blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.rotation.y = -Math.PI / 2;
    blade.position.x = T / 2;
    blade.castShadow = true;
    bladeG.add(blade);

    // parlak ağız bandı (dışarı taşan ince bıçak sırtı)
    var esh = new THREE.Shape();
    esh.moveTo(-0.150, -0.012);
    esh.lineTo(-0.328, -0.017);
    esh.lineTo(-0.386, -0.004);
    esh.lineTo(-0.402, 0.000);
    esh.lineTo(-0.336, -0.034);
    esh.lineTo(-0.150, -0.029);
    esh.lineTo(-0.148, -0.014);
    esh.closePath();
    var edgeGeo = new THREE.ExtrudeGeometry(esh, { depth: T + 0.0009, bevelEnabled: false, steps: 1 });
    var edge = new THREE.Mesh(edgeGeo, bladeEdgeMat);
    edge.rotation.y = -Math.PI / 2;
    edge.position.x = (T + 0.0009) / 2;
    bladeG.add(edge);

    // kanal (iki yüzde ince koyu iz)
    wp(bladeG, 0.0009, 0.009, 0.132, 0.0038, 0.014, -0.196, steelDarkMat);
    wp(bladeG, 0.0009, 0.009, 0.132, -0.0038, 0.014, -0.196, steelDarkMat);
    // sırt tırtıkları
    for (var j = 0; j < 5; j++) wp(bladeG, 0.0085, 0.007, 0.006, 0, 0.047, -0.098 - j * 0.010, steelDarkMat);

    var mzK = new THREE.Object3D();
    mzK.position.set(0, 0.030, -0.405);
    bladeG.add(mzK);
    g.traverse(function (o) { if (o.isMesh) o.userData.noHit = true; });
    root.userData.muzzle = mzK;
    return root;
  }

  W.knife = {
    def: { id: 'knife', name: 'BIÇAK', cls: 'knife', speedMul: 1.2, melee: true, auto: false, dmg: 35, headMul: 1, rpm: 130,
      heavyDmg: 75, heavyRpm: 65, backstabDmg: 50, heavyBackstab: 9999,
      magSize: 0, reserveMax: 0, spread: 0.02, bloom: 0, bloomMax: 0, kickUp: 0.35, kickSide: 0.15, reloadTime: 0.5, moveSpread: 0,
      pos: { x: 0.28, y: -0.20, z: -0.55 }, muzzle: { x: 0.16, y: -0.2, z: -0.62 } },
    viewKind: 'knife',
    reloadSfx: null,
    build: build
  };
})();
