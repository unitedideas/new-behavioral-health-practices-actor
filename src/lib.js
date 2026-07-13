import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { createInterface } from "node:readline";
import AdmZip from "adm-zip";

export const CMS_PAGE = "https://download.cms.gov/nppes/NPI_Files.html";
export const SOURCE_LABEL = "CMS NPPES weekly dissemination file";
const MAX_ARCHIVE_BYTES = 50 * 1024 * 1024;

export const TAXONOMIES = new Map([
  ["101YM0800X", "Mental health counselor"],
  ["261QM0801X", "Mental health clinic"],
  ["251S00000X", "Community / behavioral health"],
  ["101YP2500X", "Professional counselor"],
  ["103K00000X", "Behavior analyst"],
  ["106H00000X", "Marriage and family therapist"],
  ["103T00000X", "Psychologist"],
  ["261QM0850X", "Adult mental health clinic"]
]);

export function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { current += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  values.push(current.replace(/\r$/, ""));
  return values;
}

export function periodFromFilename(name) {
  const iso = /(20\d{2})(\d{2})(\d{2})[-_](20\d{2})(\d{2})(\d{2})/.exec(name);
  if (iso) return { start: `${iso[1]}-${iso[2]}-${iso[3]}`, end: `${iso[4]}-${iso[5]}-${iso[6]}` };
  const short = /(\d{2})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/.exec(name);
  if (!short) throw new Error(`Cannot determine the weekly period from ${name}`);
  const date = (month, day, year) => `20${year}-${month}-${day}`;
  return { start: date(short[1], short[2], short[3]), end: date(short[4], short[5], short[6]) };
}

export function normalizeStates(states) {
  if (states == null) return [];
  if (!Array.isArray(states)) throw new Error("states must be an array of two-letter codes");
  const normalized = [...new Set(states.map((state) => String(state).trim().toUpperCase()).filter(Boolean))].sort();
  if (normalized.some((state) => !/^[A-Z]{2}$/.test(state))) throw new Error("Each state must be a two-letter code");
  return normalized;
}

export async function latestWeeklyUrl(fetchImpl = fetch) {
  const response = await fetchImpl(CMS_PAGE, { headers: { "user-agent": "PracticeRadar-Apify/1.0 (+https://actablesite.com/practice-radar)" } });
  if (!response.ok) throw new Error(`CMS file page returned HTTP ${response.status}`);
  const html = await response.text();
  const candidates = [...html.matchAll(/href=["']([^"']*NPPES_Data_Dissemination_\d{6}_\d{6}_Weekly_V2\.zip)["']/gi)]
    .map((match) => new URL(match[1], CMS_PAGE))
    .filter((url) => url.hostname === "download.cms.gov")
    .map((url) => ({ url: url.toString(), period: periodFromFilename(url.pathname) }))
    .sort((left, right) => left.period.end.localeCompare(right.period.end));
  if (!candidates.length) throw new Error("CMS published no recognizable weekly V2 archive");
  return candidates.at(-1).url;
}

export async function downloadArchive(url, fetchImpl = fetch) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "download.cms.gov" || !/NPPES_Data_Dissemination_\d{6}_\d{6}_Weekly_V2\.zip$/i.test(parsed.pathname)) {
    throw new Error("Refusing an archive outside the expected CMS weekly-file path");
  }
  const response = await fetchImpl(parsed, { headers: { "user-agent": "PracticeRadar-Apify/1.0 (+https://actablesite.com/practice-radar)" } });
  if (!response.ok) throw new Error(`CMS weekly archive returned HTTP ${response.status}`);
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > MAX_ARCHIVE_BYTES) throw new Error("CMS weekly archive exceeded the 50 MB safety limit");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_ARCHIVE_BYTES) throw new Error("CMS weekly archive exceeded the 50 MB safety limit");
  return bytes;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function formatDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value || "");
  return match ? `${match[3]}-${match[1]}-${match[2]}` : value;
}

function rowValue(row, headers, name) {
  const index = headers.get(name);
  return index == null ? "" : row[index] || "";
}

async function extractMainCsv(archiveBytes, workDir) {
  await mkdir(workDir, { recursive: true });
  const zip = new AdmZip(archiveBytes);
  const entries = zip.getEntries().filter((entry) => !entry.isDirectory && /^npidata_pfile_\d{8}-\d{8}\.csv$/i.test(basename(entry.entryName)));
  if (entries.length !== 1) throw new Error(`Expected one primary NPI CSV; found ${entries.length}`);
  const entry = entries[0];
  const csvPath = join(workDir, basename(entry.entryName));
  await writeFile(csvPath, entry.getData());
  return { csvPath, filename: basename(entry.entryName) };
}

async function filterCsv(csvPath, period) {
  const lines = createInterface({ input: createReadStream(csvPath), crlfDelay: Infinity });
  let headers;
  let inputRows = 0;
  let newOrganizations = 0;
  const candidates = [];

  for await (const line of lines) {
    if (!headers) {
      headers = new Map(parseCsvLine(line).map((name, index) => [name, index]));
      continue;
    }
    inputRows += 1;
    const row = parseCsvLine(line);
    if (rowValue(row, headers, "Entity Type Code") !== "2") continue;
    const enumerationDate = formatDate(rowValue(row, headers, "Provider Enumeration Date"));
    if (enumerationDate < period.start || enumerationDate > period.end) continue;
    if (rowValue(row, headers, "NPI Deactivation Date")) continue;
    newOrganizations += 1;
    const taxonomyCodes = Array.from({ length: 15 }, (_, index) => rowValue(row, headers, `Healthcare Provider Taxonomy Code_${index + 1}`));
    const matchedCode = taxonomyCodes.find((code) => TAXONOMIES.has(code));
    if (!matchedCode) continue;
    const state = rowValue(row, headers, "Provider Business Practice Location Address State Name").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(state)) continue;
    candidates.push({
      npi: rowValue(row, headers, "NPI"),
      organization: rowValue(row, headers, "Provider Organization Name (Legal Business Name)").trim(),
      address_1: rowValue(row, headers, "Provider First Line Business Practice Location Address").trim(),
      address_2: rowValue(row, headers, "Provider Second Line Business Practice Location Address").trim(),
      city: rowValue(row, headers, "Provider Business Practice Location Address City Name").trim(),
      state,
      postal_code: rowValue(row, headers, "Provider Business Practice Location Address Postal Code").trim(),
      telephone: rowValue(row, headers, "Provider Business Practice Location Address Telephone Number").trim(),
      fax: rowValue(row, headers, "Provider Business Practice Location Address Fax Number").trim(),
      enumeration_date: enumerationDate,
      last_update_date: formatDate(rowValue(row, headers, "Last Update Date")),
      focus: TAXONOMIES.get(matchedCode),
      taxonomy_code: matchedCode,
      authorized_official: [rowValue(row, headers, "Authorized Official First Name"), rowValue(row, headers, "Authorized Official Last Name")].filter(Boolean).join(" ").trim(),
      authorized_official_title: rowValue(row, headers, "Authorized Official Title or Position").trim(),
      authorized_official_phone: rowValue(row, headers, "Authorized Official Telephone Number").trim()
    });
  }

  const unique = new Map();
  for (const candidate of candidates) {
    const key = [candidate.organization, candidate.city, candidate.state].map((value) => value.toUpperCase()).join("|");
    if (!unique.has(key)) unique.set(key, candidate);
  }
  const records = [...unique.values()].sort((left, right) => left.state.localeCompare(right.state) || left.city.localeCompare(right.city) || left.organization.localeCompare(right.organization));
  return { inputRows, newOrganizations, records };
}

export function selectPreview(records, count = 15) {
  const selected = [];
  const preferredStates = ["CA", "TX", "FL", "NC", "WA", ...new Set(records.map((record) => record.state))];
  for (const state of preferredStates) {
    const record = records.find((item) => item.state === state && item.organization && !selected.some((selectedItem) => selectedItem.npi === item.npi));
    if (record) selected.push(record);
    if (selected.length === count) break;
  }
  return selected;
}

export async function buildEdition({ archiveBytes, sourceUrl, states = [], workDir }) {
  const normalizedStates = normalizeStates(states);
  const { csvPath, filename } = await extractMainCsv(archiveBytes, workDir);
  try {
    const period = periodFromFilename(filename);
    const { inputRows, newOrganizations, records: allRecords } = await filterCsv(csvPath, period);
    if (allRecords.length < 50) throw new Error(`Failing closed: only ${allRecords.length} behavioral-health organizations were selected`);
    const records = normalizedStates.length ? allRecords.filter((record) => normalizedStates.includes(record.state)) : allRecords;
    const byState = Object.fromEntries([...new Set(records.map((record) => record.state))].sort().map((state) => [state, records.filter((record) => record.state === state).length]));
    const receipt = {
      schema_version: 1,
      generated_at: new Date().toISOString(),
      source: {
        publisher: "Centers for Medicare & Medicaid Services",
        page_url: CMS_PAGE,
        file_url: sourceUrl,
        archive_sha256: sha256(archiveBytes),
        csv_sha256: sha256(await readFile(csvPath))
      },
      period,
      input_rows: inputRows,
      newly_enumerated_type_2_organizations: newOrganizations,
      selected_unique_records_national: allRecords.length,
      eligible_records_after_state_filter: records.length,
      state_filter: normalizedStates,
      by_state: byState,
      taxonomy_codes: Object.fromEntries(TAXONOMIES),
      limitations: "An NPI record does not prove licensure, credentialing, active operation, independence, service availability, demand, or buying intent. Verify every record before relying on it."
    };
    const enriched = records.map((record) => ({ ...record, edition_start: period.start, edition_end: period.end, source: SOURCE_LABEL }));
    return { receipt, records: enriched };
  } finally {
    await rm(csvPath, { force: true });
  }
}
