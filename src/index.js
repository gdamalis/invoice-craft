import "dotenv/config.js";
import { connect } from "./services/database.service.js";
import { generateInvoice } from "./services/generate-invoice.service.js";
import { saveInvoice } from "./services/save-invoice.service.js";
import invoiceData from "../invoice.json" with { type: "json" };

const invoice = {
  number: invoiceData.number,
  date: new Date(`${invoiceData.date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  from: invoiceData.from,
  to: invoiceData.to,
  ship_to: invoiceData.ship_to,
  due_date: new Date(`${invoiceData.due_date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ),
  payment_terms: invoiceData.payment_terms,
  items: invoiceData.items,
  fields: {
    tax: "%",
    discounts: false,
    shipping: false,
  },
  tax: 0,
};

const fileName = process.env.FILE_NAME_FORMAT.replace(
  "{{number}}",
  invoice.number
);

const archive = async () => {
  // Setup connection to MongoDB
  const client = await connect();

  // Save invoice to MongoDB
  await saveInvoice(invoice, client);
};

const run = async () => {
  // --save-only archives an invoice that has already been generated, without
  // re-rendering it. Regenerating would spend another API call and rewrite the
  // PDF with a new creation date, which matters once the file has been reviewed
  // and filed.
  if (process.argv.includes("--save-only")) {
    console.log(`Archiving ${invoice.number} without regenerating the PDF.`);
    await archive();
    return;
  }

  const outputPath = await generateInvoice(invoice, fileName);
  console.log(`Saved to ${outputPath}`);

  if (process.argv.includes("--save")) {
    await archive();
  } else {
    console.log("Invoice not saved in the cloud.");
  }
};

run().catch((error) => {
  console.error(`Invoice generation failed: ${error.message}`);
  process.exitCode = 1;
});
