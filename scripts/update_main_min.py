#!/usr/bin/env python3
"""Minify assets/js/_main.js and update the bundled assets/js/main.min.js snippet."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "js" / "_main.js"
TARGET = ROOT / "assets" / "js" / "main.min.js"

IDENTIFIER_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$"
WHITESPACE = " \t\r\n"


def minify_js(source: str) -> str:
    result = []
    length = len(source)
    i = 0
    in_string = False
    string_char = ''
    escape = False

    while i < length:
        ch = source[i]

        if in_string:
            result.append(ch)
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == string_char:
                in_string = False
            i += 1
            continue

        if ch in ('"', "'"):
            in_string = True
            string_char = ch
            result.append(ch)
            i += 1
            continue

        if ch in WHITESPACE:
            j = i + 1
            while j < length and source[j] in WHITESPACE:
                j += 1

            prev = result[-1] if result else ''
            next_char = source[j] if j < length else ''
            if (
                prev in IDENTIFIER_CHARS
                and next_char in IDENTIFIER_CHARS
            ):
                result.append(' ')
            i = j
            continue

        if ch == '/':
            next_char = source[i + 1] if i + 1 < length else ''
            if next_char == '/':
                i += 2
                while i < length and source[i] not in ('\n', '\r'):
                    i += 1
                continue
            if next_char == '*':
                i += 2
                while i < length - 1 and not (source[i] == '*' and source[i + 1] == '/'):
                    i += 1
                i += 2
                continue

        result.append(ch)
        i += 1

    return ''.join(result)


def update_bundle() -> None:
    source_code = SOURCE.read_text(encoding="utf-8")
    minified = minify_js(source_code)

    bundle = TARGET.read_text(encoding="utf-8")

    pattern = re.compile(r"\$\(document\)\.ready\(function\(\)\{.*?\}\)\}\);", re.DOTALL)
    new_bundle, count = pattern.subn(minified, bundle, count=1)

    if count != 1:
        raise RuntimeError("Unable to locate existing document ready block in main.min.js")

    TARGET.write_text(new_bundle, encoding="utf-8")


if __name__ == "__main__":
    update_bundle()
