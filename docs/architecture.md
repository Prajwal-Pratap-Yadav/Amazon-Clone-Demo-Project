# Architecture

The immutable synthetic catalog feeds pure query selection. Selection combines all search words with a category and stable sorting, returning a new array. The cart reducer accepts known IDs and integer quantities. Pricing uses integer paise. Saved records are untrusted input: version, length and each quantity are checked; unknown keys are discarded and storage exceptions fall back to memory.

`src/main.ts` constructs DOM elements and assigns text, without inserting user fields as HTML. Native `dialog` supplies modal inertness and Escape behavior; a small visible/enabled-control loop keeps Tab and Shift+Tab within its boundaries. Quantity updates preserve the control's focus; removing a row focuses the close control. A live region inside the dialog remains available while the rest of the page is inert. Error summaries and completion headings receive focus.

Checkout is local simulation. Only a fictional name and `.test` address are validated. Neither enters storage, requests or logs. Completion clears the cart and explains that nothing was sent. Delivery rules are invented, with no tax or inventory authority. Browser storage events synchronize tabs using last-writer-wins behavior; simultaneous edits can overwrite one another.

Vite builds a static page, compiled CSS/JS and local SVGs with base `/Amazon-Clone-Demo-Project/`. Legacy source and reports are excluded from the bundle. No runtime CDN, downloaded font or tracking service is used. Quickstart installs the locked Vite runtime; development checks install the complete lockfile separately.
