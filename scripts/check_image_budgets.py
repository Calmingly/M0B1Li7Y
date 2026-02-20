#!/usr/bin/env python3
import argparse
from pathlib import Path
import sys


def parse_args():
    parser = argparse.ArgumentParser(description="Validate routine image size budgets.")
    parser.add_argument("--dir", default="img", help="Image directory to scan (default: img)")
    parser.add_argument("--max-per-image-kb", type=int, default=150, help="Max allowed size per image in KB")
    parser.add_argument("--max-total-kb", type=int, default=2048, help="Max allowed total size in KB")
    return parser.parse_args()


def main():
    args = parse_args()
    base = Path(args.dir)
    if not base.exists() or not base.is_dir():
        print(f"Image directory not found: {base}")
        return 2

    allowed_ext = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"}
    files = sorted([p for p in base.iterdir() if p.is_file() and p.suffix.lower() in allowed_ext])

    if not files:
        print("No image files found.")
        return 0

    max_per_bytes = args.max_per_image_kb * 1024
    max_total_bytes = args.max_total_kb * 1024

    total_bytes = 0
    oversized = []

    print("Image size report:")
    for file_path in files:
        size = file_path.stat().st_size
        total_bytes += size
        size_kb = size / 1024
        print(f"- {file_path.name}: {size_kb:.1f} KB")
        if size > max_per_bytes:
            oversized.append((file_path.name, size_kb))

    print(f"Total: {total_bytes / 1024:.1f} KB")

    failed = False
    if oversized:
        failed = True
        print(f"\nFAIL: {len(oversized)} image(s) exceed per-file budget of {args.max_per_image_kb} KB")
        for name, size_kb in oversized:
            print(f"  - {name}: {size_kb:.1f} KB")

    if total_bytes > max_total_bytes:
        failed = True
        print(f"\nFAIL: Total image budget exceeded ({total_bytes / 1024:.1f} KB > {args.max_total_kb} KB)")

    if failed:
        return 1

    print("\nPASS: Image budgets are within limits.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
