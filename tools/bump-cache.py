#!/usr/bin/env python3
"""
Stamp a new version on the stylesheets and scripts.

    python3 tools/bump-cache.py

Every page links its CSS and JS with a `?v=YYYYMMDD` stamp. Browsers cache a
file by its whole address, so changing the stamp is what makes them fetch the
new one. Without it a visitor can end up running today's HTML against
yesterday's stylesheet, which looks broken rather than merely stale.

Run this whenever you change anything in assets/css/ or assets/js/ (or the
data files), before you commit. It rewrites the stamp in every .html file to
today's date, or to the date you pass as an argument.
"""

import datetime
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PATTERN = re.compile(r'((?:href|src)="(?:assets/(?:css|js)|data)/[a-z-]+\.(?:css|js))(?:\?v=\d+)?"')


def main():
    stamp = sys.argv[1] if len(sys.argv) > 1 else datetime.date.today().strftime("%Y%m%d")
    if not re.fullmatch(r"\d{8}", stamp):
        sys.exit("Give the stamp as YYYYMMDD, or pass nothing to use today.")

    total = 0
    for page in sorted(ROOT.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        new, count = PATTERN.subn(r'\1?v=' + stamp + '"', text)
        if new != text:
            page.write_text(new, encoding="utf-8")
        total += count
        print(f"{page.name:16s} {count} links -> ?v={stamp}")

    print(f"\n{total} links stamped. Commit and push, and every visitor gets the new files.")


if __name__ == "__main__":
    main()
