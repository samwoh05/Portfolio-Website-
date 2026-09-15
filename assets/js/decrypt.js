/* ==========================================================================
   Decrypted text — letters scramble through random characters and settle
   into the real words. A plain-JavaScript port of React Bits' DecryptedText
   (this site has no React). Options come from data attributes:

     data-decrypt="hover | view | inViewHover | click"   when it runs (hover)
     data-decrypt-speed="50"          ms between steps
     data-decrypt-iterations="10"     scrambles before settling, when not sequential
     data-decrypt-sequential          settle one character at a time
     data-decrypt-direction="start"   start | end | center, for sequential
     data-decrypt-chars="ABC…"        characters to scramble through
     data-decrypt-original-only       scramble with the text's own letters only
     data-decrypt-click="once"        once | toggle, for click
     data-decrypt-delay="0"           ms to hold, still scrambling, once in view

   The view modes start scrambled and keep scrambling until they settle, so
   the text is never seen whole first. Anything on screen when the page opens
   waits for the preloader; the delay covers the curtain still lifting.
   ========================================================================== */
(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-decrypt]");
  if (!targets.length) return;

  // Under reduced motion the text simply stays as written
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

  function setup(el) {
    var d = el.dataset;
    var text = el.textContent.replace(/\s+/g, " ").trim();
    var mode = d.decrypt || "hover";
    var speed = parseInt(d.decryptSpeed, 10) || 50;
    var maxIterations = parseInt(d.decryptIterations, 10) || 10;
    var sequential = "decryptSequential" in d;
    var revealDirection = d.decryptDirection || "start";
    var clickMode = d.decryptClick || "once";
    var delay = parseInt(d.decryptDelay, 10) || 0;
    var onView = mode === "view" || mode === "inViewHover";
    var pool = "decryptOriginalOnly" in d
      ? text.split("").filter(function (c, i, all) { return c !== " " && all.indexOf(c) === i; })
      : (d.decryptChars || DEFAULT_CHARS).split("");

    /* Screen readers get the words once; the scrambling letters are hidden
       from them. (The original also set visibility:hidden on its reader text,
       which hides it from screen readers too.) */
    el.textContent = "";
    var reader = document.createElement("span");
    reader.className = "decrypt__sr";
    reader.textContent = text;
    var shown = document.createElement("span");
    shown.setAttribute("aria-hidden", "true");
    var cells = text.split("").map(function (ch) {
      var c = document.createElement("span");
      c.className = "decrypt__char";
      c.textContent = ch;
      shown.appendChild(c);
      return c;
    });
    el.appendChild(reader);
    el.appendChild(shown);

    var revealed = new Set();
    var timer = null, idle = null, animating = false, hasAnimated = false;
    var decrypted = mode !== "click";
    var direction = "forward", order = [], pointer = 0, iteration = 0;

    /* Each cell keeps the width of its real letter, so a wide scrambled glyph
       never shoves the rest of the word along. Measured while the real letters
       are showing. */
    function lockWidths() {
      var was = cells.map(function (c) { return c.textContent; });
      cells.forEach(function (c, i) { c.textContent = text[i]; c.style.width = ""; });
      cells.forEach(function (c, i) {
        if (text[i] !== " ") c.style.width = c.getBoundingClientRect().width + "px";
      });
      cells.forEach(function (c, i) { c.textContent = was[i]; });
    }

    function render(scrambling) {
      cells.forEach(function (c, i) {
        var ch = text[i];
        var settled = ch === " " || revealed.has(i) || !scrambling;
        c.textContent = settled ? ch : pool[Math.floor(Math.random() * pool.length)];
        c.classList.toggle("is-encrypted", !settled);
      });
    }

    function everyIndex() {
      var s = new Set();
      for (var i = 0; i < text.length; i++) s.add(i);
      return s;
    }

    function computeOrder(len) {
      var out = [], i;
      if (revealDirection === "start") { for (i = 0; i < len; i++) out.push(i); return out; }
      if (revealDirection === "end") { for (i = len - 1; i >= 0; i--) out.push(i); return out; }
      var middle = Math.floor(len / 2), offset = 0, idx;
      while (out.length < len) {
        idx = offset % 2 === 0 ? middle + offset / 2 : middle - Math.ceil(offset / 2);
        if (idx >= 0 && idx < len) out.push(idx);
        offset++;
      }
      return out;
    }

    function nextIndex() {
      var len = text.length, i;
      if (revealDirection === "start") return revealed.size;
      if (revealDirection === "end") return len - 1 - revealed.size;
      var middle = Math.floor(len / 2), offset = Math.floor(revealed.size / 2);
      var next = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1;
      if (next >= 0 && next < len && !revealed.has(next)) return next;
      for (i = 0; i < len; i++) if (!revealed.has(i)) return i;
      return 0;
    }

    function stop() {
      clearInterval(timer);
      clearInterval(idle);
      timer = idle = null;
      animating = false;
    }

    function tick() {
      if (sequential && direction === "forward") {
        if (revealed.size < text.length) { revealed.add(nextIndex()); render(true); }
        else { stop(); decrypted = true; render(false); }
        return;
      }
      if (sequential) {                       // reverse, one character at a time
        if (pointer < order.length) revealed.delete(order[pointer++]);
        render(true);
        if (!revealed.size || pointer >= order.length) { stop(); decrypted = false; }
        return;
      }
      if (direction === "forward") {          // scramble everything, then settle at once
        render(true);
        if (++iteration >= maxIterations) { stop(); decrypted = true; render(false); }
        return;
      }
      // Reverse: knock out a handful of settled letters each step
      if (!revealed.size) revealed = everyIndex();
      var arr = Array.from(revealed);
      var count = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
      for (var k = 0; k < count && arr.length; k++) arr.splice(Math.floor(Math.random() * arr.length), 1);
      revealed = new Set(arr);
      render(true);
      if (!revealed.size || ++iteration >= maxIterations) {
        stop(); decrypted = false; revealed = new Set(); render(true);
      }
    }

    function run(dir) {
      stop();
      direction = dir;
      iteration = 0;
      if (dir === "forward") {
        revealed = new Set();
      } else {
        revealed = everyIndex();
        order = computeOrder(text.length).reverse();
        pointer = 0;
      }
      animating = true;
      timer = setInterval(tick, speed);
    }

    /* ---------------- triggers ---------------- */
    if (mode === "hover" || mode === "inViewHover") {
      el.addEventListener("mouseenter", function () {
        if (animating || idle) return;        // let the first run finish on its own
        decrypted = false;
        run("forward");
      });
      el.addEventListener("mouseleave", function () {
        if (idle) return;
        stop();
        revealed = new Set();
        decrypted = true;
        render(false);
      });
    }

    if (mode === "click") {
      el.addEventListener("click", function () {
        if (clickMode === "once") { if (!decrypted) run("forward"); return; }
        run(decrypted ? "reverse" : "forward");
      });
      render(true);                           // starts scrambled, waiting for the click
    }

    lockWidths();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockWidths);

    if (onView) {
      // Scrambled from the first paint, and still scrambling while it waits
      decrypted = false;
      render(true);
      idle = setInterval(function () { render(true); }, speed);

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || hasAnimated) return;
          hasAnimated = true;
          io.disconnect();
          setTimeout(function () { run("forward"); }, delay);
        });
      }, { threshold: 0.1 });
      afterPreloader(function () { io.observe(el); });
    }
  }

  function afterPreloader(fn) {
    var called = false;
    function once() { if (!called) { called = true; fn(); } }
    if (document.body.classList.contains("is-loaded")) { once(); return; }
    var wait = new MutationObserver(function () {
      if (!document.body.classList.contains("is-loaded")) return;
      wait.disconnect();
      once();
    });
    wait.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // Never wait forever if the preloader class doesn't arrive
    setTimeout(function () { wait.disconnect(); once(); }, 4000);
  }

  targets.forEach(setup);
})();
