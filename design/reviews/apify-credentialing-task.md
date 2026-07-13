# Apify credentialing Task design review

- Reviewed surface: `actablesite/new-behavioral-health-groups-for-credentialing`
- Public Task ID: `Z22XvAAbiUlbxnDCw`
- Public URL: `https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/new-behavioral-health-groups-for-credentialing`
- Actor source/build: `1820bb160f20cac005e2daa40f6fe8656c9b1b38` / `0.0.2`
- Category: public marketplace use-case page / free product preview
- Audience: credentialing firms, provider-enrollment consultants, and healthcare operations teams researching newly enumerated behavioral-health groups
- Primary conversion: duplicate the deterministic free preview into the buyer's Apify account, then choose the $9 full weekly edition if the current sample fits the workflow
- Conversion-quality metric: qualified Task duplications followed by non-owner Actor runs; only a settled paid full-edition event with automatic dataset delivery proves revenue

## Evidence and judgment

- Measured evidence: Apify Console reports the Task as Public. The public server response contains the SEO title, buyer-specific description, verification warning, and exact `create-task-from-example/Z22XvAAbiUlbxnDCw` route. The persistent monitor verifies that contract.
- Market evidence: current behavioral-health credentialing services describe Type 2 NPI registration and payer enrollment as required startup work. Current Apify NPI competitors primarily offer generic provider lookup and all-provider extraction, leaving a narrower discovery position around newly enumerated behavioral-health organizations.
- Standards: preview mode remains fixed on, no full-edition event is charged from the public Task default, the copy calls the data market research rather than credentialing proof, and every row must be verified before operational use.
- Hypothesis: the segment-specific title will produce more qualified Task duplications than the national generic preview. This remains unproved until external run evidence appears.

## Rendered QA and findings

1. **High — interactive public route is not design-approved.** The server-rendered response is correct, but the authenticated in-app browser repeatedly redirects the new example path to the Actor examples index after hydration. That prevents trustworthy desktop and mobile inspection of the actual page. No desktop or mobile approval is claimed.
2. **Medium — conversion remains unproved.** The page creates a distinct credentialing acquisition surface, but publication and owner verification are not demand.
3. **Low — provider-controlled layout.** The public page uses Apify's fixed marketplace components; source changes can govern title, description, disclosed inputs, and output schema, but not the wrapper layout.

## Decision

Publication is accepted as a monitored acquisition experiment because the public server contract and duplication route are live. Visual approval is withheld until the exact public route remains open after client hydration and desktop/mobile renders can be inspected. Any Task metadata, publication setting, or Actor source change invalidates this review.
