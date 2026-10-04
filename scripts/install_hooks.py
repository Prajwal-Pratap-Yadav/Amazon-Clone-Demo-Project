"""Install staged secret scanning without replacing an existing push guard."""
from pathlib import Path
import subprocess

directory = Path(subprocess.check_output(["git", "rev-parse", "--git-path", "hooks"], text=True).strip())
directory.mkdir(parents=True, exist_ok=True)
hook = directory / "pre-commit"
content = '#!/usr/bin/env bash\nset -euo pipefail\n.tools/gitleaks git --pre-commit --staged --redact\n'
if hook.exists() and hook.read_text() != content:
    raise SystemExit("Existing pre-commit hook preserved: integrate staged scanning manually.")
hook.write_text(content)
hook.chmod(0o755)
print("Staged secret hook installed; pre-push hook preserved.")
