/* ==========================================================================
   Project folder — the React Bits <Folder /> component, ported to plain JS.
   It rests open, holding the projects out where they can be read.

   Two departures from the original, both forced:
     - it is React, and this site has no React and no build step, so the state
       lives in classes on the element instead of useState;
     - it takes three papers, and there are five projects, so the fanned
       positions are computed across however many there are rather than being
       the three hard-coded transforms.

   Click the folder to open it. Click a paper and it lifts clear with a brief;
   the full write-up lives on that project's own page.
   ========================================================================== */
(function () {
  "use strict";

  var mount = document.querySelector("[data-folder]");
  if (!mount) return;

  var DATA = (window.PROJECTS_DATA && window.PROJECTS_DATA.items) || [];
  if (!DATA.length) { mount.remove(); return; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 19 5M9 5h10v10"/></svg>';

  function href(p) {
    return p.detail
      ? "project.html?p=" + encodeURIComponent(p.slug)
      : (p.href || "#");
  }

  /* Deliberately NOT shuffled. A recruiter opens this page once; a random
     order means the strongest work can land behind the weakest. data/projects.js
     holds the intended order and this respects it.

     Reversed only for stacking: the last strip drawn sits highest in the
     pocket, so reversing here puts the first project in the data at the top of
     the pile, where it is read first. */
  var papers = DATA.slice(0, 5).reverse();
  var n = papers.length;

  var html = papers.map(function (p, k) {
    return '<button class="paper" type="button" data-k="' + k + '" style="--k:' + k + '"' +
        ' aria-expanded="false" aria-controls="rb-card">' +
        '<span class="paper__name">' + esc(p.title) + "</span>" +
        '<span class="paper__year">' + esc(p.year || "") + "</span>" +
      "</button>";
  }).join("");

  mount.innerHTML =
    '<div class="rb-folder" style="--count:' + n + '">' +
      /* The opened card sits above the folder, outside the pocket that clips
         the stack — so the stack can be concealed without also clipping this. */
      '<div class="rb-card" id="rb-card" role="region" aria-live="polite"></div>' +
      '<div class="rb-folder__back">' +
        '<div class="rb-folder__pocket">' + html + "</div>" +
        '<div class="rb-folder__front" aria-hidden="true"></div>' +
        '<div class="rb-folder__front right" aria-hidden="true"></div>' +
      "</div>" +
      '<button class="rb-folder__toggle" type="button" aria-expanded="true">' +
        '<span class="rb-folder__hint">Close the folder</span>' +
      "</button>" +
    "</div>";

  var folder = mount.querySelector(".rb-folder");
  var toggle = folder.querySelector(".rb-folder__toggle");
  var sheets = [].slice.call(folder.querySelectorAll(".paper"));
  var card   = folder.querySelector(".rb-card");

  function pick(k) {
    sheets.forEach(function (s, idx) {
      s.classList.toggle("is-picked", idx === k);
      s.setAttribute("aria-expanded", String(idx === k));
    });
    folder.classList.toggle("has-out", k > -1);

    if (k < 0) { card.innerHTML = ""; return; }
    var p = papers[k];
    var ext = /^https?:/i.test(href(p));
    card.innerHTML =
      '<p class="rb-card__year">' + esc(p.year || "") +
        (p.org ? " &middot; " + esc(p.org) : "") + "</p>" +
      '<h4 class="rb-card__title">' + esc(p.title) + "</h4>" +
      (p.expansion ? '<p class="rb-card__expansion">' + esc(p.expansion) + "</p>" : "") +
      '<p class="rb-card__blurb">' + esc(p.blurb || "") + "</p>" +
      '<a class="rb-card__go" href="' + esc(href(p)) + '"' +
        (ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
        "View full project" + ARROW +
      "</a>";
  }

  function open(on) {
    folder.classList.toggle("is-open", on);
    toggle.setAttribute("aria-expanded", String(on));
    toggle.querySelector(".rb-folder__hint").textContent =
      on ? "Close the folder" : "Open the folder";
    sheets.forEach(function (b) { b.tabIndex = on ? 0 : -1; });
    if (!on) pick(-1);
  }

  toggle.addEventListener("click", function () {
    open(!folder.classList.contains("is-open"));
  });

  folder.addEventListener("click", function (e) {
    var strip = e.target.closest(".paper");
    if (!strip) return;
    var k = sheets.indexOf(strip);
    pick(strip.classList.contains("is-picked") ? -1 : k);
  });

  /* Anywhere off the card puts that card back in the folder. The folder itself
     stays open: shutting it would hide the only thing this section is for. */
  document.addEventListener("click", function (e) {
    if (!folder.classList.contains("is-open")) return;
    if (e.target.closest(".rb-card")) return;           // inside the open card
    if (e.target.closest(".paper")) return;             // picking another strip
    if (e.target.closest(".rb-folder__toggle")) return; // the toggle handles itself
    if (folder.classList.contains("has-out")) pick(-1);
  });

  folder.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { pick(-1); return; }
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    var strip = e.target.closest(".paper");
    if (!strip) return;
    e.preventDefault();
    var k = sheets.indexOf(strip);
    // The pile is drawn bottom-up, so down the screen is back through the array
    var next = (k + (e.key === "ArrowDown" ? -1 : 1) + n) % n;
    sheets[next].focus();
  });

  /* Open from the start. It used to rest shut, which meant the projects
     teaser showed a visitor no project names at all until they clicked — the
     work was behind a door. The toggle still shuts it for anyone who wants
     the folder closed. */
  open(true);
  if (window.siteRefresh) window.siteRefresh();
})();
