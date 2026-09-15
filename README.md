# Samuel Yee — Portfolio

A three-page portfolio site. No build step, no framework, no `npm install`.
Plain HTML, CSS and JavaScript. No dependencies at all.

```
index.html          Home — hero, about, disciplines, teasers, music, contact
gallery.html        Photos + videos, filterable, with a lightbox
projects.html       Project list with cursor-following previews

data/gallery.js     ← the photos and videos you edit
data/projects.js    ← the projects you edit

assets/css/site.css   All styling
assets/js/site.js     Preloader, menu, scroll reveals, parallax, tilt, marquee
assets/js/route.js    The car that drives down the page as you scroll
assets/js/gallery.js  Builds the gallery posters + lightbox
assets/js/projects.js Builds the project list
assets/gallery/       Your photos
assets/img/           Portrait, about photo, project covers

assets/img/car.png    The car on the scroll route (masked, transparent)
tools/set-photos.py   Swaps the two portraits (see below)
source/               Full-size originals — not used by the site
```

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

1. Drop the image into `assets/gallery/`.
2. Open `data/gallery.js` and add an entry to the `items` list:

```js
{
  "type":   "photo",
  "src":    "assets/gallery/blue-hour.jpg",
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
sips -g pixelWidth -g pixelHeight "assets/gallery/blue-hour.jpg"
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

Fonts load from Google Fonts, so type falls back to system faces offline.
Everything else works with no connection at all.

---

## Notes

- **`assets/gallery/g6.jpg`** is a near-duplicate of `g5.jpg` (same scene, from
  your old site) and is deliberately left out of the gallery. Delete it, or add
  it to `data/gallery.js` if you prefer that frame.
- **Your email is published** on every page as a `mailto:` link. That's normal
  for a portfolio but it does attract spam — swap it for a contact form
  (Formspree, Tally) if that becomes annoying.
- The about text says you *studied* at Nanyang Polytechnic. Your old site said
  "on the verge of graduating", which was written in 2024 — update it to
  whatever's true now.
- Motion respects `prefers-reduced-motion`.
- The cursor is a mosaic-tiled pixel arrow defined in `site.css`; links get a
  cobalt variant. Both are inline SVG, so there is no image file to manage.
