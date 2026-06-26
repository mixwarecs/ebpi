# /// script
# requires-python = ">=3.9"
# dependencies = ["requests"]
# ///
"""
Downloads the Portuguese ACF 2020 audio Bible from archive.org and saves each
chapter as  pt/{bookNumber}_{chapter}.mp3  (e.g. pt/1_1.mp3 = Gênesis 1).

Book numbers follow canonical Protestant order (1 = Gênesis … 66 = Apocalipse).

Filename pattern in archive:
  OT (books 1–39):  ACF2_B01C001.mp3
  NT (books 40–66): ACF_B40C001.mp3

Usage:
    uv run download_audio_pt.py

Resume-safe: skips files that already exist locally.
Parallel downloads: 5 concurrent connections (respectful of archive.org).
"""

from __future__ import annotations

import re
import sys
import time
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://archive.org/download/ACF_202011"
OUTPUT_DIR = Path("pt")
MAX_WORKERS = 5
TIMEOUT = 90


def get_file_list() -> list[str]:
    """Fetch the archive directory listing and return all MP3 filenames."""
    print("Fetching file list from archive.org...")
    resp = requests.get(f"{BASE_URL}/", timeout=30)
    resp.raise_for_status()
    return re.findall(r'href="(ACF2?_B\d+C\d+\.mp3)"', resp.text)


def parse_filename(name: str) -> tuple[int | None, int | None]:
    """
    Parse an archive filename into (book_number, chapter_number).

    Example: ACF2_B01C001.mp3  →  (1, 1)
             ACF_B40C003.mp3   →  (40, 3)
             ACF_B66C022.mp3   →  (66, 22)
    """
    m = re.match(r"^ACF2?_B(\d+)C(\d+)\.mp3$", name)
    if not m:
        return None, None
    return int(m.group(1)), int(m.group(2))


def download_file(filename: str, book_num: int, chapter: int) -> str:
    dest = OUTPUT_DIR / f"{book_num}_{chapter}.mp3"

    if dest.exists() and dest.stat().st_size > 0:
        return f"SKIP  {dest.name}"

    url = f"{BASE_URL}/{filename}"
    for attempt in range(1, 4):
        try:
            resp = requests.get(url, timeout=TIMEOUT, stream=True)
            resp.raise_for_status()
            with open(dest, "wb") as fh:
                for chunk in resp.iter_content(chunk_size=65_536):
                    fh.write(chunk)
            return f"OK    {dest.name}"
        except Exception as exc:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    filenames = get_file_list()
    print(f"Found {len(filenames)} MP3 files\n")

    tasks: list[tuple[str, int, int]] = []
    for filename in filenames:
        book_num, chapter = parse_filename(filename)
        if book_num is None:
            print(f"WARNING: could not parse '{filename}' — skipping")
            continue
        tasks.append((filename, book_num, chapter))

    tasks.sort(key=lambda t: (t[1], t[2]))

    total = len(tasks)
    done = 0
    errors = 0

    print(f"Downloading {total} files → {OUTPUT_DIR}/\n")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(download_file, fn, bn, ch): (fn, bn, ch)
            for fn, bn, ch in tasks
        }
        for future in as_completed(futures):
            fn, bn, ch = futures[future]
            try:
                label = future.result()
                done += 1
                print(f"[{done:4d}/{total}] {label}")
            except Exception as exc:
                errors += 1
                done += 1
                print(f"[{done:4d}/{total}] ERROR {fn}: {exc}", file=sys.stderr)

    print(f"\nFinished — {total - errors} succeeded, {errors} errors")
    print(f"Files saved to:  {OUTPUT_DIR.resolve()}/")
    print(f"\nGCS upload command:")
    print(f"  gsutil -m cp -r pt/ gs://YOUR_BUCKET_NAME/audio/")


if __name__ == "__main__":
    main()
