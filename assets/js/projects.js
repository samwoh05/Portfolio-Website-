/* ==========================================================================
   Projects — renders from data/projects.js, with a cover image
   that follows the cursor as you move down the list
   ========================================================================== */
(function () {
  "use strict";

  var lists = document.querySelectorAll("[data-projects]");
  if (!lists.length) return;

  var DATA = (window.PROJECTS_DATA && window.PROJECTS_DATA.items) || [];
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- Render ---------------- */

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19 19 5M9 5h10v10"/></svg>';

  function rowsFor(limit) {
    return DATA.slice(0, limit).map(function (p, i) {
    /* A project with written-up detail opens its own page; one without goes
       straight to wherever it lives. */
    var href = p.detail
      ? (window.HASH_ROUTING ? "#project/" : "project.html?p=") + encodeURIComponent(p.slug)
      : (p.href || "#");
    var external = /^https?:/i.test(href);
    var tags = (p.tags || []).map(function (t) {
      return "<span>" + esc(t) + "</span>";
    }).join("");

    return '<a class="proj reveal" data-d="' + Math.min(i, 5) + '"' +
      ' href="' + esc(href) + '"' +
      (external ? ' target="_blank" rel="noopener noreferrer"' : "") +
      ' data-cover="' + esc(p.cover || "") + '">' +
      '<span class="proj__num">' + String(i + 1).padStart(2, "0") + '</span>' +
      '<span>' +
        '<span class="proj__year">' + esc(p.year || "") + '</span>' +
        '<h2 class="proj__title">' + esc(p.title) + '</h2>' +
        '<p class="proj__desc">' + esc(p.blurb || "") + '</p>' +
        '<span class="tags">' + tags + '</span>' +
      '</span>' +
      '<span class="proj__go">' + ARROW + '</span>' +
      '</a>';
    }).join("");
  }

  lists.forEach(function (list) {
    list.innerHTML = rowsFor(parseInt(list.dataset.limit, 10) || DATA.length);
  });

  var countEl = document.getElementById("proj-count");
  if (countEl) {
    countEl.textContent = String(DATA.length).padStart(2, "0") +
      (DATA.length === 1 ? " project" : " projects");
  }

  if (window.siteRefresh) window.siteRefresh();

  /* ---------------- Cursor-following preview ---------------- */

  if (!fine || reduced) return;

  var peek = document.createElement("div");
  peek.className = "proj-peek";
  peek.innerHTML = '<img alt="">';
  document.body.appendChild(peek);
  var peekImg = peek.querySelector("img");

  var mx = 0, my = 0, px = 0, py = 0, on = false, raf = null;

  function loop() {
    px += (mx - px) * 0.14;
    py += (my - py) * 0.14;
    peek.style.transform =
      "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px) " +
      "translate(-50%,-50%) scale(" + (on ? 1 : 0.86) + ")";
    if (on || Math.abs(mx - px) > 0.5 || Math.abs(my - py) > 0.5) {
      raf = requestAnimationFrame(loop);
    } else { raf = null; }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (on) kick();
  }, { passive: true });

  lists.forEach(function (list) {
  list.addEventListener("mouseover", function (e) {
    var row = e.target.closest(".proj");
    if (!row) return;
    var cover = row.dataset.cover;
    if (!cover) return;
    if (peekImg.getAttribute("src") !== cover) peekImg.src = cover;
    on = true;
    peek.classList.add("on");
    // Jump straight to the cursor so it doesn't fly in from the last row
    px = mx; py = my;
    kick();
  });

  list.addEventListener("mouseleave", function () {
    on = false;
    peek.classList.remove("on");
    kick();
  });
  });
})();
