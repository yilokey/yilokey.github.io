/* BASIC-STRIKE harita: KALDRIX — görsellerden yeniden kurulmuş arena */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function buildKaldrix(K) {
    var addRoom = K.addRoom, addCrate = K.addCrate, part = K.part;
    var texBrickRed = K.texBrickRed;
    var crateMat = K.worldMats.crate;

    var mBrick = new THREE.MeshLambertMaterial({ map: texBrickRed });
    var mRedBlock = new THREE.MeshLambertMaterial({ map: texBrickRed, color: 0x8e3327 });
    var mConc = new THREE.MeshLambertMaterial({ map: K.texConcreteClean });
    var mWhite = new THREE.MeshBasicMaterial({ color: 0xf3f3ef });
    var mPadB = new THREE.MeshBasicMaterial({ color: 0x2f66d6 });
    var mPadR = new THREE.MeshBasicMaterial({ color: 0xb8271f });

    function vis(w, h, d, x, y, z, mat) {
      var m = part(w, h, d, x, y, z, mat);
      m.userData.noHit = true;
      return m;
    }
    function pad(x, z, mat) {
      vis(3.0, 0.02, 3.0, x, 0.02, z, mWhite);
      vis(2.55, 0.03, 2.55, x, 0.035, z, mat);
    }
    function stepsX(dir) {           // -1 batı, +1 doğu; 7 basamak (0.4 -> 2.8)
      for (var i = 0; i < 7; i++) {
        var h = (i + 1) * 0.4;
        var x0 = dir < 0 ? -11 - (7 - i) * 1.15 : 11 + (6 - i) * 1.15;
        addCrate(x0, -8.2, 1.15, 6, h, 0, mConc);
      }
    }

    addRoom(-44, -58, 88, 116, 'KALDRIX Arena');

    /* ---- zemin doğuş pedleri ---- */
    var padX = [-27, -13.5, 0, 13.5, 27];
    for (var pi = 0; pi < padX.length; pi++) {
      pad(padX[pi], 47.8, mPadB);
      pad(padX[pi], -47.8, mPadR);
    }

    /* ---- çevre duvarı üst harç bandı ---- */
    vis(88.6, 0.2, 0.95, 0, 4.5, 57.5, mConc);
    vis(88.6, 0.2, 0.95, 0, 4.5, -57.5, mConc);
    vis(0.95, 0.2, 117.1, -43.5, 4.5, 0, mConc);
    vis(0.95, 0.2, 117.1, 43.5, 4.5, 0, mConc);

    /* ---- takım kapı panelleri (duvar dibi) ---- */
    vis(21.6, 1.05, 0.06, 0, 0.55, 57.72, mWhite);
    vis(20.6, 0.72, 0.07, 0, 0.55, 57.67, mPadB);
    vis(21.6, 1.05, 0.06, 0, 0.55, -57.72, mWhite);
    vis(20.6, 0.72, 0.07, 0, 0.55, -57.67, mPadR);
    vis(0.06, 1.05, 17.6, -43.72, 0.55, -36, mWhite);
    vis(0.07, 0.72, 16.6, -43.67, 0.55, -36, mPadR);
    vis(0.06, 1.05, 17.6, 43.72, 0.55, 36, mWhite);
    vis(0.07, 0.72, 16.6, 43.67, 0.55, 36, mPadB);

    /* ---- merkez tuğla köprü / teras ---- */
    var DECK = 2.8;
    addCrate(-11, -12, 22, 16, 0.4, DECK - 0.4, mConc);        // güverte
    addCrate(-11.0, -12.0, 2.5, 2.5, DECK, 0, mBrick);         // köşe ayakları
    addCrate(8.5, -12.0, 2.5, 2.5, DECK, 0, mBrick);
    addCrate(-11.0, 1.5, 2.5, 2.5, DECK, 0, mBrick);
    addCrate(8.5, 1.5, 2.5, 2.5, DECK, 0, mBrick);
    addCrate(-0.9, 1.5, 1.8, 2.5, DECK, 0, mBrick);            // orta ayaklar
    addCrate(-0.9, -12.0, 1.8, 2.5, DECK, 0, mBrick);
    addCrate(-11.0, -4.9, 2.5, 1.8, DECK, 0, mBrick);
    addCrate(8.5, -4.9, 2.5, 1.8, DECK, 0, mBrick);
    vis(17, 0.4, 0.09, 0, 2.2, 4.03, mBrick);                  // kemer üstü bant
    vis(17, 0.4, 0.09, 0, 2.2, -12.03, mBrick);
    vis(0.09, 0.4, 11.9, -11.03, 2.2, -4.45, mBrick);
    vis(0.09, 0.4, 11.9, 11.03, 2.2, -4.45, mBrick);
    vis(22.7, 0.4, 0.3, 0, 2.6, 4.08, mConc);                  // gri korniş
    vis(22.7, 0.4, 0.3, 0, 2.6, -12.08, mConc);
    vis(0.3, 0.4, 16.7, -11.08, 2.6, -4, mConc);
    vis(0.3, 0.4, 16.7, 11.08, 2.6, -4, mConc);
    var mTrim = new THREE.MeshBasicMaterial({ color: 0x8e3327 });  // güverte kırmızı çerçevesi
    vis(22.0, 0.03, 0.16, 0, 2.815, 3.92, mTrim);
    vis(22.0, 0.03, 0.16, 0, 2.815, -11.92, mTrim);
    vis(0.16, 0.03, 16.0, -10.92, 2.815, -4, mTrim);
    vis(0.16, 0.03, 16.0, 10.92, 2.815, -4, mTrim);
    stepsX(-1); stepsX(1);

    /* ---- uzun beton siperler ---- */
    addCrate(-41.0, -42.2, 24.5, 0.7, 0.95, 0, mConc);
    addCrate(15.8, -42.2, 25.1, 0.7, 0.95, 0, mConc);
    addCrate(-41.0, 38.5, 24.5, 0.7, 0.95, 0, mConc);
    addCrate(15.8, 38.5, 25.1, 0.7, 0.95, 0, mConc);
    addCrate(-14.7, -26.3, 7.8, 0.7, 0.95, 0, mConc);
    addCrate(12.8, -37.9, 0.7, 12.5, 0.95, 0, mConc);
    addCrate(-36.3, -18.0, 0.7, 6.7, 0.95, 0, mConc);   // L (sol orta)
    addCrate(-36.3, -13.0, 5.4, 0.7, 0.95, 0, mConc);
    addCrate(-20.3, -18.9, 1.6, 1.6, 1.15, 0, mConc);   // kalın kolonlar
    addCrate(18.8, -18.7, 1.7, 1.7, 1.2, 0, mConc);
    addCrate(25.4, -1.5, 0.7, 10.5, 0.95, 0, mConc);
    addCrate(29.0, 6.5, 0.7, 6.1, 0.95, 0, mConc);      // L (sağ alt)
    addCrate(29.0, 11.2, 7.1, 0.7, 0.95, 0, mConc);
    addCrate(-14.7, 19.2, 7.8, 0.7, 0.95, 0, mConc);
    addCrate(-13.5, 27.1, 0.7, 11.1, 0.95, 0, mConc);

    /* ---- alçak üç kademeli platformlar ---- */
    addCrate(26.0, -10.9, 11.1, 1.5, 0.9, 0, mConc);
    addCrate(26.0, -9.4, 11.1, 1.5, 0.6, 0, mConc);
    addCrate(26.0, -7.9, 11.1, 2.4, 0.3, 0, mConc);
    addCrate(-38.1, -1.8, 11.4, 1.7, 0.9, 0, mConc);
    addCrate(-38.1, -0.1, 11.4, 2.0, 0.6, 0, mConc);
    addCrate(-38.1, 1.9, 11.4, 1.9, 0.3, 0, mConc);

    /* ---- kırmızı bloklar ---- */
    addCrate(-38.3, -35.9, 3.6, 8.6, 1.6, 0, mRedBlock);
    addCrate(25.4, -21.5, 9.6, 2.6, 1.5, 0, mRedBlock);
    addCrate(33.8, 19.4, 4.2, 9.2, 1.6, 0, mRedBlock);
    addCrate(-34.7, 15.1, 8.6, 3.7, 1.1, 0, mRedBlock);

    /* ---- ahşap kasalar ---- */
    addCrate(-28.3, -30.1, 1.5, 1.5, 1.5, 0, crateMat);
    addCrate(-28.1, -30.0, 1.15, 1.15, 1.1, 1.5, crateMat);
    addCrate(-26.6, -30.0, 0.9, 0.9, 0.9, 0, crateMat);
    addCrate(4.4, -35.2, 1.7, 1.7, 1.6, 0, crateMat);
    addCrate(4.7, -34.9, 1.25, 1.25, 1.1, 1.6, crateMat);
    addCrate(8.4, -35.2, 0.9, 0.9, 0.9, 0, crateMat);
    addCrate(30.8, 17.0, 1.7, 1.7, 1.6, 0, crateMat);
    addCrate(31.1, 17.3, 1.25, 1.25, 1.1, 1.6, crateMat);
    addCrate(33.8, 17.4, 0.9, 0.9, 0.9, 0, crateMat);
    addCrate(-9.3, 30.1, 1.3, 1.3, 1.3, 0, crateMat);
    addCrate(-7.7, 30.3, 1.2, 1.2, 1.2, 0, crateMat);
    addCrate(-6.2, 30.4, 0.8, 0.8, 0.8, 0, crateMat);
    addCrate(-18.3, 13.3, 1.4, 1.4, 1.4, 0, crateMat);
    addCrate(-18.1, 13.5, 1.0, 1.0, 0.9, 1.4, crateMat);
    addCrate(-36.3, 46.0, 0.9, 0.9, 0.9, 0, crateMat);
    addCrate(34.0, -50.2, 0.9, 0.9, 0.9, 0, crateMat);
  }

  function kaldrixSpawns(K) {
    var xs = [-27, -13.5, 0, 13.5, 27];
    var blue = [], red = [];
    for (var i = 0; i < xs.length; i++) {
      blue.push({ x: xs[i], z: 47.8, yaw: 0 });
      red.push({ x: xs[i], z: -47.8, yaw: Math.PI });
    }
    return { blue: blue, red: red };
  }

  function kaldrixRoutes() {
    return {
      blue: [
        [[-31, 20], [-33, -6], [-31, -24], [-27, -40]],
        [[-8, 22], [-2, 12], [2.8, 2], [6, -14], [4, -34]],
        [[30, 20], [33, 0], [30, -18], [26, -38]],
        [[0, 20], [0, 12], [2.8, 2], [-2, -16], [-4, -36]]
      ],
      red: [
        [[31, -20], [33, 2], [31, 24], [27, 40]],
        [[8, -22], [2, -12], [-2.8, 2], [-6, 14], [-4, 34]],
        [[-30, -20], [-33, -5], [-30, 18], [-26, 38]],
        [[0, -20], [0, -12], [-2.8, 2], [2, 16], [4, 36]]
      ]
    };
  }

  M.kaldrix = {
    name: 'KALDRIX',
    desc: 'Arena · tuğla köprü teras · iki merdiven · beton ve kasa siperleri',
    theme: 'kaldrix', wallH: 4.6,
    restricted: false, duel: false, street: false,
    spawns: { blue: { x: 0, z: 47.8, yaw: 0, name: 'Mavi Doğuş' },
      red: { x: 0, z: -47.8, yaw: Math.PI, name: 'Kırmızı Doğuş' } },
    miniLabels: [{ t: 'MAVİ', x: 0, z: 52 }, { t: 'KIRMIZI', x: 0, z: -52 }],
    routes: kaldrixRoutes(),
    build: buildKaldrix,
    spawnsFn: kaldrixSpawns
  };
})();
