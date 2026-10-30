#!/usr/bin/env python3
"""Compatibility entrypoint for the JSON-based publication updater (dry run by default)."""
import sys
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))
from update_publications import main

if __name__ == '__main__':
    sys.exit(main())
