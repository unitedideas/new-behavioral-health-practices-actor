# New Behavioral Health Practices Weekly

Find the behavioral-health organizations that received an NPI in the latest CMS weekly file—before they disappear inside a seven-million-provider directory.

This Actor turns the official NPPES weekly dissemination archive into a compact, source-linked lead feed. It selects newly enumerated Type 2 organizations across eight disclosed behavioral-health taxonomy codes, removes deactivated rows, deduplicates repeated organization/city/state combinations, and returns a ready-to-export dataset.

## Try the current edition

- Start with the [free national preview](https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/new-behavioral-health-practices-free-weekly-preview) for 15 deterministic rows in your own Apify account.
- Use the [medical-billing preview](https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/behavioral-health-npi-leads-for-medical-billing-free-preview) for billing territory and prospect research.
- Use the [credentialing-firm preview](https://apify.com/actablesite/new-behavioral-health-practices-actor/examples/new-behavioral-health-groups-for-credentialing) for provider-enrollment market research.
- The [hosted Actor](https://apify.com/actablesite/new-behavioral-health-practices-actor) offers a $9 full weekly edition. Buyer-paid platform usage is separate, and the full-edition event is charged only after the current CMS archive passes validation.

## The result

Each run returns the latest completed weekly edition with:

- organization name, NPI, business address, public phone, and fax;
- enumeration and last-update dates;
- matched behavioral-health taxonomy and code;
- the public authorized official, title, and phone when NPPES supplies them;
- edition dates, source URL, record counts, filters, and SHA-256 source receipts.

Use Apify's dataset tools to export JSON, CSV, Excel, XML, or RSS, or call the Actor through API and MCP.

## Run it

1. Keep **Free preview** selected to inspect the current receipt and 15 representative rows.
2. Optionally add two-letter state or territory codes such as `CA`, `TX`, or `WA`.
3. Clear **Free preview** to receive the complete current edition.

The full-edition event is charged once per successful run. The archive is parsed and validated before that event is charged. If the run's maximum charge does not permit the edition, no full records are delivered.

### Input

```json
{
  "preview": false,
  "states": ["CA", "TX", "FL"]
}
```

### Output record

```json
{
  "npi": "1234567890",
  "organization": "Example Behavioral Health LLC",
  "city": "Austin",
  "state": "TX",
  "telephone": "5125550100",
  "enumeration_date": "2026-07-02",
  "focus": "Mental health clinic",
  "taxonomy_code": "261QM0801X",
  "authorized_official": "Example Person",
  "authorized_official_title": "Owner",
  "edition_start": "2026-06-29",
  "edition_end": "2026-07-05",
  "source": "CMS NPPES weekly dissemination file"
}
```

## Who it is for

- billing, credentialing, EHR, telehealth, staffing, and compliance vendors;
- behavioral-health networks and market-research teams;
- territory planners who need a recent public starting list rather than a static provider dump.

## What is measured, and what is not

The Actor measures a specific public event: CMS recorded a Type 2 NPI enumeration during the source week's date range, the row was not deactivated in that file, and at least one of eight disclosed taxonomy codes matched.

An NPI is not proof of licensure, credentialing, active operation, independence, service availability, demand, or buying intent. NPPES fields can be incomplete, self-reported, stale, or shared across related organizations. Verify every record before using it for a consequential decision or contacting an organization. This product does not supply private data, email enrichment, licensure verification, or a HIPAA-compliance determination.

## Taxonomy scope

The current filter includes:

- `101YM0800X` — Mental health counselor
- `261QM0801X` — Mental health clinic
- `251S00000X` — Community / behavioral health
- `101YP2500X` — Professional counselor
- `103K00000X` — Behavior analyst
- `106H00000X` — Marriage and family therapist
- `103T00000X` — Psychologist
- `261QM0850X` — Adult mental health clinic

The full machine-readable taxonomy map, national count, state counts, source archive URL, and file hashes are included in every run's `OUTPUT` receipt.

## Data and privacy

The source is the [CMS NPPES Data Dissemination](https://download.cms.gov/nppes/NPI_Files.html) weekly file. The Actor processes public professional and organization records. Inputs are limited to preview mode and state codes; do not submit confidential or patient information.

## Reliability

The run fails closed when CMS does not publish a recognizable weekly archive, the archive exceeds 50 MB, the expected primary CSV is missing, or the national behavioral-health selection falls below 50 records. Those gates prevent an upstream layout change from silently producing an empty paid edition.

## Support

Use the Actor's Issues tab for reproducible run problems. Include the Apify run URL and the non-sensitive error message; do not post patient data, credentials, or private business records.

Source code: [unitedideas/new-behavioral-health-practices-actor](https://github.com/unitedideas/new-behavioral-health-practices-actor)
