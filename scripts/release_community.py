"""Attach existing scoped roadmap issues to the next preview milestone."""
import json
import os
import urllib.request

REPOSITORY = "Prajwal-Pratap-Yadav/Amazon-Clone-Demo-Project"
def write_ok():
    if os.environ.get("GITHUB_REPOSITORY") != REPOSITORY or os.environ.get("GITHUB_REF") != "refs/heads/main":
        raise SystemExit("Community mutation is restricted to this repository's main workflow")

def api(method, endpoint, payload=None):
    if method != "GET":
        write_ok()
    body = None if payload is None else json.dumps(payload).encode()
    request = urllib.request.Request(f"https://api.github.com/repos/{REPOSITORY}/{endpoint}", data=body, method=method,
        headers={"Authorization": "Bearer " + os.environ["GH_TOKEN"], "Accept": "application/vnd.github+json", "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)

write_ok()
title = "Next storefront preview (0.2.0)"
milestones = api("GET", "milestones?state=all&per_page=100")
milestone = next((item for item in milestones if item["title"] == title), None)
if milestone is None:
    milestone = api("POST", "milestones", {"title": title, "description": "Cross-browser evidence, shareable catalog state and real-device accessibility review. These are unverified roadmap items."})
for number in [1, 2, 3]:
    issue = api("GET", f"issues/{number}")
    if "pull_request" in issue:
        raise SystemExit("Roadmap ID resolved to a pull request")
    if issue.get("milestone") is None:
        api("PATCH", f"issues/{number}", {"milestone": milestone["number"]})
print(f"Roadmap milestone {milestone['number']} verified for this repository.")
