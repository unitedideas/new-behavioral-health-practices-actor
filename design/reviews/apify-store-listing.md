# Apify Store listing design review

Reviewed: 2026-07-13  
Source revision: `1820bb160f20cac005e2daa40f6fe8656c9b1b38`  
Apify build: `0.0.2`  
Surface: <https://apify.com/actablesite/new-behavioral-health-practices-actor>

## Conversion contract

- Category: marketplace lead-generation data Actor.
- Audience: healthcare software, billing, credentialing, staffing, compliance, territory-planning, and research teams.
- Primary conversion: a successful full weekly-edition run charged once at $9.
- Conversion-quality metric: paid full-edition events minus platform costs, followed by successful full-dataset delivery. Free preview runs are activation, not revenue.

## Evidence and judgment

- Measured evidence: the production Actor returned 15 current preview records; the Store reports the Actor as published and monetized; the configured primary event is `weekly-edition` at $9 per event; the current source build succeeded from the revision above.
- Standards: the first screen names the job, exposes a free trial path, states the pricing unit, identifies the developer, and keeps methodology and limitations in the README.
- Observed pattern: marketplace buyers compare title, short description, pricing unit, recent activity, input, output, and README before running an Actor.
- Hypothesis: naming the current CMS weekly event and contrasting it with a seven-million-provider directory will make the freshness advantage legible enough to earn qualified preview runs.

## Rendered QA

- Desktop: `design/renders/apify-store-desktop.png` at 1440 x 1000.
- Mobile: `design/renders/apify-store-mobile.png` at 390 x 844.
- The title, description, free-run action, pricing unit, developer identity, README, and primary result promise remain readable on both viewports.
- The mobile first screen preserves the complete path from value proposition to free run and pricing without horizontal overflow.
- Source provenance, deterministic filtering, and the explicit NPI limitations remain available in the README decision path.

## Findings

- **Open — medium:** the default Actor icon is a low-contrast placeholder on both viewports. Apify's in-app browser does not support the native file-upload flow, so the prepared `assets/icon.svg` could not be attached autonomously. This prevents a full design-ready approval but does not block a buyer from understanding or running the product.
- **Observed platform presentation:** Apify renders the $9 event as `$9,000 / 1,000 full weekly editions`. The equivalent per-run price is correct but less immediately scannable than `$9 per edition`; this wording is controlled by the marketplace.

Any source or Store-copy change after the revision above invalidates this review.
