import * as https from "https";
import { createWriteStream } from "fs";
import { validateInvoice } from "../utils/invoice.validator.js";

const apiUrl = process.env.INVOICE_GENERATOR_API_URL;
const apiKey = process.env.INVOICE_GENERATOR_API_KEY;

if (!apiUrl) {
  throw new Error("INVOICE_GENERATOR_API_URL environment variable is not set");
}

if (!apiKey) {
  throw new Error("INVOICE_GENERATOR_API_KEY environment variable is not set");
}

export const generateInvoice = async (invoice, filename) => {
  // Validate invoice
  const validation = await validateInvoice(invoice);
  if (!validation.valid) {
    throw new Error(`Validation errors: ${JSON.stringify(validation.errors)}`);
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
      Authorization: `Bearer ${apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const file = createWriteStream(filename);

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code: ${res.statusCode}`));
        file.end();
        return;
      }

      res.on("data", (d) => {
        file.write(d);
      });

      res.on("end", () => {
        file.end((err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Invoice generated.");
            resolve();
          }
        });
      });
    });

    req.on("error", (e) => {
      console.error(`Error when generating invoice: ${e.message}`);
      if (!file.closed) {
        file.end();
      }
      reject(e);
    });

    req.write(invoiceData);
    req.end();
  });
};
