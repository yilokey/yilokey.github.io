/* BASIC-STRIKE silah: M4A4 (rifle2) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // alıcı + üst ray
    wp(g, 0.082, 0.098, 0.320, 0, 0.008, -0.02, bMat);
    wp(g, 0.074, 0.022, 0.300, 0, 0.068, -0.02, mMat);
    // taşıma kolu
    wp(g, 0.040, 0.020, 0.240, 0, 0.105, -0.10, bMat);
    wp(g, 0.034, 0.050, 0.030, 0, 0.082, 0.02, bMat);
    wp(g, 0.030, 0.062, 0.032, 0, 0.085, -0.24, bMat);
    wp(g, 0.008, 0.028, 0.008, 0, 0.118, -0.245, mMat);      // arpacık
    wp(g, 0.026, 0.012, 0.050, 0, 0.090, -0.34, mMat);       // gaz bloğu
    // namlu
    cylZ(g, 0.017, 0.016, 0.26, 0, 0.022, -0.46, mMat, 10);
    cylZ(g, 0.024, 0.022, 0.06, 0, 0.022, -0.60, bMat, 10);  // alev gizleyici
    // el kundağı + ray
    wp(g, 0.060, 0.058, 0.220, 0, 0.000, -0.31, bMat);
    for (var p2 = 0; p2 < 3; p2++) wp(g, 0.062, 0.010, 0.014, 0, 0.028 - p2 * 0.014, -0.31, mMat);
    wp(g, 0.052, 0.016, 0.120, 0, -0.035, -0.31, bMat);
    // dipçik
    cylZ(g, 0.020, 0.020, 0.11, 0, 0.012, 0.19, mMat, 8);    // tampon borusu
    wp(g, 0.056, 0.082, 0.140, 0, -0.010, 0.300, bMat);
    wp(g, 0.062, 0.096, 0.022, 0, -0.010, 0.375, kMat);
    // kabza + tetik
    wpr(g, 0.048, 0.120, 0.058, 0, -0.108, 0.065, 0.30, 0, 0, bMat);
    wp(g, 0.022, 0.010, 0.100, 0, -0.055, 0.005, mMat);
    wp(g, 0.010, 0.026, 0.010, 0, -0.040, -0.005, bMat);
    wp(g, 0.012, 0.010, 0.030, 0.052, 0.045, -0.02, mMat);   // kovan deflektörü
    wp(g, 0.020, 0.030, 0.020, 0.045, 0.012, -0.01, mMat);   // forward assist
    // şarjör
    var mag = wp(g, 0.048, 0.165, 0.082, 0, -0.125, -0.115, kMat);
    mag.userData.baseY = -0.125;
    g.userData.mag = mag;
    // sürgü kolu
    var charge = wp(g, 0.046, 0.018, 0.026, 0, 0.060, 0.095, mMat);
    charge.userData.baseZ = 0.095;
    charge.userData.baseX = 0;
    g.userData.charge = charge;
    // ince detaylar: kovan kapağı, arka gez, şarjör boğazı, askı halkası, ray kapağı
    wp(g, 0.006, 0.048, 0.110, 0.043, 0.010, -0.02, bMat);
    wp(g, 0.020, 0.026, 0.014, 0, 0.118, 0.010, bMat);
    wp(g, 0.058, 0.026, 0.030, 0, -0.062, -0.115, bMat);
    wp(g, 0.014, 0.026, 0.012, 0, -0.052, 0.330, bMat);
    wp(g, 0.064, 0.008, 0.120, 0, 0.036, -0.310, kMat);
    var mzR2 = new THREE.Object3D(); mzR2.position.set(0, 0.022, -0.64); g.add(mzR2); g.userData.muzzle = mzR2;
    return g;
  }

  W.rifle2 = {
    def: { id: 'rifle2', name: 'M4A4', cls: 'rifle', speedMul: 1, auto: true, dmg: 33, headMul: 4, rpm: 666, magSize: 30, reserveMax: 90,
      spread: 0.009, bloom: 0.0055, bloomMax: 0.047, kickUp: 0.7, kickSide: 0.28, reloadTime: 2.6, moveSpread: 0.03,
      pos: { x: 0.33, y: -0.24, z: -0.6 }, muzzle: { x: 0.24, y: -0.16, z: -0.88 } },
    viewKind: 'rifle2',
    reloadSfx: [[0.04, 'release'], [0.12, 'out'], [0.43, 'seat'], [0.62, 'bolt'], [0.74, 'boltSlam']],
    build: build
  };
})();
