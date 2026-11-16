/* BASIC-STRIKE silah: AK-47 (rifle) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // alıcı + üst kapak
    wp(g, 0.086, 0.112, 0.34, 0, 0.005, -0.03, mMat);
    wp(g, 0.078, 0.026, 0.30, 0, 0.072, -0.04, mMat);
    wp(g, 0.070, 0.012, 0.26, 0, 0.088, -0.04, kMat);
    wp(g, 0.062, 0.050, 0.14, 0, -0.045, 0.06, mMat);
    // namlu + gaz sistemi
    cylZ(g, 0.021, 0.019, 0.40, 0, 0.022, -0.43, bMat, 10);
    cylZ(g, 0.013, 0.013, 0.30, 0, 0.056, -0.40, mMat, 8);
    wp(g, 0.030, 0.070, 0.045, 0, 0.045, -0.61, mMat);       // arpacık kulesi
    wp(g, 0.008, 0.034, 0.008, 0, 0.088, -0.615, bMat);      // arpacık
    cylZ(g, 0.026, 0.024, 0.075, 0, 0.022, -0.665, bMat, 10); // namlu freni
    wp(g, 0.050, 0.022, 0.050, 0, 0.090, -0.16, mMat);       // gez yatağı
    wp(g, 0.016, 0.030, 0.014, 0, 0.108, -0.16, bMat);       // gez
    // ahşap el kundağı
    wp(g, 0.066, 0.062, 0.21, 0, -0.012, -0.33, wMat);
    wp(g, 0.052, 0.030, 0.13, 0, 0.058, -0.335, wMat);
    wp(g, 0.070, 0.018, 0.060, 0, -0.055, -0.24, wMat);
    // dipçik
    wp(g, 0.066, 0.095, 0.20, 0, -0.028, 0.235, wMat);
    wp(g, 0.060, 0.040, 0.14, 0, 0.035, 0.235, wMat);
    wp(g, 0.072, 0.110, 0.028, 0, -0.028, 0.335, bMat);      // taban
    wp(g, 0.040, 0.030, 0.09, 0, -0.075, 0.16, mMat);        // bağlantı
    // kabza + tetik düzeneği
    wpr(g, 0.050, 0.132, 0.062, 0, -0.118, 0.075, 0.30, 0, 0, kMat);
    wp(g, 0.024, 0.010, 0.110, 0, -0.062, 0.005, mMat);      // korkuluk
    wp(g, 0.012, 0.030, 0.012, 0, -0.045, -0.005, bMat);     // tetik
    wp(g, 0.012, 0.032, 0.050, 0.052, 0.020, 0.030, mMat);   // emniyet kolu
    // kavisli şarjör
    var mag = new THREE.Group(); mag.position.set(0, -0.10, -0.135); g.add(mag);
    wpr(mag, 0.052, 0.095, 0.105, 0, -0.030, 0, -0.10, 0, 0, kMat);
    wpr(mag, 0.052, 0.095, 0.105, 0, -0.105, -0.012, -0.26, 0, 0, kMat);
    wpr(mag, 0.052, 0.085, 0.100, 0, -0.173, -0.036, -0.44, 0, 0, kMat);
    mag.userData.baseY = -0.10;
    g.userData.mag = mag;
    // sürgü kolu (reload animasyonu)
    var charge = wp(g, 0.024, 0.024, 0.055, 0.058, 0.030, 0.06, mMat);
    charge.userData.baseZ = 0.06;
    charge.userData.baseX = 0.058;
    g.userData.charge = charge;
    // ince detaylar: arpacık kulakları, gaz borusu kelepçesi, yan kızak, askı halkası
    wp(g, 0.006, 0.030, 0.010, -0.014, 0.100, -0.615, bMat);
    wp(g, 0.006, 0.030, 0.010, 0.014, 0.100, -0.615, bMat);
    wp(g, 0.038, 0.012, 0.026, 0, 0.048, -0.545, bMat);
    wp(g, 0.008, 0.026, 0.090, -0.047, 0.010, -0.030, bMat);
    wp(g, 0.010, 0.010, 0.030, 0.040, -0.070, -0.090, bMat);
    wp(g, 0.014, 0.026, 0.012, 0, -0.070, 0.300, bMat);
    var mzR = new THREE.Object3D(); mzR.position.set(0, 0.022, -0.71); g.add(mzR); g.userData.muzzle = mzR;
    return g;
  }

  W.rifle = {
    def: { id: 'rifle', name: 'AK-47', cls: 'rifle', speedMul: 1, auto: true, dmg: 36, headMul: 4, rpm: 600, magSize: 30, reserveMax: 90,
      spread: 0.010, bloom: 0.006, bloomMax: 0.05, kickUp: 0.75, kickSide: 0.3, reloadTime: 2.4, moveSpread: 0.032,
      pos: { x: 0.33, y: -0.24, z: -0.62 }, muzzle: { x: 0.24, y: -0.17, z: -0.86 } },
    viewKind: 'rifle',
    reloadSfx: [[0.04, 'release'], [0.12, 'out'], [0.45, 'seat'], [0.64, 'bolt'], [0.76, 'boltSlam']],
    build: build
  };
})();
