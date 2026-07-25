/* ==========================================================================
   main.js — Eternal Production
   Navbar / hamburger menü, tema (dark/light), PWA install, service worker,
   loading screen ve toast bildirimleri.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loading-screen");
    if (loader) {
      setTimeout(function () {
        loader.classList.add("is-hidden");
      }, 250);
    }
  });

  /* ---------- Hamburger / side menu ---------- */
  var hamburgerBtn = document.getElementById("hamburger-btn");
  var sideMenu = document.getElementById("side-menu");
  var sideOverlay = document.getElementById("side-overlay");
  var sideMenuClose = document.getElementById("side-menu-close");

  function openMenu() {
    sideMenu.classList.add("is-open");
    sideOverlay.classList.add("is-visible");
    hamburgerBtn.classList.add("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    sideMenu.classList.remove("is-open");
    sideOverlay.classList.remove("is-visible");
    hamburgerBtn.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn && sideMenu && sideOverlay) {
    hamburgerBtn.addEventListener("click", function () {
      if (sideMenu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    sideOverlay.addEventListener("click", closeMenu);
    if (sideMenuClose) sideMenuClose.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Dark / Light theme ---------- */
  var THEME_KEY = "eternal-production-theme";
  var themeToggleBtn = document.getElementById("theme-toggle-btn");
  var themeIcon = document.getElementById("theme-icon");
  var htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", theme === "light");
      themeIcon.classList.toggle("fa-sun", theme === "dark");
    }
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* noop */ }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    applyTheme(theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      var current = htmlEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* noop */ }
    });
  }

  initTheme();

  /* ---------- Toast helper (global) ---------- */
  window.showToast = function (message, type) {
    var stack = document.getElementById("toast-stack");
    if (!stack) return;
    var toast = document.createElement("div");
    toast.className = "toast" + (type ? " " + type : "");
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transition = "opacity .3s ease";
      setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  };

  /* ---------- Placeholder helper (global) ----------
     Eksik JSON verileri için varsayılan placeholder sistemi. */
  window.withPlaceholder = function (value, fallback) {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "string" && value.trim() === "") return fallback;
    return value;
  };

  /* ---------- URL doğrulama sistemi ---------- */
  window.isValidUrl = function (url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("mailto:") || url.startsWith("tel:")) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  /* ---------- PWA: install prompt ---------- */
  var deferredInstallPrompt = null;
  var installBtn = document.getElementById("install-btn");

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) installBtn.classList.add("is-visible");
  });

  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.finally(function () {
        deferredInstallPrompt = null;
        installBtn.classList.remove("is-visible");
      });
    });
  }

  window.addEventListener("appinstalled", function () {
    if (installBtn) installBtn.classList.remove("is-visible");
    if (window.showToast) window.showToast("Uygulama başarıyla yüklendi", "success");
  });

  /* ---------- Service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* offline destek olmadan devam et */
      });
    });
  }
})();
