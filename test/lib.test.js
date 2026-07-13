import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { buildEdition, normalizeStates, parseCsvLine, periodFromFilename, selectPreview } from "../src/lib.js";

test("CSV parsing preserves quoted commas and escaped quotes", () => {
  assert.deepEqual(parseCsvLine('"A, B","said ""yes""",plain'), ["A, B", 'said "yes"', "plain"]);
});

test("weekly period parsing supports the CMS filename", () => {
  assert.deepEqual(periodFromFilename("npidata_pfile_20260629-20260705.csv"), { start: "2026-06-29", end: "2026-07-05" });
  assert.deepEqual(periodFromFilename("NPPES_Data_Dissemination_062926_070526_Weekly_V2.zip"), { start: "2026-06-29", end: "2026-07-05" });
});

test("state filters normalize and reject malformed values", () => {
  assert.deepEqual(normalizeStates(["wa", " CA ", "wa"]), ["CA", "WA"]);
  assert.throws(() => normalizeStates(["Washington"]), /two-letter/);
});

test("preview selection is deterministic and unique", () => {
  const records = [
    { npi: "1", state: "TX", organization: "Texas" },
    { npi: "2", state: "CA", organization: "California" },
    { npi: "3", state: "WA", organization: "Washington" }
  ];
  assert.deepEqual(selectPreview(records, 3).map((record) => record.npi), ["2", "1", "3"]);
});

test("the current CMS fixture produces a state-filtered edition", { skip: !process.env.PRACTICE_RADAR_FIXTURE }, async () => {
  const fixture = await readFile(process.env.PRACTICE_RADAR_FIXTURE);
  const result = await buildEdition({
    archiveBytes: fixture,
    sourceUrl: "https://download.cms.gov/nppes/NPPES_Data_Dissemination_062926_070526_Weekly_V2.zip",
    states: ["WA"],
    workDir: join(process.cwd(), "work", "test")
  });
  assert.equal(result.receipt.period.end, "2026-07-05");
  assert.equal(result.receipt.selected_unique_records_national, 423);
  assert.equal(result.records.length, 17);
  assert.ok(result.records.every((record) => record.state === "WA"));
});
