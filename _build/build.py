#!/usr/bin/env python3
"""Concatenate _build/parts/*.js into content.js and syntax-check it."""
import glob, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
parts = sorted(glob.glob(os.path.join(here, "parts", "*.js")))
out = "\n".join(open(p, encoding="utf-8").read() for p in parts)
dst = os.path.join(root, "content.js")
open(dst, "w", encoding="utf-8").write(out)
r = subprocess.run(["node", "--check", dst], capture_output=True, text=True)
print(f"wrote {dst} ({len(out)} bytes) from {len(parts)} parts; node --check: {'OK' if r.returncode == 0 else r.stderr}")
sys.exit(r.returncode)
