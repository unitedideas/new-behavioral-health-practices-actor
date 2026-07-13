# Apify Store listing design review

Reviewed: 2026-07-13  
Source revision: `1820bb160f20cac005e2daa40f6fe8656c9b1b38`  
Apify build: `0.0.2`  
Store API modified: `2026-07-13T23:13:00.671Z`  
Surface: <https://apify.com/actablesite/new-behavioral-health-practices-actor>

Review status: **not design-ready while the hydrated Store UI serves stale copy**.

## Conversion contract

- Category: marketplace lead-generation data Actor.
- Audience: healthcare software, billing, credentialing, staffing, compliance, territory-planning, and research teams.
- Primary conversion: a successful full weekly-edition run charged once at $9.
- Conversion-quality metric: paid full-edition events minus platform costs, followed by successful full-dataset delivery. Free preview runs are activation, not revenue.

## Evidence and judgment

- Measured evidence: the production Actor returned 15 current preview records; the Store reports the Actor as published and monetized; the configured primary event is `weekly-edition` at $9 per event; the current source build succeeded from the revision above. The public Actor API and server-rendered meta description now position the dataset for billing, credentialing, EHR, and territory research.
- Standards: the first screen names the job, exposes a free trial path, states the pricing unit, identifies the developer, and keeps methodology and limitations in the README.
- Observed pattern: marketplace buyers compare title, short description, pricing unit, recent activity, input, output, and README before running an Actor.
- Hypothesis: naming the buying teams in the Store description, alongside the current CMS weekly event and the contrast with a seven-million-provider directory, will make the freshness advantage legible enough to earn qualified preview runs.

## Rendered QA

- Desktop: `design/renders/apify-store-desktop.png` at 1440 x 1000.
- Mobile: `design/renders/apify-store-mobile.png` at 390 x 844.
- The title, free-run action, pricing unit, developer identity, README, and primary result promise remain readable on both viewports.
- The mobile first screen preserves the path from value proposition to free run and pricing without horizontal overflow.
- Source provenance, deterministic filtering, and the explicit NPI limitations remain available in the README decision path.

## Findings

- **Open — medium:** the default Actor icon is a low-contrast placeholder on both viewports. Apify's in-app browser does not support the native file-upload flow, so the prepared `assets/icon.svg` could not be attached autonomously. This prevents a full design-ready approval but does not block a buyer from understanding or running the product.
- **Open — high:** at `2026-07-13T23:25:41Z`, Apify's uncached public HTML began returning the new segment-specific meta description, but both a reloaded tab and a fresh tab hydrated to the prior generic short description. The current desktop and mobile captures preserve this mismatch. Do not approve the listing until the buyer-visible DOM contains `billing, credentialing, EHR, and territory research`.
- **Observed platform presentation:** Apify renders the $9 event as `$9,000 / 1,000 full weekly editions`. The equivalent per-run price is correct but less immediately scannable than `$9 per edition`; this wording is controlled by the marketplace.

Any source or Store-copy change after the revision and Store API timestamp above invalidates this review.
