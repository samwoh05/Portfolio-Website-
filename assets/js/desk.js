/* ==========================================================================
   The desk — the page's own colour temperature.

   Samuel patched and programmed lighting rigs before he wanted to programme
   campaigns. A lighting desk measures its lamps in kelvin: tungsten is warm
   and low, daylight is cool and high. This page runs the same scale.

   At the top it is lit tungsten (3200K) — the work already made. At the
   bottom it is daylight (5600K) — the part he is learning. Scrolling moves
   the fader, and the accent colour of the whole site is mixed live from the
   two gels rather than switched at one point. The readout in the corner is
   the honest number: it says what the page is currently lit at.

   Everything here is one rAF loop writing two custom properties and two
   short strings, and only when a rounded value actually changes.
   ========================================================================== */
(function () {
  "use strict";

  var hud = document.querySelector("[data-desk]");
  if (!hud) return;

  var K_WARM = 3200;
  var K_COOL = 5600;

  var out   = hud.querySelector("[data-desk-k]");
  var cueEl = hud.querySelector("[data-desk-cue]");
  var root  = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Every section that owns a cue, in document order */
  var cues = [].slice.call(document.querySelectorAll("[data-cue]"));

  var target = 0;   /* where the scroll says we are, 0–1 */
  var eased  = 0;   /* where the fader has got to */
  var raf    = null;
  var lastK  = -1;
  var lastCue = "";

  function progress() {
    var doc = document.documentElement;
    var span = doc.scrollHeight - window.innerHeight;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / span));
  }

  /* The cue crossing the playhead — a third of the way down the viewport,
     which is roughly where a reader is actually looking. */
  function currentCue() {
    var line = window.innerHeight * 0.34;
    var name = cues.length ? cues[0].getAttribute("data-cue") : "";
    for (var i = 0; i < cues.length; i++) {
      if (cues[i].getBoundingClientRect().top <= line) {
        name = cues[i].getAttribute("data-cue");
      }
    }
    return name;
  }

  /* Each cue stamp prints the kelvin its own section is lit at, worked out
     from where that section actually sits in the scroll. It is the same sum
     the readout does, so the stamp and the instrument can never disagree —
     and it re-does itself on resize, when every offset moves. */
  function stampCues() {
    var doc = document.documentElement;
    var span = doc.scrollHeight - window.innerHeight;
    if (span <= 0) return;
    cues.forEach(function (sec) {
      var out = sec.querySelector("[data-cue-k]");
      if (!out) return;
      var top = sec.getBoundingClientRect().top + window.scrollY;
      var p = Math.min(1, Math.max(0, (top - window.innerHeight * 0.34) / span));
      out.textContent = Math.round((K_WARM + (K_COOL - K_WARM) * p) / 50) * 50 + "K";
    });
  }

  function paint() {
    var k = Math.round((K_WARM + (K_COOL - K_WARM) * eased) / 50) * 50;

    if (k !== lastK) {
      lastK = k;
      /* The mix the whole stylesheet reads. Kept to three decimals so a
         scroll of one pixel does not invalidate every gradient on the page. */
      root.style.setProperty("--k-mix", eased.toFixed(3));
      root.style.setProperty("--k-pct", (eased * 100).toFixed(1) + "%");
      if (out) out.textContent = k + "K";
    }

    if (!cueEl) return;
    var cue = currentCue();
    if (cue !== lastCue) {
      lastCue = cue;
      cueEl.textContent = cue;
    }
  }

  function loop() {
    eased += (target - eased) * 0.14;
    if (Math.abs(target - eased) < 0.0015) { eased = target; raf = null; }
    else { raf = requestAnimationFrame(loop); }
    paint();
  }

  function onScroll() {
    target = progress();
    /* Under reduced motion the fader does not glide — it is simply set. */
    if (reduced.matches) { eased = target; paint(); return; }
    if (!raf) raf = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { onScroll(); stampCues(); }, { passive: true });
  window.addEventListener("load", function () { onScroll(); stampCues(); });

  target = eased = progress();
  paint();
  stampCues();
  hud.removeAttribute("hidden");
})();
