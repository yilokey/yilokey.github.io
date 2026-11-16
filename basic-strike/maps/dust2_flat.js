/* BASIC-STRIKE harita: dust2_flat — game.js içinden ayrıldı */
(function () {
  var M = window.BS_MAPS = window.BS_MAPS || {};

  function buildDust2Flat(K) {
    var addBarrel = K.addBarrel, addBlock = K.addBlock, addCrate = K.addCrate, addRoom = K.addRoom, groundDecal = K.groundDecal, groundTint = K.groundTint, labelTexture = K.labelTexture, letterTexture = K.letterTexture, part = K.part, worldMats = K.worldMats;
    // güney: T tarafı
    addRoom(-22, 39, 21, 10, 'T Spawn');
    addRoom(-37, 27, 15, 22, 'T Plat');
    addRoom(-47, 19, 11, 22, 'T Ramp');
    addRoom(-44, 9, 20, 16, 'Outside Tunnels');
    addRoom(-39, 0, 8, 10, 'Tunnel Stairs');
    addRoom(-46, -9, 27, 10, 'Upper Tunnels');
    addRoom(-37, -14, 4, 7, 'B Tunnel Stairs');
    addRoom(-24, -11, 18, 4, 'Lower Tunnels');

    // orta hat
    addRoom(-10, 11, 5, 28, 'Suicide');
    addRoom(-8, 11, 18, 14, 'Top Mid');
    addRoom(-6, -15, 9, 28, 'Mid');
    addRoom(-8, -18, 11, 5, 'Mid Doors');
    addRoom(4, -15, 3, 28, 'Catwalk');
    addRoom(2, -15, 16, 8, 'A Short Lower');

    // CT tarafı
    addRoom(-23, -38, 17, 21, 'CT Mid');
    addRoom(-9, -38, 21, 14, 'CT Spawn');
    addRoom(-9, -24, 20, 9, 'CT Mid East');
    addRoom(11, -38, 7, 25, 'A Short');

    // A bölgesi
    addRoom(12, -41, 24, 10, 'A Plat');
    addRoom(29, -49, 15, 8, 'Goose');
    addRoom(36, -41, 8, 8, 'A Ramp');
    addRoom(29, -33, 15, 7, 'A Cross');
    addRoom(35, -26, 12, 29, 'Long A');
    addRoom(25, 0, 21, 8, 'Long Corner');
    addRoom(17, 6, 10, 12, 'Long Doors');
    addRoom(17, 18, 9, 16, 'Outside Long');
    addRoom(8, 17, 11, 8, 'Top Mid Link');
    addRoom(27, 6, 8, 16, 'Side Pit');
    addRoom(36, 6, 8, 16, 'Pit');
    addRoom(44, 7, 4, 15, 'Pit Plat');

    // B bölgesi
    addRoom(-46, -51, 11, 18, 'B Plat');
    addRoom(-35, -43, 9, 10, 'B Site');
    addRoom(-26, -41, 3, 4, 'Window');
    addRoom(-28, -34, 7, 9, 'B Doors');
    addRoom(-46, -33, 20, 19, 'B Lower');

    // T tarafı eşyaları
    addCrate(-21, 45.5, 1.6, 1.6, 0.9);
    addBarrel(-21, 40.5);
    addCrate(-35, 46, 2, 2, 1.7);
    addCrate(-33.4, 46.2, 1.2, 1.2, 0.85, 1.7);
    addBarrel(-24, 45);
    addBarrel(-46, 26);
    addCrate(-38, 36, 1.4, 1.4, 0.85);
    addCrate(-41, 12, 1.8, 1.8, 0.85);
    addBarrel(-27, 20);
    addCrate(-30, 22, 1.4, 1.4, 0.85);
    addCrate(-44, -6, 2, 2, 1.4);
    addBarrel(-30, -3);
    addCrate(-15, -10, 2, 2, 0.85);

    // orta hat eşyaları
    addCrate(-5, -10, 2, 2, 1.4);          // XBOX
    addBarrel(1.5, 2);
    addBarrel(7.5, 21); addBarrel(8.9, 21.4);
    addCrate(-7, 23, 1.4, 1.4, 0.85);
    addCrate(16, 23, 1.4, 1.4, 0.85);
    addCrate(16, -9, 1.2, 1.2, 0.85);
    addCrate(16, -30, 1.4, 1.4, 0.85);
    addBarrel(13, -22);

    // CT tarafı eşyaları
    addCrate(-2, -36, 1.6, 1.6, 0.85);
    addBarrel(-4, -28);
    addCrate(-21, -35, 2, 2, 1.7);
    addCrate(-12, -20, 1.6, 1.6, 0.85);
    addBarrel(-20, -24);

    // A bölgesi eşyaları
    addCrate(29, -35, 1.6, 1.6, 1.5);      // default
    addCrate(16, -40, 1.4, 1.4, 0.85);     // ninja
    addCrate(26, -32, 1.4, 1.4, 0.85);
    addCrate(41, -39.5, 1.4, 1.4, 0.85);
    addBarrel(36, -46); addBarrel(37.4, -46.2);
    addCrate(40, -47, 1.6, 1.6, 0.85);
    addCrate(40, -30, 1.6, 1.6, 0.85);
    addBlock(41, -23, 4, 1.8, 1.0, 0x8a5a2b);   // A Car
    addCrate(37, -8, 1.6, 1.6, 0.85);
    addCrate(27, 2, 1.6, 1.6, 0.9);             // blue crate
    addCrate(18, 7, 1.2, 1.2, 0.85);
    addCrate(25.5, 16, 1.2, 1.2, 0.85);
    addCrate(19, 30, 1.8, 1.8, 0.9);
    addBarrel(25, 32);
    addCrate(28.5, 20, 1.4, 1.4, 0.85);
    addBarrel(38, 12);
    addCrate(42, 19, 1.4, 1.4, 0.85);
    addBlock(44, 8, 0.4, 10, 2.2, 0x8f8a7a);    // Pit / Pit Plat ayrımı

    // B bölgesi eşyaları
    addCrate(-29.5, -40.5, 1.6, 1.6, 1.5);      // default
    addCrate(-34, -42.6, 1.2, 1.2, 0.85);
    addCrate(-44, -48, 2, 2, 1.7);
    addBarrel(-37, -46);
    addBlock(-30, -22, 3.4, 1.8, 1.1, 0x8a5a2b); // B Car
    addCrate(-43.5, -16, 2, 2, 0.9);
    addCrate(-38, -16.5, 1.6, 1.6, 0.85);
    addCrate(-38, -33, 2.2, 2.2, 1.7);          // Big Box

    // kapı çerçeveleri
    var fm = worldMats.frame;
    part(11, 0.35, 0.4, -3, 2.92, -18, fm);     // Mid Doors
    part(10, 0.35, 0.4, 22, 2.92, 17.6, fm);    // Long Doors
    part(0.4, 0.35, 9, -25, 2.92, -29.5, fm);   // B Doors

    // zemin işaretleri
    groundDecal(letterTexture('A'), 5, 31.5, -34.5, 0, true);
    groundDecal(letterTexture('B'), 5, -31, -38.5, 0, true);
    groundDecal(labelTexture('T SPAWN'), 9, -12, 44.5, 0, true);
    groundDecal(labelTexture('CT SPAWN'), 9, 8.5, -30, 0, true);
    groundTint(17, 8, -12, 44, 0x3fbf5f, 0.16);
    groundTint(7, 12, 8.5, -30, 0x3fbf5f, 0.18);
    groundTint(7, 6, 31.5, -34.2, 0xe0641a, 0.34);
    groundTint(7, 7, -31, -38.3, 0xe0641a, 0.34);
  }

  function dust2FlatSpawnList(K) {
    var addBarrel = K.addBarrel, addBlock = K.addBlock, addCrate = K.addCrate, addRoom = K.addRoom, groundDecal = K.groundDecal, groundTint = K.groundTint, labelTexture = K.labelTexture, letterTexture = K.letterTexture, part = K.part, worldMats = K.worldMats;
    var bx = [-17, -11, -5], bz = [40, 42, 44, 46, 48];
    var rx = [7, 9, 11], rz = [-35.5, -33, -30.5, -28, -25.5];
    var blue = [], red = [], i, j;
    for (i = 0; i < bz.length; i++)
      for (j = 0; j < bx.length; j++) blue.push({ x: bx[j], z: bz[i], yaw: 0 });
    for (i = 0; i < rz.length; i++)
      for (j = 0; j < rx.length; j++) red.push({ x: rx[j], z: rz[i], yaw: Math.PI });
    return { blue: blue, red: red };
  }

  M.dust2_flat = {
      name: 'Dust II Flat', desc: 'Radar düzeni · düz zemin · A/B, Long, Mid, Tünel hatları', theme: 'sand',
      restricted: false, build: buildDust2Flat, spawnsFn: dust2FlatSpawnList,
      spawns: { blue: { x: -11, z: 44, yaw: 0, name: 'T Spawn' }, red: { x: 8.5, z: -30, yaw: Math.PI, name: 'CT Spawn' } },
      miniLabels: [{ t: 'A', x: 31.5, z: -34.5 }, { t: 'B', x: -31, z: -38.5 }],
      routes: {
        blue: [
          [[-12, 44], [-6, 30], [-6, 20], [-2, 20], [12, 20], [21, 26], [21, 14], [30, 2], [40, -12], [36, -28], [32, -34]],
          [[-12, 44], [-6, 30], [-6, 20], [-2, 12], [0, 0], [0, -12], [0, -17], [-6, -20], [5, -18], [8, -12], [14, -20], [14, -32], [24, -34], [32, -34]],
          [[-12, 44], [-20, 42], [-30, 40], [-40, 30], [-40, 22], [-36, 14], [-36, 4], [-36, -5], [-35, -11], [-35, -20], [-31, -30], [-31, -38], [-31, -42]],
          [[-12, 44], [-6, 30], [-6, 20], [-2, 12], [0, 0], [0, -12], [-8, -9], [-16, -9], [-22, -9], [-25, -6], [-35, -5], [-35, -11], [-35, -20], [-40, -30], [-31, -38]],
          [[-12, 44], [-6, 30], [-6, 20], [-2, 12], [0, 4], [0, -12], [-6, -20], [5, -18], [8, -12], [14, -20], [14, -32], [8, -34]]
        ],
        red: [
          [[8, -30], [14, -30], [15, -24], [22, -34], [32, -34]],
          [[8, -30], [0, -30], [0, -22], [0, -17], [0, 0], [2, 14], [-6, 30], [-12, 44]],
          [[8, -30], [0, -30], [-10, -30], [-20, -30], [-24, -30], [-30, -38], [-31, -41]],
          [[8, -30], [0, -32], [-10, -36], [-20, -36], [-25, -39], [-30, -40], [-40, -45]],
          [[8, -30], [14, -30], [22, -34], [30, -30], [38, -20], [40, -5], [32, 4], [21, 10], [21, 24], [12, 20], [2, 16]]
        ]
      }
  };
})();
