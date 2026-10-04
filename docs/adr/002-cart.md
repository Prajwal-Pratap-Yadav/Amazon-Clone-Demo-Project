# ADR 002: Integer pricing and bounded browser state

Accepted. Integer paise avoid floating-point rupee ambiguity. Quantities are bounded to 20 per known product. Stored records are versioned and length-bounded; unknown keys and invalid quantities are dropped. Storage failure leaves a visible in-memory fallback.

Checkout fields are never persisted. This is appropriate for a simulation, not a transactional merchant cart: browser state supplies no identity, inventory or payment guarantee, and concurrent tab changes can overwrite each other.
