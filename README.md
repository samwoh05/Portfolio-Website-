# Samuel Yee — Portfolio

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

data/gallery.js     ← the photos and videos you edit
data/projects.js    ← the projects you edit

assets/css/site.css   All styling
assets/css/fonts.css  The three self-hosted faces
assets/js/site.js     Preloader, cursor, menu, scroll reveals, parallax, tilt
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
assets/img/           Portrait, about photo, project covers
assets/video/         Web-encoded films + their poster frames
assets/fonts/         Anton, DM Sans, Neucha

assets/img/car.png    The car on the scroll route (masked, transparent)
tools/set-photos.py   Swaps the two portraits (see below)
source/               Full-size originals — never published
```

---

## Spec sheet

Measured from the published site, September 2026. **87 files, 32.4 MB**, of
which 27.5 MB is video.

### Pages

| File | What it holds | Lines | Size |
|---|---|---:|---:|
| `index.html` | Hero, about, four hobby tiles, the photo ring, project teaser, contact | 375 | 21 KB |
| `privacy.html` | Privacy notice | 172 | 13 KB |
| `gallery.html` | The full wall, grouped by set, with filters and a lightbox | 154 | 12 KB |
| `projects.html` | Project list; the cover follows the cursor down the page | 139 | 11 KB |
| `project.html` | One project, chosen by `?p=slug` | 110 | 10 KB |

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
files to manage. `site.css` is 2,656 lines / 145 KB, which GitHub Pages gzips
to 24 KB.

### Behaviour

Ten modules, 69 KB in total, no dependencies.

| Module | What it does | Lines |
|---|---|---:|
| `site.js` | Preloader, custom cursor, overlay menu, scroll reveal, parallax, tilt | 285 |
| `ring.js` | The photo ring on the home page | 265 |
| `gallery.js` | Builds the wall from data, filters it, runs the lightbox | 240 |
| `decrypt.js` | "Say Hello" scrambles and settles on every load | 232 |
| `project-detail.js` | Renders one project from the slug in the address | 195 |
| `route.js` | A car that winds down the page behind everything as you scroll | 138 |
| `folder.js` | The project folder that opens on the home page | 137 |
| `projects.js` | Project list with a cover that follows the cursor | 114 |
| `split.js` | Splits a line into letters so each rises out of its own mask | 110 |
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
edge. Project stills: 10 WebP, 1.7 MB. The first four frames load eagerly and
the rest lazily; every frame carries its own aspect ratio so nothing jumps as it
arrives.

### Access

- Reduced motion is honoured in 10 stylesheet blocks and 8 of the 10 modules —
  the ring stops drifting, letters stop scrambling, the car stops driving.
- Six `:focus-visible` rules; the ring brings a focused card round to the front;
  the lightbox takes <kbd>Esc</kbd>, <kbd>←</kbd> and <kbd>→</kbd>.
- Scrambling letters are hidden from screen readers and the real words read out
  once. Every photograph carries alt text and every control a label.
- Soft ink sits at the darkest point where 10px type still clears 4.5:1 on all
  four grounds.

### Hosting

GitHub Pages, branch `main` / root, no build. No CDN, analytics, tracker or
cookies — every byte comes from the same origin. Needs custom properties, grid,
3D transforms and `IntersectionObserver`; where the observer is missing the ring
simply stays awake. See [Putting it online](#putting-it-online) for the details.

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
