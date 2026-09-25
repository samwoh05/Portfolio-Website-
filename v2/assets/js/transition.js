/* ==========================================================================
   Page transition — a terracotta panel sweeps across, the next page loads
   behind it, and it sweeps off the other side.

   Two reasons it exists. One, a plain navigation flashes the browser's white
   between two cream pages, which is the cheapest-looking moment on the site.
   Two, the preloader was running its full count on every page, so moving
   around felt slower than the site is; when you arrive behind the wipe, the
   curtain is dropped and the page is simply there.

   The panel is the only thing that knows about timing. Everything else —
   links, the back button, a page restored from the browser's cache — is
   handled by getting the panel out of the way.

   Must load before site.js, so the preloader can be lifted before it starts
   counting. Under reduced motion nothing here runs at all.
   ========================================================================== */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var KEY = "sy-wipe";          // set while leaving, read on arrival
  var IN = 200;                 // ms to cover the screen
  var OUT = 260;                // ms to clear it again

  var panel = document.createElement("div");
  panel.className = "wipe";
  panel.setAttribute("aria-hidden", "true");

  function ready(fn) {
    if (document.body) { fn(); return; }
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function arriving() {
    try {
      if (sessionStorage.getItem(KEY) !== "1") return false;
      sessionStorage.removeItem(KEY);
      return true;
    } catch (e) { return false; }    // private mode: just load normally
  }

  function leaving() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* no matter */ }
  }

  /* ---------------- arriving ---------------- */
  var cameThroughWipe = arriving();

  ready(function () {
    document.body.appendChild(panel);

    if (!cameThroughWipe) return;

    /* The curtain has already been paid for by the wipe, so drop it before
       site.js starts counting to 100 behind it. */
    var curtain = document.querySelector(".preloader");
    if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);

    panel.classList.add("is-covering");

    /* One frame covered, so the new page is never seen arriving — but a tab
       that loads in the background fires no frames at all, and the screen
       must never be left under the panel. Whichever comes first wins. */
    var swept = false;
    function sweepOff() {
      if (swept) return;
      swept = true;
      panel.classList.add("is-leaving");
      setTimeout(function () {
        panel.classList.remove("is-covering", "is-leaving");
      }, OUT + 60);
    }

    requestAnimationFrame(function () { requestAnimationFrame(sweepOff); });
    setTimeout(sweepOff, 120);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) sweepOff();
    }, { once: true });
  });

  /* ---------------- leaving ---------------- */
  function sameDocument(url) {
    return url.pathname === location.pathname && url.search === location.search;
  }

  function handled(e) {
    if (e.defaultPrevented || e.button !== 0) return null;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;   // new tab, download, etc.

    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return null;
    if (a.getAttribute("href").charAt(0) === "#") return null;
    if (a.dataset.noWipe !== undefined) return null;

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return null; }
    if (url.origin !== location.origin) return null;                      // off to someone else's site
    if (!/^https?:$/.test(url.protocol)) return null;                     // mailto:, tel:
    if (sameDocument(url)) return null;                                   // an anchor on this page

    return url.href;
  }

  document.addEventListener("click", function (e) {
    var href = handled(e);
    if (!href) return;

    e.preventDefault();
    leaving();
    panel.classList.add("is-covering");

    var gone = false;
    var go = function () { if (!gone) { gone = true; location.href = href; } };
    setTimeout(go, IN);
    // If the transition never fires (a backgrounded tab, say), still travel
    setTimeout(go, IN + 320);
  });

  /* A page restored from the browser's back/forward cache keeps whatever was
     on screen when it left — including a panel mid-sweep. */
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    panel.classList.remove("is-covering", "is-leaving");
    try { sessionStorage.removeItem(KEY); } catch (err) { /* no matter */ }
  });
})();
