#!/usr/bin/env python3
"""
Swap the two portraits on the site.

    python3 tools/set-photos.py source/hero.jpg source/about.jpg

First argument goes in the hero panel, second in the About section. Handles
phone photos: HEIC is converted via sips, and EXIF rotation is baked in so
portrait shots don't land sideways.
"""

import os, sys, subprocess, tempfile
from PIL import Image, ImageOps

# The hero panel is a tall column; About is a 3:4 figure. Long-edge caps are
# 2x their largest on-screen size, which is plenty and keeps the files small.
TARGETS = [
    ("assets/img/portrait.jpg", 1600, 82),
    ("assets/img/about.jpg",    1200, 82),
]


def load(path):
    if path.lower().endswith((".heic", ".heif")):
        tmp = tempfile.mktemp(suffix=".jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", path, "--out", tmp],
                       check=True, capture_output=True)
        path = tmp
    im = Image.open(path)
    return ImageOps.exif_transpose(im).convert("RGB")   # honour phone rotation


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__.strip())
    for src, (dst, cap, q) in zip(sys.argv[1:3], TARGETS):
        if not os.path.exists(src):
            sys.exit("no such file: " + src)
        im = load(src)
        before = im.size
        if max(im.size) > cap:
            r = cap / max(im.size)
            im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        im.save(dst, "JPEG", quality=q, optimize=True, progressive=True)
        print("  %-26s %sx%s -> %sx%s  %.0f KB"
              % (dst, before[0], before[1], im.width, im.height,
                 os.path.getsize(dst) / 1024))

    # The hero used to point at a PNG; keep the markup honest about the format
    s = open("index.html").read()
    if "assets/img/profile.png" in s:
        open("index.html", "w").write(s.replace("assets/img/profile.png",
                                                "assets/img/portrait.jpg"))
        print("  index.html now points at assets/img/portrait.jpg")
    print("\nDone. Reload the page — you may want the hero crop retuned "
          "(.hero__media img { object-position } in site.css).")


if __name__ == "__main__":
    main()
