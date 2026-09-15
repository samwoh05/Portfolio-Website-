/* ==========================================================================
   Photo ring — the gallery teaser on the home page. Landscape photographs
   stand in a circle that turns as you scroll and keeps drifting when you
   stop, each card fading as it turns away and floating over its own shadow.
   A plain-JavaScript port of the CircularGallery component from 21st.dev
   (this site has no React or Tailwind): each card is the photograph alone,
   with its details set in the bottom-left corner. Pick one and it opens in
   the gallery's lightbox.
   ========================================================================== */
(function () {
  "use strict";

  var stage = document.querySelector("[data-gallery-ring]");
  if (!stage) return;

  var DATA = (window.GALLERY_DATA && window.GALLERY_DATA.items) || [];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COUNT = 8;                     // fewer, larger cards than the original's ten
  var DRIFT = 4;                     // degrees a second while nobody is scrolling
  var PER_PX = 0.12;                 // degrees of turn for each pixel scrolled
  var SWAP_EVERY = 6000;             // ms between quiet photo swaps round the back
  var DEPTH = 3.3;                   // perspective as a multiple of the radius, as in the original
  var NEAR = DEPTH / (DEPTH - 1);    // how much that magnifies the card at the front
  var GAP = 0.09;                    // how far a card floats above its shadow, as a share of its width
  var SHADOW = 0.14;                 // depth of that shadow, likewise (matches .ring__shadow)

  /* Landscape photographs only. Each keeps its index in the full collection,
     so the lightbox opens the right one. */
  var POOL = [];
  DATA.forEach(function (it, i) {
    if (it.type !== "video" && it.src && it.w > it.h) POOL.push({ i: i, it: it });
  });
  COUNT = Math.min(COUNT, POOL.length);
  if (COUNT < 3) return;

  // The squarest frame in the pool decides how tall the stage has to be
  var TALLEST = Math.max.apply(null, POOL.map(function (p) { return p.it.h / p.it.w; }));

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* The photograph at its own shape, and its details in the corner: the set it
     belongs to on the gallery page, then the camera and lens */
  function fill(card, p) {
    var it = p.it;
    var meta = [it.camera, it.lens].filter(Boolean).join(" · ");
    card._p = p;
    card.dataset.i = p.i;
    card.setAttribute("aria-label",
      "Open photograph" + (it.group ? ": " + it.group : "") + (meta ? ", " + meta : ""));
    card.innerHTML =
      '<img src="' + esc(it.src) + '" alt="' + esc(it.alt || "") + '" draggable="false"' +
        ' style="aspect-ratio:' + it.w + "/" + it.h + '">' +
      '<span class="ring__info">' +
        (it.group ? '<b class="ring__title">' + esc(it.group) + "</b>" : "") +
        (meta ? '<i class="ring__meta">' + esc(meta) + "</i>" : "") +
      "</span>";
  }

  /* ---------------- build ---------------- */
  var bag = shuffle(POOL.slice());
  var spare = bag.slice(COUNT);            // what the quiet swaps draw from

  stage.innerHTML =
    '<div class="ring" role="group" aria-label="A ring of photographs. Scroll or drag to turn it, and pick one to open it.">' +
      '<div class="ring__spin"></div>' +
    "</div>";
  var ring = stage.querySelector(".ring");
  var spin = stage.querySelector(".ring__spin");
  var step = 360 / COUNT;

  var cards = bag.slice(0, COUNT).map(function (p) {
    var s = document.createElement("span");
    s.className = "ring__shadow";
    s.setAttribute("aria-hidden", "true");
    spin.appendChild(s);

    var b = document.createElement("button");
    b.type = "button";
    b.className = "ring__card";
    b._shadow = s;
    fill(b, p);
    spin.appendChild(b);
    return b;
  });

  /* ---------------- geometry ---------------- */
  var cardW = 0, radius = 0;

  // A card, and the shadow it floats over, at their place on the ring
  function place(n) {
    var c = cards[n];
    var h = cardW * c._p.it.h / c._p.it.w;
    var at = "rotateY(" + (n * step) + "deg) translateZ(" + radius + "px) ";
    c.style.transform = at + "translateY(-50%)";
    c._shadow.style.transform = at + "translateY(" + Math.round(h / 2 + cardW * GAP) + "px)";
  }

  // Card width follows the column; the radius is just wide enough that
  // neighbours don't collide. The centre line sits high enough, and the stage
  // is tall enough, that the squarest frame and the shadow under it both
  // clear the edges once they are magnified at the front.
  function measure() {
    cardW = Math.max(220, Math.min(400, (stage.clientWidth || window.innerWidth) * 0.3));
    radius = Math.round(COUNT * cardW * 1.1 / (2 * Math.PI));
    var above = cardW * TALLEST / 2 * NEAR;
    var below = (cardW * TALLEST / 2 + cardW * (GAP + SHADOW)) * NEAR;
    stage.style.setProperty("--card", cardW.toFixed(1) + "px");
    stage.style.setProperty("--ring-y", Math.round(above + 28) + "px");
    stage.style.setProperty("--ring-h", Math.round(above + below + 56) + "px");
    ring.style.perspective = Math.round(radius * DEPTH) + "px";
    cards.forEach(function (c, n) { place(n); });
  }

  /* ---------------- turning ---------------- */
  var rot = 0, goal = 0, lastT = 0, raf = null;
  var lastY = window.scrollY;
  var inView = false, hovering = false, focused = false;
  var dragging = false, moved = 0, dragX = 0;

  function angleOf(n) {                    // 0 facing you, 180 directly behind
    var a = (((n * step + rot) % 360) + 360) % 360;
    return a > 180 ? 360 - a : a;
  }

  function paint() {
    spin.style.transform = "rotateY(" + rot.toFixed(3) + "deg)";
    cards.forEach(function (c, n) {
      var o = Math.max(0.3, 1 - angleOf(n) / 180);
      c.style.opacity = o.toFixed(3);
      c._shadow.style.opacity = (o * o).toFixed(3);   // shadows round the back fade faster
    });
  }

  function frame(t) {
    var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
    lastT = t;
    if (!reduced && !hovering && !focused && !dragging) goal += DRIFT * dt;
    rot += (goal - rot) * (reduced ? 1 : 0.1);
    paint();
    swapBehind(t);
    var busy = !reduced || dragging || Math.abs(goal - rot) > 0.01;
    raf = inView && busy ? requestAnimationFrame(frame) : null;
    if (!raf) lastT = 0;
  }
  function kick() { if (!raf && inView) raf = requestAnimationFrame(frame); }

  /* Scrolling turns it by how far you scrolled, not by where you are on the
     page, so it never snaps back to a scroll position after drifting. */
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (inView && !reduced) goal += (y - lastY) * PER_PX;
    lastY = y;
  }, { passive: true });

  // Only turn while it is on screen; off-screen frames are wasted
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) kick();
    }, { rootMargin: "100px" }).observe(stage);
  } else {
    inView = true;
  }

  // Hold still under the mouse, so a card can be picked
  stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
  stage.addEventListener("pointerleave", function () { hovering = false; });

  cards.forEach(function (c) {
    c.addEventListener("focus", function () {
      var keyboard = true;
      try { keyboard = c.matches(":focus-visible"); } catch (err) { /* older browsers */ }
      if (!keyboard) return;
      focused = true;
      // Keyboard focus brings the card round to the front, the short way
      var n = cards.indexOf(c);
      goal += ((((-n * step) - goal) % 360) + 540) % 360 - 180;
      kick();
    });
    c.addEventListener("blur", function () { focused = false; });

    // Opens on a pick, not at the end of a drag (keyboard clicks have detail 0)
    c.addEventListener("click", function (e) {
      if (moved > 8 && e.detail !== 0) { e.preventDefault(); return; }
      if (window.openLightbox) window.openLightbox(parseInt(c.dataset.i, 10));
    });
  });

  /* ---------------- drag ---------------- */
  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    dragging = true; moved = 0; dragX = e.clientX;
    kick();
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - dragX;
    dragX = e.clientX;
    moved += Math.abs(dx);
    if (moved > 8) stage.classList.add("is-dragging");
    goal += dx * 0.35;
    kick();
  });
  function release() {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  /* ---------------- quiet swaps ---------------- */
  // Now and then a card round the back, where nobody is looking, changes its
  // photograph, so the ring keeps showing more of the collection.
  var lastSwap = 0;
  function swapBehind(t) {
    if (reduced || !spare.length) return;
    if (!lastSwap) { lastSwap = t; return; }
    if (t - lastSwap < SWAP_EVERY) return;
    for (var n = 0; n < COUNT; n++) {
      if (angleOf(n) > 150 && cards[n] !== document.activeElement) {
        lastSwap = t;
        swap(n);
        return;
      }
    }
  }
  function swap(n) {
    var card = cards[n];
    var next = spare.shift();
    var pre = new Image();
    pre.onload = function () {
      // It may have come round while the file loaded; never change in view
      if (angleOf(n) < 120) { spare.push(next); return; }
      spare.push(card._p);
      fill(card, next);
      place(n);                              // a squarer frame moves its shadow down
    };
    pre.onerror = function () { spare.push(next); };
    pre.src = next.it.src;
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { measure(); paint(); }, 120);
  }, { passive: true });

  measure();
  paint();
  kick();
})();
