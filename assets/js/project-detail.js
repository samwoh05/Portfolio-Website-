/* ==========================================================================
   Project detail — renders one project from data/projects.js, chosen by the
   ?p=<slug> in the address. One page serves every project, so adding a
   project to the data file is all it takes to get a page for it.
   ========================================================================== */
(function () {
  "use strict";

  var slot = document.querySelector("[data-project-detail]");
  if (!slot) return;

  var DATA = (window.PROJECTS_DATA && window.PROJECTS_DATA.items) || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19 19 5M9 5h10v10"/></svg>';
  var BACK  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  /* The real site addresses a project with ?p=<slug>. Inside a single-file
     artifact there is only a hash, so accept #project/<slug> too. */
  function param() {
    var m = /[?&]p=([^&]+)/.exec(location.search);
    if (m) return decodeURIComponent(m[1]);
    m = /#project\/([^&/]+)/.exec(location.hash);
    return m ? decodeURIComponent(m[1]) : "";
  }

  window.renderProjectDetail = function (forced) {
  var slug = forced || param();
  var idx  = -1;
  for (var i = 0; i < DATA.length; i++) {
    if (DATA[i].slug === slug) { idx = i; break; }
  }
  var p = idx > -1 ? DATA[idx] : null;

  if (!p) {
    slot.innerHTML =
      '<header class="detail__head">' +
        '<a class="detail__back" href="' + (window.HASH_ROUTING ? "#projects" : "projects.html") + '">' + BACK + 'All projects</a>' +
        '<h1 class="display h-lg" style="margin:18px 0 0">Not found</h1>' +
        '<p class="lede" style="margin:18px 0 0">' +
          "That project isn't in the list. " +
          '<a class="cta-link" href="' + (window.HASH_ROUTING ? "#projects" : "projects.html") + '" style="display:inline-flex">See all projects' + ARROW + "</a>" +
        "</p>" +
      "</header>";
    document.title = "Project — Samuel Yee";
    if (window.siteRefresh) window.siteRefresh();
    return;
  }

  document.title = p.title + " — Samuel Yee";
  var desc = document.querySelector('meta[name="description"]');
  if (desc && p.blurb) desc.setAttribute("content", p.blurb);

  /* --- the standing line under the title: role, org and year --- */
  var facts = [];
  if (p.role) facts.push({ k: "Role", v: p.role });
  if (p.org)  facts.push({ k: "Where", v: p.org });
  if (p.year) facts.push({ k: "Year", v: p.year });

  var factsHtml = facts.length
    ? '<dl class="detail__facts">' + facts.map(function (f) {
        return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>";
      }).join("") + "</dl>"
    : "";

  /* The labelled beats come first: a reader skimming for whether this person
     can do the job gets the answer in eight seconds, and the prose is there
     for the one who wants the whole story. */
  var beatsHtml = (p.beats || []).length
    ? '<dl class="detail__beats">' + p.beats.map(function (b) {
        return "<div><dt>" + esc(b[0]) + "</dt><dd>" + esc(b[1]) + "</dd></div>";
      }).join("") + "</dl>"
    : "";

  var bodyHtml = (p.detail || [p.blurb || ""]).filter(Boolean).map(function (para) {
    return "<p>" + esc(para) + "</p>";
  }).join("");

  var tagsHtml = (p.tags || []).length
    ? '<span class="tags detail__tags">' + p.tags.map(function (t) {
        return "<span>" + esc(t) + "</span>";
      }).join("") + "</span>"
    : "";

  /* Photographs run at their own shape, the same way the gallery wall does */
  var shots = p.shots || [];
  var shotsHtml = shots.length ? '<div class="detail__shots"></div>' : "";

  /* The reel plays in place on the real site. Inside a single-file artifact the
     host blocks Instagram frames outright, so there it becomes a link card
     rather than an empty black box. */
  var reelHtml = "";
  if (p.reel) {
    var reelId = (p.reel.match(/\/reel\/([^/?#]+)/) || [])[1];
    if (reelId && !window.HASH_ROUTING) {
      reelHtml =
        '<figure class="detail__reel">' +
          '<div class="detail__reel-frame">' +
            '<iframe src="https://www.instagram.com/reel/' + encodeURIComponent(reelId) + '/embed/"' +
              ' title="Instagram reel of ' + esc(p.title) + '"' +
              ' loading="lazy" allowfullscreen scrolling="no"></iframe>' +
          "</div>" +
          '<figcaption>The station in use. <a href="' + esc(p.reel) + '" target="_blank"' +
            ' rel="noopener noreferrer">Open on Instagram</a></figcaption>' +
        "</figure>";
    } else if (reelId) {
      reelHtml =
        '<a class="detail__reel-card" href="' + esc(p.reel) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="detail__reel-play" aria-hidden="true">&#9654;</span>' +
          '<span><b>Watch the reel</b><i>The station in use, on Instagram</i></span>' +
        "</a>";
    }
  }

  var linksHtml = (p.links || []).length
    ? '<div class="detail__links">' + p.links.map(function (l) {
        var ext = /^https?:/i.test(l.href || "");
        return '<a class="cta-link" href="' + esc(l.href) + '"' +
               (ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
               esc(l.label) + ARROW + "</a>";
      }).join("") + "</div>"
    : "";

  /* Next project, so the page ends on a way forward rather than a dead stop */
  var next = DATA[(idx + 1) % DATA.length];
  var nextHref = next.detail
    ? (window.HASH_ROUTING ? "#project/" : "project.html?p=") + encodeURIComponent(next.slug)
    : (next.href || (window.HASH_ROUTING ? "#projects" : "projects.html"));
  var nextExt = /^https?:/i.test(nextHref);

  slot.innerHTML =
    '<header class="detail__head">' +
      '<a class="detail__back" href="' + (window.HASH_ROUTING ? "#projects" : "projects.html") + '">' + BACK + "All projects</a>" +
      '<p class="label rise in" style="margin:26px 0 clamp(14px,2.4vh,22px)"><span>' +
        esc(p.org || "Project") + "</span></p>" +
      '<h1 class="display h-lg rise in" data-d="1" style="margin:0;max-width:16ch"><span>' +
        esc(p.title) + "</span></h1>" +
      (p.expansion ? '<p class="detail__expansion">' + esc(p.expansion) + "</p>" : "") +
      factsHtml +
    "</header>" +

    '<div class="detail__body reveal">' + beatsHtml + reelHtml + bodyHtml + tagsHtml + linksHtml + "</div>" +

    shotsHtml +

    '<nav class="detail__next reveal" aria-label="Next project">' +
      '<span class="label label--muted">Next</span>' +
      '<a class="detail__nextlink" href="' + esc(nextHref) + '"' +
        (nextExt ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
        esc(next.title) + ARROW +
      "</a>" +
    "</nav>";

  /* Each frame takes the shape of the file that lands in it, so a portrait and a
     landscape shot both sit right without anything being written down. Shots are
     added in order as they resolve; a file that is not there yet is skipped, and
     the strip disappears entirely if none of them are. */
  var strip = slot.querySelector(".detail__shots");
  if (strip) {
    var slots = shots.map(function () { return null; });
    var left = shots.length;

    var flush = function () {
      strip.innerHTML = "";
      slots.forEach(function (html) { if (html) strip.insertAdjacentHTML("beforeend", html); });
      if (!strip.children.length) strip.remove();
      if (window.siteRefresh) window.siteRefresh();
    };

    shots.forEach(function (s, n) {
      var probe = new Image();
      probe.onload = function () {
        slots[n] =
          '<figure class="detail__shot" style="--ar:' + probe.naturalWidth + "/" + probe.naturalHeight + '">' +
            '<img src="' + esc(s.src) + '" alt="' + esc(s.alt || "") + '">' +
            (s.title ? "<figcaption><b>" + esc(s.title) + "</b>" +
              (s.caption ? "<span>" + esc(s.caption) + "</span>" : "") + "</figcaption>" : "") +
          "</figure>";
        if (!--left) flush();
      };
      probe.onerror = function () { if (!--left) flush(); };
      probe.src = s.src;
    });
  }

  if (window.siteRefresh) window.siteRefresh();
  };

  window.renderProjectDetail();
})();
