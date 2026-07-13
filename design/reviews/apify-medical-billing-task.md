# Apify medical-billing task design review

Reviewed: 2026-07-13
Actor repository revision: `ad2d20062b009d892462c934ff09d8b59761094a`
Task ID: `nN2ddMDX3Uy4YSIYN`
Surface: <https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/behavioral-health-npi-leads-for-medical-billing-free-preview>

## Conversion contract

- Category: medical-billing lead-research task landing page.
- Audience: billing, credentialing, territory-planning, and business-development teams evaluating newly enumerated behavioral-health organizations.
- Primary conversion: duplicate and run the deterministic 15-row preview, then choose the Actor's $9 full weekly edition when the records fit the buyer's workflow.
- Conversion-quality metric: non-owner task duplications and preview runs that precede a paid `weekly-edition` event and successful dataset delivery.

## Evidence and judgment

- Measured evidence: the public page returns HTTP 200, exposes `preview: true`, names nine output fields, and links `Try for free` to task duplication in the buyer's Apify account.
- Standards: the first screen names the exact medical-billing job, states the preview limit, and explicitly tells buyers to verify every record before contact.
- Observed pattern: high-intent marketplace pages match one buyer role and one immediate workflow before exposing broader integration options.
- Hypothesis: matching the page to medical-billing and credentialing language will produce more qualified Actor discovery than generic healthcare-data terminology alone.

## Rendered QA

- Desktop: `design/renders/apify-medical-billing-task-desktop.png` at 1440 x 1000.
- Mobile: `design/renders/apify-medical-billing-task-mobile.png` at 390 x 844 after viewport reload.
- Desktop exposes the buyer, data event, preview limit, verification boundary, primary action, input, and output schema in the first screen.
- Mobile preserves the same decision path before normal scrolling, with a full-width primary action and readable disclosure.

## Findings

- **Open - low:** Apify's mobile output diagram introduces horizontal overflow at 390 pixels. The title, disclosure, and primary action do not overflow.
- No unresolved high- or medium-severity design findings.

Any Actor input-schema, dataset-schema, task metadata, publication-state, or public-page change after this review invalidates it.
