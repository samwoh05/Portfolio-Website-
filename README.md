# Samuel Yee — Portfolio Website

A six-page portfolio site, live at
<https://samwoh05.github.io/Portfolio-Website-/>. No build step, no framework,
no `npm install`. Plain HTML, CSS and JavaScript, and nothing fetched from a
third party at run time.

It says one thing: an Infocomm & Media Engineering graduate who built things
that had to work in front of a crowd, and is moving into marketing. The work
leads, because work already done is the strongest argument for a change of
direction.

```
index.html          Home — hero reel, the work, the turn, learning, gallery, about
projects.html       Project list with a cover that follows the cursor
project.html        One project, chosen by ?p=slug
gallery.html        Photos + videos, filterable, with a lightbox
privacy.html        Privacy notice
404.html            Where a wrong address lands — a patch bay

data/gallery.js     ← the photos and videos you edit
data/projects.js    ← the projects you edit
data/learning.js    ← the courses and their certificates

assets/css/site.css   All styling, both themes
assets/css/fonts.css  The three self-hosted faces
assets/css/print.css  Paper only — loaded with media="print"

assets/js/site.js     Preloader, cursor, menu, reveals, parallax, tilt, hero film
assets/js/desk.js     The colour temperature — the readout and the live mix
assets/js/theme.js    The light/dark switch
assets/js/transition.js  The filament wipe between pages
assets/js/lanyard.js  The staff pass swinging in the hero
assets/js/ring.js     The turning ring of photographs on the home page
assets/js/folder.js   The project case that opens on the home page
assets/js/gallery.js  Builds the gallery wall + lightbox
assets/js/projects.js Builds the project list
assets/js/project-detail.js  Builds one project page
assets/js/learning.js Builds the courses
assets/js/split.js    Splits a line into letters so each rises on its own
assets/js/decrypt.js  The scrambling "Say Hello"

assets/gallery/       Your photos (WebP)
assets/img/           About photo, badge photo, project shots, covers
assets/img/certs/     The certificates themselves
assets/video/         Web-encoded films + posters, and the hero loop
assets/fonts/         Archivo, DM Sans, IBM Plex Mono

assets/img/share.jpg  1200x630 link preview, used by every page
sitemap.xml           The five public pages, for crawlers
robots.txt            Allows everything, points at the sitemap
tools/set-photos.py   Swaps the portraits (see below)
tools/bump-cache.py   Re-stamps the CSS and JS links after you change them
source/               Full-size originals — never published
```

---

## Spec sheet

Measured from this folder, September 2026. **103 tracked files, 32.9 MB**, of
which 27.4 MB is video.

### Pages

| File | What it holds | Lines | Size |
|---|---|---:|---:|
| `index.html` | Hero reel, the work, the gel change, learning, gallery, about, education | 414 | 23 KB |
| `privacy.html` | Privacy notice | 201 | 14 KB |
| `404.html` | Wrong address — a patch bay, four ways out, three frames | 201 | 9 KB |
| `gallery.html` | The full wall, grouped by set, with filters and a lightbox | 174 | 13 KB |
| `projects.html` | Project list; the cover follows the cursor down the page | 160 | 12 KB |
| `project.html` | One project, chosen by `?p=slug` | 131 | 11 KB |

### The desk — colour temperature

The whole site runs on one number. A lighting desk measures lamps in kelvin:
tungsten sits low and warm, daylight sits high and cool. Samuel patched and
programmed rigs before he wanted to programme campaigns, so the page is lit on
that scale and says what it is lit at.

| | |
|---|---|
| Range | **3200K** at the top of a page → **5600K** at the bottom |
| Readout | Top right, above the page marker; bottom-left as a chip under 861px |
| What moves it | Scroll position, eased at 0.14 per frame; set instantly under reduced motion |
| What it drives | `--k-mix` and `--k-pct` on `:root`, from which every accent is mixed in `oklab` |
| The ground | Mixed 6% with the live colour, plus a fixed wash (16% at the top of the viewport, gone by 46%) — so the change is felt, not only read |
| Measured, dark | `#171613` warm charcoal at the top, `#121719` cool charcoal at the bottom |
| Cue stamps | Each section prints the kelvin **its own position** works out to, from the same sum, recomputed on resize |
| Cost | `desk.js`, 119 lines, one rAF loop, writing two custom properties only when the rounded value changes |
| Without JS | The readout carries `hidden` in the markup and `desk.js` removes it, so it never reads as a broken instrument |

### Colour

A cool near-white ground with near-black ink. The accents are the two gels
every lighting desk keeps: **CTO**, the orange that warms a lamp to tungsten,
and **CTB**, the blue that cools it to daylight. Tungsten lights what he has
made; daylight lights what he is learning. Nothing else is saturated, so the
photographs are the only full colour in the building.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f4f5f4` | Page ground (then mixed 6% with the live gel) |
| `--bg-warm` | `#e9ebea` | Warmer ground |
| `--panel` | `#ffffff` | Raised panels |
| `--ink` | `#101314` | Body text |
| `--ink-mid` | `#454d50` | Secondary text |
| `--ink-soft` | `#5c6568` | Clears 4.5:1 at 10px on every ground |
| `--tungsten` / `--tungsten-deep` | `#c97a16` / `#95590a` | Display marks / anything at 11px |
| `--daylight` / `--market-deep` | `#2c7fa8` / `#1b5e7e` | Everything below the gel change |
| `--tungsten-on-band` | `#f2a544` | Tungsten printed on a dark band, which doesn't flip |
| `--daylight-band` | `#123a4e` | The band a cool section is printed on |
| `--on-sheet-accent` | `#8a5108` | Tungsten on paper — clears 4.5:1 on all four sheet colours at 8.5px |

**Surfaces.** Ink and page colours swap between themes. Anything standing for a
physical surface keeps its own colour and **re-binds the ink tokens**, so type
on it follows the surface rather than the page — `--sheet` (the pass, the
folder strips, the lifted card), `--stock` (the overlay menu, dark chips),
`--mat` (the near-black every photograph is mounted on). The overlay menu is
the case that proves it: printed on dark stock in either theme, it was reading
the page's `--ink-soft` and coming out at 3.24:1 in the light theme.

### Type

Archivo, DM Sans and IBM Plex Mono are served from `assets/fonts/` as woff2
(**176 KB across 8 files**, Latin and Latin-Extended split, two preloaded per
page). No font CDN, so the type is right offline and the site makes no
third-party request.

| Role | Face | Where |
|---|---|---|
| Display | Archivo variable 400–800 | Headlines, section names, the ticker |
| Body | DM Sans variable 400–700 | Everything read as text |
| Instrument | IBM Plex Mono 400/500 | Every label, number, date, caption, credit |

Mono in the margins is what makes a layout read as *instrumented* rather than
decorated, which is the right voice for a portfolio arguing that its author
counts things. Heading scale: `h-xl` clamp(2.3rem, 6.6vw, 5.9rem) · `h-lg`
clamp(2rem, 5vw, 4.1rem) · `h-md` clamp(1.5rem, 3vw, 2.4rem). Section names
run to clamp(2.5rem, 9.6vw, 7.4rem). Running text 15px / 1.7.

### The hero reel

| | |
|---|---|
| The film | 3.85s of the Joo Chiat film — the shophouse row, people crossing |
| Why that shot | One continuous take. A 7s cut had a camera change behind the headline; an earlier start caught the film's own title card, which read as a watermark |
| Weight | `street-loop.mp4` **179 KB**, 1280×720, 24fps, silent · poster 134 KB |
| Cut from | `assets/video/joo-chiat.mp4`, 16.95s–20.80s |
| The scrim | The page's own ground, not black, so type keeps its contrast in both themes. Drawn twice: a 95deg wash on wide screens, and on narrow ones the film keeps the top while the ground comes up solid under everything readable |
| Playback | No `autoplay` attribute — `site.js` starts it, and only when the reader has not asked for less motion and is not on a metered connection. It pauses off-screen |
| Without JS | The poster frame, which is a still from the same shot |

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

`--rail` is 92px of fixed chrome — logo, menu, readout, page marker, scroll
rail, social links — and drops to 0 under 860px, where content takes the full
width. `--gutter` is clamp(20px, 5vw, 72px). Breakpoints: 1120 · 980 · 900 ·
861 · 860 · 700 · 560 · 520 px. Texture comes from a measured rule (a hairline
with a tick every 16px), a film-grain overlay, and a pixel-arrow cursor drawn
as inline SVG — no image files to manage. `site.css` is **4,042 lines /
165 KB**, which GitHub Pages gzips to 32 KB. `print.css` (175 lines) is
linked with `media="print"`, so a screen visitor never downloads it.

The first screen is verified at **375×812, 800×600, 1024×768, 1440×900 and
1920×1080**: the hero fits the viewport at each, no horizontal scroll at any,
and the three things that want the bottom edge — the readout, the film credit
and the fixed social links — share it at none of them.

### Behaviour

Thirteen modules, **2,385 lines**, no dependencies.

| Module | What it does | Lines |
|---|---|---:|
| `site.js` | Preloader, cursor, overlay menu, reveals, parallax, tilt, ticker, hero film | 336 |
| `lanyard.js` | The staff pass hanging in the hero, on a simulated rope | 288 |
| `ring.js` | The photo ring on the home page | 265 |
| `gallery.js` | Builds the wall from data, filters it, runs the lightbox | 240 |
| `decrypt.js` | "Say Hello" scrambles and settles | 232 |
| `project-detail.js` | Renders one project from the slug in the address | 195 |
| `folder.js` | The project case — shut at rest, opens on click, each file lifts out as a card | 188 |
| `transition.js` | The filament wipe between pages | 133 |
| `desk.js` | The colour temperature: the readout, the live mix, the cue stamps | 119 |
| `projects.js` | Project list with a cover that follows the cursor | 114 |
| `split.js` | Splits a line into letters so each rises out of its own mask | 110 |
| `learning.js` | Builds the courses, and removes the section if there are none | 78 |
| `theme.js` | The light/dark switch | 87 |

### The running order

The home page leads with the work, then turns. Everything above the gel change
is what he made; everything below is what he is learning, and the page is lit
to say so.

| | Section | Lit at |
|---|---|---|
| | Hero — the reel, the name, the status line, two buttons | 3200K |
| 01 | **The work** — the case, opening to four projects | 3500K |
| | *The gel change* — "People buy what it says about them." | CTO → CTB |
| 02 | **The market** — the courses, with the certificate itself | 4100K |
| 03 | **Gallery** — the photo ring, and Sam's Visual Diary | 4400K |
| 04 | **Start here** — the biography | 4950K |
| 05 | **How I got here** — two stops, not four | 5450K |
| | Contact — "Say Hello", the address, the socials | 5600K |

Section names are set at poster scale with the old label underneath as the
caption, and one `h2` per section, so the outline reads `h1 → h2 → h3`.

The hero carries a status line (**edit it in `index.html` — it should say what
is true this month**) and two buttons: *Email me* and *See the work*. A third,
commented out, links `assets/cv.pdf` — uncomment it once that file exists.

### The project case

Shut, it is an equipment case with a stencilled plate (`PROJECT FILES · 4
INSIDE`) and a warm seam along the lid where the light inside gets out, which
widens when you point at it. Open, the lid tips 72° toward you and four files
step up out of the pocket; click one and it lifts out as a card with the brief
and a link to the full page. Click anywhere off the card and it goes back.
The plate is decorative — the cover is `aria-hidden` and the button says what
it does.

### Photo ring

Eight photographs stand in a circle that turns as you scroll and keeps drifting
when you stop. Each card fades as it turns away and floats over its own shadow;
pick one and it opens in the gallery lightbox.

| Setting | Value |
|---|---|
| Cards | 8, drawn from the landscape frames only |
| Card width | clamp(220px, 30% of the stage, 400px) |
| Perspective | 3.3 × radius — magnifies the front card by 1.43× |
| Turn | 0.12° per pixel scrolled; 4°/s of drift otherwise |
| Quiet swaps | Every 6 s one card past 150° — out of sight — loads another photograph |
| Holds still | Under the pointer, during a drag, and while a card has keyboard focus |

### Lanyard

The hero carries a staff pass on a lanyard, hanging over the film — the idea of
the Framer/React Bits Lanyard component, which uses three.js and a WASM physics
engine. With no framework here the rope is simulated in `lanyard.js` and drawn
as SVG: about 240 lines of physics and no new bytes beyond the pass photo.

| Setting | Value |
|---|---|
| Rope | 13 points, Verlet integration, 14 constraint passes per step |
| Step | Fixed at 1/120 s, so it moves the same on any screen |
| Gravity / drag | 2100 px/s², 0.995 friction, extra air on the pass itself |
| The pass | Two more points held a card apart — that rigid link gives it an angle to hang at |
| Print | The name repeats down the left strand on an SVG `textPath`, so it bends as the strap swings |
| Drag | Grabs the nearer end; it keeps the speed you let go at |
| Keyboard | The pass takes focus; ← and → nudge it |
| Hangs from | 96–132px down, so its cord clears the readout in the corner |
| Still | Under reduced motion it hangs straight and never moves |

The pass carries `assets/img/badge.webp` (53 KB), cropped from `portrait.jpg`.

### Themes

The same rooms after dark, not an inversion: the ground goes near-black, the
two gels lift so they still carry, and shadows deepen. The staff pass keeps its
own light colours — it is white plastic in any light.

| | |
|---|---|
| Default | Follows the system setting |
| Chosen | A switch in the side rail stamps `data-theme` on `<html>`, which wins over the system in both directions |
| Storing it | Kept in `localStorage` under `sy-theme`; picking the side your system is already on clears it and goes back to following |
| No flash | A snippet in each `<head>` applies the stored choice before the first paint |

### Page transition

The panel is painted in the page's own ground rather than a contrasting colour,
so what crosses the screen is three pixels of tungsten on its leading edge, with
the glow they throw ahead — a coloured panel would trade the browser's white
flash for one of its own. It travels (`translate`) instead of growing
(`scaleX`), which is what keeps the filament three pixels wide the whole way.

| | |
|---|---|
| Timings | 200 ms out, 260 ms back, nothing at all under reduced motion |
| Handled | Same-origin links in the same tab |
| Left alone | External links, `mailto:`, anchors on the current page, and anything opened with a modifier key |
| The handover | A flag in `sessionStorage` (`sy-wipe`) tells the arriving page to sweep off rather than run the curtain |
| Never stuck | The sweep-off runs on a frame, a timer and the page becoming visible, whichever comes first |
| Back button | A page restored from the browser's cache clears the panel on `pageshow` |

### The 404

It runs on the trade Samuel actually practised: patching. *"This channel isn't
patched."* Under it a patch bay hands back the address that was actually
requested, in mono, next to an unlit lamp and the word `Unpatched` — people
mistype URLs, and seeing the string returned is how they spot their own typo.
It is written with `textContent`, never `innerHTML`: that string comes from the
URL bar, so it is the only content on the site a stranger controls. It
truncates at 64 characters and wraps anywhere. Three photographs sit at the
bottom, because a dead end should be worth landing on.

### Content

| | |
|---|---|
| Gallery | 39 items — 37 photographs and 2 films |
| Sets | Joo Chiat 12 · NE Tour 11 · MSP 9 · Earlier 6 · Holy Land 1 |
| Cameras | Sony A7 III 23 · Canon R50 9 · iPhone 17 Pro Max 4 · Digital Camera 2 · iPhone 12 Pro 1 |
| Item fields | `type, group, src, poster, w, h, camera, lens, edit, alt` |
| Projects | S.O.N.I.C (2024) · NYP Open House (2024) · Mini Python Games (2025) · This Portfolio (2026) |
| Courses | One, real: *Digital Marketing Tools and Techniques*, Simplilearn SkillUp, June 2026, certificate 10333384. The card shows the certificate itself and links to it |
| Still to write | The `took` line on that card — one sentence on what the course changed about how you read something ordinary. The card renders without it; a placeholder marked `draft: true` would render with a dashed edge and a "To fill in" chip |

### Media

| Film | Length | Master | On the site |
|---|---:|---:|---:|
| Joo Chiat Mini Vlog | 3:24 | 497.6 MB | 19.3 MB |
| Holy Land Trip '23 | 0:31 | 268.5 MB | 7.5 MB |
| Hero loop (cut from Joo Chiat) | 0:04 | — | 179 KB |

The certificate is `assets/img/certs/digital-marketing-simplilearn.webp`, 900×627,
**31 KB** — cropped out of a PDF-viewer screenshot, with the viewer's title chip
and its fullscreen button painted out against the flat areas they covered.

Photographs: 37 WebP in `assets/gallery/`, 2.6 MB in total. `assets/img/`
holds 22 files, 2.3 MB — the About photo, the pass, the share card, four
covers and ten project stills. The first four frames load eagerly and the rest
lazily; every frame carries its own aspect ratio so nothing jumps as it arrives.

### Access

- Reduced motion is honoured in **13 stylesheet blocks** and in every module
  that moves: the ring stops drifting, letters stop scrambling, the pass hangs
  still, the hero film never starts, the fader is set rather than eased, and
  pages change without the wipe.
- **13 `:focus-visible` rules**; the ring brings a focused card round to the
  front; the pass swings with <kbd>←</kbd> and <kbd>→</kbd>; the lightbox takes
  <kbd>Esc</kbd>, <kbd>←</kbd> and <kbd>→</kbd>.
- Scrambling and split letters are hidden from screen readers and the real
  words read out once. Every photograph carries alt text and every control a
  label.
- **Contrast: zero failures.** Audited on the live pages, every text node, both
  themes, six pages — including with the overlay menu open, and at both ends of
  the scroll now that the ground itself moves. Two known false positives: the
  `.ring__*` captions and the `.statement__gel` line sit on gradients the
  checker cannot sample; the latter measures 4.89:1 by hand against every stop.

### Hosting

GitHub Pages, branch `main` / root, no build. No CDN, analytics, tracker or
cookies — **zero third-party requests**; every byte comes from the same origin.
Needs custom properties, grid, 3D transforms, `IntersectionObserver` and
`color-mix()`; without `color-mix()` the accents fall back to tungsten and the
ground stops shifting, and the page is otherwise unchanged.

**Sharing and crawling.** Every page carries an absolute `og:image`
(`assets/img/share.jpg`, 1200x630), `og:url`, `og:site_name`, image dimensions
and alt, and `twitter:card`. The five public pages also carry a `canonical`.
**These carry the full domain — if the site ever moves, they all need
rewriting**; they are the only absolute URLs in the project. `sitemap.xml` and
`robots.txt` sit at the root.

**Print.** `print.css` strips the fixed chrome, the pass, the ring and the
grain, reveals anything waiting on a scroll, prints the address after any
outgoing link, and signs the foot of the page.

**Cache stamps.** Every page links its CSS and JS with a `?v=` fingerprint —
**61 links**, a short hash of everything in `assets/css/`, `assets/js/` and
`data/`. Pages serves assets with `max-age=600`, so without a stamp a visitor
can run new HTML against a stylesheet cached ten minutes earlier. After
changing anything under those folders, run:

```bash
python3 tools/bump-cache.py
```

then commit. It rewrites the stamp on all six pages, and does nothing if the
files haven't changed.

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
a `group` and they break into labelled chunks. Any label works — a year, a
city, a project. Items with no `group` sit together under an unlabelled chunk.

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

**A YouTube video** — use the *embed* URL (`/embed/ID`, not `/watch?v=ID`).

**A TikTok or Instagram post** — those block embedding, so link out instead:
`"href": "https://www.tiktok.com/@sam_yzx"` turns the tile into a link that
opens in a new tab.

## Adding projects

Edit `data/projects.js`:

```js
{
  "slug":  "project-name",
  "title": "Project Name",
  "year":  "2026",
  "blurb": "One or two sentences on what it is and what you learned.",
  "tags":  ["Python", "Hardware"],
  "href":  "https://github.com/samwoh05/repo-name",
  "cover": "assets/img/covers/python.svg"
}
```

`cover` is the image that follows your cursor when you hover the row. A project
with a `detail` array gets its own page at `project.html?p=slug`; one without
links straight to its `href`.

## The courses

`data/learning.js` holds them, newest first. A card carries the issuer, the
title as the certificate names it, the month, the certificate number and a
picture of the certificate itself:

```js
{
  "issuer": "Simplilearn SkillUp",
  "title":  "Digital Marketing Tools and Techniques",
  "done":   "June 2026",
  "code":   "10333384",
  "href":   "https://www.linkedin.com/in/…/recent-activity/documents/",
  "cover":  "assets/img/certs/digital-marketing-simplilearn.webp",
  "alt":    "What the certificate says, for anyone who can't see it",
  "took":   "One sentence on what it changed about how you read something ordinary."
}
```

`took` is the field that matters and the one that is still empty. A list of
course names proves attendance; that line proves thinking. The card renders
fine without it, so it can wait until the sentence is true.

An item marked `draft: true` renders with a dashed edge and a "To fill in"
chip, so nothing here can quietly ship looking like a qualification. Empty the
file and the section removes itself, heading and all.

**Adding a certificate picture.** Crop the viewer's chrome off first — a
screenshot with a fullscreen button in the corner reads as a screenshot, not a
credential. Save it to `assets/img/certs/` as WebP at about 900px wide.

## Changing the hero film

The hero plays `assets/video/street-loop.mp4`. To cut a new one, pick a single
continuous shot — a cut behind the headline reads as a glitch — with the
movement in the right half, no on-screen text, and no blown highlights in the
left third where the type sits:

```bash
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -ss 16.95 -t 3.85 -i source/video/YOUR.mov -an \
  -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart assets/video/street-loop.mp4
"$FF" -ss 17.1 -i source/video/YOUR.mov -frames:v 1 -vf "scale=1280:-2" \
  -q:v 5 assets/video/street-loop.jpg
```

Keep the poster from the same shot as the loop's first frame, or the still a
visitor sees before it plays will be a different picture from the one that
starts.

## Video

Films live in `assets/video/` as web-encoded MP4 with a poster frame beside
them; the full-quality masters stay in `source/video/` and are never deployed.

```bash
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -i source/video/YOUR.mov \
  -vf scale=-2:1080 -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart assets/video/your-film.mp4
```

`crf` is the quality dial — lower is better and larger, 23–26 is the useful
range for web. `+faststart` moves the index to the front of the file so
playback can begin before the download finishes. A poster frame can be grabbed
with `qlmanage -t -s 1400 -o . your-film.mp4`.

## Swapping the portraits

```bash
python3 tools/set-photos.py <hero-photo> <about-photo>
```

It converts (HEIC included), fixes phone rotation, resizes and saves both to
the right places. The hero is a film now rather than a portrait, so the photo
that matters here is the About one; `assets/img/badge.webp` — the face on the
staff pass — is cropped separately from `portrait.jpg`.

## Changing the words

Everything else — the headline, the about text, the stats, the footer — is
plain text in the HTML files. Search for the sentence you want to change and
type over it. The biography lives in `index.html` under `<!-- ==== 05 — about
==== -->`.

### Your links

Wired into three places on every page: the corner chrome, the overlay menu and
the footer's icon row.

| Where | Link |
|---|---|
| Instagram | https://www.instagram.com/eattohrepeat/ |
| Photography | https://www.instagram.com/samvisualdiary.jpg/ (linked from the gallery section) |
| TikTok | https://www.tiktok.com/@sam_yzx |
| GitHub | https://github.com/samwoh05 |
| LinkedIn | https://www.linkedin.com/in/samuel-yee-573164284/ |
| Spotify | https://open.spotify.com/user/samuelyee4385 |
| Email | samuelyee4385@gmail.com |

To change one, search the six `.html` files for the old URL and replace it.

---

## Putting it online

The site is published from GitHub
([samwoh05/Portfolio-Website-](https://github.com/samwoh05/Portfolio-Website-))
with GitHub Pages, deploying from `main` / root. To update it, commit and push
— in VS Code, **Source Control → Sync Changes**:

```bash
git add -A && git commit -m "Describe the change" && git push
```

The live site refreshes a minute or so later.

`.gitignore` keeps `source/` (the full-size originals), camera `.mov` exports,
`.claude/` and `.DS_Store` off GitHub. GitHub refuses any file over 100 MB, so
always re-encode a film (see *Video*) rather than committing the master.
`.nojekyll` tells Pages to serve the files as they are.

Because it's a plain static folder, Netlify, Vercel or Cloudflare Pages would
host it just as well: import the repo, no build command, output directory `/`.

---

## Notes

- **`source/`** holds the camera masters, the JPEG originals the WebP wall was
  made from, and ten frames the gallery never showed. Local only.
- **`assets/img/portrait.jpg`** is no longer used by any page — the hero is a
  film now. It stays because `badge.webp` was cropped from it.
- **Your email is published** on every page as a `mailto:` link. That's normal
  for a portfolio but it does attract spam — swap it for a contact form
  (Formspree, Tally) if that becomes annoying.
- The status line in the hero and the "Now learning" stat should say what is
  true this month. They are the two lines that date fastest.
- The cursor is a mosaic-tiled pixel arrow defined in `site.css`; links get a
  second variant. Both are inline SVG, so there is no image file to manage.
