/* ==========================================================================
   Learning — the section that carries the career change.

   It renders from its own data file, the same way the projects list and the
   gallery wall do, so adding a course is one edit in data/learning.js and
   nothing else.

   Two rules are built in rather than left to remember:

   1. A section with nothing in it removes itself. An empty heading over
      blank ground says less than no heading at all.
   2. An item marked `draft: true` renders with a dashed edge and a chip that
      says so. A placeholder course can therefore never be mistaken for a
      credential Samuel actually holds — not by a visitor, and not by
      whoever ships the site next.
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var CHIP = '<span class="draft-chip">To fill in</span>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19 19 5M9 5h10v10"/></svg>';

  /* A section whose list is empty takes its own heading down with it, so the
     page never shows a promise it can't keep. */
  function drop(host) {
    var section = host.closest(".section");
    if (section) section.parentNode.removeChild(section);
    else host.parentNode.removeChild(host);
  }

  /* ---------------- Learning ---------------- */
  var shelf = document.querySelector("[data-learning]");
  if (shelf) {
    var courses = (window.LEARNING_DATA && window.LEARNING_DATA.items) || [];
    if (!courses.length) drop(shelf);
    else {
      /* One course shouldn't stretch a card the width of the page. */
      shelf.className += " rail" + (courses.length === 1 ? " rail--one" : "");
      shelf.innerHTML = courses.map(function (c, i) {
        /* A draft has nothing to link to yet, and "No certificate" under a
           placeholder reads as a fact about a course that doesn't exist. */
        var cert = "";
        if (c.href) cert = '<a class="course__cert" href="' + esc(c.href) + '" target="_blank" rel="noopener noreferrer">Certificate' + ARROW + "</a>";
        else if (!c.draft) cert = '<span class="course__cert course__cert--none">No certificate</span>';

        /* The certificate itself, when there is one to show. It is the same
           link as the foot, so the obvious thing to click is clickable. */
        var shot = "";
        if (c.cover) {
          var img = '<img src="' + esc(c.cover) + '" alt="' + esc(c.alt || "") + '" loading="lazy" decoding="async">';
          shot = c.href
            ? '<a class="course__shot" href="' + esc(c.href) + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">' + img + "</a>"
            : '<span class="course__shot">' + img + "</span>";
        }

        /* The number a reader could check it against, where a date sits */
        var foot = [c.done, c.code ? "No. " + c.code : ""].filter(Boolean).map(esc).join(" &middot; ");

        return '<article class="course reveal' + (c.draft ? " is-draft" : "") + '"' +
          ' data-d="' + Math.min(i, 5) + '">' + shot +
          '<p class="course__issuer">' + esc(c.issuer) + (c.draft ? CHIP : "") + "</p>" +
          '<h3 class="course__title">' + esc(c.title) + "</h3>" +
          (c.took ? '<p class="course__took">' + esc(c.took) + "</p>" : "") +
          '<p class="course__foot">' +
            "<span>" + foot + "</span>" + cert +
          "</p>" +
        "</article>";
      }).join("");
    }
  }

})();
