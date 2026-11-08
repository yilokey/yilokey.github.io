# BASIC-STRIKE — r7

Tarayıcıda çalışan, **tamamen çevrimdışı** bir FPS demosu. three.js r128
projede gömülü; haritalar, silahlar, botlar, dokular ve sesler çalışma anında
prosedürel olarak üretilir. Kurulum, derleme veya internet bağlantısı gerekmez.
Aynı ağdaki bilgisayarlar **LAN eşler arası** maç yapabilir (kod kopyala-yapıştır
yeterlidir; sunucu yoktur). İnternet varsa **tek kodla bağlanma** modu da hazır:
oda açanın 6 haneli kodunu yazan herkes aynı lobiye katılabilir; lobi kalabalık
olabilir (ana makine + birden fazla katılımcı).

## Çalıştırma

`index.html` dosyasına çift tıkla. Bu kadar.

- Oyun `file://` üzerinden açılmaya hazırdır; `libs/three.min.js` klasörde durur.
- İstersen VS Code Live Server gibi basit bir sunucuyla da açabilirsin.
- Ayarlar, kullanıcı adı ve silah yüklemesi `localStorage` içinde
  (`dust2-settings-r7`) saklanır.

## Lobi

Açılışta maç otomatik başlamaz; önce lobi gelir:

- **Harita seç:** Dust II, Aim Redline, AWP Lego2, Meydan Köy.
- **Takım seç:** Mavi Takım (güney) veya Kırmızı Takım (kuzey).
- **Bot sayısı:** 0–15 arası. Toplam takım mevcudu 15'i geçemez; kendi
  takımında en fazla 14 bot olabilir (15. kişi sensin), karşı takımda 15 bot
  olabilir.
- **Kullanıcı adı (zorunlu):** Maça başlamadan önce 2–16 karakterlik bir ad gir.
  Ad; üst profil, skorbord, öldürme akışı ve çok oyunculu eşleşmede görünür.
- **Silah yüklemesi (zorunlu):** Tüm tüfeklerden **bir adet** (AK-47, AWP,
  M4A4) ve tüm tabancalardan **bir adet** (USP, Deagle) seçmeden maç başlamaz.
  Seçimler değiştirene kadar geçerlidir; maç içinde yalnızca bu iki ateşli
  silah kullanılır. AWP Lego2 haritasında tüfek olarak yalnızca AWP kullanılır
  (bıçak her haritada yanında).
- **Ayarlar:** fare hassasiyeti, parlaklık, ses, görüş açısı (FOV, varsayılan
  75°), nişan çizgisi (renk / boyut / kalınlık / boşluk / nokta / dinamik),
  sınırsız şarjör, ölümsüzlük ve geliştirici konsolu. Sınırsız şarjör ve
  ölümsüzlük varsayılan olarak **kapalıdır**; çok oyunculuda yalnızca
  **lobi sahibi** açabilir.
- Ayarlar anında uygulanır ve kaydedilir.

`MAÇI BAŞLAT` ile oyun başlar. Oyun sırasında `Esc` menüyü açar; oyun çok
oyunculu olduğu için **durmaz**, botlar ve maç saati arka planda devam eder.
`DEVAM ET` ile menü kapanır, `LOBİYE DÖN` ile maç sıfırlanır.

## Kontroller

| Tuş | İşlev |
| --- | --- |
| `W A S D` | Yürü |
| `Fare` | Etrafa bak (tıklayınca imleç kilitlenir) |
| `Sol tık` | Ateş (AK-47/M4A4 tam otomatik; USP, AWP, Deagle tek tek); bıçakta **hızlı hamle (35)**; bombadayken **fırlat** |
| `1` | Yüklemede seçtiğin tüfek |
| `2` | Yüklemede seçtiğin tabanca |
| `3` | Bıçak |
| `4` `5` `6` | Sis / Flaş / HE bombasını **ele al** (atmak için sol tık) |
| `G` `F` `H` | Sis / Flaş / HE bombasını ele al veya bırak |
| `Tab` (basılı) | Skor tablosunu göster |
| `R` | Şarjör değiştir (animasyonlu) |
| `Ctrl` (basılı) | Eğil: alçal, yavaşla, isabeti artır |
| `Sağ tık` | AWP dürbünü (**1x → 2x → çık**); bıçakta **ağır hamle (75, 2 kat yavaş)**; bombadayken **yarı mesafeye fırlat** |
| `Space` | Zıpla (basılı tutsan da her basışta bir kez) |
| `Shift` | Sessiz / yavaş yürü |
| `U` | **Takım sohbeti** yaz (`Enter` gönder / boşsa kapat, `Esc` iptal) |
| `Y` | **Herkese açık sohbet** yaz (`Enter` gönder / boşsa kapat, `Esc` iptal) |
| `Esc` | Menüyü aç / kapat (oyun durmaz, sohbet açıkken önce sohbeti kapatır) |

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
- Ölen oyuncu ve botlar **5 saniye** sonra **kendi takımlarının doğuş
  noktasında** yeniden doğar. Cesetler öldükleri yerde **4 saniye** kaldıktan
  sonra tamamen silinir; doğuş anında ölüm yerinde anlık bir kopya görünmez.
- Yeniden doğuşta **3 saniye doğuş koruması** vardır; bu sürede hasar almazsın
  ve HUD'da koruma sayacı görünür.
- Ölümde **kart/pencere açılmaz**; yalnızca alttaki **5 sn** geri sayımı görünür
  ve süre dolunca otomatik doğarsın. Doğuşta yüklemede seçtiğin sınıfın silahı
  (tüfek veya tabanca) **dolu şarjör + yedek** ile eline gelir.
- **Tab** tuşunu basılı tutunca takım skorları, oyuncu/bot adları, öldürme,
  ölüm, K/D, **ping**, can ve durum bilgilerini içeren skor tablosu açılır.
- **Killfeed:** sağ üstte kimin kimi **hangi silahla** (AK-47, M4A4, AWP, USP,
  Deagle, BIÇAK, EL BOMBASI) vurduğu gösterilir; kafa vuruşları ayrıca işaretlenir.
- **Can görünürlüğü:** oyun sırasında yalnızca **kendi takımının** can/zırh
  barlarını görürsün; rakip oyuncu ve botların canı gizlidir (skor tablosunda
  da `—` olarak görünür).
- **Dost ateşi kapalıdır:** ne sen ne de botlar kendi takımına hasar verebilir.
  Botlar hedef seçerken de dost takımı hiç hedeflemez.
- Sağ üstte skor, canlı bot sayıları ve takım rozeti; sol üstte **FPS'in hemen
  yanında kendi ping'in**, harita adı ve bulunduğun bölge (callout) görünür.

## Silahlar ve ekipman

Yüklemede **bir tüfek + bir tabanca** seçilir; maç içinde yalnızca bunlar
kullanılabilir. Slotlar: `1` tüfek, `2` tabanca, `3` bıçak, `4` sis,
`5` flaş, `6` HE. **Şarjör boşalınca yedek mermi varsa otomatik olarak
şarjör değiştirilir**; AWP'de bu, sürgü hareketi bittikten sonra olur.

- **AK-47:** Çok yönlü tam otomatik tüfek; dengeli hasar ve şarjör.
- **USP:** Hafif tabanca; hareket halinde en bağışlayıcı silah.
- **AWP:** Tek atışlık keskin nişancı; **gövde ve kafa tek atış**, **bacak ve
  ayak 85 hasar** (zırhı deler). Koşarken neredeyse hiç isabet etmez, dürbün
  döngüsü 1x → 2x → çık.
- **M4A4:** Tam otomatik tüfek; AK-47'ye rakip, daha kontrollü geri tepme.
- **Deagle:** Yarı otomatik ağır tabanca; kafaya tek atış potansiyeli,
  güçlü geri tepme.
- **Bıçak (3):** Yakın mesafe (2 m) savurma silahı; şarjörsüz ve sınırsız.
  **Sol tık 35 hasar ve hızlı**, **sağ tık 75 hasar ama 2 kat yavaş**. Hedefin
  arkasındaysan sol tık **50**, sağ tık **tek atış** yapar. Normal yürüyüşten
  **%20 hızlıdır**; tabanca taşırken **%10 hızlı**, tüfekte mevcut hızda
  hareket edersin.
- **Bombalar (`4` / `5` / `6` veya `G` / `F` / `H`):** Tuşa basmak bombayı
  **atmaz, ele alır**. Sol tıkla nişan çizgisinin gösterdiği yöne fizik
  kurallarına göre (yerçekimi + sekme) fırlatılır; **sağ tık yarı mesafeye**
  fırlatır.
- **Sis:** duman çıkarır ve 16 saniye görüşü keser; botlar dumanın içinden
  ateş edemez. Aynı anda en fazla 3 sis aktif olur.
- **Flaş:** patladığında ona bakan herkesi (botlar dahil) geçici olarak kör
  eder; **etki yarıçapı 52 m'dir** (eski değerin 2 katı), köşe temizlemede kullan.
- **HE:** alan hasarı verir; dost takımına zarar vermez. HUD'daki ekipman
  sayacı (Sis / Flaş / HE) kalan bombaları gösterir.

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
  geri tepme, namlu alevi ve ölüm/doğuş animasyonları vardır. Ölünce silahı
  bırakıp yere devrilirler; ceset 4 saniye sonra kaldırılır.
- Haritaya özel devriye rotalarında gezerler; görüş hattı, mesafe, duvar, kasa ve
  sis kontrolüyle düşman ararlar. Dost takımı hedeflemezler.
- Engellere takıldıklarında **A\* yol bulma** ile dolambaçlı rota çizer, duvar
  boyunca kayarak köşeleri dönerler; haritanın her köşesine ulaşabilirler.
- **Taktik davranışlar:** düşman görünce baskı altında ateş eder, ağır hasar
  alınca **geri çekilip** siper arar, koridor ve kapı gibi dar geçitlerde
  **köşe tutar**; yüksek zorlukta hedefe doğru yan adım atarak (strafe)
  ateş eder.
- Vurulunca düşerler; başlarının üstündeki can/zırh barları ve doğuş koruması
  çerçevesi durumlarını gösterir. 5 saniye sonra kendi doğuşlarında yeniden
  doğarlar.
- Botlar birbirlerinin ve oyuncunun içinden geçmez; kalabalıkta birbirlerini
  itmez, yolları tıkanırsa yan yola geçerler.
- Mini haritada takım renkleriyle görünürler.

## Çok Oyunculu

Lobideki **Çok Oyunculu** sekmesinden **kalabalık maç** yapılır: bir ana makine
ve istediği kadar katılımcı aynı lobiye bağlanabilir. Bağlantı **WebRTC eşler
arasıdır**: hareket, atış ve skor verileri sunucudan geçmez, doğrudan akar.
İki mod vardır:

### Tek kodla bağlan (önerilen)

- **Ana makine:** OYNA sekmesinde kuralları seç, MP sekmesinde **ODA AÇ**'a
  bas — 6 haneli bir oda kodu üretilir. Aynı kodu birden fazla arkadaşın
  kullanabilir.
- **Katılımcı:** kodu yazıp **KODLA BAĞLAN**'a bas. Bağlanınca **iki takım
  kartı** açılır; mavi veya kırmızıyı seçersin. Seçim ana makineye iletilir.
- **Takım dengeleme (isteğe bağlı):** ana makine bu ayarı açarsa yeni katılan,
  insan sayısı az olan takıma yerleştirilir ve kart seçimine göre gerekirse
  dengelenir. Kapalıyken herkes seçtiği takıma girer.
- **Lobi listesi:** ana makine tüm oyuncuları görür; yanlarındaki **KICK** ve
  **BAN** düğmeleriyle lobiden atabilir. **Banlanan aynı odaya geri giremez**;
  **atılan (kick) yeniden bağlanabilir**.
- **Yetkiler:** harita, bot sayıları, zorluk, öldürme hedefi, süre ve takım
  dengeleme ayarlarını **yalnızca ana makine** değiştirebilir. Katılımcılarda bu
  alanlar kilitlidir; maçı da ana makine başlatır.
- Kod internet üzerinden de çalışır: PeerJS buluşma sunucusu tarafları
  eşleştirir, veri yine doğrudan şifreli eşler arası akar. Kodu bilen odaya
  girebilir.
- **Sohbet:** `U` takım, `Y` herkes. Mesajlar ana makine üzerinden dağıtılır;
  takım mesajını yalnızca aynı takım görür, herkes mesajını tüm oyuncular görür.
  Yazarken oyun durmaz, hareket/ateş kilitlenir; mesajlar 6,5 saniye sonra
  sohbet geçmişinden silinir.
- Ağ koparsa oyuncu lobiye döner; tek oyunculu oyun etkilenmez.

### Manuel kod değişimi (çevrimdışı LAN)

İnternet yoksa aynı yerel ağdaki makineler davet/cevap koduyla bağlanır.
Bu mod tamamen sunucusuzdur; buz sunucuları dahil hiçbir sunucu kullanılmaz
(taraflar aynı LAN'da olmalıdır). Her davet/cevap kod çifti **tek bir konuk**
bağlar; kalabalık lobi için tek kod modunu kullan.

**Maç kurmak (Ana Makine):**

1. **DAVET KODU OLUŞTUR** — ekranda bir kod belirir. Bunu karşı tarafa gönder
   (telefon, mesajlaşma vb.).
2. Karşı taraf kendi ekranındaki **MAÇA KATIL** alanına bu kodu yapıştırıp
   **KATIL** der; ona bir **cevap kodu** çıkar.
3. Cevap kodunu al, **CEVAPLA BAĞLAN** alanına yapıştır ve **BAĞLAN**'a bas.
4. Bağlantı kurulunca lobi listesi dolar; konuk **takım kartlarından** seçim
   yapar. Ana makine haritayı, takımları, botları, skoru ve maç sonunu yönetir;
   maçı **MAÇI BAŞLAT** ile o başlatır.

**Maça katılmak (Konuk):**

1. Davet kodunu **MAÇA KATIL** alanına yapıştır, **KATIL → CEVAP KODU AL**'a bas.
2. Çıkan cevap kodunu ana makineye gönder; bağlantı onun onayıyla kurulur.

Kurallar:

- Ana makine **yetkilidir:** harita, botlar, skor, lobi ayarları ve maç sonu ona
  aittir; katılımcılar bu ayarları değiştiremez. Ölümsüzlük ve sınırsız şarjör
  de yalnızca ana makinede açılabilir; katılımcılarda kilitli ve kapalıdır.
- **Ping:** her oyuncunun gidiş-dönüş süresi skor tablosunda, kendi ping'in ise
  oyun içinde FPS'in yanında canlı gösterilir.
- Her oyuncu kendi canını yönetir; hasar mesajları eşler arası gönderilir.
  Konuklar ana makinenin botlarını vurabilir; hasar ve öldürme kaydı ana
  makinede işlenir. Obje üstündeki oyuncuların yüksekliği de eşlere aktarılır.
- Ana makinenin botları konuğun ekranında **hayalet** olarak canlandırılır;
  konuk onlara vurabilir, hasar ana makineye iletilir ve skor işlenir.
- Ana makine **KICK** ile oyuncuyu atabilir (tekrar bağlanabilir) veya **BAN**
  ile yasaklayabilir (aynı odaya geri giremez).
- Skor, ölüm/öldürme akışı ve maç sonu kartı tüm istemcilerde senkron gider.
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
