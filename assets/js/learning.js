/* ==========================================================================
   Learning & Notes — the two sections that carry the career change.

   Both render from their own data file, the same way the projects list and
   the gallery wall do, so adding a course or a teardown is one edit in
   data/learning.js or data/notes.js and nothing else.

   Two rules are built in rather than left to remember:

   1. A section with nothing in it removes itself. An empty "Notes" heading
      over blank ground says less than no heading at all.
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
      shelf.className += " rail";
      shelf.innerHTML = courses.map(function (c, i) {
        /* A draft has nothing to link to yet, and "No certificate" under a
           placeholder reads as a fact about a course that doesn't exist. */
        var cert = "";
        if (c.href) cert = '<a class="course__cert" href="' + esc(c.href) + '" target="_blank" rel="noopener noreferrer">Certificate' + ARROW + "</a>";
        else if (!c.draft) cert = '<span class="course__cert course__cert--none">No certificate</span>';

        return '<article class="course reveal' + (c.draft ? " is-draft" : "") + '"' +
          ' data-d="' + Math.min(i, 5) + '">' +
          '<p class="course__issuer">' + esc(c.issuer) + (c.draft ? CHIP : "") + "</p>" +
          '<h3 class="course__title">' + esc(c.title) + "</h3>" +
          '<p class="course__took">' + esc(c.took) + "</p>" +
          '<p class="course__foot">' +
            "<span>" + esc(c.done || "") + "</span>" + cert +
          "</p>" +
        "</article>";
      }).join("");
    }
  }

  /* ---------------- Notes ---------------- */
  var desk = document.querySelector("[data-notes]");
  if (desk) {
    var notes = (window.NOTES_DATA && window.NOTES_DATA.items) || [];
    if (!notes.length) drop(desk);
    else {
      desk.className += " notes";
      desk.innerHTML = notes.map(function (n, i) {
        var meta = [n.read, n.done].filter(Boolean).map(esc).join(" &middot; ");
        var body =
          '<p class="note__kick">' + esc(n.kicker || "Note") +
            (n.draft ? CHIP : "") + "</p>" +
          '<h3 class="note__title">' + esc(n.title) + "</h3>" +
          '<p class="note__body">' + esc(n.body || "") + "</p>" +
          (meta ? '<p class="note__meta">' + meta + "</p>" : "");

        /* A finished note with somewhere to go is a link; a draft is just a
           card, because there is nothing on the other end of it yet. */
        if (n.href && !n.draft) {
          return '<a class="note note--open reveal" data-d="' + Math.min(i, 5) + '"' +
            ' href="' + esc(n.href) + '">' + body + "</a>";
        }
        return '<article class="note reveal' + (n.draft ? " is-draft" : "") + '"' +
          ' data-d="' + Math.min(i, 5) + '">' + body + "</article>";
      }).join("");
    }
  }
})();
