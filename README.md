# sierra-mooniva

Situs perkenalan **Sierra Mooniva**, virtual corporate secretary yang suka main
JRPG dan mengunggah cover. Satu halaman statis, satu file konten, nol CMS, nol
data karangan.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # cek hasil build, tanpa /api
npm run lint
```

> `npm run dev` **tidak** melayani `/api/content`. Itu serverless function milik
> Vercel, bukan route Vite. Untuk mencoba jalur live secara lokal pakai
> `vercel dev`.

## Sumber data

Tidak ada deskripsi, gambar, avatar, atau tautan yang dikarang. Semuanya
ditarik dari kanal aslinya, langsung saat build server:

| Data | Sumber |
|---|---|
| Nama kanal, bio, hashtag | Deskripsi channel YouTube |
| Avatar | `yt3.googleusercontent.com`, avatar resmi channel |
| Bio profil X, tautan | Handle `@SierraMooniva` |
| Broadcast terbaru | Tab `/streams?view=0&sort=dd`, dibaca tiap request |
| Upload non-broadcast | Tab `/videos?view=0&sort=dd` |
| Klip dari channel lain | Pencarian `sierra mooniva`, channel atau handle-nya di judul atau deskripsi |
| Status live | Badge `LIVE` di thumbnail, atau baris penonton |
| Jumlah penonton | Baris "N sedangonton" pada kartu live |
| Usia tiap item | Label relatif YouTube sendiri, dari baris metadata |
| Thumbnail | `i.ytimg.com/vi/<id>/maxresdefault.jpg`, dari `videoId` |
| Seri yang dijalankan | Dihitung dari judul, bukan ditebak |
| Tautan YouTube / X / situs | Dari handle dan deskripsi channel |

X hanya bisa dibaca lewat `og:` meta tag, jadi yang terambil adalah nama,
handle, bio, dan avatar. Jumlah pengikut tidak bisa diambil tanpa login, jadi
tidak ditampilkan.

**Tidak ada jumlah subscriber di mana pun di repo ini.** Zona `/about` yang
dipakai scraper pernah mengembalikan `14,4 rb` milik channel lain yang muncul
di baris rekomendasi, bukan channel ini. Menampilkannya berarti mengaitkan
angka orang ke orang yang salah, jadi tidak ada. Kalau suatu saat angka
subscriber dipakai, itu harus datang dari `channelId`-nya secara eksplisit:
`UChqM8QAXqPDRU5D16Os32IA`.

## Konten: tiga sumber

Semua daftar diambil server-side supaya halaman tetap statis di sisi klien.
`api/content.ts` adalah satu-satunya serverless function di repo.

```
GET /api/content
```

Tiga kategori, tiga permukaan berbeda, karena tidak satu pun memuat konten
yang lain:

| Kategori | Sumber | Diparse dari |
|---|---|---|
| Streams | Tab `/streams?sort=dd` | `lockupViewModel` |
| Video | Tab `/videos?sort=dd` | `lockupViewModel` |
| Clips | Pencarian `sierra mooniva` | `videoRenderer` |

Dua tab channel tidak saling tumpuk: `/streams` hanya berisi broadcast,
`/videos` hanya berisi upload. Klip tidak pernah disebut di keduanya, jadi
hanya halaman hasil pencarian yang bisa jadi sumbernya. Ketiganya diambil
`Promise.all`, karena tiga request ke tiga halaman berbeda tidak perlu
diserialkan.

**Sepuluh query** dipakai untuk klip, bukan satu. Satu query bukan ukuran
berapa banyak klip yang ada: YouTube mengurutkan berdasarkan relevansi terhadap
frasa yang diberi, jadi satu query hanya mengembalikan potongan web yang
cocok dengan kata-kata itu. Bentuk temuan itu diukur di situs saudara — enam
query saja melihat 8, 9, dan 7 dari sembilan belas klip pada tiga pass, sepuluh
query membawa satu pass ke 15, 13, dan 14, dan hanya gabungan sepuluh yang
pernah melihat seluruh sembilan belas — tapi yang diukur adalah bentuk
pencariannya, bukan orangnya. Angka itu karena itu dibawa, dan catatan di
`api/content.ts` menyatakan terus terang bahwa ia belum diukur ulang terhadap
kanal Sierra.

Yang **tidak** dilakukan: tidak ada satu pun pass yang diukur terhadap kanal
Sierra. Unggahannya adalah cover, dan klip dari sebuah cover berbeda bentuk
dari klip sebuah stream. Tembok klip di sini boleh kembali kosong, dan
`SNAPSHOT_CLIPS` di `src/lib/useContent.ts` kosong karena alasan yang sama
bukan karena membawa daftar kreator lain. `SNAPSHOT_STREAMS` juga kosong: dia
menerbitkan cover, bukan menyiarkan, dan mengarsipkan broadcast yang tidak
pernah ada adalah hal yang tidak boleh dilakukan file ini. `/konten` jatuh ke
 unggahan terbaru saat jendela stream kosong, dan itu perilaku yang memang
dibangun untuk kasus itu.

### Kenapa tidak ada jam mulai

Awalnya tiap kartu menampilkan jam mulai absolut. Dua-duanya gugur:

- **Feed bukan sumbernya.** `published` di RSS adalah waktu arsip naik, 2,3
  sampai 13,5 jam setelah broadcast dimulai, dan bisa jatuh di hari berbeda.
- **Halaman watch tidak bisa dibaca dari IP serverless.** Terukur dari produksi:

  | Yang dicoba | Hasil dari IP Vercel |
  |---|---|
  | Halaman watch | 200, 1,27 MB, dokumen kena deteksi bot, `liveBroadcastDetails` tidak ada |
  | Halaman watch, Cloudflare Worker | 200, `liveBroadcastDetails` tidak ada |
  | InnerTube `WEB` | `LOGIN_REQUIRED`, "Sign in to confirm you're not a bot" |
  | InnerTube `TVHTML5` | `LOGIN_REQUIRED`, sama |
  | InnerTube `ANDROID` / `IOS` | HTTP 400 |
  | Tab `/streams` | **200, parsing jalan** |

  Free proxy juga dicoba: 0 dari 25 hidup dari 1.054 entri.

Jadi tidak ada kartu yang mengklaim jam mulai. Yang tampil adalah label
relatif YouTube sendiri, "5 jam lalu", dari baris metadata yang sudah ada di
tab `/streams` maupun hasil pencarian. Itu angka yang sama dengan yang
ditampilkan YouTube di grid channel-nya.

`h` di label itu berarti **hari**, bukan jam: grid menulis jam penuh ("1 jam
lalu") dan menyingkat hari jadi `h`. Ketahuan dari mencocokkan label dengan
`endTimestamp` yang sudah terukur, di mana "5 h lalu" ternyata lima hari.
`m` satu huruf sengaja tidak dipetakan, karena bisa berarti menit atau bulan.

Cache per payload: `s-maxage=300` kalau ada yang live, `s-maxage=3600` kalau
sepi. Kalau semua sumber gagal, function mengembalikan snapshot terakhir dengan
header `stale`, bukan 500.

Klien `src/lib/useContent.ts` jatuh ke snapshot lokal kalau gagal, jadi tidak
ada section yang pernah kosong. Usia di snapshot disimpan dalam detik, bukan
teks, lalu dihitung ulang di sisi klien: snapshot yang tetap menulis "1 jam
lalu" seminggu kemudian sedang berbohong.

Snapshot-nya berisi dua belas cover dari tab `/videos`, diambil 2026-10-09
dengan label usia YouTube sendiri.

## Halaman

Lima rute, satu bundle. Router-nya lookup tabel, bukan library: tanpa nesting,
tanpa loader, tanpa param, jadi dependensi bakal lebih besar dari routing-nya
sendiri.

| Rute | Isi |
|---|---|
| `/` | Hero, Tentang, Recent Streams (24 jam), Channel |
| `/tentang` | Tentang, versi panjang dengan glosarium hashtag |
| `/konten` | Streams saja, broadcast yang sedang dan yang sudah lewat |
| `/konten/streams?id={videoId}` | Satu broadcast: pemutar YouTube, plus panel chat |
| `/konten/video` | Upload yang bukan broadcast |
| `/konten/clips` | Clip dari kanal lain yang menyebut dia |
| `/tweets` | Postingan X, terbaru lebih dulu |
| `/channel` | Tautan kanal |

Tabel rute ada di `src/content/site.ts`, bukan di App, jadi nav dan router
membaca sumber yang sama dan tidak bisa berbeda pendapat soal path mana yang
ada. `satisfies` mengikat tiap `href` ke union `Route`, sehingga salah ketik
jadi error kompilasi.

`navigate()` melakukan `pushState`. Itu bagian yang menentukan, bukan
`setState`: tanpa itu address bar tidak pernah berubah, refresh balik ke home,
dan tombol back meninggalkan situs. Ketiganya pernah diuji rusak sebelum
`pushState` ada.

`vercel.json` rewrite semua path non-`/api` ke `index.html`, jadi setiap rute
bertahan setelah hard reload.

**Footer pernah punya bug tautan mati.** Di `/konten`, `#tentang` dan
`#channel` diselesaikan terhadap halaman yang tidak punya section itu: kelihatan
bisa diklik, tidak terjadi apa-apa. Semua href sekarang rute penuh, bertipe
`Route`.

Tiap rute punya tepat satu h1: yang di `/` ada di hero, yang di `/tentang` di
heading halaman, `/konten` dan `/tweets` di heading masing-masing, `/channel`
di heading section-nya. `#konten` milik `<main>` sebagai target skip link, jadi
section yang sama memakai `#isi-*`.

Tab di `/konten` memakai `role="tablist"` dengan roving tabindex, jadi panah
kiri/kanan memindah tab, bukan Tab.

## Tweets: Nitter RSS, bukan HTML

X menutup pembacaan timeline tanpa login. Dua belas rute dicoba dari IP
serverless dan dari browser sungguhan:

| Yang dicoba | Hasil |
|---|---|
| `x.com/sierramooniva` (HTML) | 200, 136 kB, nol teks tweet |
| `syndication.twitter.com` timeline-profile | 429, tiga percobaan |
| `cdn.syndication.twimg.com` widgets/timelines | 200, nol tweet |
| `publish.twitter.com/oembed` | 404 |
| Guest token (activate + UserTweets) | 401 |
| `rsshub.app` | 404 |
| `rsshub.rssforever` | 503 |
| `rsshub.withx` / `pseudoyu` / `feeded` | connection failed |
| `xcancel.com` | 451 |
| `nitter.tiekoetter.com` | 200, tapi challenge "not a bot" |
| `nitter.tiekoetter.com` di Chromium sungguhan | tetap 0 item |
| `nitter.poast.org` | DNS gagal |
| `twiiit.com` | 403 |
| `rss-bridge.org` | 500 |
| **`nitter.kabii.moe` + `nitter1.kabii.moe` (RSS)** | **200, 20 post nyata** |

Yang paling berbahaya adalah yang pertama: halaman profil balas 200 dengan 136 kB
dan **nol** teks tweet, tapi grep dokumen menemukan string `full_text` dan
`tweet_results` di dalam bundel JavaScript. Scraper yang dibangun di atas itu
akan melaporkan sukses dan merender timeline kosong selamanya.

Jalan yang dipakai sekarang adalah **RSS milik Nitter**, bukan HTML, dan dua
instance diputar bergantian supaya satu instance yang sedang lambat tidak
menggagalkan seluruh halaman. Delapan instance lain diputar paralel di
`/api/fanart`.

Kalau semuanya gagal, endpoint tetap membalas daftar kosong **beserta
alasan**-nya, bukan 200 yang terlihat berisi. Halaman mengatakannya apa adanya di
bawah grid, supaya tidak terlihat seperti akun yang belum pernah ngepost.

Empat hal yang tidak dibawa feed, dan karena itu tidak dikarang di sini:

- **like / reply / retweet / view** tidak ada di feed, jadi `null` dan baris
  engagement di kartu dihilangkan, bukan diisi nol.
- **URL panjang tetap penuh.** Nitter memotong `<title>` sendiri dengan
  ellipsis, dan `...` di ujung apa pun dianggap terpotong lalu dibuang, karena
  `description` membawa teks yang sama tanpa terpotong. Tiap URL di badan tweet
  jadi tautan asli yang membuka tab baru.
- **Prewrite mirror dibalik ke YouTube.** Nitter mengarahkan link video lewat
  Piped dan Invidious, jadi `pipedapi.kavin.rocks/streams/{id}` ditulis ulang
  jadi `youtube.com`. Dicocokkan dari label pertama host, bukan dari pola TLD,
  karena mirror ini hidup di ratusan domain yang tidak saling berkaitan.
- **Label `RT by` / `R to` dibuang** dari teks. Itu penanda kerja Nitter,
  bukan tulisan Sierra. Prefix-nya dihapus server-side, tapi status retweet
  tetap dibaca lebih dulu supaya kartu bisa menandainya sendiri.

Card-nya dibangun dari bentuk milik situs sendiri: garis crimson di kiri, font
display untuk teksnya, dan token border serta radius yang sama dengan panel lain.
Embed widget X akan menarik style mereka beserta banner cookie-nya, dan akan
menampilkan login wall untuk siapa pun yang belum masuk.

## Halaman broadcast: pemutar hidup, chat tidak bisa diambil

`/konten/streams?id={videoId}` memasang pemutar dari
`youtube.com/embed/{videoId}`. Itu client-side, dan berhasil: HTTP 200 tanpa
bot wall.

Yang tidak berhasil adalah chat, dan alasannya sudah diuji, bukan ditebak:

| Yang dicoba | Hasil |
|---|---|
| `embed` + `embed/v1` | iframe, tidak ada chat sama sekali |
| `oEmbed` (`youtube.com/oembed`) | 400 untuk video ini |
| `watch` polos, `watch m=1`, `m.youtube.com` | bot wall, `playabilityStatus` `LOGIN_REQUIRED` |
| **`watch?bpctr=9999999999&has_verified=1`** | **`ytInitialPlayerResponse` penuh, tanpa bot wall** |
| `live_chat/get_live_chat` dengan token dari halaman itu | 200, **nol action** |
| `get_live_chat_replay` | 200, nol |
| client `WEB_EMBEDDED_PLAYER` / `TVHTML5` / `WEB` | 400 `error` |

Jadi `bpctr=9999999999` itu benar-benar menembus blokir untuk **data stream**:
`videoDetails.isLive` dan
`microformat.playerMicroformatRenderer.liveBroadcastDetails` terbaca,
termasuk `isLiveNow` dan `startTimestamp` absolut. Itu yang dipakai untuk
usia stream yang sedang berjalan.

Chat-nya tetap kosong, dan penyebabnya ada di HTML yang dikembalikan:
`liveChatRenderer.continuations` cuma berisi satu `reloadContinuationData` —
token invalidasi, bukan token pesan. `initialDisplayState` bukan array pesan,
melainkan string enum `"LIVE_CHAT_DISPLAY_STATE_EXPANDED"`, dan
`liveChatTextMessageRenderer` tidak ada sama sekali di dokumen. Panel-nya juga
sengaja belum dibuka: `showButton` = "Tampilkan chat", dan `clientMessages.tips`
berisi "Tidak dapat terhubung ke chat."

Artinya YouTube memang tidak-serving chat ke klien ini, jadi halaman chat
menjelaskan condition itu apa adanya, bukan menampilkan panel kosong yang
mengaku live. Kalau nanti chat bisa diambil, titik pasangnya sudah ada: satu
`liveChatRenderer` di halaman watch, dan `StreamPage` tinggal memakainya.

## Palet

Dari brief:

```
ground ............ #1A0003             crimson-hitam nyaris hitam
crimson .......... #D32F2F             crimson menyala
gold ............. #E5A93C             amber hangat
```

Ramp diturunkan dari hue yang sama dan **diukur**, bukan dikira. Semua pasangan
yang benar-benar dirender UI diuji di kedua tema: 4.5 untuk teks badan, 3.0 untuk
batas.

Tokens dinaikkan dari warna brief di `src/index.css` dan nilainya tercatat di
sana supaya tidak "dibetulkan" tanpa sadar. Yang paling penting: `--gold`
dipakai untuk badge, garis kiri kartu, wash, dan aksen — tidak pernah satu-satunya
pembatas dua permukaan, karena `--crimson` yang melakukan pekerjaan itu.

## Tipografi

**Bodoni Moda** untuk display, **Jost** untuk teks. Bodoni karena serif
tinggi-kontras yang memb vertebra formalitas dan keanggunan, yang justru
menyCharsets "corporate secretary" — kontra yang dipakai karakter ini, dan
memang yang paling jauh dari bulatramai. Jost untuk badan karena geometris
dengan x-height terbuka yang menjaga teks kecil tetap terbaca di atas
permukaan gelap. Keduanya self-hosted lewat `@fontsource-variable`, dengan
`unicode-range` sehingga hanya subset latin yang diunduh.

## Bentuk

Satu skala, tanpa pengecualian, dan sengaja tajam:

```
frame / panel ..... 4px
tombol ............ 4px, tidak pernah pill
tag ............... 4px
avatar ............ 4px, inset di dalam panel, bukan lingkaran
```

Ini kebalikan dari situs saudara: dari sibling yang melengkung dan hangat, yang ini
seperti dossier — panel rectilinear, garis emas, avatar besar yang duduk di
dalam kotak, bukan pill atau lingkaran di mana pun.

## Motion

Semua animasi scroll pakai `whileInView` (IntersectionObserver), tidak ada
scroll listener. `prefers-reduced-motion` membuang animasinya outright di
`src/lib/reveal.tsx`. `RevealFailsafe` memaksa blok yang masih menunggu
observer ke keadaan final saat print, supaya "Save as PDF" tidak menghasilkan
section kosong.

## Yang sudah diverifikasi

- `tsc -b` bersih, `vite build` berhasil, ESLint bersih.
- `dist/` dibangun tanpa error; bundle utama 254 kB, motion 119 kB, CSS 37 kB.
- Font Bodoni Moda dan Jost termuat dari `@fontsource-variable`, subset latin.
- Channel, hashtag, tautan X, dan situs di `src/content/site.ts` semuanya
  diambil dari kanal dan profil Sierra.
- Avatar: 900×900 dari `yt3` (YouTube) dan 400×400 dari `pbs` (X), keduanya
  diverifikasi sebagai milik dia.
- `og-image.png` dibangun ulang dari avatar itu, dikuantisasi ke palet 256
  warna: 584 kB → 244 kB, 43% dari sebelumnya, tanpa penurunan yang terlihat.
- `favicon-32.png` adalah PNG, bukan WebP dan bukan JPEG: iOS mengabaikan WebP
  untuk touch icon, dan derau JPEG di atas tanah nyaris hitam memunculkan
  halo terang pada 16px.
- Tidak ada token palet Pingu, dan tidak ada utilitas Tailwind yang mengarah ke
  token yang sudah tidak ada — `peach`, `glow`, `cocoa`, `milk`, `rounded-pill`,
  dan `text-shadow` nol di seluruh `src/`. Build adalah buktinya: utility yang
  tidak dikenal dirender sebagai no-op, bukan error, jadi ketiadaan referensi
  itulah yang menjaga warnanya tidak hilang diam-diam.

**Belum diverifikasi untuk kanal ini:** skor Lighthouse CLI, performa di
jaringan asli, jalur `/konten` saat ada stream benar-benar sedang berjalan,
pengambilan tweet dari Nitter untuk `@SierraMooniva`, dan hitungan klip. Yang
terukur di_readme ini diwarisi dari situs saudara; tidak ada satu pun angka
performanya yang diukur ulang terhadap kanal Sierra, dan tidak ada yang
dis أقرakannya seolah begitu.

## Berat aset

Avatar asli dari `yt3` 900×900 ada di jalur kritis, jadi dua avatar di-encode
ulang ke WebP (57 kB dan 24 kB). `apple-touch-icon` tetap PNG 180×180 karena
iOS mengabaikan WebP untuk touch icon dan akan memakai screenshot sebagai
gantinya. `og-image` tetap PNG karena platform sosial lebih miserable dengan
WebP, dan sudah dikuantisasi ke palet 256 warna. Upload thumbnail dibiarkan
JPEG: lazy loaded, bukan di jalur kritis.

## Deploy

Build static ke `dist/`, plus satu serverless function di `api/`. Tanpa env
var, tanpa database.

**Vercel** - import repo ini, Vite terdeteksi otomatis.
Build command `npm run build`, output `dist`, folder `api/` terbaca sebagai
function Node. Publish ke `main` akan auto-deploy.

Lalu di Settings → Domains, tambahkan `sierra-mooniva.vtube-info.xyz` sebagai
custom domain. Kalau `*.vtube-info.xyz` sudah diarahkan ke Vercel lewat DNS
wildcard, subdomain ini langsung nyambung tanpa langkah tambahan.
**Netlify** - build `npm run build`, publish `dist`. `public/_headers` ikut
tersalin untuk cache. Folder `api/` **tidak** dijalankan di sini, jadi live
detection mati dan section jatuh ke snapshot lokal.

## Stack

React 18, TypeScript, Vite 6, Tailwind v4, Motion, Phosphor icons.