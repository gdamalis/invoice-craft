import * as https from "https";
import { createWriteStream } from "fs";
import { validateInvoice } from "../utils/invoice.validator.js";

const apiUrl = "invoice-generator.com";

export const generateInvoice = async (invoice, filename) => {
  // Validate invoice
  const validation = await validateInvoice(invoice);
  if (!validation.valid) {
    throw Error("Validation errors:", validation.errors);
  }

  const invoiceData = JSON.stringify(invoice);

  const options = {
    hostname: apiUrl,
    port: 443,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(invoiceData),
    },
  };

  const file = createWriteStream(filename);

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      file.write(d);
    });

    res.on("end", () => {
      file.end();
    });
  });

  req.write(invoiceData);
  req.end();
};
