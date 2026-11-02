# ADR 002: Integer pricing and bounded browser state

Accepted. Integer paise avoid floating-point rupee ambiguity. Quantities are bounded to 20 per known product. Stored records are versioned and length-bounded; unknown keys and invalid quantities are dropped. Storage failure leaves a visible in-memory fallback.

Checkout fields are never persisted. This is appropriate for a simulation, not a transactional merchant cart: browser state supplies no identity, inventory or payment guarantee, and concurrent tab changes can overwrite each other.

Only local-storage notifications synchronize the cart. Each notification reads
the latest bounded record, so a delayed event cannot replay an older snapshot;
session-storage events for the same key are ignored. Unchanged quantities do
not trigger a refresh. Catalog controls are updated in place to retain keyboard
focus, with focus moving to the cart button when a focused add control reaches
the quantity limit.

An external change during demo checkout returns a nonempty cart to review and
announces the change before the user continues. Clearing the cart cancels that
checkout and discards its form state. These controls preserve the demo's review
step; they do not add transactional conflict resolution to browser storage.
