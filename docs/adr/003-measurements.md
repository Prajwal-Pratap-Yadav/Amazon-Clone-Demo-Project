# ADR 003: Preserve repeated lab measurements

Accepted. One Lighthouse score varies with host load and throttling. The harness saves five runs per profile, medians and ranges, full configuration, hardware/tool versions, source SHA and real captures. Browser tests independently verify the shopping flow.

Mobile uses Lighthouse's default simulated mobile configuration; desktop uses its official desktop configuration. Both serve local HTTP on GitHub Ubuntu runners. This is a lab comparison, not field telemetry or an isolated causal experiment. Automated axe tests supplement human review; they do not certify WCAG conformance.
