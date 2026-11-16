/* BASIC-STRIKE silah: BIÇAK (knife) — game.js içinden ayrıldı */
(function () {
  var W = window.BS_WEAPONS = window.BS_WEAPONS || {};

  function build(K) {
    var wp = K.wp, wpr = K.wpr, cylZ = K.cylZ;
    var mMat = K.mMat, wMat = K.wMat, bMat = K.bMat, oMat = K.oMat, kMat = K.kMat;
    var steelMat = K.steelMat, steelDarkMat = K.steelDarkMat, lensMat = K.lensMat;
    var bladeMat = K.bladeMat, bladeEdgeMat = K.bladeEdgeMat, sightMat = K.sightMat;
    var g = new THREE.Group();
    // sap
    wp(g, 0.034, 0.046, 0.200, 0, 0, 0.030, kMat);
    wp(g, 0.040, 0.052, 0.020, 0, 0, -0.075, bMat);
    wp(g, 0.030, 0.040, 0.016, 0, 0, 0.135, mMat);           // topuz
    for (var p4 = 0; p4 < 3; p4++) wp(g, 0.038, 0.010, 0.014, 0, -0.024, -0.020 + p4 * 0.045, bMat);
    wp(g, 0.092, 0.020, 0.030, 0, 0.002, -0.105, mMat);      // balçak
    // bıçak (yukarı açılı)
    var bladeG = new THREE.Group();
    bladeG.position.set(0, 0.010, -0.115);
    bladeG.rotation.x = 0.38;
    g.add(bladeG);
    wp(bladeG, 0.014, 0.062, 0.240, 0, 0.030, -0.120, bladeMat);
    wp(bladeG, 0.012, 0.026, 0.100, 0, 0.045, -0.275, bladeMat);   // uç
    wp(bladeG, 0.016, 0.012, 0.235, 0, -0.002, -0.120, bladeEdgeMat); // ağız
    wp(bladeG, 0.016, 0.014, 0.040, 0, 0.058, -0.225, bladeMat);   // sırt çıkıntısı
    var mzK = new THREE.Object3D(); mzK.position.set(0, 0.045, -0.33); bladeG.add(mzK); g.userData.muzzle = mzK;
    return g;
  }

  W.knife = {
    def: { id: 'knife', name: 'BIÇAK', cls: 'knife', speedMul: 1.2, melee: true, auto: false, dmg: 35, headMul: 1, rpm: 130,
      heavyDmg: 75, heavyRpm: 65, backstabDmg: 50, heavyBackstab: 9999,
      magSize: 0, reserveMax: 0, spread: 0.02, bloom: 0, bloomMax: 0, kickUp: 0.35, kickSide: 0.15, reloadTime: 0.5, moveSpread: 0,
      pos: { x: 0.30, y: -0.26, z: -0.46 }, muzzle: { x: 0.16, y: -0.2, z: -0.62 } },
    viewKind: 'knife',
    reloadSfx: null,
    build: build
  };
})();
