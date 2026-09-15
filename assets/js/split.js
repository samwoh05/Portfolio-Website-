/* ==========================================================================
   Per-character reveal. Splits [data-split] into one span per letter and
   lets each rise out of its own mask, a beat behind the last.

   Two things this has to get right beyond the motion:
     - a screen reader must still hear one sentence, not forty letters, so the
       original text goes on the container as a label and the pieces are hidden;
     - selecting and copying must still yield the sentence with its spaces, so
       words stay whole and the spaces between them stay real text nodes.
   ========================================================================== */
(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-split]");
  if (!targets.length) return;

  /* No split at all under reduced motion — the text is simply there. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach(function (el) { el.classList.add("is-split-done"); });
    return;
  }

  targets.forEach(function (el) {
    var source = el.querySelector("span") || el;

    /* The accessible sentence. textContent alone is wrong here: a <br> yields
       no character, so "pass<br>too" would be announced as "passtoo". */
    var label = [].slice.call(source.childNodes).map(function (n) {
      return n.nodeName === "BR" ? " " : n.textContent;
    }).join("").replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", label);

    var frag = document.createDocumentFragment();
    var i = 0;

    [].slice.call(source.childNodes).forEach(function (node) {
      if (node.nodeName === "BR") { frag.appendChild(document.createElement("br")); return; }
      if (node.nodeType !== 3) return;

      var words = node.textContent.split(/(\s+)/);
      words.forEach(function (word) {
        if (!word) return;
        if (/^\s+$/.test(word)) {
          // A real space, so copied text reads normally
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        // The word is the mask; the letters inside it do the moving
        var w = document.createElement("span");
        w.className = "split__word";
        word.split("").forEach(function (ch) {
          var c = document.createElement("span");
          c.className = "split__char";
          c.style.setProperty("--i", i++);
          c.textContent = ch;
          w.appendChild(c);
        });
        frag.appendChild(w);
      });
    });

    source.setAttribute("aria-hidden", "true");
    source.innerHTML = "";
    source.appendChild(frag);
    el.classList.add("is-split");
  });

  /* Runs once, when the line has actually been scrolled to */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-split-done");
      io.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

  /* A line that is already on screen at load would otherwise animate behind
     the preloader and be over before the curtain lifts. Those wait for the
     preloader and then play; anything further down keeps the observer. */
  function start() {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var onScreen = r.top < window.innerHeight * 0.9 && r.bottom > 0;
      if (onScreen) {
        setTimeout(function () { el.classList.add("is-split-done"); }, 260);
      } else {
        io.observe(el);
      }
    });
  }

  if (document.body.classList.contains("is-loaded")) {
    start();
  } else {
    // The preloader adds is-loaded when it lifts
    var wait = new MutationObserver(function () {
      if (!document.body.classList.contains("is-loaded")) return;
      wait.disconnect();
      start();
    });
    wait.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // Belt and braces: never leave the text invisible if that class never comes
    setTimeout(function () {
      if (document.body.classList.contains("is-loaded")) return;
      wait.disconnect();
      document.body.classList.add("is-loaded");
      start();
    }, 4000);
  }
})();
