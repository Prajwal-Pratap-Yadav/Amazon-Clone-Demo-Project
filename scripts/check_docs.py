"""Check local Markdown links, version metadata and tracked file sizes."""
from pathlib import Path
import json
import re
import subprocess
root = Path.cwd()
files = subprocess.check_output(["git", "ls-files", "-z"], text=True).split("\0")
failures = []
for item in files:
    if not item:
        continue
    path = root / item
    if not path.exists():
        continue
    if path.stat().st_size > 5_000_000:
        failures.append(f"Oversized file: {item}")
    if path.suffix == ".md":
        for destination in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", path.read_text()):
            if destination.startswith(("http:", "https:", "mailto:", "#")):
                continue
            target = destination.split("#")[0]
            if not (path.parent / target).exists():
                failures.append(f"Broken link in {item}: {target}")
version = json.loads(Path("package.json").read_text())["version"]
for name in ["CHANGELOG.md", "CITATION.cff", "docs/RELEASE.md"]:
    if Path(name).exists() and version not in Path(name).read_text():
        failures.append(f"Version {version} absent from {name}")
if failures:
    raise SystemExit("\n".join(failures))
print("Local links, metadata versions and file bounds passed.")
