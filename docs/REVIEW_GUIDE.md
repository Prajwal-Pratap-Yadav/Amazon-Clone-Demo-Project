# Everyday storefront: review guide

Review state management, validation, and measured browser quality in an educational commerce interface.

## Follow the implementation

| Start here          | File                                                                      | What to inspect                                     |
| ------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Cart transitions    | [src/features/cart/cart.ts](../src/features/cart/cart.ts)                 | How quantities, totals, and persistence interact.   |
| Catalog queries     | [src/features/catalog/query.ts](../src/features/catalog/query.ts)         | How filtering and ordering remain deterministic.    |
| Checkout validation | [src/features/checkout/validate.ts](../src/features/checkout/validate.ts) | How invalid form states become actionable feedback. |
| Unit tests          | [tests/unit/cart.test.ts](../tests/unit/cart.test.ts)                     | State transitions and edge cases.                   |
| Browser tests       | [tests/e2e/storefront.spec.ts](../tests/e2e/storefront.spec.ts)           | User journeys across the rendered interface.        |
| Recorded evidence   | [docs/EVIDENCE.md](../docs/EVIDENCE.md)                                   | Measurement provenance, environment, and scope.     |

## Run the checks

Run from the repository root after the setup described in the [README](../README.md). Review fixtures and recorded evidence before starting any full experiment.

```bash
make setup-ci
make test docs typecheck
npm run test:e2e
```

## Interpret the evidence

Saved quality measurements describe the recorded browser, viewport, and source version. They do not establish production traffic behavior, a payment integration, or a live GitHub Pages deployment.

The linked reports retain their original experiment dates and protocols. A new passing CI run verifies its named checks; it does not silently refresh historical measurements.

## Discuss the design

- What belongs in pure cart logic versus browser storage?
- Which recorded quality signals would change on a slower device or a larger catalog?
