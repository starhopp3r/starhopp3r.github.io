#!/usr/bin/env python3
"""Makes the small, sharp copies of every image that the site serves.

A browser then fetches only the copy that fits its screen, so a post loads a few hundred kilobytes of
images instead of tens of megabytes.

- Post images (assets/img/*.png, *.jpg, *.jpeg) get WebP copies in assets/img/sized/, at the widths the
  reading column shows them on phones and on ordinary and sharp screens; the largest is for the image
  viewer. Each copy keeps the original's colour profile. _data/images.yml lists the copies, and
  _plugins/responsive_images.rb puts them on the post's <img> tags.
- Book covers (assets/img/books/) get 2:3 WebP copies at exactly the sizes the shelf shows them (148px,
  and two, three and four times that), so the small text on a cover stays sharp.

Run it from the repository root after adding or changing an image (needs Pillow):  python3 _tools/images.py
It only remakes copies that are missing or older than their original, and it deletes copies whose
original is gone. Jekyll skips folders that start with an underscore, so this script is never published.
"""
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "assets" / "img"
SIZED = IMAGES / "sized"
BOOKS = IMAGES / "books"
MANIFEST = ROOT / "_data" / "images.yml"
SOURCES = {".png", ".jpg", ".jpeg"}
POST_WIDTHS = (480, 736, 1104, 1472, 2208)
COVER_WIDTHS = (148, 296, 444, 592)
COVER_COPY = re.compile(r"-(?:%s)$" % "|".join(map(str, COVER_WIDTHS)))


def load(path):
    """Opens an image upright, as RGB, or as RGBA when it has real transparency, with its colour profile."""
    with Image.open(path) as original:
        icc = original.info.get("icc_profile")
        image = ImageOps.exif_transpose(original)
        transparent = image.mode in ("RGBA", "LA", "PA") or "transparency" in image.info
        image = image.convert("RGBA" if transparent else "RGB")
    if transparent and image.getchannel("A").getextrema() == (255, 255):
        image = image.convert("RGB")
    return image, icc


def webp(image, icc, **options):
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", icc_profile=icc, **options)
    return buffer.getvalue()


def stale(target, source):
    return not target.exists() or target.stat().st_mtime < source.stat().st_mtime


def post_widths(width):
    """The standard widths an image can fill, then its own width, up to the largest standard one."""
    widths = [step for step in POST_WIDTHS if step < width * 0.9]
    top = min(width, POST_WIDTHS[-1])
    return widths if top in widths else widths + [top]


def post_images():
    manifest, keep = {}, set()
    SIZED.mkdir(exist_ok=True)
    for source in sorted(IMAGES.iterdir()):
        if source.suffix.lower() not in SOURCES:
            continue
        with Image.open(source) as original:
            width, height = ImageOps.exif_transpose(original).size
        widths = post_widths(width)
        image = icc = None
        for copy_width in widths:
            target = SIZED / f"{source.stem}-{copy_width}.webp"
            keep.add(target)
            if not stale(target, source):
                continue
            if image is None:
                image, icc = load(source)
            copy = image.resize((copy_width, round(height * copy_width / width)), Image.Resampling.LANCZOS)
            # Lossless wins only on flat drawings; photos and screenshots are far smaller lossy.
            lossy = webp(copy, icc, quality=85, method=6)
            lossless = webp(copy, icc, lossless=True, quality=80, method=4)
            target.write_bytes(min(lossy, lossless, key=len))
            print(f"wrote {target.relative_to(ROOT)}")
        manifest[f"/{source.relative_to(ROOT).as_posix()}"] = {"width": width, "height": height, "copies": widths}
    for copy in SIZED.glob("*.webp"):
        if copy not in keep:
            copy.unlink()
            print(f"deleted {copy.relative_to(ROOT)}")
    lines = ["# Made by _tools/images.py, which lists every post image's size and the widths of its WebP copies."]
    lines += [f"{json.dumps(path)}: {json.dumps(entry)}" for path, entry in manifest.items()]
    text = "\n".join(lines) + "\n"
    if not MANIFEST.exists() or MANIFEST.read_text() != text:
        MANIFEST.write_text(text)
        print(f"wrote {MANIFEST.relative_to(ROOT)}")


def crop_to_board(image):
    """Trims a cover to 2:3 around its centre, as the shelf would."""
    width, height = image.size
    if width * 3 > height * 2:
        trimmed = height * 2 // 3
        left = (width - trimmed) // 2
        return image.crop((left, 0, left + trimmed, height))
    trimmed = width * 3 // 2
    top = (height - trimmed) // 2
    return image.crop((0, top, width, top + trimmed))


def book_covers():
    sources = {path.stem: path for path in BOOKS.iterdir() if path.suffix.lower() in SOURCES}
    for stem, source in sorted(sources.items()):
        cover = icc = None
        for width in COVER_WIDTHS:
            target = source.with_name(f"{stem}-{width}.webp")
            if not stale(target, source):
                continue
            if cover is None:
                image, icc = load(source)
                cover = crop_to_board(image.convert("RGB"))
            target.write_bytes(webp(cover.resize((width, width * 3 // 2), Image.Resampling.LANCZOS), icc, quality=90, method=6))
            print(f"wrote {target.relative_to(ROOT)}")
    for copy in BOOKS.glob("*.webp"):
        if COVER_COPY.search(copy.stem) and COVER_COPY.sub("", copy.stem) not in sources:
            copy.unlink()
            print(f"deleted {copy.relative_to(ROOT)}")


if __name__ == "__main__":
    post_images()
    book_covers()
