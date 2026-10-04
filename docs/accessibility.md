# Accessibility review scope

Implemented controls use explicit labels, native buttons/selects, landmarks, heading hierarchy, a skip link, visible focus and reduced-motion scrolling. Product artwork is decorative when the adjacent heading names it; the hero has descriptive alternative text.

The modal initially focuses its close control, cycles visible/enabled controls at Tab boundaries, and returns focus on Escape. Quantity edits preserve focus; row removal moves it to an existing control. Checkout error summaries and completion headings receive focus. Live regions exist inside and outside the modal so inert content is not the sole announcement channel.

Playwright checks catalog, cart and checkout with axe WCAG A/AA tags and rejects serious/critical violations. It also exercises focus, storage recovery, validation and a narrow viewport. Passing automation does not establish full WCAG 2.2 AA conformance. Screen-reader review, unusual zoom/high-contrast settings and non-Chromium browsers remain roadmap work. Baseline failures are retained as evidence.
