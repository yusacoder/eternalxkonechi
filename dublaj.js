/* ==========================================================================
   dublaj.js — Dublajlarımız sayfası: dublaj.json okuma, kart oluşturma
   ========================================================================== */

(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderDubs(dubs) {
    var grid = document.getElementById("dub-grid");
    if (!grid) return;

    if (!Array.isArray(dubs) || dubs.length === 0) {
      grid.innerHTML = '<p class="placeholder-note">Henüz bir dublaj projesi eklenmemiş.</p>';
      return;
    }

    var html = dubs.map(function (dub, index) {
      var title = window.withPlaceholder(dub.title, "İsimsiz Proje");
      var description = window.withPlaceholder(dub.description, "");
      var cover = window.withPlaceholder(dub.cover, "");
      var siteLogo = window.withPlaceholder(dub.siteLogo, "");
      var siteName = window.withPlaceholder(dub.siteName, "");
      var episode = window.withPlaceholder(dub.episode, "-");
      var quality = window.withPlaceholder(dub.quality, "-");
      var date = window.withPlaceholder(dub.date, "-");
      var team = window.withPlaceholder(dub.team, "Eternal Production");
      var url = dub.url;
      var validUrl = window.isValidUrl(url);
      var delay = (index * 0.06).toFixed(2);

      return (
        '<article class="dub-card glass-card" style="animation-delay:' + delay + 's">' +
          (cover ? '<img class="dub-cover" src="' + cover + '" alt="' + escapeHtml(title) + '" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
          '<div class="dub-body">' +
            (siteLogo || siteName ? (
              '<div class="dub-site-row">' +
                (siteLogo ? '<img class="dub-site-logo" src="' + siteLogo + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
                (siteName ? '<span class="dub-site-name">' + escapeHtml(siteName) + '</span>' : '') +
              '</div>'
            ) : '') +
            '<h2 class="dub-title">' + escapeHtml(title) + '</h2>' +
            (description ? '<p class="dub-desc">' + escapeHtml(description) + '</p>' : '') +
            '<div class="dub-meta-grid">' +
              '<div class="dub-meta-item"><span class="label">Bölümler</span><span class="value">' + escapeHtml(episode) + '</span></div>' +
              '<div class="dub-meta-item"><span class="label">Kalite</span><span class="value">' + escapeHtml(quality) + '</span></div>' +
              '<div class="dub-meta-item"><span class="label">Yayın Tarihi</span><span class="value">' + escapeHtml(date) + '</span></div>' +
              '<div class="dub-meta-item"><span class="label">Seslendirme</span><span class="value">' + escapeHtml(team) + '</span></div>' +
            '</div>' +
            (validUrl
              ? '<a class="btn btn-primary dub-watch-btn" href="' + url + '" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-play"></i> İZLE</a>'
              : '<span class="btn btn-ghost dub-watch-btn" aria-disabled="true">Bağlantı yakında</span>') +
          '</div>' +
        '</article>'
      );
    }).join("");

    grid.innerHTML = html;
  }

  function loadData() {
    var cacheKey = "eternal-production-dublaj-cache";
    fetch("data/dublaj.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("dublaj.json okunamadı");
        return res.json();
      })
      .then(function (data) {
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) { /* noop */ }
        renderDubs(data.dubs);
      })
      .catch(function (err) {
        console.error("Otomatik hata yakalama:", err);
        var cached = null;
        try { cached = sessionStorage.getItem(cacheKey); } catch (e) { /* noop */ }
        if (cached) {
          renderDubs(JSON.parse(cached).dubs);
        } else {
          var grid = document.getElementById("dub-grid");
          if (grid) grid.innerHTML = '<p class="placeholder-note">İçerik yüklenemedi, lütfen data/dublaj.json dosyasını kontrol edin.</p>';
        }
        if (window.showToast) window.showToast("Dublaj verileri yüklenirken bir sorun oluştu", "error");
      });
  }

  document.addEventListener("DOMContentLoaded", loadData);
})();
