/* ==========================================================================
   Scroll route — a car winds its way down the page as you scroll.
   The route sits behind everything: it shows through the page's open ground
   and passes under the solid blocks, so it never obscures content.
   ========================================================================== */
(function () {
  "use strict";

  var CAR = "../assets/img/car.png";
  var CAR_W = 44;          // on-screen width in px
  var CAR_H = CAR_W * 2.15;  // refined once the image reports its aspect
  var NOSE  = -90;         // this art points nose-DOWN, so subtract 90 from the path angle
  var MARGIN = 0.20;       // keep the route this far inside the page edges
  var DEPTH  = 0.55;       // how much slower the road travels than the page

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  var main = document.querySelector("main");
  if (!main) return;

  /* ---------------- layer ---------------- */
  var layer = document.createElement("div");
  layer.className = "route";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML =
    '<svg preserveAspectRatio="none">' +
      '<path class="route__line" fill="none"/>' +
      '<path class="route__done" fill="none"/>' +
    "</svg>" +
    '<img class="route__car" src="' + CAR + '" alt="">';
  document.body.insertBefore(layer, document.body.firstChild);

  var svg  = layer.querySelector("svg");
  var path = layer.querySelector(".route__line");
  var done = layer.querySelector(".route__done");
  var car  = layer.querySelector(".route__car");
  car.style.width = CAR_W + "px";
  car.addEventListener("load", function () {
    if (car.naturalWidth) CAR_H = CAR_W * (car.naturalHeight / car.naturalWidth);
    place();
  });

  var total = 0, winH = 0;
  var travel = 0;          // scroll distance over which the car covers the route
  var roadH = 0;           // drawn height of the road — shorter than the page

  /* A sine snake, sampled densely enough that getPointAtLength reads smooth */
  function build() {
    winH = window.innerHeight;
    // The route runs the length of the scrolling content, stopping at the
    // footer — the car would only vanish behind it.
    var foot = document.querySelector(".footer");
    var end = foot ? foot.offsetTop : document.documentElement.scrollHeight;
    var W = layer.clientWidth || window.innerWidth;

    // Nothing is laid out yet (a zero-height viewport sends the wave count to
    // Infinity, and sin(Infinity) is NaN, which poisons the whole path).
    // The load and resize handlers will call back once there are real numbers.
    if (!W || !winH || !end) return;

    travel = Math.max(1, end - winH);

    // Depth comes from the road travelling slower than the page, not from
    // z-index alone — a layer pinned 1:1 to the scroll sits on the same plane
    // as the text no matter what is stacked in front of it. Drawing the road
    // shorter and then letting it lag by exactly the difference keeps the car
    // sweeping the viewport the same way it did before.
    roadH = winH + (1 - DEPTH) * travel;

    layer.style.height = roadH + "px";
    svg.setAttribute("viewBox", "0 0 " + W + " " + roadH);
    svg.setAttribute("width", W);
    svg.setAttribute("height", roadH);

    var amp   = W * (0.5 - MARGIN);
    var waves = Math.max(1.2, Math.min(14, roadH / (winH * 3.2)));
    var steps = Math.max(120, Math.round(roadH / 14));
    var d = "";
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var x = W / 2 + Math.sin(t * Math.PI * 2 * waves) * amp;
      var y = t * roadH;
      d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    }
    path.setAttribute("d", d);
    done.setAttribute("d", d);
    total = path.getTotalLength();
    // A single dash the length of the route, pulled back to reveal only the
    // stretch already driven.
    done.style.strokeDasharray = total + " " + total;
    place();
  }

  /* ---------------- drive ---------------- */
  var target = 0, eased = 0, raf = null;

  function place() {
    if (!total) return;
    var p = Math.min(Math.max(eased / travel, 0), 1);

    // Hold the road back as the page scrolls away, so it drifts behind
    layer.style.transform = "translate3d(0," + (eased * DEPTH).toFixed(1) + "px,0)";

    var at = total * p;
    var a  = path.getPointAtLength(at);
    // Sample forward, except at the very end where there is nothing ahead
    var back = at + 2 > total;
    var b = path.getPointAtLength(back ? at - 2 : at + 2);
    var dx = back ? a.x - b.x : b.x - a.x;
    var dy = back ? a.y - b.y : b.y - a.y;
    var ang = Math.atan2(dy, dx) * 180 / Math.PI + NOSE;

    car.style.transform =
      "translate(" + (a.x - CAR_W / 2).toFixed(1) + "px," +
                     (a.y - CAR_H / 2).toFixed(1) + "px) rotate(" + ang.toFixed(1) + "deg)";
    done.style.strokeDashoffset = String(total * (1 - p));
  }

  function loop() {
    eased += (target - eased) * 0.12;
    place();
    if (Math.abs(target - eased) > 0.4) { raf = requestAnimationFrame(loop); }
    else { eased = target; place(); raf = null; }
  }

  function onScroll() {
    target = window.scrollY;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { build(); onScroll(); }, { passive: true });
  window.addEventListener("load", build);
  build();
  eased = target = window.scrollY;
  place();
})();
