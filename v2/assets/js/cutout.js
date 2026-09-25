/* ==========================================================================
   The name as a magazine cut-out — each letter its own scrap of paper, in a
   different face, on a different colour, torn along a different edge, sitting
   at its own angle. They fold down into place one after the next.

   The tiles are decoration: the accessible name is a plain text node beside
   them, so a screen reader hears one word rather than six loose letters.
   ========================================================================== */
(function () {
  "use strict";

  var host = document.querySelector("[data-cutout]");
  if (!host) return;

  var word = (host.textContent || "").trim();
  if (!word) return;

  /* Six stocks. Each pairs a background with a letter colour that holds on it
     — cream on the saturated ones, ink on the pale ones. */
  var TONES = ["rust", "cobalt", "cream", "forest", "ink", "amber"];
  /* Three faces, cycled out of step with the colours so no pairing repeats */
  var FACES = ["display", "hand", "body"];
  /* Three torn edges */
  var TEARS = 3;

  var tiles = word.split("").map(function (ch, i) {
    var rot = [-5, 3.5, -2.5, 4.5, -3.5, 2].slice(i % 6, (i % 6) + 1)[0];
    if (rot === undefined) rot = (i % 2 ? 1 : -1) * (2 + (i % 3));
    var lift = [0, -6, 3, -3, 5, -4][i % 6];
    /* Each scrap starts crumpled at its own angle, so no two open the same way */
    var yaw = [46, -38, 52, -44, 34, -50][i % 6];
    return '<span class="cut cut--' + TONES[i % TONES.length] +
             " cut--" + FACES[i % FACES.length] +
             " cut--tear" + (i % TEARS) + '"' +
           ' style="--i:' + i + ";--rot:" + rot + "deg;--lift:" + lift +
             "px;--yaw:" + yaw + "deg;--cx:" + (12 + i * 17) + "%;--cy:" +
             (18 + ((i * 29) % 60)) + '%">' +
             '<span class="cut__ch">' + ch.replace(/[&<>]/g, "") + "</span>" +
             '<span class="cut__crease" aria-hidden="true"></span>' +
           "</span>";
  }).join("");

  host.innerHTML =
    '<span class="cuts" aria-hidden="true">' + tiles + "</span>" +
    '<span class="cuts__label">' + word.replace(/[&<>]/g, "") + "</span>";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    host.classList.add("is-laid");
    return;
  }

  /* The tiles have to fold after the preloader lifts, or they are already
     flat by the time the curtain is out of the way. */
  function whenLoaded(fn) {
    if (document.body.classList.contains("is-loaded")) { fn(); return; }
    var mo = new MutationObserver(function () {
      if (!document.body.classList.contains("is-loaded")) return;
      mo.disconnect(); fn();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTimeout(function () { mo.disconnect(); fn(); }, 4000);
  }

  whenLoaded(function () {
    setTimeout(function () { host.classList.add("is-laid"); }, 260);
  });
})();
