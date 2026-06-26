# /// script
# requires-python = ">=3.9"
# dependencies = ["requests"]
# ///
"""
Downloads a Spanish audio Bible and saves each chapter as:
  audio/es/{source}/{bookNumber}_{chapter}.{ext}

Sources:
  rv   — Reina Valera 1909 (archive.org)           → .mp3
  bll  — Biblia Libre Latinoamericana (publicdomainaudiobibles.com) → .m4a

Usage:
    uv run download_audio_es.py --source rv
    uv run download_audio_es.py --source bll

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

# BLL book mapping: canonical number → (abbreviation, chapter_count)
# Psalms uses 3-digit chapter numbers (001-150); all others use 2-digit (01-nn).
BLL_BOOKS = {
     1: ("GEN", 50),   2: ("EXO", 40),   3: ("LEV", 27),   4: ("NUM", 36),
     5: ("DEU", 34),   6: ("JOS", 24),   7: ("JDG", 21),   8: ("RUT",  4),
     9: ("1SA", 31),  10: ("2SA", 24),  11: ("1KI", 22),  12: ("2KI", 25),
    13: ("1CH", 29),  14: ("2CH", 36),  15: ("EZR", 10),  16: ("NEH", 13),
    17: ("EST", 10),  18: ("JOB", 42),  19: ("PSA",150),  20: ("PRO", 31),
    21: ("ECC", 12),  22: ("SNG",  8),  23: ("ISA", 66),  24: ("JER", 52),
    25: ("LAM",  5),  26: ("EZK", 48),  27: ("DAN", 12),  28: ("HOS", 14),
    29: ("JOL",  3),  30: ("AMO",  9),  31: ("OBA",  1),  32: ("JON",  4),
    33: ("MIC",  7),  34: ("NAM",  3),  35: ("HAB",  3),  36: ("ZEP",  3),
    37: ("HAG",  2),  38: ("ZEC", 14),  39: ("MAL",  4),  40: ("MAT", 28),
    41: ("MRK", 16),  42: ("LUK", 24),  43: ("JHN", 21),  44: ("ACT", 28),
    45: ("ROM", 16),  46: ("1CO", 16),  47: ("2CO", 13),  48: ("GAL",  6),
    49: ("EPH",  6),  50: ("PHP",  4),  51: ("COL",  4),  52: ("1TH",  5),
    53: ("2TH",  3),  54: ("1TI",  6),  55: ("2TI",  4),  56: ("TIT",  3),
    57: ("PHM",  1),  58: ("HEB", 13),  59: ("JAS",  5),  60: ("1PE",  5),
    61: ("2PE",  3),  62: ("1JN",  5),  63: ("2JN",  1),  64: ("3JN",  1),
    65: ("JUD",  1),  66: ("REV", 22),
}


def build_rv_tasks(output_dir: Path) -> list[tuple[str, Path]]:
    """Scrape archive.org listing and return (url, dest) pairs for RV source."""
    base = "https://archive.org/download/BibliaEnAudioRVA1909"
    print(f"Fetching file list from {base} ...")
    resp = requests.get(f"{base}/", timeout=30)
    resp.raise_for_status()
    filenames = re.findall(r'href="(\d{2}-[^"]+\.mp3)"', resp.text)
    print(f"Found {len(filenames)} MP3 files\n")

    tasks = []
    for fn in filenames:
        name = fn.replace("%20", " ")
        m = re.match(r"^(\d{2})-.*?(\d+)\.mp3$", name)
        if not m:
            print(f"WARNING: could not parse '{fn}' — skipping")
            continue
        book_num, chapter = int(m.group(1)), int(m.group(2))
        dest = output_dir / f"{book_num}_{chapter}.mp3"
        tasks.append((f"{base}/{fn}", dest))
    return tasks


def build_bll_tasks(output_dir: Path) -> list[tuple[str, Path]]:
    """Generate (url, dest) pairs for BLL source using the book lookup table."""
    base = "https://publicdomainaudiobibles.com/content/mp3/SPABLL"
    tasks = []
    for book_num, (abbr, num_chapters) in BLL_BOOKS.items():
        digits = 3 if num_chapters > 99 else 2
        for ch in range(1, num_chapters + 1):
            chapter_str = str(ch).zfill(digits)
            filename = f"{abbr}{chapter_str}.m4a"
            url = f"{base}/{filename}"
            dest = output_dir / f"{book_num}_{ch}.m4a"
            tasks.append((url, dest))
    return tasks


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
    parser = argparse.ArgumentParser(description="Download Spanish audio Bible chapters.")
    parser.add_argument(
        "--source",
        choices=["rv", "bll"],
        required=True,
        help="rv = Reina Valera 1909 (archive.org)  |  bll = Biblia Libre Latinoamericana (publicdomainaudiobibles.com)",
    )
    args = parser.parse_args()
    source = args.source

    output_dir = Path("audio") / "es" / source
    output_dir.mkdir(parents=True, exist_ok=True)

    tasks = build_rv_tasks(output_dir) if source == "rv" else build_bll_tasks(output_dir)
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
    print(f"  gsutil -m cp {output_dir}/* gs://dramatized_bible/audio/es/{source}/")


if __name__ == "__main__":
    main()
