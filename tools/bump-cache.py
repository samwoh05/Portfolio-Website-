#!/usr/bin/env python3
"""
Stamp the stylesheets and scripts with a fingerprint of their own contents.

    python3 tools/bump-cache.py

Every page links its CSS and JS with a `?v=` stamp. Browsers cache a file by
its whole address, so changing the stamp is what makes them fetch the new one.
Without it a visitor can end up running today's HTML against yesterday's
stylesheet, which looks broken rather than merely stale.

The stamp is a short hash of everything in assets/css/, assets/js/ and data/.
It was a date once, which failed the first time the site was deployed twice in
one day: the files changed, the stamp didn't, and browsers kept the old copy.
A fingerprint can't drift out of step with the files, and re-running this after
no change rewrites nothing.

Run it whenever you change anything under those folders, before you commit.
"""

import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
WATCHED = ["assets/css/*.css", "assets/js/*.js", "data/*.js"]
PATTERN = re.compile(
    r'((?:href|src)="(?:assets/(?:css|js)|data)/[a-z-]+\.(?:css|js))(?:\?v=[0-9a-z]+)?"'
)


def fingerprint():
    """One short hash over every file a page links to."""
    digest = hashlib.md5()
    files = sorted(f for pattern in WATCHED for f in ROOT.glob(pattern))
    for f in files:
        digest.update(f.name.encode())
        digest.update(f.read_bytes())
    return digest.hexdigest()[:8], len(files)


def main():
    stamp, counted = (sys.argv[1], 0) if len(sys.argv) > 1 else fingerprint()
    if not re.fullmatch(r"[0-9a-z]{4,16}", stamp):
        sys.exit("A stamp must be 4-16 lowercase letters or digits.")

    total = touched = 0
    for page in sorted(ROOT.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        new, count = PATTERN.subn(r'\1?v=' + stamp + '"', text)
        total += count
        if new != text:
            page.write_text(new, encoding="utf-8")
            touched += 1
        print(f"  {page.name:16s} {count} links")

    if counted:
        print(f"\nFingerprint of {counted} files: {stamp}")
    if touched:
        print(f"{total} links stamped across {touched} page(s). Commit and push, "
              "and every visitor gets the new files.")
    else:
        print(f"\nNothing changed — the files still fingerprint to {stamp}.")


if __name__ == "__main__":
    main()
