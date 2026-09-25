/* ==========================================================================
   Gallery — renders from data/gallery.js, filters, and a keyboard lightbox
   ========================================================================== */
(function () {
  "use strict";

  var grid    = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var counter = document.getElementById("count");
  /* The home page has no wall of its own — it has the photo ring — but it
     still needs the lightbox this file owns. */
  if (!grid && !document.getElementById("lightbox")) return;

  var DATA  = (window.GALLERY_DATA && window.GALLERY_DATA.items) || [];
  var view  = DATA.slice();   // what is currently rendered
  var mode  = "all";

  var CAM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h3l1.6-2.2h8.8L18 7h3v12H3z"/><circle cx="12" cy="13" r="3.6"/></svg>';
  var ICON_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- Render ---------------- */

  function tileHtml(item, i) {
    var isVideo = item.type === "video";
    var thumb = item.poster || item.src;
    var external = !!item.href;

    var credit = item.camera
      ? '<span class="tile__cam">' + CAM_ICON +
          "<span><b>" + esc(item.camera) + "</b>" +
          (item.lens ? "<i>" + esc(item.lens) + "</i>" : "") + "</span>" +
        "<s></s></span>"
      : "";

    var ar = item.w && item.h ? ' style="--ar:' + item.w + "/" + item.h + '"' : "";

    var inner =
      '<span class="tile__frame"' + ar + ">" +
        '<img src="' + esc(thumb) + '" alt="' + esc(item.alt || "") + '"' +
          ' loading="' + (i < 4 ? "eager" : "lazy") + '">' +
        (isVideo ? '<span class="tile__badge">' + ICON_PLAY + "Video</span>" : "") +
      "</span>" + credit;

    if (external) {
      return '<a class="tile reveal" data-tilt="4" data-i="' + i + '" href="' +
             esc(item.href) + '" target="_blank" rel="noopener noreferrer">' +
             inner + "</a>";
    }
    return '<button class="tile reveal" type="button" data-tilt="4" data-i="' + i +
           '" aria-label="Open photograph' + (item.camera ? ", " + esc(item.camera) : "") +
           '">' + inner + "</button>";
  }

  function emptyHtml(kind) {
    return '<div class="empty">' +
      '<h3>No ' + esc(kind) + ' yet</h3>' +
      '<p style="margin:0 0 14px">Add them to <code>data/gallery.js</code> and they show up here.</p>' +
      '<p style="margin:0"><a class="label" href="https://www.tiktok.com/@sam_yzx" ' +
      'target="_blank" rel="noopener noreferrer">Watch on TikTok →</a></p>' +
      '</div>';
  }

  /* Miller's Law: a wall of more than ~7 posters stops being a set you can
     hold in your head and becomes a pile. Give an item a "group" in
     data/gallery.js and the wall breaks into labelled chunks; with no groups
     set, or only one, it stays a single flat wall. */
  function chunked(items) {
    var order = [], byGroup = {};
    items.forEach(function (it, i) {
      var g = it.group || "";
      if (!(g in byGroup)) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(i);            // index into `items`, so data-i stays true
    });
    var wall = function (idx) {
      return '<div class="wall">' +
             idx.map(function (i) { return tileHtml(items[i], i); }).join("") +
             "</div>";
    };
    if (order.length < 2) return wall(items.map(function (_, i) { return i; }));
    return order.map(function (g) {
      return (g ? '<h2 class="grid__group">' + esc(g) + "</h2>" : "") + wall(byGroup[g]);
    }).join("");
  }

  function render() {
    view = DATA.filter(function (it) {
      if (mode === "all") return true;
      if (mode === "video") return it.type === "video";
      return it.type !== "video";
    });

    if (!view.length) {
      grid.style.gridTemplateColumns = "1fr";
      grid.innerHTML = emptyHtml(mode === "video" ? "videos" : "photos");
    } else {
      grid.style.gridTemplateColumns = "";
      grid.innerHTML = chunked(view);
    }

    if (counter) {
      counter.textContent = String(view.length).padStart(2, "0") +
        (view.length === 1 ? " item" : " items");
    }
    if (window.siteRefresh) window.siteRefresh();
  }

  /* ---------------- Filters ---------------- */

  if (filters) {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var swapTimer = null;

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      if (btn.dataset.filter === mode) return;        // already showing it

      mode = btn.dataset.filter;
      filters.querySelectorAll("button[data-filter]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      /* Replacing the wall's contents in place, so it dissolves rather than
         snapping. The height is pinned across the swap so the page doesn't
         jump under the pointer while the new set measures itself. */
      if (reducedMotion || !grid) { render(); return; }

      clearTimeout(swapTimer);
      grid.style.minHeight = grid.offsetHeight + "px";
      grid.classList.add("is-swapping");

      swapTimer = setTimeout(function () {
        render();
        // The new wall is in the DOM and still transparent, so the pin can come
        // off in the same tick — any height change happens while it is invisible.
        // (Deliberately not requestAnimationFrame: it never fires in a
        // backgrounded tab, which would strand the pin at the old height.)
        grid.style.minHeight = "";
        grid.classList.remove("is-swapping");
      }, 150);
    });
  }

  /* ---------------- Lightbox ---------------- */

  var lb      = document.getElementById("lightbox");
  var stage   = lb && lb.querySelector(".lightbox__stage");
  var lbTitle = lb && lb.querySelector(".lightbox__foot h3");
  var lbMeta  = lb && lb.querySelector(".lightbox__foot p");
  var lbNow   = lb && lb.querySelector(".lightbox__bar b");
  var lbTotal = lb && lb.querySelector(".lightbox__bar .total");
  var idx     = 0;

  function show(i) {
    if (!lb || !view.length) return;
    idx = (i + view.length) % view.length;
    var item = view[idx];

    lb.classList.remove("shown");

    var media;
    if (item.type === "video" && item.embed) {
      media = '<iframe src="' + esc(item.embed) + '" title="' + esc(item.camera || "Video") +
              '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (item.type === "video" && item.src) {
      media = '<video src="' + esc(item.src) + '" poster="' + esc(item.poster || "") +
              '" controls autoplay playsinline></video>';
    } else if (item.type === "video") {
      // No source to play (the artifact build ships posters only) — show the frame
      media = '<img src="' + esc(item.poster) + '" alt="' + esc(item.alt || "") + '">';
    } else {
      media = '<img src="' + esc(item.src) + '" alt="' + esc(item.alt || item.title) + '">';
    }

    stage.innerHTML = media;
    if (lbTitle) lbTitle.textContent = item.camera || "";
    if (lbMeta) {
      lbMeta.textContent = [item.lens, item.edit && "Edited in " + item.edit]
        .filter(Boolean).join("  ·  ");
    }
    if (lbNow)   lbNow.textContent   = String(idx + 1).padStart(2, "0");
    if (lbTotal) lbTotal.textContent = String(view.length).padStart(2, "0");

    requestAnimationFrame(function () { lb.classList.add("shown"); });
  }

  function open(i) {
    if (!lb) return;
    lb.classList.add("open");
    document.body.classList.add("is-locked");
    lb.setAttribute("aria-hidden", "false");
    show(i);
  }

  function close() {
    if (!lb) return;
    lb.classList.remove("open", "shown");
    document.body.classList.remove("is-locked");
    lb.setAttribute("aria-hidden", "true");
    // Stop any playing media
    setTimeout(function () { if (!lb.classList.contains("open")) stage.innerHTML = ""; }, 420);
  }

  /* The home page's photo ring opens the same lightbox, so it needs a way in. */
  window.openLightbox = function (i) {
    if (!view.length) view = DATA.slice();
    open(i);
  };

  if (grid) grid.addEventListener("click", function (e) {
    var tile = e.target.closest("button.tile");
    if (!tile) return;
    open(parseInt(tile.dataset.i, 10) || 0);
  });

  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target.closest(".lb-next")) return show(idx + 1);
      if (e.target.closest(".lb-prev")) return show(idx - 1);
      if (e.target.closest(".lb-close")) return close();
      // Click the backdrop (but not the media itself) to dismiss
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape")     close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft")  show(idx - 1);
    });
  }

  if (grid) render();
})();
