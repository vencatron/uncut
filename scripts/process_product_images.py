#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import warnings
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, UnidentifiedImageError

try:
    from duckduckgo_search import DDGS
except Exception:  # noqa: BLE001
    DDGS = None

try:
    import imagehash
except Exception:  # noqa: BLE001
    imagehash = None

STORE_URL = "https://uncutpackaging.com"
COLLECTIONS = [
    "aprons-gowns-coats",
    "foot-protection",
    "gloves",
    "head-eye",
    "tape",
]
OUTPUT_DIR = Path("public/processed-products")
MAP_PATH = Path("data/processed-image-map.json")
REPORT_PATH = Path("data/processed-image-report.json")
USER_AGENT = "UncutImageProcessor/2.0"

warnings.filterwarnings(
    "ignore",
    message=".*duckduckgo_search.*renamed to `ddgs`.*",
    category=RuntimeWarning,
)


@dataclass
class ImageTask:
    src: str
    title: str
    vendor: str
    handle: str
    width: int
    height: int


@dataclass
class DownloadedImage:
    url: str
    image: Image.Image

    @property
    def area(self) -> int:
        return self.image.width * self.image.height


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download and process all product images for this storefront."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Reprocess images even if output files already exist.",
    )
    parser.add_argument(
        "--min-clean-size",
        type=int,
        default=1200,
        help="Upscale images until the longest side reaches this size.",
    )
    parser.add_argument(
        "--web-fallback",
        action="store_true",
        help="Try internet search fallback for low-quality images.",
    )
    parser.add_argument(
        "--max-web-fallback",
        type=int,
        default=15,
        help="Maximum number of low-quality images to attempt web replacement for.",
    )
    return parser.parse_args()


def fetch_json(url: str) -> dict:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:48] or "image"


def collect_image_tasks() -> List[ImageTask]:
    products_by_id: Dict[int, dict] = {}

    for handle in COLLECTIONS:
        url = f"{STORE_URL}/collections/{handle}/products.json?limit=250"
        payload = fetch_json(url)
        for product in payload.get("products", []):
            products_by_id[product["id"]] = product

    seen_sources: Set[str] = set()
    tasks: List[ImageTask] = []

    for product in products_by_id.values():
        title = str(product.get("title") or "").strip()
        vendor = str(product.get("vendor") or "").strip()
        handle = str(product.get("handle") or "").strip()
        for image in product.get("images", []):
            src = image.get("src")
            if not isinstance(src, str) or not src or src in seen_sources:
                continue

            seen_sources.add(src)
            tasks.append(
                ImageTask(
                    src=src,
                    title=title,
                    vendor=vendor,
                    handle=handle,
                    width=int(image.get("width") or 0),
                    height=int(image.get("height") or 0),
                )
            )

    return tasks


def make_output_name(src: str) -> str:
    parsed = urlparse(src)
    stem = slugify(Path(parsed.path).stem)
    digest = hashlib.sha1(src.encode("utf-8")).hexdigest()[:12]

    return f"{stem}-{digest}.webp"


def load_remote_image(url: str) -> Optional[DownloadedImage]:
    try:
        req = Request(url, headers={"User-Agent": USER_AGENT})
        with urlopen(req, timeout=30) as response:
            raw = response.read()
        with Image.open(BytesIO(raw)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            return DownloadedImage(url=url, image=image)
    except Exception:  # noqa: BLE001
        return None


def shopify_hires_candidates(src: str) -> List[str]:
    parsed = urlparse(src)
    if "cdn.shopify.com" not in parsed.netloc:
        return []

    path = parsed.path
    suffix = f"?{parsed.query}" if parsed.query else ""
    stem_path, ext = path.rsplit(".", 1)
    sizes = ["2048x2048", "1600x1600", "1200x1200", "1024x1024", "800x800"]
    candidates: List[str] = []

    for size in sizes:
        candidates.append(f"{parsed.scheme}://{parsed.netloc}{stem_path}_{size}.{ext}{suffix}")

    return candidates


def choose_best_shopify_source(base: DownloadedImage, src: str) -> Tuple[DownloadedImage, bool]:
    best = base
    improved = False

    for candidate_url in shopify_hires_candidates(src):
        candidate = load_remote_image(candidate_url)
        if candidate is None:
            continue

        if candidate.area > int(best.area * 1.15):
            best = candidate
            improved = True

    return best, improved


def is_low_quality(image: Image.Image) -> bool:
    long_side = max(image.width, image.height)
    short_side = min(image.width, image.height)
    return long_side < 700 or short_side < 450


def needs_web_fallback(image: Image.Image) -> bool:
    long_side = max(image.width, image.height)
    short_side = min(image.width, image.height)
    return long_side <= 260 or short_side <= 200


def perceptual_match_distance(a: Image.Image, b: Image.Image) -> Optional[int]:
    if imagehash is None:
        return None
    try:
        return int(imagehash.phash(a) - imagehash.phash(b))
    except Exception:  # noqa: BLE001
        return None


def find_web_replacement(task: ImageTask, reference: Image.Image) -> Optional[DownloadedImage]:
    if DDGS is None or imagehash is None:
        return None

    query_parts = [task.title, task.vendor, "PPE product photo"]
    query = " ".join([part for part in query_parts if part]).strip()

    ref_ratio = reference.width / max(reference.height, 1)
    best: Optional[DownloadedImage] = None
    best_score = -1

    try:
        with DDGS() as ddgs:
            results = ddgs.images(
                keywords=query,
                max_results=20,
                safesearch="moderate",
            )

            for result in results:
                image_url = result.get("image")
                if not isinstance(image_url, str) or not image_url.startswith("http"):
                    continue

                candidate = load_remote_image(image_url)
                if candidate is None:
                    continue

                long_side = max(candidate.image.width, candidate.image.height)
                if long_side < 900:
                    continue

                cand_ratio = candidate.image.width / max(candidate.image.height, 1)
                if abs(cand_ratio - ref_ratio) > 0.45:
                    continue

                dist = perceptual_match_distance(reference, candidate.image)
                if dist is None or dist > 10:
                    continue

                score = candidate.area - (dist * 50000)
                if score > best_score:
                    best = candidate
                    best_score = score
    except Exception:  # noqa: BLE001
        return None

    return best


def clean_product_image(image: Image.Image, min_clean_size: int) -> Tuple[Image.Image, bool]:
    working = image.copy()
    upscaled = False

    long_side = max(working.width, working.height)
    if long_side < min_clean_size:
        factor = min_clean_size / max(long_side, 1)
        new_size = (
            max(1, int(round(working.width * factor))),
            max(1, int(round(working.height * factor))),
        )
        working = working.resize(new_size, Image.Resampling.LANCZOS)
        upscaled = True

    working = working.filter(ImageFilter.MedianFilter(size=3))
    working = ImageOps.autocontrast(working, cutoff=1)
    working = ImageEnhance.Brightness(working).enhance(1.03)
    working = ImageEnhance.Contrast(working).enhance(1.08)
    working = ImageEnhance.Sharpness(working).enhance(1.2 if upscaled else 1.1)

    red, green, blue = working.split()
    red = red.point(lambda channel: 255 if channel >= 248 else channel)
    green = green.point(lambda channel: 255 if channel >= 248 else channel)
    blue = blue.point(lambda channel: 255 if channel >= 248 else channel)

    return Image.merge("RGB", (red, green, blue)), upscaled


def write_map(image_map: Dict[str, str]) -> None:
    ordered = dict(sorted(image_map.items(), key=lambda kv: kv[0]))
    MAP_PATH.parent.mkdir(parents=True, exist_ok=True)
    MAP_PATH.write_text(json.dumps(ordered, indent=2) + "\n", encoding="utf-8")


def write_report(rows: List[dict]) -> None:
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")


def run(force: bool, min_clean_size: int, web_fallback: bool, max_web_fallback: int) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    tasks = collect_image_tasks()

    if not tasks:
        print("No product images found.")
        write_map({})
        write_report([])
        return

    if web_fallback and (DDGS is None or imagehash is None):
        print("Web fallback requested but dependencies unavailable; continuing without it.")
        web_fallback = False

    image_map: Dict[str, str] = {}
    report_rows: List[dict] = []
    failed: List[Tuple[str, str]] = []
    web_attempts = 0
    web_replaced = 0
    upscaled_count = 0
    shopify_upgraded_count = 0

    print(f"Processing {len(tasks)} unique product images...")

    for idx, task in enumerate(tasks, start=1):
        filename = make_output_name(task.src)
        output_path = OUTPUT_DIR / filename
        mapped_src = f"/processed-products/{filename}"

        if output_path.exists() and not force:
            image_map[task.src] = mapped_src
            report_rows.append(
                {
                    "src": task.src,
                    "mapped_src": mapped_src,
                    "status": "skipped_existing",
                    "product_title": task.title,
                    "product_handle": task.handle,
                }
            )
            print(f"[{idx}/{len(tasks)}] ↷ {Path(urlparse(task.src).path).name}", flush=True)
            continue

        try:
            base = load_remote_image(task.src)
            if base is None:
                raise UnidentifiedImageError("Unable to download/decode source image.")

            chosen, shopify_improved = choose_best_shopify_source(base, task.src)
            if shopify_improved:
                shopify_upgraded_count += 1

            source_stage = "shopify_hires" if shopify_improved else "original"
            web_used = False

            if web_fallback and needs_web_fallback(chosen.image) and web_attempts < max_web_fallback:
                web_attempts += 1
                candidate = find_web_replacement(task, chosen.image)
                if candidate and candidate.area > int(chosen.area * 1.15):
                    chosen = candidate
                    source_stage = "web_fallback"
                    web_replaced += 1
                    web_used = True

            cleaned, upscaled = clean_product_image(chosen.image, min_clean_size=min_clean_size)
            if upscaled:
                upscaled_count += 1

            cleaned.save(output_path, format="WEBP", quality=92, method=6)
            image_map[task.src] = mapped_src
            report_rows.append(
                {
                    "src": task.src,
                    "mapped_src": mapped_src,
                    "status": "processed",
                    "product_title": task.title,
                    "product_handle": task.handle,
                    "api_dims": [task.width, task.height],
                    "source_stage": source_stage,
                    "source_url_used": chosen.url,
                    "source_dims": [chosen.image.width, chosen.image.height],
                    "final_dims": [cleaned.width, cleaned.height],
                    "shopify_hires_used": shopify_improved,
                    "web_fallback_used": web_used,
                    "upscaled": upscaled,
                }
            )
            print(f"[{idx}/{len(tasks)}] ✓ {Path(urlparse(task.src).path).name}", flush=True)
        except Exception as error:  # noqa: BLE001
            failed.append((task.src, str(error)))
            print(f"[{idx}/{len(tasks)}] ✗ {task.src} :: {error}", flush=True)

    write_map(image_map)
    write_report(report_rows)

    print(
        "\nDone. "
        f"Processed: {len(image_map)} | Failed: {len(failed)} | "
        f"Shopify hires upgrades: {shopify_upgraded_count} | "
        f"Upscaled: {upscaled_count} | "
        f"Web replacements: {web_replaced}/{web_attempts} attempted"
    )
    print(f"Image map written to: {MAP_PATH}")
    print(f"Image report written to: {REPORT_PATH}")
    print(f"Processed images folder: {OUTPUT_DIR}")

    if failed:
        print("\nFailed URLs:")
        for src, error in failed:
            print(f"- {src} :: {error}")


if __name__ == "__main__":
    args = parse_args()
    run(
        force=args.force,
        min_clean_size=args.min_clean_size,
        web_fallback=args.web_fallback,
        max_web_fallback=args.max_web_fallback,
    )
