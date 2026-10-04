"""Attempt authorized Pages activation and report a concrete administration blocker."""
from pathlib import Path
import json
import os
import urllib.error
import urllib.request

REPOSITORY = "Prajwal-Pratap-Yadav/Amazon-Clone-Demo-Project"
if os.environ.get("GITHUB_REPOSITORY") != REPOSITORY or os.environ.get("GITHUB_REF") != "refs/heads/main":
    raise SystemExit("Pages mutation is restricted to this repository's main workflow")

def api(method, payload=None):
    # The exact repository/ref check above is required before every mutation.
    if method != "GET" and (os.environ.get("GITHUB_REPOSITORY") != REPOSITORY or os.environ.get("GITHUB_REF") != "refs/heads/main"):
        raise SystemExit("Blocked Pages mutation")
    request = urllib.request.Request(f"https://api.github.com/repos/{REPOSITORY}/pages", data=None if payload is None else json.dumps(payload).encode(), method=method,
        headers={"Authorization": "Bearer " + os.environ["GH_TOKEN"], "Accept": "application/vnd.github+json", "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read()
            return response.status, json.loads(data) if data else {}
    except urllib.error.HTTPError as error:
        return error.code, {"message": json.loads(error.read()).get("message", "Pages API rejected the request")}

status, site = api("GET")
if status == 404:
    status, site = api("POST", {"build_type": "workflow"})
elif status == 200 and site.get("build_type") != "workflow":
    status, site = api("PUT", {"build_type": "workflow"})
ready = status in (200, 201, 204)
report = {"repository": REPOSITORY, "ready": ready, "httpStatus": status, "message": site.get("message"), "manualAction": None if ready else "Repository Settings > Pages > Source: GitHub Actions; rerun Storefront quality after activation."}
Path("reports/local").mkdir(parents=True, exist_ok=True)
Path("reports/local/pages-status.json").write_text(json.dumps(report, indent=2) + "\n")
with open(os.environ["GITHUB_OUTPUT"], "a") as output:
    output.write("ready=" + str(ready).lower() + "\n")
print("Pages deployment is configured." if ready else f"Pages activation blocked (HTTP {status}); owner administration is required. The deployment is skipped and recorded.")
