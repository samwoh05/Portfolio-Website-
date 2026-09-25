/* ==========================================================================
   Theme — light by day, dark by night, and a switch for people who disagree
   with their own computer.

   With no choice made the site follows the system setting, which the
   stylesheet handles on its own. Picking a side stamps data-theme on <html>
   and remembers it; "System" clears it again. The one thing this site keeps
   in your browser's storage, and it never leaves your machine — see
   privacy.html.

   The stamp is applied by an inline snippet in the <head> of each page, so
   the theme is right in the first painted frame. This file only builds the
   switch and handles the clicking.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "sy-theme";
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");

  function remember(value) {
    try {
      if (value) localStorage.setItem(KEY, value);
      else localStorage.removeItem(KEY);
    } catch (e) { /* nothing to be done, the choice just won't outlive the tab */ }
  }

  function current() {
    return root.getAttribute("data-theme") || (system.matches ? "dark" : "light");
  }

  var SUN =
    '<svg class="theme-btn__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.7" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4.2"/>' +
      '<path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"/>' +
    "</svg>";
  var MOON =
    '<svg class="theme-btn__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/>' +
    "</svg>";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-btn";
  btn.innerHTML = SUN + MOON;

  function label() {
    var now = current();
    btn.setAttribute("aria-label", now === "dark" ? "Switch to the light theme" : "Switch to the dark theme");
    btn.setAttribute("title", now === "dark" ? "Light" : "Dark");
    btn.setAttribute("aria-pressed", String(now === "dark"));
  }

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    // Choosing the same side your system is on goes back to simply following it
    if ((next === "dark") === system.matches) {
      root.removeAttribute("data-theme");
      remember(null);
    } else {
      root.setAttribute("data-theme", next);
      remember(next);
    }
    label();
  });

  // If the system flips at dusk and no side has been chosen, the label follows
  var onSystem = function () { if (!root.getAttribute("data-theme")) label(); };
  if (system.addEventListener) system.addEventListener("change", onSystem);
  else if (system.addListener) system.addListener(onSystem);

  label();
  document.body.appendChild(btn);

  // Keep the address bar and the page agreeing on the colour
  function paintChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute("content", current() === "dark" ? "#14100c" : "#f3ece0");
  }
  btn.addEventListener("click", paintChrome);
  if (system.addEventListener) system.addEventListener("change", paintChrome);
  paintChrome();
})();
