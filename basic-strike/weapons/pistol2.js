/* BASIC-STRIKE silah: Deagle (pistol2) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // çerçeve + kabza
    wp(g, 0.048, 0.046, 0.190, 0, -0.002, -0.03, kMat);
    wpr(g, 0.050, 0.132, 0.068, 0, -0.095, 0.040, 0.20, 0, 0, bMat);
    wp(g, 0.054, 0.012, 0.062, 0, -0.135, 0.055, kMat);
    wp(g, 0.022, 0.012, 0.105, 0, -0.048, -0.020, bMat);     // korkuluk
    wp(g, 0.012, 0.030, 0.012, 0, -0.032, -0.025, bMat);     // tetik
    wpr(g, 0.016, 0.038, 0.020, 0, 0.048, 0.090, -0.35, 0, 0, bMat); // horoz
    // sürgü (ateş/reload'da hareket eder)
    var slide = new THREE.Group(); g.add(slide);
    wp(slide, 0.056, 0.080, 0.300, 0, 0.045, -0.06, steelMat);
    wp(slide, 0.026, 0.014, 0.260, 0, 0.090, -0.06, steelDarkMat);
    wp(slide, 0.040, 0.060, 0.050, 0, 0.030, -0.225, steelDarkMat);
    cylZ(slide, 0.024, 0.024, 0.100, 0, 0.032, -0.300, steelDarkMat, 8);
    wp(slide, 0.014, 0.020, 0.022, 0, 0.086, -0.190, bMat);  // arpacık
    wp(slide, 0.034, 0.016, 0.018, 0, 0.090, 0.065, bMat);   // gez
    wp(slide, 0.007, 0.005, 0.007, 0, 0.097, -0.190, sightMat); // arpacık noktası
    wp(g, 0.012, 0.012, 0.030, 0.032, 0.008, 0.020, steelDarkMat); // emniyet
    wp(g, 0.010, 0.010, 0.010, -0.030, -0.008, -0.040, steelDarkMat); // sökme pimi
    for (var p3 = 0; p3 < 3; p3++) wp(slide, 0.058, 0.046, 0.008, 0, 0.042, 0.055 + p3 * 0.015, steelDarkMat);
    wp(slide, 0.058, 0.024, 0.024, 0, 0.030, 0.075, bMat);
    slide.userData.baseZ = 0;
    slide.userData.travel = 0.052;
    g.userData.slide = slide;
    var mag = wp(g, 0.046, 0.120, 0.058, 0, -0.080, 0.040, kMat);
    mag.userData.baseY = -0.080;
    g.userData.mag = mag;
    var mzP2 = new THREE.Object3D(); mzP2.position.set(0, 0.032, -0.37); g.add(mzP2); g.userData.muzzle = mzP2;
    return g;
  }

  W.pistol2 = {
    def: { id: 'pistol2', name: 'Deagle', cls: 'pistol', speedMul: 1.1, auto: false, dmg: 53, headMul: 4, rpm: 267, magSize: 7, reserveMax: 35,
      spread: 0.011, bloom: 0.021, bloomMax: 0.1, kickUp: 1.7, kickSide: 0.55, reloadTime: 2.3, moveSpread: 0.033,
      pos: { x: 0.3, y: -0.23, z: -0.54 }, muzzle: { x: 0.16, y: -0.16, z: -0.68 } },
    viewKind: 'pistol2',
    reloadSfx: [[0.06, 'release'], [0.18, 'out'], [0.46, 'seat'], [0.68, 'slide'], [0.80, 'slideSlam']],
    build: build
  };
})();
