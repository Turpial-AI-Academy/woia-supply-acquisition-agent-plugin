# WOIA Supply Acquisition v0.5.6

Generic reusable supply acquisition department methodology. Core v0.5.6 is the sole hard dependency; no Real Estate delta is implemented.

Use [the skill](skills/woia-supply-acquisition/SKILL.md) and [contract](skills/woia-supply-acquisition/references/acquisition-contract.md) for scoped intake, authority, readiness, receiver contribution and accepted continuity. The deterministic evaluator executes no external or financial effects and stores no business master.

Organization source maps, authorities, service criteria, people and bindings remain private configuration. Exact base/delta/provider qualification is separate from range eligibility. Local engineering certification does not imply runtime activation, Operator E2E or Production Ready.

Maintenance: validate a clean exact candidate through WOIA Ecosystem `plugin:certify-thin`; repositories with local tooling also expose `ci:fast` and `release:check`.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
