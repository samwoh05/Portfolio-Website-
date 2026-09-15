# Project photos

All ten are in and live. Filenames are `.webp`, matched to entries in
`data/projects.js`.

## S.O.N.I.C  ->  project.html?p=sonic
| File | Caption on the page |
|---|---|
| `sonic-1-shuriken-placeholder.webp` | Shuriken placeholder |
| `sonic-2-raspberry-pi.webp`         | Raspberry Pi configuration |
| `sonic-3-target-boards.webp`        | Sensory target boards |

## NYP Open House  ->  project.html?p=nyp-open-house
| File | Caption on the page |
|---|---|
| `openhouse-1-end-product.webp`        | End product |
| `openhouse-2-tunnel-entrance.webp`    | Tunnel entrance |
| `openhouse-3-patching-led-tubes.webp` | Patching the LED tubes |
| `openhouse-4-black-cloth.webp`        | Laying black cloth over the structure |
| `openhouse-5-building-structure.webp` | Building the LED tunnel |
| `openhouse-6-power-dmx-cables.webp`   | Managing power and DMX |
| `openhouse-7-teardown-fixtures.webp`  | Tearing down from the classroom |

## Adding more later
Drop the file in this folder and add an entry to that project's `shots` array
in `data/projects.js`:

    { "src": "assets/img/projects/<file>", "title": "Short title",
      "caption": "One or two sentences.", "alt": "What is in the photo" }

No sizes needed - each frame reads the photo's own dimensions. A file that is
not there yet is skipped rather than showing a broken frame.
