# Dust2 Web Arena — r7

Tarayıcıda çalışan, **tamamen çevrimdışı** bir FPS demosu. three.js r128
projede gömülü; haritalar, silahlar, botlar, dokular ve sesler çalışma anında
prosedürel olarak üretilir. Kurulum, derleme veya internet bağlantısı gerekmez.
Aynı ağdaki iki bilgisayar **LAN eşler arası** maç yapabilir (kod kopyala-yapıştır
yeterlidir; sunucu yoktur).

## Çalıştırma

`index.html` dosyasına çift tıkla. Bu kadar.

- Oyun `file://` üzerinden açılmaya hazırdır; `libs/three.min.js` klasörde durur.
- İstersen VS Code Live Server gibi basit bir sunucuyla da açabilirsin.
- Ayarlar ve son seçimler `localStorage` içinde (`dust2-settings`) saklanır.

## Lobi

Açılışta maç otomatik başlamaz; önce lobi gelir:

- **Harita seç:** Dust II, Aim Redline, AWP Lego2, Meydan Köy.
- **Takım seç:** Mavi Takım (güney) veya Kırmızı Takım (kuzey).
- **Bot sayısı:** 0–15 arası. Toplam takım mevcudu 15'i geçemez; kendi
  takımında en fazla 14 bot olabilir (15. kişi sensin), karşı takımda 15 bot
  olabilir.
- **Silah seç:** AK-47, USP, AWP, M4A4, Deagle. AWP Lego2 haritasında yalnızca
  AWP seçilebilir.
- **Ayarlar:** fare hassasiyeti, parlaklık, ses, görüş açısı (FOV), nişan
  çizgisi (renk / boyut / kalınlık / boşluk / nokta / dinamik), sınırsız şarjör,
  ölümsüzlük ve geliştirici konsolu.
- Ayarlar anında uygulanır ve kaydedilir.

`MAÇI BAŞLAT` ile oyun başlar. Oyun sırasında `Esc` menüyü açar ve duraklatır;
`DEVAM ET` ile kalınan yerden devam edilir, `LOBİYE DÖN` ile maç sıfırlanır.

## Kontroller

| Tuş | İşlev |
| --- | --- |
| `W A S D` | Yürü |
| `Fare` | Etrafa bak (tıklayınca imleç kilitlenir) |
| `Sol tık` | Ateş (AK-47/M4A4 tam otomatik; USP, AWP, Deagle tek tek) |
| `1` `2` `3` `4` `5` | Silah değiştir: AK-47 / USP / AWP / M4A4 / Deagle |
| `R` | Şarjör değiştir (animasyonlu) |
| `G` | Sis bombası at |
| `F` | Flaş bombası at (bakanı kör eder) |
| `H` | HE el bombası at (alan hasarı) |
| `Ctrl` (basılı) | Eğil: alçal, yavaşla, isabeti artır |
| `Sağ tık` | AWP dürbünü: **1. basış 1x → 2. basış 2x → 3. basış dürbünden çıkar** |
| `Space` | Zıpla |
| `Shift` | Sessiz / yavaş yürü |
| `Esc` | Menü / duraklat |

`Q` ile dürbün ve `K` ile başlangıca dönme kaldırıldı. Aynı silahı yeniden
seçmek kaldırma animasyonunu tekrar oynatmaz.

### İmleç kilidi engellenirse

Bazı gömülü tarayıcılar fare kilidini reddeder. Oyun otomatik olarak
**sürükleme moduna** geçer:

- **Sağ tuşu basılı tutup sürükle:** etrafa bak.
- **Sağ tık (sürüklemeden):** AWP dürbününü değiştir.
- **Sol tık:** ateş et.

### Tarayıcı tuşları ve Ctrl+W

Oyun sırasında `Space`/okların sayfa kaydırması, `Tab`, `Backspace`, `'` `/`,
`F1`/`F3`/`F5`/`F7`, `Ctrl+S/O/P` ve `Ctrl+tekerlek` gibi kısayollar engellenir.

`Ctrl+W`, `Ctrl+T`, `Ctrl+N` tarayıcı tarafından ayrılmış kısayollardır; bir web
sayfası bunları gerçekten iptal edemez. Bu yüzden maç sürerken sayfadan
ayrılmak istendiğinde tarayıcının **“sayfadan ayrılmak istiyor musunuz?”**
onay penceresi devreye girer.

## Takımlar, doğuş ve puan

- İki takım vardır: **mavi** ve **kırmızı**. Her takımın kendi doğuş noktaları
  vardır; oyuncu seçtiği takımın doğuşunda başlar.
- Ölen oyuncu ve botlar **10 saniye** sonra **kendi takımlarının doğuş
  noktasında** yeniden doğar.
- Yeniden doğuşta **3 saniye doğuş koruması** vardır; bu sürede hasar almazsın
  ve HUD'da koruma sayacı görünür.
- **Dost ateşi kapalıdır:** ne sen ne de botlar kendi takımına hasar verebilir.
  Botlar hedef seçerken de dost takımı hiç hedeflemez.
- Sağ üstte skor, canlı bot sayıları ve takım rozeti; sol üstte harita adı ve
  bulunduğun bölge (callout) görünür.

## Silahlar ve ekipman

- **AK-47 (1):** Çok yönlü tam otomatik tüfek; dengeli hasar ve şarjör.
- **USP (2):** Hafif tabanca; hareket halinde en bağışlayıcı silah.
- **AWP (3):** Tek atışlık keskin nişancı; koşarken neredeyse hiç isabet
  etmez, dürbün döngüsü 1x → 2x → çık.
- **M4A4 (4):** Tam otomatik tüfek; AK-47'ye rakip, daha kontrollü geri tepme.
- **Deagle (5):** Yarı otomatik ağır tabanca; kafaya tek atış potansiyeli,
  güçlü geri tepme.
- **Sis (`G`):** zıplar, duman çıkarır ve 16 saniye görüşü keser; botlar dumanın
  içinden ateş edemez. Aynı anda en fazla 3 sis aktif olur.
- **Flaş (`F`):** patladığında ona bakan herkes (botlar dahil) geçici olarak
  kör olur; köşe temizlemede kullan.
- **HE (`H`):** alan hasarı verir; dost takımına zarar vermez. HUD'daki
  ekipman sayacı (Sis / Flaş / HE) kalan bombaları gösterir.

## Atış mekaniği

- Hitscan mermiler; kafa vuruşu ciddi hasar verir. Her silahın kendi hasarı,
  atış hızı, şarjörü ve hareket cezası vardır.
- **Can + zırh:** oyuncu ve botlar 100 can / 100 zırh ile başlar. Zırh gövde
  hasarının yarısını, kafa hasarının dörtte birini emer.
- **Hareket isabeti:** AWP koşarken neredeyse hiç isabet etmez; dürbünlüyken
  durmak gerekir. USP hareket halinde en bağışlayıcı silahtır. `Shift` cezayı
  azaltır, `Ctrl` ile eğilmek hem saçılmayı hem geri tepmeyi düşürür.
- Crosshair, nişan saçılmasına göre açılıp kapanır; dinamik seçeneği kapatılabilir.
- Silah animasyonları: ateş tepmesi, fare sallanması, koşarken silahın inmesi,
  nefes salınımı ve **şarjör değiştirme animasyonu**. Aynı silaha geçişte
  kaldırma animasyonu oynamaz.
- Namlu alevi namlu ucundan çıkar; iz mermisi, duvar izi ve toz parçacıkları vardır.
- Tüm sesler (silah, ayak, şarjör, isabet, sis, patlama) WebAudio ile anlık
  üretilir.

## Botlar

- 0–15 arası bot seçilebilir; 15v15'e kadar (oyuncu dahil 30 kişi) çalışır.
- Botlar takım renklerinde modellenir, ellerinde silah taşır; yürüme, nişan alma,
  geri tepme, namlu alevi ve ölüm/doğuş animasyonları vardır.
- Haritaya özel devriye rotalarında gezerler; görüş hattı, mesafe, duvar, kasa ve
  sis kontrolüyle düşman ararlar. Dost takımı hedeflemezler.
- **Taktik davranışlar:** düşman görünce baskı altında ateş eder, ağır hasar
  alınca **geri çekilip** siper arar, koridor ve kapı gibi dar geçitlerde
  **köşe tutar**; yüksek zorlukta hedefe doğru yan adım atarak (strafe)
  ateş eder.
- Vurulunca düşerler; başlarının üstündeki can/zırh barları ve doğuş koruması
  çerçevesi durumlarını gösterir. 10 saniye sonra kendi doğuşlarında yeniden
  doğarlar.
- Botlar birbirlerinin ve oyuncunun içinden geçmez; kalabalıkta birbirlerini
  itmez, yolları tıkanırsa yan yola geçerler.
- Mini haritada takım renkleriyle görünürler.

## Çok Oyunculu (LAN)

Lobideki **Çok Oyunculu** sekmesinden, aynı ağdaki iki bilgisayarla 1v1 maç
yapılır. Bağlantı **WebRTC eşler arasıdır**; ortada sunucu yoktur, sadece
kodlar kopyalanıp yapıştırılır. İnternet bağlantısı gerekmez (buz sunucuları
kullanılmaz; iki taraf da aynı LAN'da olmalıdır).

**Maç kurmak (Ana Makine):**

1. **DAVET KODU OLUŞTUR** — ekranda bir kod belirir. Bunu karşı tarafa gönder
   (telefon, mesajlaşma vb.).
2. Karşı taraf kendi ekranındaki **MAÇA KATIL** alanına bu kodu yapıştırıp
   **KATIL** der; ona bir **cevap kodu** çıkar.
3. Cevap kodunu al, **CEVAPLA BAĞLAN** alanına yapıştır ve **BAĞLAN**'a bas.
4. Bağlantı kurulunca maç otomatik başlar. Ana makine haritayı, takımları,
   botları, skoru ve maç sonunu yönetir; konuk otomatik olarak **karşı takımda**
   başlar.

**Maça katılmak (Konuk):**

1. Davet kodunu **MAÇA KATIL** alanına yapıştır, **KATIL → CEVAP KODU AL**'a bas.
2. Çıkan cevap kodunu ana makineye gönder; bağlantı onun onayıyla kurulur.

Kurallar:

- Ana makine **yetkilidir:** harita, botlar, skor ve maç sonu ona aittir.
- Her oyuncu kendi canını yönetir; hasar mesajları eşler arası gönderilir.
- Ana makinenin botları konuğun ekranında **hayalet** olarak canlandırılır;
  konuk onlara vurabilir, hasar ana makineye iletilir ve skor işlenir.
- Skor, ölüm/öldürme akışı ve maç sonu kartı iki tarafta da senkron gider.
- Bağlantı koparsa lobiye dönülür; tek taraflı maç bozulmaz.

## Haritalar

| Harita | Özellik |
| --- | --- |
| **Dust II** | Klasik düzen: A/B bölgeleri, Long A, Mid, tüneller, CT ve T doğuşları. |
| **Aim Redline** | Dar, simetrik aim haritası; merkezde siper, iki yan hat, hızlı tempo. |
| **AWP Lego2** | Renkli Lego bloklarından uzun koridor; **sadece AWP** kullanılır. |
| **Meydan Köy** | Özel tasarım köy meydanı: çeşme, pazar tezgâhları, ağaçlar ve iki savunulabilir avlu. |

Her harita kendi temasını, dokularını, doğuş noktalarını, bot rotalarını ve mini
haritasını getirir. Oyuncu ve bot doğuşları takıma göre ayrıdır.

## Geliştirici konsolu

Lobideki **Geliştirici → Geliştirici konsolu** anahtarını açtıktan sonra oyun
içinde `"` tuşuyla konsolu açabilirsin. Konsol oyunu duraklatır; kapatmak için
`"`, `'` veya `Esc`. Komut geçmişi `↑` / `↓` ile gezilir.

Örnek komutlar:

```text
help
sens 1.2
brightness 1.1
volume 0.6
fov 100
crosshair color #00ff66
crosshair size 9
crosshair thickness 2
crosshair gap 4
crosshair dot 1
crosshair dynamic 0
crosshair reset
map village
team red
bots blue 8
bots red 10
god 1
inf 1
noclip 1
spawnprotect 5
give
tp 0 0
respawn
heal
kill
scope 2
stats
clear
exit
```

Konsol açıldığında örnek komutlar ve `help` çıktısı görünür. `map` komutu
haritayı anında değiştirir; `bots` ve `team` maç sırasında da uygulanır;
`give` tüm silahların şarjörünü ve yedeğini doldurur.

## Teknik notlar

- Çarpışma ve hareket 1 m'lik ızgara (AABB) üzerinden yürür; haritalar
  `MAP_DEFS` tanımlarından dinamik olarak kurulur.
- three.js r128 yerel olarak gömülüdür. `libs/three.min.js` silinirse sayfa
  CDN'den yüklemeyi dener; normal kullanımda internet gerekmez.
- Geliştirici kancası `window.__dust2` açıktır: `player`, `keys`, `spread`,
  `updatePlayer`, `props`, `walkable`, `npcClear`, `scene`, `fire`, `reload`,
  `throwSmoke`, `cycleScope`, `setGod`, `setInf`, `damageTarget`, `npcInfo`,
  `mode`, `state`, `tick`, `mp` vb.
- Mini harita canlı konum, yön ve botları gösterir; harita başına ölçeklenir.

## Sırada

- LAN eşler arası maça takım arkadaşları eklemek (2v2 / 5v5) ve daha fazla
  eşzamanlama iyileştirmesi.
- Daha gelişmiş bot davranışları (grup saldırısı, siper değiştirme, ekipman
  kullanımı) ve silah/ayak seslerinin yönlü iyileştirmesi.
