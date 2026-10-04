# Measurement methodology

Original application source: `c8f0e99961b4648f9ea62c0e81070fd2ce3137ac`. Baseline harness: `7ff23da5de5c030a55102ed0c26d4ae74d6c1cc6`. Its workflow verifies original application files are unchanged, serves local HTTP and captures the page, axe and five Lighthouse runs for each profile.

`make reproduce` builds the new app, serves the repository subpath on local HTTP, runs the same pinned audit and captures catalog/cart/error states. Manifests record source SHA (or explicitly unpublished local tree), UTC time, OS/kernel, CPU, Node, Chromium, Lighthouse and full throttling configuration. Browser/tool pins are the same for the comparison; runner availability can vary.

Scores are normalized to [0,1]; README tables multiply by 100. Mobile uses Lighthouse's default simulated mobile throttling; desktop uses its official desktop configuration. The baseline's broken images and absent interactions make its high performance score weak evidence of product quality. No field-performance or isolated causal claim follows from these runs.

Budgets in `configs/budgets.json` are acceptance targets. CI checks medians, browser errors, overflow and axe serious/critical violations, retaining raw reports. `scripts/capture.mjs` waits for actual local illustrations and captures real viewport states. CI copies measurements to the reviewed branch only after verification, with owner identity and a branch-head guard. Docs-only updates retain earlier measurements if application/test files are unchanged.

Reruns default to ignored `reports/local`, preserving the committed baseline. Full manual accessibility and cross-browser behavior are not inferred from automation.
