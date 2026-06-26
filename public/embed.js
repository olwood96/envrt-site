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
 *  - Mod-click (cmd/ctrl/middle) → opens in new tab as normal
 *  - Parent domain not approved → the iframe loads dpp.envrt.com which
 *    renders a branded "embedding pending approval" placeholder inside
 *    the popup; the popup stays open.
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

  // Warm DNS + TLS to dpp.envrt.com immediately so the iframe load on
  // first click skips the connection-setup penalty. Idempotent and cheap.
  (function preconnectDashboard() {
    try {
      var head = document.head || document.getElementsByTagName("head")[0];
      if (!head) return;
      if (head.querySelector('link[data-envrt-preconnect]')) return;
      var link = document.createElement("link");
      link.rel = "preconnect";
      link.href = DASHBOARD_ORIGIN;
      link.crossOrigin = "anonymous";
      link.setAttribute("data-envrt-preconnect", "");
      head.appendChild(link);
    } catch (_e) { /* non-critical */ }
  })();

  var DEFAULT_SETTINGS = {
    drawerWidth: "640px",
    drawerSide: "right",
    sheetHeight: "92svh",
    backdropDim: "50",
    // Link presentation settings. Used to override the pasted anchor's
    // CTA text + typography at runtime so brands can tweak from the
    // dashboard without re-pasting. Defaults match the snippet builder
    // so visitors on a freshly-pasted brand site see no change before
    // /api/embed-config resolves.
    linkText: "View Digital Product Passport",
    linkUnderline: "inherit",
    linkBold: "default"
  };

  // ---- State ----
  /** Built lazily on first open. Reused across opens. */
  var popup = null;
  /** Scroll position saved when body is locked, restored on close. */
  var savedScrollY = 0;
  /** Per-brand settings cache. Key is brand slug, value is a Promise that
   *  resolves with the settings object. Fetched on first popup open per
   *  brand, then reused. */
  var settingsCache = {};
  /** The element that had focus immediately before the popup opened.
   *  Used to restore focus when the popup closes so keyboard users land
   *  back on the trigger link. Null when no popup is open. */
  var previouslyFocusedElement = null;
  /** Body-level siblings of the popup host that we marked `inert` while
   *  the popup is open. Each entry is { element, hadInert } so we can
   *  restore the pre-existing inert state on close without trampling
   *  any host-page intent. */
  var inertedSiblings = [];

  // ---- URL transform ----
  /**
   * Turn the visible link href (envrt.com/collective/{brand}/{sku}) into
   * the iframe src on the dashboard (dpp.envrt.com/embed/{brand}/{sku}).
   * The dashboard then resolves the collection and redirects to the
   * canonical /embed page. Returns null if the href doesn't match.
   *
   * If the brand has stored colourway page URLs for their variants, and the
   * current page URL matches one of them, appends ?variant={sku} so the DPP
   * popup opens directly on the right colourway. Falls back to the default
   * DPP if no match is found or anything errors.
   */
  function buildIframeUrl(href, variantMappings) {
    try {
      var u = new URL(href, window.location.href);
      var parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] !== "collective" || parts.length < 3) return null;
      var brand = parts[1];
      var sku = parts[2];
      var base = DASHBOARD_ORIGIN + "/embed/" + encodeURIComponent(brand) + "/" + encodeURIComponent(sku);
      var variantSku = resolveVariantSku(variantMappings, sku);
      if (variantSku) {
        base += "?variant=" + encodeURIComponent(variantSku);
      }
      return base;
    } catch (_e) {
      return null;
    }
  }

  /**
   * Check the current page URL against stored variant page URLs for the given
   * product SKU. Returns the matching ENVRT variant SKU, or null if no match.
   * All errors are swallowed — a bad stored URL must never block the popup.
   */
  function resolveVariantSku(mappings, productSku) {
    if (!mappings || !mappings.length) return null;
    try {
      var current = window.location.href;
      for (var i = 0; i < mappings.length; i++) {
        var m = mappings[i];
        if (m.productSku !== productSku || !m.pageUrl || !m.variantSku) continue;
        try {
          if (variantUrlMatches(current, m.pageUrl)) return m.variantSku;
        } catch (_e) { /* malformed stored URL — skip */ }
      }
    } catch (_e) { /* swallow */ }
    return null;
  }

  /**
   * Returns true when the current page URL matches the stored variant page URL.
   * Matching rules:
   *   - Compare pathnames normalised (lowercase, trailing slash stripped).
   *   - If the stored URL includes search params, the current search must also
   *     match (covers Shopify ?variant= style URLs).
   *   - Hostname is ignored so http/https and www differences don't break it.
   */
  function variantUrlMatches(current, stored) {
    var a = new URL(current);
    var b = new URL(stored);
    var aN = a.pathname.toLowerCase().replace(/\/+$/, "");
    var bN = b.pathname.toLowerCase().replace(/\/+$/, "");
    if (aN !== bN) return false;
    if (b.search) return a.search === b.search;
    return true;
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
    // font-weight:normal stops the attribution inheriting bold from the
    // anchor when the brand picks "bold" for the CTA. text-decoration is
    // already overridden here so the same isolation logic applies both
    // ways: CTA-level typography never bleeds into the attribution.
    span.style.cssText =
      "display:inline-block;text-decoration:none;font-weight:normal;font-size:0.85em;opacity:0.75;margin-top:2px;";
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

  // Warm the settings cache for every brand whose link appears on the
  // page. Without this, the click handler races fetchSettings against the
  // slide-in animation, so the drawer opens at CSS defaults then visibly
  // snaps to the brand's saved width/height once the API responds.
  //
  // The same fetch resolution drives applyPresentationToBrand, so the
  // anchor's CTA text + typography update to current dashboard values
  // shortly after page load with no re-paste required.
  function prefetchSettingsForLinksOnPage() {
    var links = document.querySelectorAll(LINK_SELECTOR);
    var seen = {};
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href) continue;
      var brand = extractBrandFromHref(href);
      if (brand && !seen[brand]) {
        seen[brand] = true;
        (function (b) {
          fetchSettings(b).then(function (cached) {
            applyPresentationToBrand(b, cached.settings);
          });
        })(brand);
      }
    }
  }

  // ---- Runtime link presentation ----
  // CTA text + typography (linkText / linkUnderline / linkBold) used to
  // be baked into the pasted snippet. Now they're applied at runtime from
  // /api/embed-config so brands can adjust them in the dashboard without
  // re-pasting. Existing live pastes are unaffected: JS overrides each
  // anchor with the brand's saved values, which equal the values baked
  // in at paste time, so the visible output is identical for any brand
  // that hasn't changed its dashboard settings since.
  function applyPresentationToLink(link, settings) {
    if (!link) return;
    var s = settings || DEFAULT_SETTINGS;
    var linkText = s.linkText || DEFAULT_SETTINGS.linkText;
    var linkUnderline = s.linkUnderline || DEFAULT_SETTINGS.linkUnderline;
    var linkBold = s.linkBold || DEFAULT_SETTINGS.linkBold;

    // Replace just the first text node (the CTA) so any trailing
    // attribution span survives. If the first child isn't text (rare,
    // e.g. an icon img was prepended), insert one before it.
    var first = link.firstChild;
    if (first && first.nodeType === 3) {
      first.nodeValue = linkText;
    } else {
      link.insertBefore(document.createTextNode(linkText), first || null);
    }

    // "inherit" / "default" clear the inline override so the host site's
    // link CSS wins, matching the pre-streamline "no inline style" path.
    if (linkUnderline === "always") {
      link.style.textDecoration = "underline";
    } else if (linkUnderline === "never") {
      link.style.textDecoration = "none";
    } else {
      link.style.textDecoration = "";
    }
    if (linkBold === "bold") {
      link.style.fontWeight = "bold";
    } else {
      link.style.fontWeight = "";
    }

    link.setAttribute("data-envrt-styled", "1");
  }

  function applyPresentationToBrand(brand, settings) {
    if (!brand) return;
    var links = document.querySelectorAll(LINK_SELECTOR);
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute("href") || "";
      if (extractBrandFromHref(href) === brand) {
        applyPresentationToLink(link, settings);
      }
    }
  }

  function handleLateLink(link) {
    injectAttributionInto(link);
    var brand = extractBrandFromHref(link.getAttribute("href") || "");
    if (!brand) return;
    fetchSettings(brand).then(function (cached) {
      applyPresentationToLink(link, cached.settings);
    });
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
            handleLateLink(node);
          }
          if (node.querySelectorAll) {
            var nested = node.querySelectorAll(LINK_SELECTOR);
            for (var k = 0; k < nested.length; k++) handleLateLink(nested[k]);
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
      prefetchSettingsForLinksOnPage();
    });
  } else {
    injectAttributionEverywhere();
    startAttributionObserver();
    prefetchSettingsForLinksOnPage();
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
    // Basic validity check before preventDefault — full URL resolution
    // (including variant injection) happens after settings are warm.
    if (!buildIframeUrl(href, [])) return;

    e.preventDefault();
    trackClick(href);
    var brand = extractBrandFromHref(href);
    var title = link.getAttribute("data-envrt-title") || link.textContent.trim() || "Digital Product Passport";
    // Apply brand settings BEFORE triggering the slide-in animation, so
    // the drawer opens at the correct width/height instead of snapping
    // mid-animation. Settings are typically cache-warm from the on-load
    // prefetch, so this resolves on the next microtask (no perceptible
    // delay). First-visit users with a cold cache wait ~50-200ms for the
    // API, still much better than the previous mid-animation resize.
    fetchSettings(brand).then(function (cached) {
      var resolvedUrl = buildIframeUrl(href, cached.variantMappings);
      if (!resolvedUrl) return;
      applySettings(cached.settings);
      open({ iframeUrl: resolvedUrl, title: title });
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
      title: opts.title || "Digital Product Passport"
    });
    return true;
  }

  window.envrtEmbed = {
    openTest: openTest,
    close: function () { close(); },
    // Exposed for unit tests; not part of the supported API surface.
    _buildIframeUrl: buildIframeUrl,
    _applyPresentationToLink: applyPresentationToLink
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
    if (!brand) return Promise.resolve({ settings: DEFAULT_SETTINGS, variantMappings: [] });
    if (settingsCache[brand]) return settingsCache[brand];
    settingsCache[brand] = fetch(CONFIG_ENDPOINT_BASE + encodeURIComponent(brand), {
      method: "GET",
      credentials: "omit",
      cache: "default"
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        return {
          settings: (data && data.settings) ? data.settings : DEFAULT_SETTINGS,
          variantMappings: (data && Array.isArray(data.variantMappings)) ? data.variantMappings : [],
        };
      })
      .catch(function () { return { settings: DEFAULT_SETTINGS, variantMappings: [] }; });
    return settingsCache[brand];
  }

  function applySettings(s) {
    if (!popup) return;
    var host = popup.host;
    var settings = s || DEFAULT_SETTINGS;

    // CSS variables — read by the rules in STYLES via var(--envrt-*).
    host.style.setProperty("--envrt-drawer-width", settings.drawerWidth || DEFAULT_SETTINGS.drawerWidth);
    host.style.setProperty("--envrt-sheet-height", settings.sheetHeight || DEFAULT_SETTINGS.sheetHeight);

    // backdropDim: a number (alpha percentage) sets the dim opacity. The
    // legacy "blur" value is treated as a stronger dim, since the actual
    // backdrop-filter blur has been removed from .overlay below (it was
    // forcing whole-viewport re-blur on every parent-page paint and
    // tanking compositor performance, including the close-cursor on
    // mousemove).
    var dim = settings.backdropDim || DEFAULT_SETTINGS.backdropDim;
    if (dim === "blur") {
      host.style.setProperty("--envrt-backdrop-bg", "rgba(0,0,0,0.6)");
    } else {
      var alpha = (parseInt(dim, 10) || 50) / 100;
      host.style.setProperty("--envrt-backdrop-bg", "rgba(0,0,0," + alpha + ")");
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
      "<div class='sheet' data-sheet role='dialog' aria-modal='true' aria-label='Digital Product Passport'>" +
      "  <div class='drag-strip' data-drag-strip aria-label='Drag to dismiss'>" +
      "    <div class='drag-handle'></div>" +
      "  </div>" +
      "  <button class='close' data-close aria-label='Close popup'>" + X_ICON + "</button>" +
      "  <div class='loading' data-loading>" +
      "    <div class='qr-frame'>" +
      "      <span class='vf vf-tl'></span>" +
      "      <span class='vf vf-tr'></span>" +
      "      <span class='vf vf-bl'></span>" +
      "      <span class='vf vf-br'></span>" +
      "      <img class='qr-img' src='https://envrt.com/qr-code.png' alt='Scanning QR code' />" +
      "      <div class='qr-line'></div>" +
      "    </div>" +
      "    <p class='qr-caption'>Scanning...</p>" +
      "  </div>" +
      // Sandbox rationale, do not remove flags without testing.
      //  - allow-scripts: the DPP page is a React app that needs JS.
      //  - allow-same-origin: required so the DPP page can read its own
      //    Supabase auth cookies (set on dpp.envrt.com). Without this
      //    flag the iframe origin is "null" and Supabase auth breaks.
      //  - allow-popups + allow-popups-to-escape-sandbox: the DPP has
      //    outbound "Shop this product" links that open in new tabs and
      //    must not inherit the sandbox or they're crippled.
      // The MDN warning that `allow-scripts + allow-same-origin` lets an
      // iframe remove its own sandbox does NOT apply here: the iframe
      // loads cross-origin (dpp.envrt.com vs the brand's domain), so
      // `parent.document` is blocked by the same-origin policy.
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
    var alreadyOpen = p.host.classList.contains("visible");

    var src = opts.iframeUrl;
    src += (src.indexOf("?") === -1 ? "?" : "&") + "src=embed-popup";
    p.iframe.setAttribute("title", "Digital Product Passport — " + opts.title);
    p.iframe.setAttribute("src", src);
    p.host.style.display = "block";
    p.host.classList.add("loading");
    document.addEventListener("keydown", onKeyDown);
    lockBodyScroll();

    // Save the element that had focus so we can restore it on close, and
    // mark every other body-level element as `inert` so keyboard / screen-
    // reader users can't tab or read past the popup. Skip on re-entrant
    // opens (popup already visible) so we don't overwrite the original
    // trigger with the close button we focused last time.
    if (!alreadyOpen) {
      previouslyFocusedElement =
        document && document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      applyInertToSiblings(p.host);
    }

    // Double RAF so the browser paints the off-screen state before we
    // flip to .visible, otherwise the slide-in transition won't fire.
    // For visitors with reduced-motion enabled the transitions are
    // overridden to none, so we still flip `.visible` the same way and
    // the popup appears instantly rather than sliding in.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        p.host.classList.add("visible");
      });
    });

    // Move keyboard focus into the popup once the slide-in completes, so
    // screen readers announce the dialog after it's visible and the user's
    // first Tab keeps them inside the popup chrome. Reduced-motion users
    // see the popup instantly, so focus moves immediately instead of
    // waiting for an animation that isn't running.
    var prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      if (!popup || !popup.host.classList.contains("visible")) return;
      var closeBtn = popup.root.querySelector("[data-close]");
      if (closeBtn) {
        try { closeBtn.focus(); } catch (_e) { /* focus can throw in detached docs */ }
      }
    }, prefersReducedMotion ? 0 : ANIMATION_MS);
  }

  function close() {
    if (!popup) return;
    popup.host.classList.remove("visible");
    document.removeEventListener("keydown", onKeyDown);
    // Restore inert state on siblings immediately so the page is usable
    // again as soon as close() is called, without waiting for the slide
    // animation to finish.
    restoreInertOnSiblings();
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
      // Restore keyboard focus to the element that triggered the popup,
      // matching the WAI-ARIA dialog pattern. Guard against the element
      // being gone (SPA navigation removed it) or not focusable any more.
      var prev = previouslyFocusedElement;
      previouslyFocusedElement = null;
      if (prev && document.contains(prev) && typeof prev.focus === "function") {
        try { prev.focus(); } catch (_e) { /* focus can throw */ }
      }
    }, ANIMATION_MS);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab" || !popup) return;

    // Tab trap. Focusable elements inside the popup are the close button
    // and the iframe. Sibling `inert` prevents Tab from escaping to the
    // host page, but doesn't stop the browser from cycling through
    // browser-chrome (address bar) on Shift+Tab from the close button,
    // so we explicitly wrap focus to the iframe in that case. Tab in the
    // other direction is left to the browser, which moves into the iframe
    // and lets the iframe's own page handle focus from there.
    var closeBtn = popup.root.querySelector("[data-close]");
    var active = popup.root.activeElement;
    if (e.shiftKey && active === closeBtn) {
      e.preventDefault();
      try { popup.iframe.focus(); } catch (_e) { /* focus can throw */ }
    }
  }

  /** Mark every body-level sibling of `host` as `inert` so they can't be
   *  reached by Tab or screen readers while the popup is open. Pre-existing
   *  `inert` state is captured per element so close() can put it back
   *  exactly as it was. Idempotent across re-entrant opens. */
  function applyInertToSiblings(host) {
    if (!document.body || typeof host.setAttribute !== "function") return;
    inertedSiblings = [];
    var children = document.body.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child === host) continue;
      inertedSiblings.push({
        element: child,
        hadInert: child.hasAttribute("inert")
      });
      child.setAttribute("inert", "");
    }
  }

  function restoreInertOnSiblings() {
    for (var i = 0; i < inertedSiblings.length; i++) {
      var entry = inertedSiblings[i];
      if (!entry.hadInert) entry.element.removeAttribute("inert");
    }
    inertedSiblings = [];
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
    "  --envrt-drawer-width: 640px;",
    "  --envrt-sheet-height: 92svh;",
    "  --envrt-backdrop-bg: rgba(0,0,0,0.5);",
    "}",

    // backdrop-filter: blur() used to be applied here. It re-blurred the
    // entire viewport on every parent-page paint, including every cursor
    // move, which starved the compositor and caused the close-cursor to
    // visibly lag. Solid dim only, much cheaper and visually almost
    // indistinguishable.
    ".overlay {",
    "  position: fixed; inset: 0; background: var(--envrt-backdrop-bg);",
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
    "    width: 100%; max-width: min(var(--envrt-drawer-width), 90vw);",
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

    // QR-scan loader. Mirrors the React <QRScanLoader/> component used
    // on envrt-site (hero + collective) so visitors see the same loader
    // regardless of how they reached a DPP. Hand-rendered here because
    // embed.js runs in vanilla JS inside a shadow root.
    //
    // N27 is the ENVRT brand font, loaded cross-origin from envrt.com
    // into the shadow root via @font-face. Without this rule the host
    // page's fonts wouldn't reach the caption (shadow DOM doesn't
    // inherit fonts) and the visitor would see a generic sans-serif
    // for "Scanning...". envrt.com serves /fonts/ with CORS headers so
    // the font request doesn't fail silently.
    "@font-face {",
    "  font-family: 'envrt-n27';",
    "  src: url('https://envrt.com/fonts/n27/n27-medium-webfont.woff2') format('woff2');",
    "  font-weight: 500;",
    "  font-style: normal;",
    "  font-display: swap;",
    "}",

    ".loading {",
    "  position: absolute; inset: 0; background: #f8f7f4;",
    "  display: flex; flex-direction: column;",
    "  align-items: center; justify-content: center; z-index: 1;",
    "  opacity: 0; transition: opacity 200ms; pointer-events: none;",
    "}",
    ":host(.loading) .loading { opacity: 1; pointer-events: auto; }",

    ".qr-frame { position: relative; width: 120px; height: 120px; }",
    ".vf { position: absolute; width: 20px; height: 20px; border-color: rgba(30,30,30,0.4); border-style: solid; border-width: 0; }",
    ".vf-tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 6px; }",
    ".vf-tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 6px; }",
    ".vf-bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 6px; }",
    ".vf-br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 6px; }",
    ".qr-img { position: absolute; inset: 12px; width: calc(100% - 24px); height: calc(100% - 24px); object-fit: contain; }",
    ".qr-line {",
    "  position: absolute; left: 0; right: 0; height: 2px;",
    "  background: linear-gradient(90deg, transparent, rgba(42,161,152,0.6), rgba(42,161,152,0.8), rgba(42,161,152,0.6), transparent);",
    "  box-shadow: 0 0 8px rgba(42,161,152,0.4);",
    "  animation: qr-scan 2s ease-in-out infinite;",
    "}",
    ".qr-caption {",
    "  margin: 20px 0 0; font-size: 11px; font-weight: 500;",
    "  letter-spacing: 0.05em; color: rgba(30,30,30,0.55);",
    "  font-family: 'envrt-n27', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
    "  animation: qr-pulse 2s ease-in-out infinite;",
    "}",
    "@keyframes qr-scan { 0%, 100% { top: 0; } 50% { top: 100%; } }",
    "@keyframes qr-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }",

    "iframe { width: 100%; height: 100%; border: 0; display: block; }",

    // Respect the visitor's OS-level reduced-motion preference. Cuts the
    // slide and fade transitions to near-zero so the popup snaps in
    // instead of animating. Used by visitors with vestibular sensitivity
    // and anyone who's asked their system to dial motion down.
    "@media (prefers-reduced-motion: reduce) {",
    "  .sheet, .overlay, .close, .loading { transition: none !important; }",
    "  .qr-line, .qr-caption { animation: none !important; }",
    "}"
  ].join("\n");
})();
