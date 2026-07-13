# Hugging Face dataset card design review

- Reviewed surface: `unitedideas/practice-radar-behavioral-health-npi-sample`
- Reviewed public revision: `c018ca8` (`Route sample users to hosted Apify edition`)
- Category: public data-product sample / marketplace acquisition surface
- Audience: behavioral-health billing, credentialing, EHR, healthcare sales, and provider-data analysts
- Primary conversion: open the deterministic free Apify Task, then choose the $9 hosted full weekly edition when the preview fits the buyer's workflow
- Conversion-quality metric: qualified Apify Task handoffs and paid Actor runs attributable to public dataset surfaces; downloads alone are an awareness signal

## Evidence and judgment

- Measured evidence: the live card contains the free Task link, Actor link, $9 price, separate buyer-paid usage disclosure, validation-before-charge language, and dated-sample disclosure.
- Standards: the offer terms are adjacent to the destination links; the sample provenance and limitations remain visible; links have descriptive labels instead of naked URLs.
- Observed pattern: the provider-owned desktop card uses a readable single-column article layout with the dataset metadata and provenance before the commercial handoff.
- Hypothesis: a buyer who first sees the dated public sample will have enough context to treat the hosted Task as a low-risk next step. Paid-run attribution is required before treating this as proven.

## Rendered QA

- Desktop render: `design/renders/huggingface-card-desktop.png` at 1440 x 1000. The first screen identifies the dataset, sample period, scope, and limitations. The decision path remains inside the card and the new hosted-edition section is present in the full page.
- Mobile render: `design/renders/huggingface-card-mobile.png` at 390 x 844. The provider wrapper collapses the long repository slug into a one-character-wide vertical column, pushing the card content far below the first screen.
- Trust and copy: the card distinguishes a dated sample from the current hosted edition, states the current $9 price, discloses buyer-paid platform usage, and says the full-edition event is charged only after validation.
- Accessibility: semantic headings, lists, and descriptive link labels are present in the Markdown source. The provider's dark theme has adequate text contrast in the inspected desktop render.

## Findings

1. **High — provider-controlled mobile layout is not design-approved.** At 390 px, the Hugging Face wrapper renders the long dataset slug vertically and destroys the first-screen decision path. This is outside the repository Markdown surface; keep the issue visible and re-check after provider layout changes or a slug migration.
2. **Medium — dataset viewer is unavailable.** Buyers must inspect the repository files instead of previewing rows inline. The free Apify Task partially mitigates this by providing a deterministic preview in the buyer's own account.
3. **Low — conversion proof is still absent.** The card now has a coherent route to the hosted product, but a non-owner paid run is still required before the path can be called commercially validated.

## Decision

Desktop content and conversion copy are approved for public use at Hugging Face revision `c018ca8`. Mobile visual approval is withheld because of the unresolved provider-controlled wrapper defect. Any later card-source edit invalidates this review until the public revision and renders are refreshed.
