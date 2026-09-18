/* ==========================================================================
   Lanyard — the staff pass hanging in the hero, in place of a flat portrait.
   The idea comes from the Framer/React Bits Lanyard component, which hangs a
   badge off a physics rope with three.js and a WASM physics engine. This site
   has neither, so the rope is simulated here instead: a chain of points under
   gravity, solved with Verlet integration and stiff distance constraints, and
   drawn as two SVG strands with the name printed along them. The pass is a
   plain element hung off the last two points of the chain, so it swings and
   turns on its own. Drag it, throw it, let it settle.
   ========================================================================== */
(function () {
  "use strict";

  var stage = document.querySelector("[data-lanyard]");
  if (!stage) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- settings ---------------- */
  var LINKS = 13;          // points in the rope itself
  var GRAVITY = 2100;      // px per second squared
  var FRICTION = 0.995;    // how much speed a point keeps between frames
  var AIR = 0.88;          // extra drag on the pass, so it settles rather than flails
  var ITERATIONS = 14;     // constraint passes — more is stiffer rope
  var STEP = 1 / 120;      // fixed physics step, for the same motion on any screen
  var BREEZE = 26;         // idle push, so it never hangs perfectly dead
  var SPREAD = 0.34;       // how far the two strands part at the top, as a share of the card

  /* ---------------- markup ---------------- */
  stage.innerHTML =
    '<svg class="lanyard__strap" aria-hidden="true">' +
      '<path id="lanyard-print-line" fill="none" stroke="none"></path>' +
      '<path class="lanyard__strand" data-strand="0" fill="none"></path>' +
      '<path class="lanyard__strand" data-strand="1" fill="none"></path>' +
      '<text class="lanyard__print"><textPath href="#lanyard-print-line" startOffset="6">' +
        "Samuel Yee &#183; Samuel Yee &#183; Samuel Yee &#183; Samuel Yee &#183; Samuel Yee" +
      "</textPath></text>" +
      '<g class="lanyard__ring"><circle r="9"></circle><rect x="-5" y="-15" width="10" height="13" rx="2"></rect></g>' +
    "</svg>" +
    '<div class="lanyard__card" tabindex="0" role="group"' +
      ' aria-label="Samuel\'s pass, hanging on a lanyard. Drag it, or press the left and right arrow keys, to swing it.">' +
      '<div class="pass">' +
        '<span class="pass__hole" aria-hidden="true"></span>' +
        '<p class="pass__issue">Portfolio pass &#183; 2026</p>' +
        '<img class="pass__photo" src="assets/img/badge.webp" alt="Samuel crouching in a courtyard mirror" draggable="false">' +
        '<p class="pass__name">Samuel<b>Yee</b></p>' +
        '<p class="pass__role">Engineer &amp; Photographer</p>' +
        '<span class="pass__bars" aria-hidden="true"></span>' +
        '<p class="pass__no">SG &#183; NO. 05</p>' +
      "</div>" +
    "</div>";

  var svg = stage.querySelector(".lanyard__strap");
  var strands = [stage.querySelector('[data-strand="0"]'), stage.querySelector('[data-strand="1"]')];
  var printLine = stage.querySelector("#lanyard-print-line");
  var ring = stage.querySelector(".lanyard__ring");
  var card = stage.querySelector(".lanyard__card");

  /* ---------------- the chain ----------------
     Points 0…LINKS-1 are the rope. The last two are the pass itself: its hole
     and its bottom edge, held a card's height apart, which is what gives it a
     rigid body and an angle to hang at. */
  var P = [];                       // {x, y, px, py, pin}
  var links = [];                   // {a, b, len, stiff}
  var TOP = LINKS, BOTTOM = LINKS + 1;

  var W = 0, H = 0, cardW = 0, cardH = 0, ropeLen = 0, anchorX = 0, anchorY = 0;

  function measure() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    if (!W || !H) return false;

    cardW = Math.max(150, Math.min(286, Math.min(W * 0.62, H * 0.34)));
    cardH = Math.round(cardW * 1.62);
    ropeLen = Math.max(74, H * 0.54 - cardH * 0.5);   // hangs the pass around the middle of the column
    anchorX = W * 0.5;
    anchorY = -14;                  // just off the top edge, so the strap comes from above

    stage.style.setProperty("--card-w", Math.round(cardW) + "px");
    stage.style.setProperty("--card-h", cardH + "px");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    return true;
  }

  function build() {
    P.length = 0; links.length = 0;
    var seg = ropeLen / (LINKS - 1), i;
    for (i = 0; i < LINKS; i++) {
      P.push({ x: anchorX, y: anchorY + i * seg, px: anchorX, py: anchorY + i * seg, pin: i === 0 });
    }
    // The pass, hung a short drop below the ring
    P.push({ x: anchorX, y: anchorY + ropeLen + 18, px: anchorX, py: anchorY + ropeLen + 18, pin: false });
    P.push({ x: anchorX, y: anchorY + ropeLen + 18 + cardH, px: anchorX, py: anchorY + ropeLen + 18 + cardH, pin: false });

    for (i = 0; i < LINKS - 1; i++) links.push({ a: i, b: i + 1, len: seg, stiff: 1 });
    links.push({ a: LINKS - 1, b: TOP, len: 18, stiff: 1 });      // the ring
    links.push({ a: TOP, b: BOTTOM, len: cardH, stiff: 1 });      // the card is rigid

    P[0].x = anchorX; P[0].y = anchorY;
  }

  /* ---------------- physics ---------------- */
  var t0 = 0, acc = 0, clock = 0;

  function integrate(dt) {
    var g = GRAVITY * dt * dt;
    var breeze = reduced ? 0 : Math.sin(clock * 0.7) * Math.sin(clock * 0.23 + 1.3) * BREEZE * dt * dt;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (p.pin) { p.px = p.x; p.py = p.y; continue; }
      var damp = i >= TOP ? FRICTION * AIR : FRICTION;
      var vx = (p.x - p.px) * damp;
      var vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y;
      p.x += vx + breeze;
      p.y += vy + g;
    }
  }

  function solve() {
    for (var k = 0; k < ITERATIONS; k++) {
      for (var i = 0; i < links.length; i++) {
        var l = links[i], a = P[l.a], b = P[l.b];
        var dx = b.x - a.x, dy = b.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        var diff = ((d - l.len) / d) * 0.5 * l.stiff;
        var ox = dx * diff, oy = dy * diff;
        if (!a.pin) { a.x += ox; a.y += oy; }
        if (!b.pin) { b.x -= ox; b.y -= oy; }
      }
      P[0].x = anchorX; P[0].y = anchorY;
      // Nothing may swing out past the edges of its own column
      for (var j = TOP; j <= BOTTOM; j++) {
        P[j].x = Math.max(cardW * 0.52, Math.min(W - cardW * 0.52, P[j].x));
      }
    }
  }

  /* ---------------- drawing ---------------- */
  // Two strands, parted at the top and meeting at the ring, the way a lanyard
  // loops through its clip. The offset is perpendicular to the rope.
  function strandPath(side) {
    var spread = cardW * SPREAD, d = "", i;
    for (i = 0; i < LINKS; i++) {
      var prev = P[Math.max(0, i - 1)], next = P[Math.min(LINKS - 1, i + 1)];
      var tx = next.x - prev.x, ty = next.y - prev.y;
      var len = Math.sqrt(tx * tx + ty * ty) || 1;
      var taper = 1 - i / (LINKS - 1);                 // both strands meet at the ring
      var off = side * spread * 0.5 * taper * taper;
      var x = P[i].x + (-ty / len) * off;
      var y = P[i].y + (tx / len) * off;
      d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  }

  function draw() {
    var left = strandPath(-1);
    strands[0].setAttribute("d", left);
    strands[1].setAttribute("d", strandPath(1));
    printLine.setAttribute("d", left);                 // the name runs down the left strand

    var end = P[LINKS - 1];
    ring.setAttribute("transform", "translate(" + end.x.toFixed(1) + " " + end.y.toFixed(1) + ")");

    var top = P[TOP], bottom = P[BOTTOM];
    var angle = Math.atan2(bottom.x - top.x, bottom.y - top.y) * -180 / Math.PI;
    // A little turn out of the page, from how fast it is travelling sideways
    var spin = Math.max(-38, Math.min(38, (top.x - top.px) * 2.6));
    card.style.transform =
      "translate3d(" + top.x.toFixed(1) + "px," + top.y.toFixed(1) + "px,0)" +
      " rotate(" + angle.toFixed(2) + "deg) rotateY(" + spin.toFixed(2) + "deg)";
  }

  /* ---------------- loop ---------------- */
  var raf = null, inView = true, ready = false;

  function frame(t) {
    var dt = t0 ? Math.min(0.05, (t - t0) / 1000) : STEP;
    t0 = t; clock += dt;
    acc += dt;
    var guard = 0;
    while (acc >= STEP && guard++ < 5) { integrate(STEP); solve(); acc -= STEP; }
    draw();
    raf = inView ? requestAnimationFrame(frame) : null;
    if (!raf) t0 = 0;
  }

  function kick() { if (ready && !raf && inView && !reduced) raf = requestAnimationFrame(frame); }

  /* ---------------- dragging ---------------- */
  var holding = null;              // which point the pointer has hold of

  function local(e) {
    var r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  card.addEventListener("pointerdown", function (e) {
    if (reduced || !ready || e.button !== 0) return;
    var pt = local(e);
    // Grab the end nearer the pointer, so you can swing it or spin it
    holding = (pt.y - P[TOP].y) > cardH * 0.55 ? BOTTOM : TOP;
    P[holding].pin = true;
    P[holding].x = P[holding].px = pt.x;
    P[holding].y = P[holding].py = pt.y;
    stage.classList.add("is-held");
    card.setPointerCapture(e.pointerId);
    kick();
    e.preventDefault();
  });

  card.addEventListener("pointermove", function (e) {
    if (holding === null) return;
    var pt = local(e);
    P[holding].x = pt.x;
    P[holding].y = pt.y;
    e.preventDefault();
  });

  function release() {
    if (holding === null) return;
    P[holding].pin = false;
    holding = null;
    stage.classList.remove("is-held");
  }
  card.addEventListener("pointerup", release);
  card.addEventListener("pointercancel", release);

  /* Keyboard: nudge it and let it swing, so it isn't mouse-only */
  card.addEventListener("keydown", function (e) {
    if (reduced || !ready) return;
    var push = e.key === "ArrowLeft" ? -26 : e.key === "ArrowRight" ? 26 : 0;
    if (!push) return;
    P[TOP].px -= push; P[BOTTOM].px -= push * 0.6;
    kick();
    e.preventDefault();
  });

  /* ---------------- life cycle ---------------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) kick();
    }, { rootMargin: "120px" }).observe(stage);
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var wasW = W;
      if (!ready || !measure()) return;
      if (Math.abs(W - wasW) > 1 || !P.length) { build(); }
      draw();
      kick();
    }, 150);
  }, { passive: true });

  function start() {
    if (!measure()) { requestAnimationFrame(start); return; }
    build();
    ready = true;
    if (reduced) { solve(); draw(); return; }   // hangs still, no loop
    // Start it a touch to one side so it falls in rather than appearing hung
    P[TOP].px += 26; P[BOTTOM].px += 34;
    draw();
    stage.classList.add("is-ready");
    kick();
  }

  /* The preloader covers the hero on the way in; dropping the pass behind it
     would waste the fall. Wait for the curtain, as the other openers do. */
  if (document.body.classList.contains("is-loaded")) {
    start();
  } else {
    var waited = false;
    var go = function () { if (!waited) { waited = true; start(); } };
    var mo = new MutationObserver(function () {
      if (!document.body.classList.contains("is-loaded")) return;
      mo.disconnect();
      setTimeout(go, 420);
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTimeout(function () { mo.disconnect(); go(); }, 4000);
  }
})();
