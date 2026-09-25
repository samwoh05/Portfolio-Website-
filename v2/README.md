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
the folder is about 500 KB rather than 33 MB.

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

**Colour carries the argument.** Terracotta marks what was made; cobalt marks
what is being learned. The statement band is the hinge, and everything below it
runs cobalt through to the footer. No new hue was invented — `--cobalt` was
already in the palette and barely spent. Three aliases (`--market`,
`--market-deep`, `--market-band`) give it a job, and `.section--market` re-binds
`--accent`, so every label, rule and arrow inside those sections follows
without being told twice. Small cobalt type gets a lighter mix after dark
(`#9db4ff`, 9.4:1 on the night ground) because `--cobalt-deep` would disappear.

**One new beat on the projects.** `"What it was for"` on S.O.N.I.C and the NYP
Open House tunnel. Nothing invented — the same work, described as the problem
it was actually solving. The tunnel is the important one: an open house is a
competition for attention, and the tunnel existed to make one corridor more
attractive to walk down than the one beside it. That is the pivot argued
without a single claimed qualification.

## What was cut

| Cut | Why |
|---|---|
| Section 05, both Spotify embeds | The site's only third-party requests, sitting between the work and the contact details |
| Cooking and Gaming tiles | Two of four hobby cards pulled against the claim; one line in the About keeps the warmth |
| Primary and secondary school | A ladder reaching back to primary school reads as a school assignment |
| "photographer" from the H1 | Demoted from half the headline to its own section, where it does more work |
| "Wherever you go, there you are" | The loudest sentence on the page said nothing about him. Now: *People buy what it says about them* |
| ~26 KB of CSS | The tile glazes and the music grid had nothing left to paint |

Kept, deliberately: the lanyard, the project folder, the photo ring, the
cut-out name, the page wipe and both themes. An employer looking at a
hand-written site with no framework and no build step is looking at evidence
that ideas get finished here. That is the one thing a template cannot produce.

The privacy notice was rewritten too. It described a Spotify player that this
version no longer loads, and a privacy page that describes the wrong thing is
worse than none.

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
