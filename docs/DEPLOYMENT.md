# Deployment

The build's base is `/Amazon-Clone-Demo-Project/`. The Pages job runs only after main-branch quality/security checks and verifies it is using the current main head. It attempts to enable the repository's GitHub Actions Pages source, uploads the static bundle and deploys with scoped Pages permissions.

If activation is rejected because the workflow lacks administration permission, `pages-status.json` records the actual HTTP status and deployment is skipped. The owner can select **Settings → Pages → Source: GitHub Actions**, then rerun Storefront quality. A successful quality/release job alone does not establish a live site; verify the deployment URL separately.

The release ZIP places the build under `Amazon-Clone-Demo-Project/`. Extract it into a new directory and serve that parent with `python -m http.server 4180 --bind 127.0.0.1`; open `http://127.0.0.1:4180/Amazon-Clone-Demo-Project/`. Opening the file directly does not provide the repository base path.

No AWS or cost-incurring resources are used. The release is a static educational preview, with no merchant integrations.
