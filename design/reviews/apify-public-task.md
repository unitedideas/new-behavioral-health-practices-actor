# Apify public task design review

Reviewed: 2026-07-13
Actor source revision: `8d7e79cc6daf888ffe9444523e01875618ab0e14`
Task ID: `mWSjyRgMOUIk9IiJr`
Surface: <https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/new-behavioral-health-practices-free-weekly-preview>

## Conversion contract

- Category: healthcare-data lead-generation task landing page.
- Audience: behavioral-health billing, credentialing, territory, research, and data teams evaluating a weekly feed.
- Primary conversion: duplicate and run the deterministic 15-row preview, then choose the Actor's $9 full weekly edition when the sample is useful.
- Conversion-quality metric: non-owner task duplications and preview runs that precede a paid `weekly-edition` event and successful dataset delivery.

## Evidence and judgment

- Measured evidence: the public page returns HTTP 200, exposes the free-preview input as `true`, displays nine named output fields, and links its primary action to task duplication in the buyer's Apify account.
- Standards: the first screen names the exact weekly job, states the 15-row limit and no-full-edition-charge boundary, and uses a single `Try for free` action.
- Observed pattern: Apify task pages are indexed under an Actor's `/examples/` path and combine a specific use case, fixed starting input, expected output schema, and runnable duplication flow.
- Hypothesis: a task page that promises one safe, bounded preview will produce more qualified Actor runs than the broader Store listing alone.

## Rendered QA

- Desktop: `design/renders/apify-public-task-desktop.png` at 1440 x 1000.
- Mobile: `design/renders/apify-public-task-mobile.png` at 390 x 844 after viewport reload.
- Desktop exposes the task title, no-charge boundary, primary action, fixed preview input, and output schema in the first screen.
- Mobile exposes the same title, boundary, and primary action before normal scrolling. The linked Actor and beginning of the output diagram remain visible beneath the action.
- Contrast, typography, focus order, and touch-target sizing are supplied by Apify and are readable in both renders.

## Findings

- **Open - low:** Apify's mobile output diagram introduces horizontal overflow at 390 pixels. The title, offer boundary, and primary action do not overflow, so the decision path remains usable.
- No unresolved high- or medium-severity design findings.

Any Actor input-schema, dataset-schema, task metadata, publication-state, or public-page change after this review invalidates it.
