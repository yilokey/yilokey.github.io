/* BASIC-STRIKE silah: AWP (sniper) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // dipçik + şasi
    wp(g, 0.062, 0.105, 0.34, 0, -0.012, 0.200, oMat);
    wp(g, 0.056, 0.045, 0.18, 0, 0.055, 0.170, oMat);        // yanak dayama
    wp(g, 0.064, 0.035, 0.05, 0, 0.078, 0.170, kMat);
    wp(g, 0.066, 0.125, 0.028, 0, -0.025, 0.375, bMat);      // dipçik pedi
    wp(g, 0.070, 0.070, 0.18, 0, -0.002, 0.060, oMat);
    wpr(g, 0.052, 0.125, 0.062, 0, -0.115, 0.055, 0.28, 0, 0, kMat);
    // alıcı
    wp(g, 0.066, 0.075, 0.30, 0, 0.010, -0.06, mMat);
    wp(g, 0.010, 0.055, 0.22, 0, 0.058, -0.06, bMat);
    // namlu
    cylZ(g, 0.026, 0.024, 0.16, 0, 0.018, -0.26, mMat, 12);
    cylZ(g, 0.018, 0.018, 0.62, 0, 0.018, -0.56, bMat, 10);
    cylZ(g, 0.024, 0.022, 0.055, 0, 0.018, -0.90, bMat, 10);
    wp(g, 0.030, 0.024, 0.050, 0, 0.050, -0.76, mMat);       // namlu bandı
    // dürbün
    cylZ(g, 0.030, 0.030, 0.30, 0, 0.115, -0.12, bMat, 14);
    cylZ(g, 0.042, 0.034, 0.07, 0, 0.115, -0.29, bMat, 14);  // objektif
    cylZ(g, 0.036, 0.030, 0.05, 0, 0.115, 0.06, bMat, 14);   // göz merceği
    wp(g, 0.030, 0.030, 0.012, 0, 0.115, -0.325, lensMat);
    wp(g, 0.020, 0.030, 0.030, 0, 0.075, -0.22, mMat);       // yüzük
    wp(g, 0.020, 0.030, 0.030, 0, 0.075, -0.02, mMat);       // yüzük
    // dürbün kuleleri + askı halkası
    wp(g, 0.030, 0.018, 0.030, 0, 0.150, -0.09, mMat);
    wp(g, 0.018, 0.026, 0.018, 0, 0.163, -0.09, mMat);
    wp(g, 0.014, 0.030, 0.026, 0.036, 0.115, -0.10, mMat);
    wp(g, 0.012, 0.024, 0.012, 0, -0.062, 0.330, bMat);
    // cıvata kolu
    var bolt = wp(g, 0.050, 0.050, 0.085, 0.042, 0.045, 0.05, mMat);
    bolt.userData.baseZ = 0.05;
    bolt.userData.baseRotZ = 0;
    var knob = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), bMat);
    knob.position.set(0.055, 0, 0.045); knob.userData.noHit = true; bolt.add(knob);
    g.userData.bolt = bolt;
    // şarjör + tetik
    var mag = wp(g, 0.052, 0.105, 0.085, 0, -0.095, -0.075, kMat);
    mag.userData.baseY = -0.095;
    g.userData.mag = mag;
    wp(g, 0.020, 0.012, 0.100, 0, -0.060, 0.010, mMat);
    wp(g, 0.010, 0.028, 0.012, 0, -0.045, 0.005, bMat);
    var mzS = new THREE.Object3D(); mzS.position.set(0, 0.018, -0.945); g.add(mzS); g.userData.muzzle = mzS;
    return g;
  }

  W.sniper = {
    def: { id: 'sniper', name: 'AWP', cls: 'rifle', speedMul: 1, auto: false, dmg: 115, headMul: 4, legDmg: 85, rpm: 41, magSize: 10, reserveMax: 30,
      spread: 0.002, bloom: 0.03, bloomMax: 0.09, kickUp: 2.6, kickSide: 0.5, reloadTime: 3.0, zoom: true, moveSpread: 0.09,
      pos: { x: 0.34, y: -0.25, z: -0.66 }, muzzle: { x: 0.2, y: -0.16, z: -1.0 } },
    viewKind: 'sniper',
    reloadSfx: [[0.05, 'release'], [0.16, 'out'], [0.48, 'seat'], [0.64, 'bolt'], [0.80, 'boltSlam']],
    build: build
  };
})();
