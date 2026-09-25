# v2 — the market restyle

A second, complete version of the site that says something different: not
*engineer & photographer*, but an engineering graduate moving into marketing.
The root site is untouched. Nothing here is published.

Run it from the project root, not from this folder:

```bash
node .claude/serve.js
```

then open <http://localhost:4173/v2/>.

## How it relates to the site above it

`v2/` carries its own copy of everything small — the HTML, the stylesheets,
the scripts, the fonts and the data files — because it is a different version
of them, not a skin over the old one. It borrows only the heavy media, which
has not changed: the photographs, the video and the project shots are read
from `../assets/img`, `../assets/gallery` and `../assets/video`. That is why
the folder is about 560 KB rather than 33 MB.

If this version is approved, the contents of `v2/` replace the files at the
root and the folder goes away. Until then the two can be compared side by side.

## What changed

**The headline.** `SAMUEL / ENGINEER, / LEARNING / THE MARKET`. "Learning"
concedes the thing a reader works out anyway, which buys belief for the rest.
The status line names the move instead of stating availability in general.

**The running order.** Work first, because the strongest argument for the
change of direction is work already done, described for a different reader.
Then the statement band, then the two new sections, then the photographs, then
the biography.

| | Now | v2 |
|---|---|---|
| 01 | What I've been making | What I've built, and what it was for |
| 02 | What I've captured | Learning the market *(new)* |
| 03 | Start here | Notes *(new)* |
| 04 | What I keep doing | What I've captured |
| 05 | What's been playing | Start here |

## The look: tungsten & daylight

The first cut of this version kept the cream-and-terracotta poster look of the
site above it. That was wrong for what the page now claims. Warm cream with a
bold condensed display face and a terracotta accent is the house style of every
second portfolio on the internet right now — and a site arguing that its author
understands why people choose things cannot afford to look like every other
site in the pile. The old palette also tinted the photographs, which are the
one genuinely strong asset here.

So the ground is a cool near-black and the accents come from Samuel's own
trade. He programmed lighting rigs before he wanted to programme campaigns, and
the two colours are the two gels every lighting desk keeps: **CTO**, the orange
that warms a lamp to tungsten, and **CTB**, the blue that cools it to daylight.

Tungsten lights what he has made. Daylight lights what he is learning. The
statement band is the moment the colour temperature changes, and the page runs
cool from there to the footer. Nothing else on the page is saturated — the
photographs are the only full colour in the building, which is the entire
reason for mounting them on near-black instead of cream.

| Token | Light | Dark | Job |
|---|---|---|---|
| `--tungsten` | `#c97a16` | `#f2a544` | Display marks, the folder's lit edge, the lanyard |
| `--tungsten-deep` | `#95590a` | `#e8912e` | The same voice at 11px — 5.2:1 and 7.9:1 |
| `--tungsten-on-band` | `#f2a544` | `#f2a544` | Tungsten printed on a dark band; doesn't flip, because the band doesn't |
| `--daylight` | `#2c7fa8` | `#7fc2e6` | Everything below the statement |
| `--market-deep` | `#1b5e7e` | `#9ccfec` | Daylight at label size |
| `--daylight-band` | `#123a4e` | `#14303d` | The statement band and the footer |
| `--on-sheet-accent` | `#8a5108` | `#8a5108` | Tungsten printed on paper — one mix that clears 4.5:1 on all four sheet colours at 8.5px |

The old `--rust` and `--cobalt` names survive as aliases pointing at the new
colours, so every rule that already asked for them kept working.

## The type

Three faces, three jobs, all self-hosted and open-licensed. The site still
makes no third-party request for fonts.

- **Archivo** (variable, 400–800) for display. A broad grotesque instead of a
  condensed poster face: it states things rather than shouting them. It runs
  about a third wider than Anton did, so every display size came down and every
  headline got its tracking pulled in to −0.028em.
- **DM Sans** for running text, unchanged.
- **IBM Plex Mono** (400/500) for every label, number, date, caption and
  credit. This is the single biggest change on the page. Mono in the margins is
  what makes a layout read as *instrumented* rather than decorated, and it is
  the right face for a portfolio whose argument is that its author counts
  things.

Total type weight: **176 KB** across eight woff2 files, latin and latin-ext.

## What the redesign removed

| Cut | Why |
|---|---|
| The car driving down the page | The most student-reading thing on the site, and it argued against every other decision here |
| The ransom-note cut-out name | A zine device on a page that is now about precision. The name is simply set instead |
| The checkerboard dividers | Replaced by a measured rule — a hairline with a tick every 20px and a taller one every fifth |
| Six coloured gallery mounts | Every print is now on the same near-black card, separated by a hairline rather than by hue |
| The manila folder | Now a dark equipment case with one warm line where the lid folds down, so the files stay the brightest thing in it |
| `route.js`, `cutout.js`, Anton, Neucha | Nothing asks for them any more |

The film grain stayed. On a cream page it was paper texture; on this one it
reads as sensor noise, which is more true.

## The transition and the 404

Both were inherited from the cream version and both have been rebuilt, because
each was designed around an assumption this version no longer makes.

**The page transition.** The old one was a terracotta panel you were meant to
see. That works on a cream page; between two near-black ones it is a bright
flash, which is the exact problem the panel exists to solve. So the panel is
now painted in the page's own ground — `var(--bg)`, matching in either theme —
and is effectively invisible. What crosses the screen is its leading edge:
three pixels of tungsten with the glow they throw ahead, the way a moving light
crosses a stage. The blackout does the hiding; the filament does the telling.

It also travels now rather than growing. The old panel animated `scaleX`, which
squashes anything drawn on its edge; a filament under `scaleX` is a hairline at
the start and full width only at the end. It animates `translate` instead, so
the edge keeps its three pixels the whole way across. Timings are unchanged —
200ms in, 260ms out, nothing at all under reduced motion — so `transition.js`
needed no logic change, only a new description of what it drives.

**The 404.** "This one never developed" was a darkroom joke from the version
where photography was half the headline. It is a hobby here, so the page runs
on the trade Samuel actually practised: patching.

> **This channel isn't patched.**
> The address you asked for has moved, been renamed, or never existed. On a
> lighting desk that is an unpatched channel: the fader goes up and nothing
> comes on. Everything else is still where you left it.

Under it is a patch bay — the one genuinely useful thing on the page. It hands
back the address that was actually requested, in mono, next to an unlit lamp
and the word `Unpatched`. People mistype URLs, and seeing the string returned to
them is how they spot their own typo. It is written with `textContent`, never
`innerHTML`: that string comes from the URL bar, so it is the only content on
the site a stranger controls. It truncates at 64 characters and wraps anywhere,
so a long mistyped address cannot push the layout sideways.

The four ways out now run in the site's own order — Home, Projects, Gallery,
Email — rather than the order they were written in. Hovering one lights it
instead of washing it: the card goes to `--stock` with a tungsten heading, which
is the pairing this version uses everywhere something is picked out. Flooding
the card with tungsten, which is what the old rule did, would have put 13px type
on a 3.3:1 ground.

Three photographs still sit at the bottom. A dead end should be worth landing
on.

## Contrast

Audited on the live pages, every text node, both themes, six pages: **zero
failures**. The two hits the audit reports on `.ring__title` and `.ring__meta`
are the long-standing false positive — those sit on a gradient the checker
can't sample.

Re-audited after the 404 rebuild: still zero. Three fixes came out of that
audit rather than out of taste:
`.footer__nav a[aria-current]` was tungsten-on-paper printed on the dark footer
band at 3.6:1; `--on-sheet-accent` was 4.37:1 on the pass and the folder tabs
at 8.5px; the overlay menu's current-page marker had the same problem as the
footer's.

## What still needs Samuel

Two sections render from data files that currently hold **placeholders**, and
they say so on screen. A card marked `draft: true` renders with a dashed edge
and a "To fill in" chip, so nothing here can quietly ship looking like a
qualification. A section whose data file is empty removes itself, heading and
all.

- **`data/learning.js`** — the real course names, issuers, months and
  certificate links. The field that matters is `took`: one sentence on what the
  course changed about the way you look at something ordinary. A list of course
  names proves attendance; that line proves thinking.
- **`data/notes.js`** — one teardown, 300 words, on something you watched work.
  Worth more than every certificate above it. Start with one.

Also outstanding: a CV at `assets/cv.pdf` (the hero button is written and
commented out), and a read-through of the two new project beats to correct
anything misread.

## Cache stamps

Every stylesheet and script here is stamped `?v=v20001`. `tools/bump-cache.py`
only walks the root, so if this version is promoted, re-run it afterwards and
let it fingerprint the files properly.
