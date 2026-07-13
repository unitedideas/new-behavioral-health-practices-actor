import { join } from "node:path";
import { Actor, log } from "apify";
import { buildEdition, downloadArchive, latestWeeklyUrl, selectPreview } from "./lib.js";

await Actor.init();

try {
  const input = await Actor.getInput() || {};
  const preview = input.preview !== false;
  const states = input.states || [];
  const sourceUrl = await latestWeeklyUrl();
  log.info("Resolved the latest CMS weekly archive", { sourceUrl });
  const archiveBytes = await downloadArchive(sourceUrl);
  const workDir = join(process.cwd(), "work", String(Date.now()));
  const edition = await buildEdition({ archiveBytes, sourceUrl, states, workDir });

  let records;
  let access;
  if (preview) {
    records = selectPreview(edition.records);
    access = "preview";
  } else {
    const pricing = Actor.getChargingManager().getPricingInfo();
    if (!pricing.isPayPerEvent && process.env.APIFY_IS_AT_HOME) {
      throw new Error("The full edition is unavailable until pay-per-event pricing is active. Run the free preview instead.");
    }
    const charge = await Actor.charge({ eventName: "weekly-edition" });
    if ((charge.chargedCount ?? 0) < 1) {
      await Actor.setValue("OUTPUT", {
        ok: false,
        status: "charge_limit_reached",
        message: "The run's maximum charge did not allow one full weekly edition. Increase the run limit or use the free preview.",
        receipt: edition.receipt,
        records_returned: 0
      });
      log.warning("No full edition was delivered because the run charge limit was reached");
      await Actor.exit("No full edition was delivered because the run charge limit was reached.");
    }
    records = edition.records;
    access = "full_weekly_edition";
  }

  const dataset = await Actor.openDataset();
  await dataset.pushData(records);
  const output = {
    ok: true,
    status: "delivered",
    access,
    records_returned: records.length,
    receipt: edition.receipt,
    dataset_id: dataset.id,
    export_formats: ["json", "csv", "xlsx", "xml", "rss"]
  };
  await Actor.setValue("OUTPUT", output);
  log.info("Practice Radar edition delivered", { access, records: records.length, period: edition.receipt.period });
  await Actor.exit(`Delivered ${records.length} ${access === "preview" ? "preview" : "full-edition"} records.`);
} catch (error) {
  const message = error instanceof Error ? error.message : "The edition could not be produced.";
  log.error(message);
  await Actor.fail(message);
}
