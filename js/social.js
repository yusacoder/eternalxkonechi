/* ==========================================================================
   social.js — Ana sayfa: data.json okuma, hero + sosyal medya kartları
   ========================================================================== */

(function () {
  "use strict";

  var ICON_MAP = {
    instagram: "fa-brands fa-instagram",
    tiktok: "fa-brands fa-tiktok",
    threads: "fa-brands fa-threads",
    x: "fa-brands fa-x-twitter",
    twitter: "fa-brands fa-x-twitter",
    facebook: "fa-brands fa-facebook",
    youtube: "fa-brands fa-youtube",
    discord: "fa-brands fa-discord",
    "discord server": "fa-brands fa-discord",
    github: "fa-brands fa-github",
    linkedin: "fa-brands fa-linkedin",
    steam: "fa-brands fa-steam",
    telegram: "fa-brands fa-telegram",
    reddit: "fa-brands fa-reddit",
    pinterest: "fa-brands fa-pinterest",
    spotify: "fa-brands fa-spotify",
    twitch: "fa-brands fa-twitch",
    anilist: "fa-solid fa-star",
    myanimelist: "fa-solid fa-star",
    patreon: "fa-brands fa-patreon",
    "ko-fi": "fa-solid fa-mug-hot",
    kofi: "fa-solid fa-mug-hot",
    soundcloud: "fa-brands fa-soundcloud",
    website: "fa-solid fa-globe",
    "personal website": "fa-solid fa-globe",
    email: "fa-solid fa-envelope",
    "e-mail": "fa-solid fa-envelope",
    kick: "fa-solid fa-bolt",
    bluesky: "fa-brands fa-bluesky",
    tumblr: "fa-brands fa-tumblr",
    medium: "fa-brands fa-medium",
    crunchyroll: "fa-solid fa-play",
    mangadex: "fa-solid fa-book",
    "anime-planet": "fa-solid fa-book-open",
    animeplanet: "fa-solid fa-book-open",
    "facebook gaming": "fa-brands fa-facebook",
    "tiktok studio": "fa-brands fa-tiktok",
    onlyfans: "fa-solid fa-heart",
    whatsapp: "fa-brands fa-whatsapp",
    line: "fa-solid fa-comment",
    messenger: "fa-brands fa-facebook-messenger"
  };

  function iconMarkup(social) {
    var icon = (social.icon || social.name || "").toString().trim();
    var lower = icon.toLowerCase();

    var looksLikeImage = /^https?:\/\//i.test(icon) || /\.(svg|png|jpg|jpeg|webp)$/i.test(icon);
    if (looksLikeImage) {
      return '<img src="' + icon + '" alt="" loading="lazy" onerror="this.parentElement.innerHTML=\'<i class=&quot;fa-solid fa-link&quot;></i>\'">';
    }

    var faClass = ICON_MAP[lower] || ICON_MAP[(social.name || "").toLowerCase()] || "fa-solid fa-link";
    return '<i class="' + faClass + '"></i>';
  }

  function renderHero(data) {
    var logoEl = document.getElementById("hero-logo");
    var nameEl = document.getElementById("hero-name");
    var bioEl = document.getElementById("hero-bio");

    var name = window.withPlaceholder(data.name, "Konechiba Senpai");
    var bio = window.withPlaceholder(data.bio, "Bio yakında eklenecek.");
    var logo = window.withPlaceholder(data.logo, "");

    if (nameEl) {
      nameEl.textContent = name;
      document.title = name + " | Eternal Production";
    }
    if (bioEl) bioEl.textContent = bio;
    if (logoEl) {
      if (logo) {
        logoEl.src = logo;
        logoEl.style.visibility = "visible";
      } else {
        logoEl.style.visibility = "hidden";
      }
    }
  }

  function renderSocials(socials) {
    var grid = document.getElementById("social-grid");
    if (!grid) return;

    if (!Array.isArray(socials) || socials.length === 0) {
      grid.innerHTML = '<p class="placeholder-note">Henüz sosyal medya hesabı eklenmemiş.</p>';
      return;
    }

    var html = socials.map(function (social, index) {
      var url = social.url;
      var validUrl = window.isValidUrl(url);
      var username = window.withPlaceholder(social.username, "@kullaniciadi");
      var platform = window.withPlaceholder(social.name, "Platform");
      var delay = (index * 0.05).toFixed(2);

      return (
        '<a class="social-card glass-card" style="animation-delay:' + delay + 's" ' +
        (validUrl ? 'href="' + url + '" target="_blank" rel="noopener noreferrer"' : 'href="javascript:void(0)" aria-disabled="true"') +
        '>' +
          '<span class="social-icon">' + iconMarkup(social) + '</span>' +
          '<span class="social-text">' +
            '<span class="social-username">' + escapeHtml(username) + '</span>' +
            '<span class="social-platform">' + escapeHtml(platform) + '</span>' +
          '</span>' +
          '<span class="social-arrow">&#8250;</span>' +
        '</a>'
      );
    }).join("");

    grid.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadData() {
    var cacheKey = "eternal-production-data-cache";
    fetch("data/data.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("data.json okunamadı");
        return res.json();
      })
      .then(function (data) {
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) { /* noop */ }
        renderHero(data);
        renderSocials(data.socials);
      })
      .catch(function (err) {
        console.error("Otomatik hata yakalama:", err);
        var cached = null;
        try { cached = sessionStorage.getItem(cacheKey); } catch (e) { /* noop */ }
        if (cached) {
          var parsed = JSON.parse(cached);
          renderHero(parsed);
          renderSocials(parsed.socials);
        } else {
          var grid = document.getElementById("social-grid");
          if (grid) grid.innerHTML = '<p class="placeholder-note">İçerik yüklenemedi, lütfen data/data.json dosyasını kontrol edin.</p>';
        }
        if (window.showToast) window.showToast("Veriler yüklenirken bir sorun oluştu", "error");
      });
  }

  document.addEventListener("DOMContentLoaded", loadData);
})();
