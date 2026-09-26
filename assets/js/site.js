/* ==========================================================================
   Samuel Yee — shared site behaviour
   Preloader · custom cursor · overlay menu · scroll reveal · parallax · tilt
   ========================================================================== */
(function () {
  "use strict";

  /* A reload should start the page from the beginning: the preloader and the
     opening reveals only make sense from the top, and the browser would
     otherwise drop you back where you were. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);
  window.addEventListener("beforeunload", function () {
    if (!location.hash) window.scrollTo(0, 0);
  });

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine    = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var lerp    = function (a, b, n) { return a + (b - a) * n; };
  var clamp   = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ----------------------------------------------------------------
     Preloader — counts to 100, then lifts the curtain
     ---------------------------------------------------------------- */
  function preloader() {
    var el = document.querySelector(".preloader");
    if (!el) { document.body.classList.add("is-loaded"); return; }

    var out  = el.querySelector(".preloader__count");
    var bar  = el.querySelector(".preloader__bar i");
    var n    = 0;
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      document.body.classList.add("is-loaded");
      // Kick off any animation that should only start once the curtain is up
      window.dispatchEvent(new CustomEvent("site:ready"));
      setTimeout(function () { el.setAttribute("hidden", ""); }, 1400);
    }

    if (reduced) { finish(); return; }

    var tick = setInterval(function () {
      n += Math.random() * 11 + 4;
      if (n >= 100) { n = 100; clearInterval(tick); setTimeout(finish, 380); }
      if (out) out.textContent = String(Math.floor(n)).padStart(3, "0");
      if (bar) bar.style.width = n + "%";
    }, 105);

    // Never let a stalled asset trap the visitor behind the curtain
    setTimeout(function () { clearInterval(tick); finish(); }, 4200);
  }

  /* ----------------------------------------------------------------
     Overlay menu
     ---------------------------------------------------------------- */
  function menu() {
    var btn = document.querySelector(".menu-btn");
    var nav = document.querySelector(".nav-overlay");
    if (!btn || !nav) return;

    function set(open) {
      document.body.classList.toggle("is-menu-open", open);
      document.body.classList.toggle("is-locked", open);
      btn.setAttribute("aria-expanded", String(open));
      nav.setAttribute("aria-hidden", String(!open));
    }
    set(false);

    btn.addEventListener("click", function () {
      set(!document.body.classList.contains("is-menu-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("is-menu-open")) set(false);
    });
  }

  /* ----------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------- */
  function reveal() {
    var items = document.querySelectorAll(".reveal, .rise");
    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------
     Scroll-driven parallax + progress rail
     Elements opt in with data-parallax="<speed>"
     ---------------------------------------------------------------- */
  function parallax() {
    var bar   = document.querySelector(".scroll-rail__track i");
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!bar && !items.length) return;

    var target = window.scrollY;
    var eased  = target;
    var ticking = false;

    function onScroll() {
      target = window.scrollY;
      // Discrete state — set it straight away rather than inside the eased
      // loop, so it stays correct even if rAF is throttled.
      document.body.classList.toggle("is-scrolled", target > window.innerHeight * 0.72);
      // The progress rail has nothing left to say once the footer is in view
      var room = document.documentElement.scrollHeight - window.innerHeight;
      document.body.classList.toggle("is-end", room > 0 && target > room - 260);
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }

    function frame() {
      eased = reduced ? target : lerp(eased, target, 0.1);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.height = (max > 0 ? clamp(eased / max, 0, 1) * 100 : 0) + "%";
      }

      if (!reduced) {
        var vh = window.innerHeight;
        items.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > vh + 200) return;
          var speed  = parseFloat(el.dataset.parallax) || 0.1;
          // Distance of the element's centre from the viewport centre
          var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
          el.style.transform = "translate3d(0," + offset.toFixed(2) + "px,0)";
        });
      }

      if (Math.abs(target - eased) > 0.4) {
        requestAnimationFrame(frame);
      } else {
        ticking = false;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    frame();
  }

  /* ----------------------------------------------------------------
     3D tilt — pointer-tracked rotation on [data-tilt] elements
     ---------------------------------------------------------------- */
  function tilt() {
    if (!fine || reduced) return;
    var nodes = document.querySelectorAll("[data-tilt]");

    nodes.forEach(function (el) {
      var max  = parseFloat(el.dataset.tilt) || 7;
      var raf  = null;
      var cur  = { x: 0, y: 0 };
      var goal = { x: 0, y: 0 };

      el.style.perspective = "900px";

      function run() {
        cur.x = lerp(cur.x, goal.x, 0.12);
        cur.y = lerp(cur.y, goal.y, 0.12);
        el.style.transform =
          "perspective(900px) rotateX(" + cur.x.toFixed(3) + "deg) rotateY(" +
          cur.y.toFixed(3) + "deg)";
        if (Math.abs(cur.x - goal.x) > 0.01 || Math.abs(cur.y - goal.y) > 0.01) {
          raf = requestAnimationFrame(run);
        } else { raf = null; }
      }
      function kick() { if (!raf) raf = requestAnimationFrame(run); }

      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        // Clamp to the element's own bounds. A pointer event can carry
        // coordinates outside the box, and without this the tilt overshoots
        // its max by however far outside the pointer was.
        var px = clamp((e.clientX - r.left) / r.width, 0, 1);
        var py = clamp((e.clientY - r.top) / r.height, 0, 1);
        goal.y =  (px - 0.5) * 2 * max;
        goal.x = -(py - 0.5) * 2 * max;
        kick();
      });
      el.addEventListener("mouseleave", function () {
        goal.x = 0; goal.y = 0; kick();
      });
    });
  }

  /* ----------------------------------------------------------------
     Marquee — clone the row so the loop is seamless, then let scrolling
     drive it: faster when you scroll down, backwards when you scroll up.
     ---------------------------------------------------------------- */
  var strips = [];

  function marquee() {
    document.querySelectorAll(".marquee").forEach(function (m) {
      var row = m.querySelector(".marquee__row");
      if (!row) return;

      /* The row wraps at its own width, so anything narrower than the window
         would show a gap crossing the screen before the copy behind it
         arrives. Short word lists therefore repeat until one row covers the
         viewport — which keeps the list itself free to be as short as it
         wants. The guard stops a zero-width row (fonts still loading) from
         spinning this forever. */
      var once = row.innerHTML;
      var guard = 0;
      while (row.getBoundingClientRect().width < window.innerWidth && guard++ < 12) {
        row.insertAdjacentHTML("beforeend", once);
      }

      var clone = row.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      m.appendChild(clone);
      if (reduced) return;                 // leave the CSS animation alone
      m.classList.add("marquee--live");    // hands the motion over to JS
      strips.push({ rows: [row, clone], x: 0, w: 0 });
    });
    if (strips.length) requestAnimationFrame(drift);
  }

  var lastY = window.scrollY, vel = 0;

  function drift() {
    requestAnimationFrame(drift);
    if (document.hidden) { lastY = window.scrollY; return; }

    var y = window.scrollY;
    vel = vel * 0.88 + (y - lastY) * 0.12;   // smoothed, so it glides rather than jerks
    lastY = y;

    var step = 0.55 + vel * 0.5;             // idle drift plus whatever the scroll adds
    strips.forEach(function (s) {
      if (!s.w) s.w = s.rows[0].getBoundingClientRect().width;
      if (!s.w) return;
      s.x -= step;
      if (s.x <= -s.w) s.x += s.w;
      else if (s.x > 0) s.x -= s.w;
      var t = "translate3d(" + s.x.toFixed(2) + "px,0,0)";
      s.rows[0].style.transform = t;
      s.rows[1].style.transform = t;
    });
  }

  /* ----------------------------------------------------------------
     Glaze sheen — the tiles catch the light where the pointer is
     ---------------------------------------------------------------- */
  function sheen() {
    if (!fine || reduced) return;
    document.querySelectorAll(".card").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      }, { passive: true });
    });
  }

  /* ----------------------------------------------------------------
     Boot
     ---------------------------------------------------------------- */
  /* ----------------------------------------------------------------
     The hero film.

     It is Samuel's own footage, so it is worth loading — but only for a
     reader who has not asked for less motion and is not on a metered
     connection. Everyone else keeps the poster frame, which is a still from
     the same film, so nothing is missing from the page. It also stops
     playing whenever it scrolls off screen: there is no reason to decode
     video nobody is looking at.
     ---------------------------------------------------------------- */
  function film() {
    var v = document.querySelector("[data-film]");
    if (!v) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var conn = navigator.connection || {};
    var btn = document.querySelector("[data-film-toggle]");

    /* Motion nobody can stop is the complaint people actually have about
       background video, so the film has a control — and it is the same
       control whether the film is running or was never started. */
    var held = reduced.matches || !!conn.saveData;   // held back, not broken

    var tryPlay = function () {
      if (v.preload !== "auto") { v.preload = "auto"; v.load(); }
      var p = v.play();
      if (p && p.catch) p.catch(function () {});     // refusal keeps the poster
    };

    if (btn) {
      var sync = function () {
        btn.textContent = v.paused ? "Play film" : "Pause film";
      };
      v.addEventListener("play", sync);
      v.addEventListener("pause", sync);
      btn.addEventListener("click", function () {
        if (v.paused) { held = false; tryPlay(); }
        else { held = true; v.pause(); }
      });
      sync();
      btn.removeAttribute("hidden");
    }

    if (!held) tryPlay();

    /* Off-screen video is decoding for nobody — but a film the reader paused
       stays paused when it comes back. */
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { if (!held) tryPlay(); }
        else if (!v.paused) { v.pause(); }
      });
    }, { threshold: 0.01 });
    io.observe(v);
  }

  function init() {
    preloader();
    menu();
    film();
    marquee();
    sheen();
    reveal();
    parallax();
    tilt();
  }

  // Re-run the observers after async content (gallery/projects) is injected
  window.siteRefresh = function () { reveal(); tilt(); parallax(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
