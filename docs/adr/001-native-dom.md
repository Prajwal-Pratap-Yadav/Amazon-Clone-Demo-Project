# ADR 001: Keep a small native-DOM app

Accepted. The original was HTML/CSS. A framework rewrite would add a runtime without removing much duplication. TypeScript provides useful catalog/cart/validation contracts; Vite provides modules, a static build and repository subpath.

Pure logic stays independently testable and DOM construction avoids interpreting user text as markup. The trade-off is explicit event lifecycle and focus management, verified through browser tests.
