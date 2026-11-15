#!/usr/bin/env python3
"""Makes the small copies of the fonts that every page carries inside itself.

A page shows its first screen with only a part of each font, so that part rides in the page as data
(_plugins/inline_fonts.rb puts it there) and the first paint already has it: no wait for a font file, and
no flash of a system font. The whole fonts stay in assets/fonts/ for whatever the copies leave out.

- Crimson Text (normal, italic, semibold) gets a "basic" copy: the letters, digits and punctuation of
  English prose, with their ligatures and kerning. It is about two thirds the size of the whole font.
- JetBrains Mono gets a "labels" copy for tags, links and other labels: plain ASCII, without the code
  ligatures that labels never use. It is a quarter the size of the whole font. Code keeps the whole font.

Run it from the repository root after changing a font (needs fonttools and brotli):  python3 _tools/fonts.py
If you change BASIC, change the matching unicode-range in _includes/style.css too.
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
ASCII = list(range(0x20, 0x7F))
# ASCII; the no-break space, (c), (R), degree, middle dot and multiplication signs; accented small letters;
# en and em dashes, curly quotes and the ellipsis.
BASIC = ASCII + [0xA0, 0xA9, 0xAE, 0xB0, 0xB7, 0xD7, *range(0xE0, 0x100), 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026]


def copy(source, target, characters, ligatures):
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"] if ligatures else []
    options.layout_closure = ligatures
    # A copy keeps the whole font's glyph names and bounding box. Without either, macOS smooths its small text
    # a little differently; with both, it draws each letter on exactly the pixels the whole font does.
    options.glyph_names = True
    font = TTFont(source, recalcBBoxes=False, recalcTimestamp=False)  # Its own date too, so a rerun writes the same bytes.
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=characters)
    subsetter.subset(font)
    font.save(target)
    print(f"wrote {target.relative_to(ROOT)}: {target.stat().st_size} bytes, was {source.stat().st_size}")


if __name__ == "__main__":
    for face in ("normal", "italic", "semibold"):
        copy(FONTS / "crimson-text" / f"{face}-latin.woff2", FONTS / "crimson-text" / f"{face}-basic.woff2", BASIC, True)
    copy(FONTS / "jetbrains-mono" / "normal-latin.woff2", FONTS / "jetbrains-mono" / "labels.woff2", ASCII, False)
