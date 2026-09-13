#!/usr/bin/env python3
"""Minify SimpleThemeDark-nightly.css for production."""
import re, os

SRC = os.path.join(os.path.dirname(__file__), "SimpleThemeDark-nightly.css")
DST = os.path.join(os.path.dirname(__file__), "SimpleThemeDark-nightly.min.css")

with open(SRC, "r") as f:
    css = f.read()

original_size = len(css.encode("utf-8"))

# 1. Remove block comments
css = re.sub(r"/\*[\s\S]*?\*/", "", css)

# 2. Remove single-line comments (not inside strings)
css = re.sub(r"(?<![:\"'])//.*$", "", css, flags=re.MULTILINE)

# 3. Collapse whitespace: newlines, tabs, multiple spaces → single space
css = re.sub(r"\s+", " ", css)

# 4. Remove spaces around structural characters
css = re.sub(r"\s*{\s*", "{", css)
css = re.sub(r"\s*}\s*", "}", css)
css = re.sub(r"\s*;\s*", ";", css)
css = re.sub(r"\s*:\s*", ":", css)
css = re.sub(r"\s*,\s*", ",", css)
css = re.sub(r"\s*>\s*", ">", css)
css = re.sub(r"\s*~\s*", "~", css)
css = re.sub(r"\s*\+\s*", "+", css)

# 5. Remove trailing semicolons before closing brace
css = re.sub(r";}", "}", css)

# 6. Remove leading space after opening brace
css = re.sub(r"{ ", "{", css)

# 7. Remove trailing space before closing brace
css = re.sub(r" }", "}", css)

# 8. Trim
css = css.strip()

# 9. Add source map reference comment at top
header = "/* SimpleThemeDark-nightly.min.css — source: SimpleThemeDark-nightly.css */\n"
css = header + css

compressed_size = len(css.encode("utf-8"))

with open(DST, "w") as f:
    f.write(css)

ratio = (1 - compressed_size / original_size) * 100
print(f"Original:   {original_size:>8,} bytes ({original_size/1024:.1f} KB)")
print(f"Compressed: {compressed_size:>8,} bytes ({compressed_size/1024:.1f} KB)")
print(f"Reduction:  {ratio:.1f}%")
print(f"Written to: {DST}")
