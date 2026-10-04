"""Package the built static site and recorded measurements with checksums."""
from pathlib import Path
import hashlib
import json
import os
import subprocess
import zipfile

version = json.loads(Path("package.json").read_text())["version"]
source = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
if os.environ.get("GITHUB_SHA", source) != source:
    raise SystemExit("Release source differs from the checked-out commit")
site = Path("dist")
if not (site / "index.html").exists() or not Path("reports/after/audit/manifest.json").exists():
    raise SystemExit("Build and recorded after measurements are required")
output = Path("reports/local/release")
output.mkdir(parents=True, exist_ok=True)
site_zip = output / f"everyday-storefront-{version}.zip"
with zipfile.ZipFile(site_zip, "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(site.rglob("*")):
        if path.is_file():
            archive.write(path, "Amazon-Clone-Demo-Project/" + path.relative_to(site).as_posix())
    archive.write("LICENSE", "Amazon-Clone-Demo-Project/LICENSE")
    archive.writestr("Amazon-Clone-Demo-Project/release-source.json", json.dumps({"version": version, "sourceSha": source}, indent=2))
measurements = output / f"everyday-storefront-{version}-measurements.zip"
with zipfile.ZipFile(measurements, "w", zipfile.ZIP_DEFLATED) as archive:
    for folder in [Path("reports/baseline"), Path("reports/after")]:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                archive.write(path, path.as_posix())
    for name in ["docs/EVIDENCE.md", "docs/measurements.md", "docs/ASSETS.md"]:
        archive.write(name, name)
checksums = "".join(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n" for path in [site_zip, measurements])
(output / "SHA256SUMS").write_text(checksums)
print(f"Packaged preview {version} from {source}")
