/*!
 * ENVRT DPP Embed Script
 * https://envrt.com/embed.js
 *
 * Drop this script on a page that has one or more
 *   <a class="envrt-dpp-link" href="https://envrt.com/collective/{brand}/{sku}">…</a>
 * and clicks on those anchors will open the Digital Product Passport in
 * a popup overlay (right-side drawer on desktop, bottom sheet on mobile)
 * instead of navigating away from the host page.
 *
 * The script is self-contained: vanilla JS, no dependencies, all styles
 * rendered inside a Shadow DOM so the host site's CSS can't interfere.
 *
 * Graceful degradation:
 *  - No JS / script blocked → the anchor still works as a normal link
 *  - iframe blocked by CSP frame-ancestors → falls back to new-tab nav
 *  - Mod-click (cmd/ctrl/middle) → opens in new tab as normal
 */
(function () {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__envrtDppEmbedLoaded) return;
  window.__envrtDppEmbedLoaded = true;

  // ---- Configuration ----
  var ANIMATION_MS = 300;
  var DISMISS_DRAG_PX = 100;
  var LINK_SELECTOR = "a.envrt-dpp-link";
  var DASHBOARD_ORIGIN = "https://dpp.envrt.com";
  var CLICK_ENDPOINT = "https://dpp.envrt.com/api/embed-click";
  var CONFIG_ENDPOINT_BASE = "https://dpp.envrt.com/api/embed-config/";

  var DEFAULT_SETTINGS = {
    drawerWidth: "40rem",
    drawerSide: "right",
    sheetHeight: "92svh",
    backdropDim: "50"
  };

  // ---- State ----
  /** Built lazily on first open. Reused across opens. */
  var popup = null;
  /** Scroll position saved when body is locked, restored on close. */
  var savedScrollY = 0;
  /** Most recent mod-state so the postMessage handler can fall back correctly. */
  var pendingFallbackUrl = null;
  /** Per-brand settings cache. Key is brand slug, value is a Promise that
   *  resolves with the settings object. Fetched on first popup open per
   *  brand, then reused. */
  var settingsCache = {};

  // ---- URL transform ----
  /**
   * Turn the visible link href (envrt.com/collective/{brand}/{sku}) into
   * the iframe src on the dashboard (dpp.envrt.com/embed/{brand}/{sku}).
   * The dashboard then resolves the collection and redirects to the
   * canonical /embed page. Returns null if the href doesn't match.
   */
  function buildIframeUrl(href) {
    try {
      var u = new URL(href, window.location.href);
      var parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] !== "collective" || parts.length < 3) return null;
      var brand = parts[1];
      var sku = parts[2];
      return (
        DASHBOARD_ORIGIN + "/embed/" + encodeURIComponent(brand) + "/" + encodeURIComponent(sku)
      );
    } catch (_e) {
      return null;
    }
  }

  // ---- Attribution injection ----
  // The "Powered by ENVRT" attribution is injected at runtime rather than
  // baked into the pasted snippet, so brands can't strip it from their
  // page source. Runs on script init for any anchor already in the DOM,
  // and via MutationObserver for anchors added later (SPAs, dynamic
  // product pages, etc.).
  //
  // Idempotency: each anchor is stamped with data-envrt-attributed once
  // injected. We also detect older snippets that included the attribution
  // inline (text "Powered by" or an img with envrt-logo in the src) and
  // skip those so we don't double-stamp brands who pasted the previous
  // snippet format.
  function buildAttributionSpan() {
    var span = document.createElement("span");
    span.setAttribute("data-envrt-attribution", "");
    // display:inline-block creates a new text-decoration scope so the
    // host site's anchor underline doesn't draw through this span. The
    // explicit text-decoration:none is belt-and-braces for hosts that
    // re-apply underlines via descendant selectors.
    span.style.cssText =
      "display:inline-block;text-decoration:none;font-size:0.85em;opacity:0.75;margin-top:2px;";
    span.innerHTML =
      'Powered by <img src="https://envrt.com/brand/envrt-logo.png" ' +
      'alt="ENVRT" ' +
      'style="height:0.9em;width:auto;vertical-align:-0.1em;display:inline-block;margin:0 0 0 3px;" />';
    return span;
  }

  function hasExistingAttribution(link) {
    if (link.querySelector("[data-envrt-attribution]")) return true;
    if (link.querySelector('img[src*="envrt-logo"]')) return true;
    // textContent walk catches plain-text "Powered by" from older snippet
    // formats even when the wordmark image failed to load.
    if ((link.textContent || "").indexOf("Powered by") !== -1) return true;
    return false;
  }

  function injectAttributionInto(link) {
    if (link.getAttribute("data-envrt-attributed") === "1") return;
    if (hasExistingAttribution(link)) {
      link.setAttribute("data-envrt-attributed", "1");
      return;
    }
    link.appendChild(document.createElement("br"));
    link.appendChild(buildAttributionSpan());
    link.setAttribute("data-envrt-attributed", "1");
  }

  function injectAttributionEverywhere() {
    var links = document.querySelectorAll(LINK_SELECTOR);
    for (var i = 0; i < links.length; i++) injectAttributionInto(links[i]);
  }

  function startAttributionObserver() {
    if (typeof MutationObserver !== "function") return;
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue; // element only
          if (node.matches && node.matches(LINK_SELECTOR)) {
            injectAttributionInto(node);
          }
          if (node.querySelectorAll) {
            var nested = node.querySelectorAll(LINK_SELECTOR);
            for (var k = 0; k < nested.length; k++) injectAttributionInto(nested[k]);
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Run once the DOM is ready (script is loaded async/defer so this may
  // be immediate or queued depending on parser state).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectAttributionEverywhere();
      startAttributionObserver();
    });
  } else {
    injectAttributionEverywhere();
    startAttributionObserver();
  }

  // ---- Click interception ----
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    var target = e.target;
    if (!target || typeof target.closest !== "function") return;
    var link = target.closest(LINK_SELECTOR);
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;
    var iframeUrl = buildIframeUrl(href);
    if (!iframeUrl) return;

    e.preventDefault();
    trackClick(href);
    var brand = extractBrandFromHref(href);
    fetchSettings(brand).then(applySettings);
    open({
      iframeUrl: iframeUrl,
      fallbackUrl: link.href,
      title: link.getAttribute("data-envrt-title") || link.textContent.trim() || "Digital Product Passport"
    });
  }, true);

  // ---- Public API (used by trusted callers, e.g. the dashboard preview) ----
  // Lets the brand-dashboard's "Test popout" button open the popup with the
  // current in-form settings, bypassing the fetch+cache so unsaved tweaks
  // are reflected. Tracking is skipped so internal previews don't pollute
  // analytics. View tracking on the iframe page is also automatically
  // suppressed by DppViewBeacon's referrer check (dpp.envrt.com).
  function buildTestIframeUrl(brand, sku) {
    if (!brand || !sku) return null;
    return DASHBOARD_ORIGIN + "/embed/" + encodeURIComponent(brand) + "/" + encodeURIComponent(sku);
  }

  function openTest(opts) {
    opts = opts || {};
    var iframeUrl = buildTestIframeUrl(opts.brand, opts.sku);
    if (!iframeUrl) return false;
    ensurePopup();
    applySettings(opts.settings || DEFAULT_SETTINGS);
    open({
      iframeUrl: iframeUrl,
      fallbackUrl: "https://envrt.com/collective/" +
        encodeURIComponent(opts.brand) + "/" + encodeURIComponent(opts.sku),
      title: opts.title || "Digital Product Passport"
    });
    return true;
  }

  window.envrtEmbed = {
    openTest: openTest,
    close: function () { close(); },
    // Exposed for unit tests; not part of the supported API surface.
    _buildIframeUrl: buildIframeUrl
  };

  // ---- Settings fetch + apply ----
  function extractBrandFromHref(href) {
    try {
      var u = new URL(href, window.location.href);
      var parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] !== "collective" || parts.length < 3) return null;
      return parts[1];
    } catch (_e) {
      return null;
    }
  }

  function fetchSettings(brand) {
    if (!brand) return Promise.resolve(DEFAULT_SETTINGS);
    if (settingsCache[brand]) return settingsCache[brand];
    settingsCache[brand] = fetch(CONFIG_ENDPOINT_BASE + encodeURIComponent(brand), {
      method: "GET",
      credentials: "omit",
      cache: "default"
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        return (data && data.settings) ? data.settings : DEFAULT_SETTINGS;
      })
      .catch(function () { return DEFAULT_SETTINGS; });
    return settingsCache[brand];
  }

  function applySettings(s) {
    if (!popup) return;
    var host = popup.host;
    var settings = s || DEFAULT_SETTINGS;

    // CSS variables — read by the rules in STYLES via var(--envrt-*).
    host.style.setProperty("--envrt-drawer-width", settings.drawerWidth || DEFAULT_SETTINGS.drawerWidth);
    host.style.setProperty("--envrt-sheet-height", settings.sheetHeight || DEFAULT_SETTINGS.sheetHeight);

    var dim = settings.backdropDim || DEFAULT_SETTINGS.backdropDim;
    if (dim === "blur") {
      host.style.setProperty("--envrt-backdrop-bg", "rgba(0,0,0,0.15)");
      host.style.setProperty("--envrt-backdrop-blur", "8px");
    } else {
      var alpha = (parseInt(dim, 10) || 50) / 100;
      host.style.setProperty("--envrt-backdrop-bg", "rgba(0,0,0," + alpha + ")");
      host.style.setProperty("--envrt-backdrop-blur", "2px");
    }

    // Drawer side toggles a class so CSS picks the correct base transform
    // and anchor edge for the slide-in animation.
    if (settings.drawerSide === "left") {
      host.classList.add("drawer-left");
    } else {
      host.classList.remove("drawer-left");
    }
  }

  // ---- Click tracking ----
  // Fires a non-blocking beacon BEFORE the iframe opens so we still
  // capture the click even when the iframe is blocked by CSP, an ad
  // blocker, or a network failure. Lets analytics compute click → view
  // conversion. Failures are silently ignored — analytics shouldn't
  // break the actual UX.
  function trackClick(href) {
    try {
      var u = new URL(href, window.location.href);
      var parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] !== "collective" || parts.length < 3) return;
      var payload = JSON.stringify({
        brand: parts[1],
        sku: parts[2],
        source: "embed-popup",
        visitorHash: getVisitorHash(),
        referrer: document.referrer || null
      });
      if (typeof navigator.sendBeacon === "function") {
        // sendBeacon with a string defaults to text/plain — CORS-safelisted,
        // so the request fires without a preflight even cross-origin.
        navigator.sendBeacon(CLICK_ENDPOINT, payload);
      } else {
        fetch(CLICK_ENDPOINT, {
          method: "POST",
          body: payload,
          keepalive: true,
          mode: "no-cors"
        }).catch(function () {});
      }
    } catch (_e) {
      // swallow — tracking failure is never user-facing
    }
  }

  // Lightweight per-visitor hash. Non-PII, non-persistent (no cookies
  // / localStorage). Used to coarsely correlate clicks with views.
  function getVisitorHash() {
    try {
      var fp = [
        navigator.userAgent || "",
        navigator.language || "",
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset(),
        navigator.platform || ""
      ].join("|");
      // Tiny non-crypto hash (djb2). Good enough for grouping a session.
      var h = 5381;
      for (var i = 0; i < fp.length; i++) {
        h = ((h << 5) + h + fp.charCodeAt(i)) >>> 0;
      }
      return h.toString(36);
    } catch (_e) {
      return null;
    }
  }

  // ---- Popup construction (one-shot, reused) ----
  function ensurePopup() {
    if (popup) return popup;

    var host = document.createElement("div");
    host.setAttribute("data-envrt-popup", "");
    // `all: initial` shields against host-site CSS that might style our wrapper
    // (margins, fonts, etc.). Critical positioning properties must come AFTER
    // so they override the initial values that `all` resets. Without this the
    // :host { position: fixed; z-index: ... } rule in the shadow tree gets
    // beaten by the inline `all: initial`, the host ends up position:static
    // with z-index:auto, no stacking context forms, and any host-page element
    // with z-index > 0 paints on top of the drawer.
    host.style.cssText =
      "all: initial; position: fixed; inset: 0; z-index: 2147483647; " +
      "pointer-events: none; display: none;";
    var root = host.attachShadow({ mode: "open" });

    root.innerHTML =
      "<style>" + STYLES + "</style>" +
      "<div class='overlay' data-overlay></div>" +
      "<div class='cursor-x' data-cursor aria-hidden='true'>" + X_ICON + "</div>" +
      "<div class='sheet' data-sheet>" +
      "  <div class='drag-strip' data-drag-strip aria-label='Drag to dismiss'>" +
      "    <div class='drag-handle'></div>" +
      "  </div>" +
      "  <button class='close' data-close aria-label='Close popup'>" + X_ICON + "</button>" +
      "  <div class='loading' data-loading>" +
      "    <div class='spinner'></div>" +
      "  </div>" +
      "  <iframe data-iframe sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox' title='Digital Product Passport'></iframe>" +
      "</div>";

    document.body.appendChild(host);

    var overlay = root.querySelector("[data-overlay]");
    var sheet = root.querySelector("[data-sheet]");
    var dragStrip = root.querySelector("[data-drag-strip]");
    var cursorX = root.querySelector("[data-cursor]");
    var closeBtn = root.querySelector("[data-close]");
    var iframe = root.querySelector("[data-iframe]");
    var loading = root.querySelector("[data-loading]");

    // Backdrop click closes
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    // Cursor-follow X on desktop. Hidden on touch via :host(:not(.hovering)).
    overlay.addEventListener("mousemove", function (e) {
      cursorX.style.transform =
        "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0) translate(-50%, -50%)";
    });
    overlay.addEventListener("mouseenter", function () {
      host.classList.add("cursor-on-backdrop");
    });
    overlay.addEventListener("mouseleave", function () {
      host.classList.remove("cursor-on-backdrop");
    });

    closeBtn.addEventListener("click", close);

    // Mobile drag-to-dismiss on the drag strip.
    var dragStartY = null;
    var dragOffset = 0;
    dragStrip.addEventListener("touchstart", function (e) {
      dragStartY = e.touches[0].clientY;
      sheet.style.transition = "none";
    }, { passive: true });
    dragStrip.addEventListener("touchmove", function (e) {
      if (dragStartY === null) return;
      var delta = e.touches[0].clientY - dragStartY;
      if (delta > 0) {
        dragOffset = delta;
        sheet.style.transform = "translateY(" + delta + "px)";
      }
    }, { passive: true });
    dragStrip.addEventListener("touchend", function () {
      if (dragStartY === null) return;
      sheet.style.transition = "transform 250ms ease-out";
      if (dragOffset > DISMISS_DRAG_PX) {
        sheet.style.transform = "translateY(100%)";
        window.setTimeout(close, 200);
      } else {
        sheet.style.transform = "";
      }
      window.setTimeout(function () {
        sheet.style.transition = "";
      }, 260);
      dragStartY = null;
      dragOffset = 0;
    }, { passive: true });

    iframe.addEventListener("load", function () {
      host.classList.remove("loading");
    });

    popup = {
      host: host,
      root: root,
      overlay: overlay,
      sheet: sheet,
      cursorX: cursorX,
      iframe: iframe,
      loading: loading
    };
    return popup;
  }

  // ---- Lifecycle ----
  function open(opts) {
    var p = ensurePopup();
    pendingFallbackUrl = opts.fallbackUrl;

    var src = opts.iframeUrl;
    src += (src.indexOf("?") === -1 ? "?" : "&") + "src=embed-popup";
    p.iframe.setAttribute("title", "Digital Product Passport — " + opts.title);
    p.iframe.setAttribute("src", src);
    p.host.style.display = "block";
    p.host.classList.add("loading");
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("message", onMessage);
    lockBodyScroll();

    // Double RAF so the browser paints the off-screen state before we
    // flip to .visible, otherwise the slide-in transition won't fire.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        p.host.classList.add("visible");
      });
    });
  }

  function close() {
    if (!popup) return;
    popup.host.classList.remove("visible");
    document.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("message", onMessage);
    pendingFallbackUrl = null;
    window.setTimeout(function () {
      if (!popup) return;
      popup.host.style.display = "none";
      popup.iframe.setAttribute("src", "about:blank");
      // Clear any inline transform left over from drag-to-dismiss. Without
      // this, the next open()  applies .visible but the inline transform
      // overrides the CSS rule and the sheet stays off-screen, leaving the
      // popup looking unresponsive on every subsequent click.
      popup.sheet.style.transform = "";
      popup.sheet.style.transition = "";
      unlockBodyScroll();
    }, ANIMATION_MS);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") close();
  }

  function onMessage(e) {
    var data = e && e.data;
    if (!data || data.type !== "envrt-dpp-blocked") return;
    var fallback = pendingFallbackUrl;
    close();
    if (fallback) window.open(fallback, "_blank", "noopener");
  }

  // ---- Body scroll lock (iOS-proof, restores instantly via behavior:'instant') ----
  function lockBodyScroll() {
    savedScrollY = window.scrollY;
    var body = document.body;
    body.style.position = "fixed";
    body.style.top = "-" + savedScrollY + "px";
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    var body = document.body;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.overflow = "";
    try {
      window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
    } catch (_e) {
      window.scrollTo(0, savedScrollY);
    }
  }

  // ---- Inline assets ----
  var X_ICON =
    "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" +
    "<path d='M6 18 18 6M6 6l12 12'/></svg>";

  var STYLES = [
    // Host positioning + z-index are set inline in JS so they win against the
    // `all: initial` reset. Only child-targeting rules live here.
    //
    // CSS variables drive the per-brand customisation (applied via JS in
    // applySettings). Defaults below match DEFAULT_SETTINGS so the popup
    // renders sensibly during the brief window before settings arrive.
    ":host {",
    "  --envrt-drawer-width: 40rem;",
    "  --envrt-sheet-height: 92svh;",
    "  --envrt-backdrop-bg: rgba(0,0,0,0.5);",
    "  --envrt-backdrop-blur: 2px;",
    "}",

    ".overlay {",
    "  position: fixed; inset: 0; background: var(--envrt-backdrop-bg);",
    "  backdrop-filter: blur(var(--envrt-backdrop-blur));",
    "  -webkit-backdrop-filter: blur(var(--envrt-backdrop-blur));",
    "  opacity: 0; transition: opacity 300ms; pointer-events: auto;",
    "}",
    ":host(.visible) .overlay { opacity: 1; }",
    "@media (hover: hover) and (pointer: fine) { .overlay { cursor: none; } }",

    ".cursor-x {",
    "  position: fixed; left: 0; top: 0; display: none;",
    "  width: 48px; height: 48px; border-radius: 9999px;",
    "  background: rgba(255,255,255,0.95); border: 1px solid rgba(255,255,255,0.2);",
    "  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);",
    "  color: #1e1e1e; align-items: center; justify-content: center;",
    "  pointer-events: none; opacity: 0; transition: opacity 150ms;",
    "  z-index: 2;",
    "}",
    ".cursor-x svg { width: 20px; height: 20px; }",
    "@media (hover: hover) and (pointer: fine) { .cursor-x { display: flex; } }",
    ":host(.cursor-on-backdrop.visible) .cursor-x { opacity: 1; }",

    ".sheet {",
    "  position: fixed; left: 0; right: 0; bottom: 0;",
    "  height: var(--envrt-sheet-height);",
    "  max-height: var(--envrt-sheet-height);",
    "  background: #ffffff; overflow: hidden;",
    "  border-top-left-radius: 16px; border-top-right-radius: 16px;",
    "  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);",
    "  transform: translateY(100%);",
    "  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);",
    "  pointer-events: auto;",
    "  padding-bottom: env(safe-area-inset-bottom);",
    "}",
    ":host(.visible) .sheet { transform: translateY(0); }",

    "@media (min-width: 640px) {",
    "  /* Default: right-anchored drawer. */",
    "  .sheet {",
    "    left: auto; right: 0; bottom: 0; top: 0;",
    "    width: 100%; max-width: var(--envrt-drawer-width);",
    "    height: auto; max-height: none;",
    "    border-radius: 0;",
    "    transform: translateX(100%);",
    "  }",
    "  :host(.visible) .sheet { transform: translateX(0); }",
    "",
    "  /* Left-anchored drawer (drawerSide === 'left' setting). */",
    "  :host(.drawer-left) .sheet {",
    "    left: 0; right: auto;",
    "    transform: translateX(-100%);",
    "  }",
    "  :host(.drawer-left.visible) .sheet { transform: translateX(0); }",
    "}",

    ".drag-strip {",
    "  position: absolute; left: 0; right: 0; top: 0;",
    "  height: 36px; display: flex; justify-content: center;",
    "  padding-top: 8px; z-index: 2;",
    "  touch-action: none;",
    "}",
    ".drag-handle { height: 4px; width: 48px; border-radius: 9999px; background: rgba(30,30,30,0.3); }",
    "@media (min-width: 640px) { .drag-strip { display: none; } }",

    ".close {",
    "  position: absolute; right: 12px; top: 12px;",
    "  width: 36px; height: 36px; border-radius: 9999px;",
    "  background: rgba(255,255,255,0.95);",
    "  border: 0; cursor: pointer; color: #1e1e1e;",
    "  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);",
    "  display: flex; align-items: center; justify-content: center;",
    "  z-index: 3; transition: background-color 200ms, color 200ms;",
    "}",
    ".close:hover { background: #f0eeea; color: #2aa198; }",
    ".close svg { width: 16px; height: 16px; }",

    ".loading {",
    "  position: absolute; inset: 0; background: #f8f7f4;",
    "  display: flex; align-items: center; justify-content: center; z-index: 1;",
    "  opacity: 0; transition: opacity 200ms; pointer-events: none;",
    "}",
    ":host(.loading) .loading { opacity: 1; pointer-events: auto; }",
    ".spinner { width: 32px; height: 32px; border-radius: 9999px; border: 2px solid #2aa198; border-top-color: transparent; animation: envrt-spin 1s linear infinite; }",
    "@keyframes envrt-spin { to { transform: rotate(360deg); } }",

    "iframe { width: 100%; height: 100%; border: 0; display: block; }"
  ].join("\n");
})();
