/* BASIC-STRIKE silah: USP (pistol) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // çerçeve + kabza
    wp(g, 0.046, 0.048, 0.160, 0, -0.004, -0.02, kMat);
    wpr(g, 0.048, 0.120, 0.062, 0, -0.092, 0.035, 0.22, 0, 0, kMat);
    wp(g, 0.052, 0.010, 0.058, 0, -0.128, 0.050, bMat);
    wp(g, 0.020, 0.012, 0.095, 0, -0.045, -0.015, kMat);     // korkuluk
    wp(g, 0.010, 0.026, 0.010, 0, -0.032, -0.020, bMat);     // tetik
    wp(g, 0.040, 0.020, 0.030, 0, 0.028, 0.075, bMat);       // horoz yatağı
    wpr(g, 0.014, 0.034, 0.018, 0, 0.040, 0.088, -0.35, 0, 0, bMat); // horoz
    // sürgü (ateş/reload'da hareket eder)
    var slide = new THREE.Group(); g.add(slide);
    wp(slide, 0.050, 0.058, 0.255, 0, 0.040, -0.045, bMat);
    wp(slide, 0.040, 0.014, 0.255, 0, 0.072, -0.045, mMat);  // üst kaburga
    wp(slide, 0.034, 0.040, 0.055, 0, 0.034, -0.195, bMat);  // namlu ağzı
    cylZ(slide, 0.028, 0.028, 0.100, 0, 0.034, -0.255, bMat, 10); // susturucu
    cylZ(slide, 0.030, 0.030, 0.020, 0, 0.034, -0.310, mMat, 10); // susturucu ucu
    wp(slide, 0.012, 0.018, 0.020, 0, 0.082, -0.145, bMat);  // arpacık
    wp(slide, 0.030, 0.014, 0.016, 0, 0.082, 0.055, bMat);   // gez
    wp(slide, 0.006, 0.004, 0.006, 0, 0.091, -0.145, sightMat); // arpacık noktası
    wp(g, 0.010, 0.012, 0.026, 0.028, 0.002, 0.010, steelDarkMat); // sürgü tutucusu
    wp(g, 0.008, 0.008, 0.008, -0.028, -0.010, -0.030, steelDarkMat); // sökme pimi
    for (var p1 = 0; p1 < 4; p1++) wp(slide, 0.052, 0.036, 0.008, 0, 0.038, 0.048 + p1 * 0.014, kMat);
    slide.userData.baseZ = 0;
    slide.userData.travel = 0.045;
    g.userData.slide = slide;
    var mag = wp(g, 0.042, 0.110, 0.050, 0, -0.075, 0.035, kMat);
    mag.userData.baseY = -0.075;
    g.userData.mag = mag;
    var mzP = new THREE.Object3D(); mzP.position.set(0, 0.034, -0.36); g.add(mzP); g.userData.muzzle = mzP;
    return g;
  }

  W.pistol = {
    def: { id: 'pistol', name: 'USP', cls: 'pistol', speedMul: 1.1, auto: false, dmg: 25, headMul: 4, rpm: 380, magSize: 12, reserveMax: 60,
      spread: 0.009, bloom: 0.011, bloomMax: 0.055, kickUp: 0.8, kickSide: 0.35, reloadTime: 2.1, moveSpread: 0.026,
      pos: { x: 0.30, y: -0.23, z: -0.52 }, muzzle: { x: 0.16, y: -0.17, z: -0.62 } },
    viewKind: 'pistol',
    reloadSfx: [[0.06, 'release'], [0.18, 'out'], [0.44, 'seat'], [0.66, 'slide'], [0.78, 'slideSlam']],
    build: build
  };
})();
