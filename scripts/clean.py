"""Remove generated outputs only, preserving evidence and installed tools."""
from pathlib import Path
import shutil
for name in ["dist", "coverage", "test-results", "playwright-report", "reports/local"]:
    path = Path(name)
    if path.is_dir():
        shutil.rmtree(path)
    print(f"Cleaned {name}")
