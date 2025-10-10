#!/usr/bin/env python3
"""Update IEEE publication metadata with the latest information from IEEE Xplore."""
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests

ROOT = Path(__file__).resolve().parents[1]
import sys

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts import generate_publications as gp

MONTH_TO_NUMBER = {
    "Jan.": "01",
    "Feb.": "02",
    "Mar.": "03",
    "Apr.": "04",
    "May": "05",
    "Jun.": "06",
    "Jul.": "07",
    "Aug.": "08",
    "Sept.": "09",
    "Oct.": "10",
    "Nov.": "11",
    "Dec.": "12",
}

MONTH_NAME_MAP = {
    "jan": "Jan.",
    "january": "Jan.",
    "feb": "Feb.",
    "february": "Feb.",
    "mar": "Mar.",
    "march": "Mar.",
    "apr": "Apr.",
    "april": "Apr.",
    "may": "May",
    "jun": "Jun.",
    "june": "Jun.",
    "jul": "Jul.",
    "july": "Jul.",
    "aug": "Aug.",
    "august": "Aug.",
    "sep": "Sept.",
    "sept": "Sept.",
    "september": "Sept.",
    "oct": "Oct.",
    "october": "Oct.",
    "nov": "Nov.",
    "november": "Nov.",
    "dec": "Dec.",
    "december": "Dec.",
}

IEEE_METADATA_URL = "https://ieeexplore.ieee.org/rest/document/{doc_id}/metadata"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

METADATA_CACHE: dict[str, Optional[dict]] = {}


def first_non_empty(*values: Optional[str]) -> Optional[str]:
    for value in values:
        if value is None:
            continue
        text = str(value).strip()
        if text:
            return text
    return None


def to_month_abbr(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    key = value.strip().lower().rstrip('.')
    return MONTH_NAME_MAP.get(key)


def parse_publication_date(metadata: dict) -> tuple[Optional[str], Optional[str]]:
    date_fields = (
        metadata.get("publicationDate"),
        metadata.get("issueDate"),
        metadata.get("displayPublicationDate"),
    )
    for raw_value in date_fields:
        if not raw_value:
            continue
        text = str(raw_value).strip()
        for fmt in ("%d %B %Y", "%d %b %Y", "%B %Y", "%b %Y"):
            try:
                parsed = datetime.strptime(text, fmt)
            except ValueError:
                continue
            month = to_month_abbr(parsed.strftime("%B"))
            year = str(parsed.year)
            if month:
                return month, year
            return None, year
        month = None
        year_match = re.search(r"(19|20)\d{2}", text)
        if year_match:
            month_match = re.search(r"([A-Za-z]+)", text)
            if month_match:
                month = to_month_abbr(month_match.group(1))
            return month, year_match.group(0)
    year = first_non_empty(metadata.get("publicationYear"), metadata.get("issueYear"))
    return None, str(year) if year else None


def fetch_ieee_metadata(doc_id: str) -> Optional[dict]:
    if doc_id in METADATA_CACHE:
        return METADATA_CACHE[doc_id]
    url = IEEE_METADATA_URL.format(doc_id=doc_id)
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json, text/plain, */*",
        "Referer": f"https://ieeexplore.ieee.org/document/{doc_id}",
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"Failed to fetch metadata for {doc_id}: {exc}")
        METADATA_CACHE[doc_id] = None
        return None
    try:
        metadata = response.json()
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON for {doc_id}: {exc}")
        METADATA_CACHE[doc_id] = None
        return None
    METADATA_CACHE[doc_id] = metadata
    return metadata


def extract_document_id(entry: dict) -> Optional[str]:
    urls: list[str] = []
    if entry.get("title_url"):
        urls.append(entry["title_url"])
    for resource in entry.get("resources", []):
        urls.append(resource)
    for url in urls:
        match = re.search(r"/document/(\d+)", url)
        if match:
            return match.group(1)
    return None


def set_field(info: dict, key: str, value: Optional[str], *, allow_clear: bool = False) -> bool:
    current = info.get(key)
    if value is not None:
        value = str(value).strip()
        if not value:
            value = None
    if value is None:
        if allow_clear and current:
            info[key] = None
            return True
        return False
    if current != value:
        info[key] = value
        return True
    return False


def pages_from_metadata(metadata: dict) -> Optional[str]:
    start = first_non_empty(metadata.get("startPage"), metadata.get("startPageStr"))
    end = first_non_empty(metadata.get("endPage"), metadata.get("endPageStr"))
    if start and end:
        if start == end:
            return start
        return f"{start}-{end}"
    if start:
        return start
    if end:
        return end
    page_range = first_non_empty(metadata.get("pageRange"))
    if page_range:
        page_range = page_range.replace("–", "-").replace("—", "-")
        return page_range
    return None


def article_number_from_metadata(metadata: dict) -> Optional[str]:
    return first_non_empty(metadata.get("articleNumber"), metadata.get("artNumber"))


def apply_metadata(entry: dict, metadata: dict) -> bool:
    if entry.get("type") != "journal":
        return False
    venue = entry.get("venue_name", "") or ""
    if "IEEE" not in venue.upper():
        return False
    info = gp.parse_tail(entry.get("tail", ""))
    changed = False
    changed |= set_field(
        info,
        "volume",
        first_non_empty(metadata.get("volume"), metadata.get("volumeNumber")),
    )
    changed |= set_field(
        info,
        "number",
        first_non_empty(metadata.get("issue"), metadata.get("publicationIssue"), metadata.get("issueNumber")),
    )
    pages = pages_from_metadata(metadata)
    if pages:
        pages = pages.replace("–", "-").replace("—", "-")
    changed |= set_field(info, "pages", pages)
    changed |= set_field(info, "article", article_number_from_metadata(metadata))
    month, year = parse_publication_date(metadata)
    if year is None:
        year = first_non_empty(metadata.get("publicationYear"), metadata.get("issueYear"))
        if year:
            year = str(year)
    if month:
        changed |= set_field(info, "month", month)
    elif metadata.get("isEarlyAccess"):
        changed |= set_field(info, "month", None, allow_clear=True)
    if year:
        changed |= set_field(info, "year", year)
    note_value = None
    status = first_non_empty(metadata.get("pubStatus"), metadata.get("status"))
    if metadata.get("isEarlyAccess") or (status and "early" in status.lower()):
        note_value = "Early Access"
    changed |= set_field(info, "note", note_value, allow_clear=True)
    doi_value = first_non_empty(metadata.get("doi"))
    changed |= set_field(info, "doi", doi_value)
    new_tail = gp.format_tail_from_info(info)
    if new_tail != entry.get("tail"):
        entry["tail"] = new_tail
        changed = True
    if info.get("year") and entry.get("year") != str(info["year"]):
        entry["year"] = str(info["year"])
        changed = True
    if info.get("month") and info.get("year"):
        month_number = MONTH_TO_NUMBER.get(info["month"])
        if month_number:
            date_value = f"{info['year']}-{month_number}"
            if entry.get("date") != date_value:
                entry["date"] = date_value
                changed = True
    return changed


def update_file(path: Path) -> bool:
    entries = gp.load_entries(path)
    updated = False
    for entry in entries:
        doc_id = extract_document_id(entry)
        if not doc_id:
            continue
        metadata = fetch_ieee_metadata(doc_id)
        if not metadata:
            continue
        if apply_metadata(entry, metadata):
            print(f"Updated metadata for '{entry['title']}' in {path}")
            updated = True
    if not updated:
        return False
    new_block = gp.render_publications(entries)
    original = path.read_text(encoding="utf-8")
    pattern = re.compile(r"<ul id=\"publication-source\".*?</ul>", re.DOTALL)
    new_html, count = pattern.subn(new_block, original, count=1)
    if count != 1:
        raise RuntimeError(f"Unable to update publication block in {path}")
    path.write_text(new_html, encoding="utf-8")
    return True


def main() -> None:
    targets = [
        Path("_pages/includes/pub.md"),
        Path("README.md"),
    ]
    changed_any = False
    for target in targets:
        if not target.exists():
            continue
        content = target.read_text(encoding="utf-8")
        if 'id="publication-source"' not in content:
            continue
        if update_file(target):
            changed_any = True
    if not changed_any:
        print("No IEEE publication metadata updates were necessary.")


if __name__ == "__main__":
    main()
