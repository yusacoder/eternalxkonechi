# Konechiba Senpai | Eternal Production

Tamamen JSON tabanlı, otomatik çalışan premium kişisel web sitesi. Vanilla HTML/CSS/JS ile hazırlanmıştır — hiçbir HTML dosyasını elle düzenlemenize gerek yoktur.

## Dosya Yapısı

```
/
├── index.html          → Ana sayfa (hero + sosyal medya kartları)
├── dublaj.html         → Dublajlarımız sayfası
├── manifest.json       → PWA manifest
├── sw.js               → Service Worker (offline destek)
├── robots.txt / sitemap.xml
├── assets/             → Logo, favicon, ikonlar, dub kapakları
├── data/
│   ├── data.json       → Ana sayfa içeriği (isim, logo, bio, sosyal medyalar)
│   └── dublaj.json     → Dublaj projeleri listesi
├── css/style.css        → Verilen tasarım dili birebir korunmuştur
└── js/
    ├── main.js          → Navbar, hamburger menü, tema, PWA, service worker
    ├── social.js        → data.json → hero + sosyal medya kartları
    └── dublaj.js        → dublaj.json → dublaj kartları
```

## İçerik Güncelleme (Admin Panelsiz)

Siteyi güncellemek için **sadece** `data/data.json` ve `data/dublaj.json` dosyalarını düzenlemeniz yeterlidir. Hiçbir HTML dosyasına dokunmanıza gerek yoktur.

### Yeni sosyal medya eklemek

`data/data.json` içindeki `socials` dizisine yeni bir nesne ekleyin:

```json
{
  "name": "Twitch",
  "username": "@konechibasenpai",
  "url": "https://twitch.tv/konechibasenpai",
  "icon": "twitch"
}
```

`icon` alanına desteklenen platform anahtarlarından birini yazabilirsiniz (`instagram`, `tiktok`, `threads`, `x`, `twitter`, `facebook`, `youtube`, `discord`, `github`, `linkedin`, `steam`, `telegram`, `reddit`, `pinterest`, `spotify`, `twitch`, `anilist`, `myanimelist`, `patreon`, `ko-fi`, `soundcloud`, `website`, `email`, `kick`, `bluesky`, `tumblr`, `medium`, `crunchyroll`, `mangadex`, `anime-planet`, `whatsapp`, `line`, `messenger`, vb.) veya doğrudan bir görsel dosyasının/URL'sinin yolunu verebilirsiniz — otomatik olarak algılanır.

### Yeni dublaj eklemek

`data/dublaj.json` içindeki `dubs` dizisine yeni bir proje ekleyin:

```json
{
  "title": "Proje Adı Türkçe Dublaj",
  "description": "Kısa açıklama.",
  "cover": "assets/dubs/proje-kapak.jpg",
  "siteLogo": "assets/dubs/site-logo.png",
  "siteName": "Crunchyroll",
  "url": "https://...",
  "episode": "12",
  "quality": "1080p",
  "date": "01.01.2026",
  "team": "Konechiba Senpai"
}
```

Kart sayısı sınırsızdır; yeni bir nesne eklediğinizde sayfa otomatik olarak günceli gösterir (sayfa yenilendiğinde).

## Görselleri Değiştirme

`assets/` klasöründeki `logo.png`, `icon-192.png`, `icon-512.png`, `og-image.jpg`, `favicon.svg` ve `assets/dubs/` altındaki kapak/site logosu görselleri **yer tutucu (placeholder)** olarak üretilmiştir. Kendi logonuz, favicon'unuz ve anime kapak görsellerinizle değiştirmeniz önerilir (aynı dosya adlarını kullanmanız yeterli, kod tarafında değişiklik gerekmez).

## Eksik Veri Davranışı

Bir JSON alanı boş bırakılırsa veya `url` geçersizse, site otomatik olarak varsayılan bir placeholder metni gösterir ve bağlantıyı devre dışı bırakır (URL doğrulama sistemi).

## Tema (Dark / Light)

Sağ üstteki ay/güneş butonuyla tema değiştirilebilir; seçim tarayıcıda saklanır ve bir sonraki ziyarette hatırlanır. Sistem temasına göre otomatik başlangıç teması da desteklenir.

## PWA

Site bir Service Worker (`sw.js`) ile temel offline desteğine sahiptir ve desteklenen tarayıcılarda "Yükle" butonu ile ana ekrana eklenebilir.

## Yayına Alma

Statik bir sitedir; herhangi bir statik hosting (GitHub Pages, Netlify, Vercel, cPanel vb.) üzerine tüm klasörü olduğu gibi yükleyebilirsiniz. `sitemap.xml`, `robots.txt` ve `manifest.json` içindeki `https://eternalproduction.com/` adresini kendi alan adınızla değiştirmeniz önerilir.
