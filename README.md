# Samuel Yee — Portfolio Website

A five-page portfolio site, live at
<https://samwoh05.github.io/Portfolio-Website-/>. No build step, no framework,
no `npm install`. Plain HTML, CSS and JavaScript, and nothing fetched from a
third party at run time.

```
index.html          Home — hero, about, hobby tiles, photo ring, projects, contact
gallery.html        Photos + videos, filterable, with a lightbox
projects.html       Project list with a cover that follows the cursor
project.html        One project, chosen by ?p=slug
privacy.html        Privacy notice
404.html            Where a wrong address lands

data/gallery.js     ← the photos and videos you edit
data/projects.js    ← the projects you edit

assets/css/site.css   All styling, both themes
assets/css/fonts.css  The three self-hosted faces
assets/css/print.css  Paper only — loaded with media="print"
assets/js/site.js     Preloader, cursor, menu, scroll reveals, parallax, tilt
assets/js/theme.js    The light/dark switch
assets/js/transition.js  The terracotta wipe between pages
assets/js/lanyard.js  The staff pass swinging in the hero
assets/js/ring.js     The turning ring of photographs on the home page
assets/js/gallery.js  Builds the gallery wall + lightbox
assets/js/decrypt.js  The scrambling "Say Hello"
assets/js/route.js    The car that drives down the page as you scroll
assets/js/folder.js   The project folder that opens on the home page
assets/js/projects.js Builds the project list
assets/js/project-detail.js  Builds one project page
assets/js/split.js    Splits a line into letters so each rises on its own
assets/js/cutout.js   The name as a magazine cut-out

assets/gallery/       Your photos (WebP)
assets/img/           Portrait, about photo, badge photo, project covers
assets/video/         Web-encoded films + their poster frames
assets/fonts/         Anton, DM Sans, Neucha

assets/img/share.jpg  1200x630 link preview, used by every page
assets/img/car.png    The car on the scroll route (masked, transparent)

sitemap.xml           The five public pages, for crawlers
robots.txt            Allows everything, points at the sitemap
tools/set-photos.py   Swaps the two portraits (see below)
tools/bump-cache.py   Re-stamps the CSS and JS links after you change them
source/               Full-size originals — never published
```

---

## Spec sheet

Measured from the published site, September 2026. **97 files, 32.6 MB**, of
which 27.5 MB is video.

### Pages

| File | What it holds | Lines | Size |
|---|---|---:|---:|
| `index.html` | Hero pass, projects, gallery ring, about, education, hobby tiles, music | 399 | 23 KB |
| `privacy.html` | Privacy notice | 172 | 13 KB |
| `gallery.html` | The full wall, grouped by set, with filters and a lightbox | 154 | 12 KB |
| `projects.html` | Project list; the cover follows the cursor down the page | 139 | 11 KB |
| `project.html` | One project, chosen by `?p=slug` | 110 | 10 KB |
| `404.html` | Wrong address — a way back, and three frames from the gallery | 166 | 13 KB |

### Colour

A warm cream ground with brown-black ink — never neutral grey, which reads cold
on cream. Terracotta leads and cobalt answers it.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f3ece0` | Page ground |
| `--bg-warm` | `#e8dcc9` | Warmer ground |
| `--panel` | `#fbf6ec` | Raised panels |
| `--cream` | `#f7f0e5` | Type on dark |
| `--ink` | `#241b14` | Body text |
| `--ink-mid` | `#5b4a3c` | Secondary text |
| `--ink-soft` | `#6d5f52` | Clears 4.5:1 at 10px on all four grounds |
| `--rust` / `--rust-deep` | `#c4552c` / `#a6421f` | Accent, leads |
| `--cobalt` / `--cobalt-deep` | `#1f3fa8` / `#182f77` | Links, second voice |
| `--forest` | `#2f6b45` | Third accent |
| `--ochre` / `--amber-deep` / `--amber-mat` | `#d9992b` / `#a8620f` / `#8f5209` | Warm signals and type-bearing mats |
| `--glaze-blue/butter/rose/mint` | `#b4cbd8` `#efd9a1` `#e6b9ad` `#bcd6c1` | One vintage glaze per hobby tile |

**Surfaces.** Ink and cream are *page* colours: they swap places between themes.
Anything that stands for a physical surface keeps its own colour instead, or the
text on it ends up cream on cream — which is exactly how the `e` in the hero
name disappeared in dark mode.

| Token | Light | Dark | Used by |
|---|---|---|---|
| `--sheet` / `--sheet-alt` | `#f7f0e5` / `#fbf6ec` | `#f2ebdf` / `#e7dece` | The staff pass, the folder strips, the card lifted from it, the pale gallery mat |
| `--on-sheet` / `-mid` / `-soft` / `-accent` | `#241b14` `#5b4a3c` `#655749` `#9c3d1b` | same | The type printed on any of those |
| `--stock` / `--on-stock` | `#241b14` / `#f7f0e5` | `#0f0b08` / `#f7f0e5` | The overlay menu, the skip link, dark chips, the dark scrap in the cut-out name |
| `--stock-rust/cobalt/forest/amber` | `#a6421f` `#1f3fa8` `#2f6b45` `#8f5209` | same | The six gallery mounting boards and the coloured scraps in the cut-out name |
| `--mat` | `#9c3d1b` | same | The default photo mat and the active filter pill |

Anything painted with `--sheet` also re-binds `--ink`, `--ink-soft` and the
accent to their on-sheet values, so type placed on it follows the surface
rather than the page. That is what makes it impossible for this bug to come
back by adding a new element inside one of them.

### Type

Anton, DM Sans and Neucha are served from `assets/fonts/` as woff2 (98 KB, Latin
and Latin-Extended split, two files preloaded per page). No font CDN, so the
type is right offline and the site makes no third-party requests.

| Role | Face | Where |
|---|---|---|
| Display | Anton 400 | Headlines, section heads, the marquee |
| Body | DM Sans variable 400–700 | Everything read as text |
| Hand | Neucha 400 | The cut-out name in the preloader |

Heading scale: `h-xl` clamp(3rem, 9.6vw, 8.5rem) · `h-lg` clamp(2.5rem, 7vw,
5.75rem) · `h-md` clamp(1.75rem, 3.9vw, 3.1rem). Running text 15px / 1.7.

### Motion

One scale for the whole site — arriving decelerates, leaving accelerates,
releasing springs past its mark.

| Token | Duration | For |
|---|---:|---|
| `--dur-1` | 150 ms | Micro — colour, a rule sliding under a link |
| `--dur-2` | 280 ms | State — hover, a pill switching on |
| `--dur-3` | 480 ms | Entrance — a card arriving, a row shifting |
| `--dur-4` | 720 ms | Scenic — full images, the lightbox opening |

`--ease-out` 0.22, 1, 0.36, 1 · `--ease-soft` 0.215, 0.61, 0.355, 1 ·
`--ease-in` 0.55, 0.06, 0.68, 0.19 · `--ease-press` 0.34, 1.36, 0.64, 1.

### Layout

`--rail` is 92px of fixed chrome — logo, menu, section marker, scroll rail,
social links — and drops to 0 under 900px, where content takes the full width.
`--gutter` is clamp(20px, 5vw, 72px). Breakpoints: 980 · 900 · 860 · 700 · 620 ·
560 · 420 px. Texture comes from checkerboard rules, a film-grain overlay
stepping at 700 ms, and a pixel-arrow cursor drawn as inline SVG — no image
files to manage. `site.css` is 3,085 lines / 156 KB, which GitHub Pages gzips
to about 26 KB. `print.css` (175 lines) is linked with `media="print"`, so a
screen visitor never downloads it.

### Behaviour

Thirteen modules, 89 KB in total, no dependencies.

| Module | What it does | Lines |
|---|---|---:|
| `lanyard.js` | The staff pass hanging in the hero, on a simulated rope | 288 |
| `site.js` | Preloader, custom cursor, overlay menu, scroll reveal, parallax, tilt | 285 |
| `ring.js` | The photo ring on the home page | 265 |
| `gallery.js` | Builds the wall from data, filters it, runs the lightbox | 240 |
| `decrypt.js` | "Say Hello" scrambles and settles on every load | 232 |
| `project-detail.js` | Renders one project from the slug in the address | 195 |
| `route.js` | A car that winds down the page behind everything as you scroll | 138 |
| `folder.js` | The project folder on the home page — rests **open**, so the projects read without a click | 146 |
| `projects.js` | Project list with a cover that follows the cursor | 114 |
| `split.js` | Splits a line into letters so each rises out of its own mask | 110 |
| `transition.js` | The terracotta wipe between pages | 128 |
| `theme.js` | The light/dark switch | 87 |
| `cutout.js` | The name as a magazine cut-out, each letter its own scrap | 67 |

### Photo ring

Eight photographs stand in a circle that turns as you scroll and keeps drifting
when you stop. Each card fades as it turns away and floats over its own shadow;
pick one and it opens in the gallery lightbox.

| Setting | Value |
|---|---|
| Cards | 8, drawn from the 31 landscape frames only |
| Card width | clamp(220px, 30% of the stage, 400px) |
| Perspective | 3.3 × radius — magnifies the front card by 1.43× |
| Turn | 0.12° per pixel scrolled; 4°/s of drift otherwise |
| Quiet swaps | Every 6 s one card past 150° — out of sight — loads another photograph |
| Holds still | Under the pointer, during a drag, and while a card has keyboard focus |

### The running order

The home page leads with the work. It used to open with the hero and then run
about → statement → education → hobby tiles before reaching a single project,
which put the evidence 3,739px down — 4.6 screens on a phone. The same sections
now read in this order, none removed:

| | Section | Reaches |
|---|---|---|
| | Hero — pass, name, status line, two buttons | |
| 01 | Projects — the folder, resting open | **900px** |
| 02 | Gallery — the photo ring | 1,662px |
| 03 | About — with education folded in under it | 2,454px |
| | Statement — "Wherever you go, there you are." | |
| 04 | What I keep doing — the four hobby tiles | |
| 05 | What's been playing — the two playlists | |
| | Contact | |

The hero carries a status line (**edit it in `index.html` — it should say what
is true this month**) and two buttons: *Email me* and *See the work*. A third,
commented out, links `assets/cv.pdf` — uncomment it once that file exists.

### Lanyard

The hero's left column holds a staff pass on a lanyard instead of a flat
portrait — the idea of the Framer/React Bits Lanyard component, which uses
three.js and a WASM physics engine. With no framework here, the rope is
simulated in `lanyard.js` instead and drawn as SVG: about 240 lines of physics
and no new bytes beyond the pass photo.

| Setting | Value |
|---|---|
| Rope | 13 points, Verlet integration, 14 constraint passes per step |
| Step | Fixed at 1/120 s, so it moves the same on any screen |
| Gravity / drag | 2100 px/s², 0.995 friction, extra air on the pass itself |
| The pass | Two more points held a card apart — that rigid link is what gives it an angle to hang at |
| Strands | Two, parted by 34% of the card at the top, meeting at the ring |
| Print | The name repeats down the left strand on an SVG `textPath`, so it bends as the strap swings |
| Drag | Grabs the nearer end, so you can swing it or spin it; it keeps the speed you let go at |
| Keyboard | The pass takes focus; ← and → nudge it |
| Idle | A slow breeze, so it never hangs dead |
| Still | Under reduced motion it hangs straight and never moves |

The pass carries `assets/img/badge.webp` (53 KB), cropped from `portrait.jpg`,
with the name set in Anton and the surname in terracotta.

### Themes

The same rooms after dark, not an inversion: the ground goes warm near-black,
terracotta and cobalt lift so they still carry, the four hobby glazes are
re-mixed as deep versions of themselves, and shadows deepen to black because a
brown shadow on a brown ground is invisible. The staff pass keeps its own light
colours — it is white plastic in any light — and becomes the brightest thing on
the page.

| | |
|---|---|
| Default | Follows the system setting |
| Chosen | A switch in the side rail stamps `data-theme` on `<html>`, which wins over the system in both directions |
| Storing it | The choice is kept in `localStorage` under `sy-theme`; picking the side your system is already on clears it and goes back to following |
| No flash | A snippet in each `<head>` applies the stored choice before the first paint |
| Contrast | Every text pairing measured on the dark ground clears 4.5:1 — body 14.8:1, secondary 9.3:1, small soft text 6.3:1, terracotta 6.4:1, links 8:1 |
| Audited | Every text node on all six pages, in both themes, measured against the background actually behind it: zero failures. Two flags are false positives the method can't read — the logo uses `mix-blend-mode: difference`, and the photo-ring captions sit on a gradient |

### Page transition

A terracotta panel sweeps across, the next page loads behind it, and it sweeps
off the other side — 200 ms out, 260 ms back, with the site's checkerboard on
the leading edge. Arriving behind the wipe also drops the preloader, so moving
around the site no longer runs the full count each time.

| | |
|---|---|
| Handled | Same-origin links in the same tab |
| Left alone | External links, `mailto:`, anchors on the current page, and anything opened with a modifier key — verified by test |
| The handover | A flag in `sessionStorage` (`sy-wipe`) tells the arriving page to sweep off rather than run the curtain |
| Never stuck | The sweep-off runs on a frame, a timer and the page becoming visible, whichever comes first — a tab that loads in the background fires no frames |
| Back button | A page restored from the browser's cache clears the panel on `pageshow` |
| Still | Under reduced motion the whole file returns early and links behave normally |

### Content

| | |
|---|---|
| Gallery | 39 items — 37 photographs (31 landscape, 6 portrait) and 2 films |
| Sets | Joo Chiat 12 · NE Tour 11 · MSP 9 · Earlier 6 · Holy Land 1 |
| Cameras | Sony A7 III 23 · Canon R50 9 · iPhone 17 Pro Max 4 · Digital Camera 2 · iPhone 12 Pro 1 |
| Item fields | `type, group, src, poster, w, h, camera, lens, edit, alt` |
| Projects | S.O.N.I.C (2024) · NYP Open House (2024) · Mini Python Games (2025) · This Portfolio (2026) |

### Media

| Film | Length | Master | On the site |
|---|---:|---:|---:|
| Joo Chiat Mini Vlog | 3:24 | 497.6 MB | 20.2 MB |
| Holy Land Trip '23 | 0:31 | 268.5 MB | 7.9 MB |

Photographs: 36 WebP, 74 KB average, 163 KB largest, 1,119–1,600 px on the long
edge. Project stills: 10 WebP, 1.7 MB. The hero pass photo: 1 WebP, 53 KB. The first four frames load eagerly and
the rest lazily; every frame carries its own aspect ratio so nothing jumps as it
arrives.

### Access

- Reduced motion is honoured in 13 stylesheet blocks and 10 of the 13 modules —
  the ring stops drifting, letters stop scrambling, the car stops driving, the
  pass hangs still, and pages change without the wipe.
- Eight `:focus-visible` rules; the ring brings a focused card round to the
  front; the pass swings with <kbd>←</kbd> and <kbd>→</kbd>; the lightbox takes
  <kbd>Esc</kbd>, <kbd>←</kbd> and <kbd>→</kbd>.
- Scrambling letters are hidden from screen readers and the real words read out
  once. Every photograph carries alt text and every control a label.
- Soft ink sits at the darkest point where 10px type still clears 4.5:1 on all
  four grounds.

### Hosting

GitHub Pages, branch `main` / root, no build. No CDN, analytics, tracker or
cookies — every byte comes from the same origin. Needs custom properties, grid,
3D transforms and `IntersectionObserver`; where the observer is missing the ring
simply stays awake. See [Putting it online](#putting-it-online) for the details.

**Sharing and crawling.** Every page carries an absolute `og:image`
(`assets/img/share.jpg`, 1200x630), `og:url`, `og:site_name`, image dimensions
and alt, and `twitter:card`. The five public pages also carry a `canonical`.
Relative `og:image` paths were invisible to every scraper, so the link arrived
as bare text wherever it was pasted. `sitemap.xml` and `robots.txt` sit at the
root. **All of these carry the full domain — if the site ever moves, they all
need rewriting**; they are the only absolute URLs in the project.

**404.** GitHub Pages serves `404.html` for any address it doesn't have. Its
links are relative, which is right for a wrong address one level deep — the
only kind this site can produce.

**Print.** `print.css` strips the fixed chrome, the car, the pass, the ring, the
grain and the checkerboards, reveals anything waiting on a scroll, prints the
address after any outgoing link, and signs the foot of the page with the site
and the email.

**Cache stamps.** Every page links its CSS and JS with a `?v=` fingerprint —
59 links, a short hash of everything in `assets/css/`, `assets/js/` and
`data/`. Pages serves assets with `max-age=600`, so without a stamp a visitor
can run new HTML against a stylesheet cached ten minutes earlier, which is not
stale so much as broken. The stamp was a date at first, and that failed the
first time the site was deployed twice in one day: the files changed, the date
didn't, and browsers kept the old copy. A fingerprint cannot drift out of step
with the files. After changing anything under those folders, run:

```bash
python3 tools/bump-cache.py
```

then commit. It rewrites the stamp on all six pages, and does nothing if the files haven't changed.

---

## Viewing it locally

Double-clicking `index.html` works. If you'd rather serve it properly, run a
tiny local server from this folder:

```bash
cd "/Users/samwoh/Documents/Portfolio Website" && node .claude/serve.js
```

Then open <http://localhost:4173>. (`python3 -m http.server 4173` works too.)

---

## Adding photos

1. Put the image in `assets/gallery/`. The wall is WebP — about 45% lighter
   than JPEG for the same picture — so convert an export first:

```bash
python3 -c "from PIL import Image; Image.open('blue-hour.jpg').convert('RGB').save('assets/gallery/blue-hour.webp','WEBP',quality=82,method=6)"
```

2. Open `data/gallery.js` and add an entry to the `items` list:

```js
{
  "type":   "photo",
  "src":    "assets/gallery/blue-hour.webp",
  "w": 1600, "h": 1067,
  "group":  "Marina Bay",
  "camera": "Fujifilm X-T30",
  "alt":    "City skyline reflected in still water at dusk"
}
```

`camera` is the credit printed on the mat under the photo. Leave it empty and
the credit is simply omitted — nothing breaks.

`w` and `h` are the pixel dimensions — they reserve the right space while the
image loads so the grid doesn't jump. On a Mac you can read them with:

```bash
sips -g pixelWidth -g pixelHeight "assets/gallery/blue-hour.webp"
```

Order in the file is the order on the page. Save, refresh, done.

### Grouping the wall

Once you're past seven or so photos the wall stops reading as a set. Give items
a `group` and they break into labelled chunks:

```js
{ "type": "photo", "title": "Nine Arches", "group": "2026", ... }
```

Any label works — a year, a city, a project. Items with no `group` sit together
under an unlabelled chunk. With fewer than two distinct groups the wall stays
flat, so you can ignore this until you need it.

## Adding videos

Three shapes, depending on where the video lives.

**A file you own** — put the `.mp4` in `assets/video/` and add a poster frame:

```js
{
  "type":   "video",
  "title":  "Sunset Timelapse",
  "meta":   "Singapore · 2026",
  "src":    "assets/video/sunset.mp4",
  "poster": "assets/gallery/sunset-still.jpg",
  "w": 1920, "h": 1080
}
```

**A YouTube video** — use the *embed* URL (`/embed/ID`, not `/watch?v=ID`):

```js
{
  "type":   "video",
  "title":  "Behind the Shoot",
  "meta":   "YouTube",
  "embed":  "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  "poster": "assets/gallery/thumb.jpg",
  "w": 1280, "h": 720
}
```

**A TikTok or Instagram post** — those block embedding, so link out instead.
Using `href` turns the tile into a link that opens in a new tab:

```js
{
  "type":   "video",
  "title":  "Latest on TikTok",
  "meta":   "TikTok",
  "href":   "https://www.tiktok.com/@sam_yzx",
  "poster": "assets/gallery/thumb.jpg",
  "w": 900, "h": 1600
}
```

Until you add any, the **Videos** filter shows a tidy empty state pointing at
your TikTok.

## Adding projects

Edit `data/projects.js`:

```js
{
  "title": "Project Name",
  "year":  "2026",
  "blurb": "One or two sentences on what it is and what you learned.",
  "tags":  ["Python", "Hardware"],
  "href":  "https://github.com/samwoh05/repo-name",
  "cover": "assets/img/covers/python.svg"
}
```

`cover` is the image that follows your cursor when you hover the row. Reuse one
of the existing covers in `assets/img/covers/`, or drop in a real screenshot.

---

## Video

Films live in `assets/video/` as web-encoded MP4 with a poster frame beside
them; the full-quality masters stay in `source/video/` and are never deployed.

Camera exports are far too heavy to serve directly — a three-minute 1080p
master runs to hundreds of megabytes. To re-encode one:

```bash
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -i source/video/YOUR.mov \
  -vf scale=-2:1080 -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart assets/video/your-film.mp4
```

`crf` is the quality dial — lower is better and larger, 23–26 is the useful
range for web. `+faststart` moves the index to the front of the file so
playback can begin before the download finishes; without it a visitor waits
for the whole file. ffmpeg came from the `imageio-ffmpeg` pip package, so
there is no system install to maintain.

To add the film to the gallery, put an entry in `data/gallery.js`:

```js
{
  "type":   "video",
  "src":    "assets/video/your-film.mp4",
  "poster": "assets/video/your-film.jpg",
  "w": 1920, "h": 1080,
  "group":  "Joo Chiat",
  "camera": "Sony A7 III",
  "lens":   "FE 28–70mm f/3.5–5.6",
  "edit":   "DaVinci Resolve"
}
```

A poster frame can be grabbed with `qlmanage -t -s 1400 -o . your-film.mp4`.

## Swapping the two portraits

The hero panel and the About section each hold one photo of you. To change them:

```bash
python3 tools/set-photos.py <hero-photo> <about-photo>
```

It converts (HEIC included), fixes phone rotation, resizes and saves both to
the right places. Afterwards you may want to nudge the hero crop — that's
`object-position` on `.hero__media img` in `assets/css/site.css`; the first
number is horizontal, the second vertical, so `50% 30%` sits higher in frame.

## The scroll route

A car winds down a dashed route as you scroll. It lives at layer 0, behind all
content, so it shows through the page's open ground and passes beneath every
solid block — it can never cover anything.

Dials are at the top of `assets/js/route.js`:

| | |
|---|---|
| `CAR` | the image; any top-view car with a transparent background works |
| `CAR_W` | on-screen width in px (height follows the image's aspect) |
| `NOSE` | `-90` if the art points nose-down, `+90` if nose-up |
| `MARGIN` | how far inside the page edges the route stays |
| `DEPTH` | how much slower the road travels than the page — higher reads as further back |

It sits out entirely under `prefers-reduced-motion`.

## Changing the words

Everything else — the headline, the about text, the stats, the footer — is
plain text in the HTML files. Search for the sentence you want to change and
type over it. The bio lives in `index.html` under `<!-- ==== About ==== -->`.

### Your links

These are wired into all three pages (the overlay menu, the contact footer's
icon row, and the bottom-right corner of the home page):

| Where | Link |
|---|---|
| Instagram | https://www.instagram.com/eattohrepeat/ |
| TikTok | https://www.tiktok.com/@sam_yzx |
| GitHub | https://github.com/samwoh05 |
| LinkedIn | https://www.linkedin.com/in/samuel-yee-573164284/ |
| Spotify I | https://open.spotify.com/playlist/5l4wbWqj1yNKjOc1XNnSc0 |
| Spotify II | https://open.spotify.com/playlist/3lRkVkXqaBwBWOFaWslODI |
| Email | samuelyee4385@gmail.com |

To change one, search the three `.html` files for the old URL and replace it.

---

## Putting it online

The site is published from GitHub
([samwoh05/Portfolio-Website-](https://github.com/samwoh05/Portfolio-Website-))
with GitHub Pages, deploying from `main` / root. To update it, commit and push:

```bash
git add -A && git commit -m "Describe the change" && git push
```

The live site refreshes a minute or so later.

`.gitignore` keeps `source/` (the full-size originals), camera `.mov` exports,
`.claude/` and `.DS_Store` files off GitHub. GitHub refuses any file over
100 MB, so always re-encode a film (see *Video*) rather than committing the
master. `.nojekyll` tells Pages to serve the files as they are.

Because it's a plain static folder, Netlify, Vercel or Cloudflare Pages would
host it just as well: import the repo, no build command, output directory `/`.

Anton, DM Sans and Neucha are served from `assets/fonts/` rather than a font
CDN, so the site makes no third-party requests at all and the type is right
even with no connection.

---

## Notes

- **`source/unused-photos/`** holds ten frames the gallery never showed (the
  `g*` and `JB*` files from your old site). They are kept on your Mac but not
  published. Move one back into `assets/gallery/` and add it to
  `data/gallery.js` if you want it on the wall.
- **`source/gallery-jpg-originals/`** holds the JPEGs the WebP wall was made
  from, likewise local only.
- **Your email is published** on every page as a `mailto:` link. That's normal
  for a portfolio but it does attract spam — swap it for a contact form
  (Formspree, Tally) if that becomes annoying.
- The about text says you *studied* at Nanyang Polytechnic. Your old site said
  "on the verge of graduating", which was written in 2024 — update it to
  whatever's true now.
- Motion respects `prefers-reduced-motion`.
- The cursor is a mosaic-tiled pixel arrow defined in `site.css`; links get a
  cobalt variant. Both are inline SVG, so there is no image file to manage.
