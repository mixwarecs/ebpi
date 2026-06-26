# /// script
# requires-python = ">=3.9"
# dependencies = ["requests"]
# ///
"""
Downloads an English audio Bible and saves each chapter as:
  audio/{source}/{bookNumber}_{chapter}.mp3

Sources:
  kjv  — KJV Dramatized (archive.org)   archive format: A01___01_Genesis_____ENGKJVO2DA.mp3
  msb  — MSB Dramatized (openbible.com) archive format: MSB_01_Gen_001_D.mp3

Usage:
    uv run download_audio_en.py --source kjv
    uv run download_audio_en.py --source msb

Resume-safe: skips files that already exist locally.
Parallel downloads: 5 concurrent connections.
"""

from __future__ import annotations

import re
import sys
import time
import argparse
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

MAX_WORKERS = 5
TIMEOUT = 90

SOURCES = {
    "kjv": {
        "base_url": "https://archive.org/download/kjvaudiodramatized1",
        "pattern": r'href="([AB]\d+___\d+_[^"]+\.mp3)"',
    },
    "msb": {
        "base_url": "https://openbible.com/audio/msb",
        "pattern": r'href="(MSB_\d+_[A-Za-z0-9]+_\d+_D\.mp3)"',
    },
}

# KJV archive book codes → canonical book numbers (1-66)
# OT: A01–A39 → 1–39  |  NT: B01–B27 → 40–66
KJV_BOOK_CODE_MAP = {
    **{f"A{i:02d}": i      for i in range(1, 40)},
    **{f"B{i:02d}": i + 39 for i in range(1, 28)},
}


def get_file_list(source: str) -> list[str]:
    cfg = SOURCES[source]
    print(f"Fetching file list from {cfg['base_url']} ...")
    resp = requests.get(f"{cfg['base_url']}/", timeout=30)
    resp.raise_for_status()
    return re.findall(cfg["pattern"], resp.text)


def parse_filename(name: str, source: str) -> tuple[int | None, int | None]:
    """Return (book_number, chapter_number) for a given archive filename."""
    if source == "kjv":
        # A01___02_Genesis_____ENGKJVO2DA.mp3  →  (1, 2)
        # B27___22_Revelation__ENGKJVN2DA.mp3  →  (66, 22)
        m = re.match(r"^([AB]\d+)___(\d+)_", name)
        if not m:
            return None, None
        book_num = KJV_BOOK_CODE_MAP.get(m.group(1))
        return book_num, int(m.group(2))

    if source == "msb":
        # MSB_01_Gen_001_D.mp3  →  (1, 1)
        # MSB_66_Rev_022_D.mp3  →  (66, 22)
        m = re.match(r"^MSB_(\d+)_[A-Za-z0-9]+_(\d+)_D\.mp3$", name)
        if not m:
            return None, None
        return int(m.group(1)), int(m.group(2))

    return None, None


def download_file(url: str, dest: Path) -> str:
    if dest.exists() and dest.stat().st_size > 0:
        return f"SKIP  {dest.name}"

    for attempt in range(1, 4):
        try:
            resp = requests.get(url, timeout=TIMEOUT, stream=True)
            resp.raise_for_status()
            with open(dest, "wb") as fh:
                for chunk in resp.iter_content(chunk_size=65_536):
                    fh.write(chunk)
            return f"OK    {dest.name}"
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def main():
    parser = argparse.ArgumentParser(description="Download English audio Bible chapters.")
    parser.add_argument(
        "--source",
        choices=["kjv", "msb"],
        required=True,
        help="kjv = KJV Dramatized (archive.org)  |  msb = MSB Dramatized (openbible.com)",
    )
    args = parser.parse_args()
    source = args.source

    output_dir = Path("audio") / "en" / source
    output_dir.mkdir(parents=True, exist_ok=True)

    filenames = get_file_list(source)
    print(f"Found {len(filenames)} MP3 files\n")

    base_url = SOURCES[source]["base_url"]
    tasks: list[tuple[str, Path]] = []
    for filename in filenames:
        book_num, chapter = parse_filename(filename, source)
        if book_num is None:
            print(f"WARNING: could not parse '{filename}' — skipping")
            continue
        dest = output_dir / f"{book_num}_{chapter}.mp3"
        tasks.append((f"{base_url}/{filename}", dest))

    tasks.sort(key=lambda t: t[1].name)

    total = len(tasks)
    done = 0
    errors = 0

    print(f"Downloading {total} files → {output_dir}/\n")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(download_file, url, dest): (url, dest)
            for url, dest in tasks
        }
        for future in as_completed(futures):
            url, dest = futures[future]
            try:
                label = future.result()
                done += 1
                print(f"[{done:4d}/{total}] {label}")
            except Exception as exc:
                errors += 1
                done += 1
                print(f"[{done:4d}/{total}] ERROR {dest.name}: {exc}", file=sys.stderr)

    print(f"\nFinished — {total - errors} succeeded, {errors} errors")
    print(f"Files saved to: {output_dir.resolve()}/")
    print(f"\nGCS upload command:")
    print(f"  gsutil -m cp {output_dir}/*.mp3 gs://dramatized_bible/audio/{source}/")


if __name__ == "__main__":
    main()
