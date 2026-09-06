import * as https from "https";
import { createWriteStream, mkdirSync } from "fs";
import { homedir } from "os";
import { join, resolve as resolvePath } from "path";
import { validateInvoice } from "../utils/invoice.validator.js";

const apiUrl = process.env.INVOICE_GENERATOR_API_URL;
const apiKey = process.env.INVOICE_GENERATOR_API_KEY;

if (!apiUrl) {
  throw new Error("INVOICE_GENERATOR_API_URL environment variable is not set");
}

// The variable is named _URL and is used as a hostname, so accept either form.
// "https://invoice-generator.com" and "invoice-generator.com" both work; passing
// the former straight to https.request fails DNS in a way that reads like an
// outage rather than a config typo.
const apiHost = apiUrl.trim().replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");

if (!apiKey) {
  throw new Error("INVOICE_GENERATOR_API_KEY environment variable is not set");
}

// Where the PDF is written. OUTPUT_DIR is optional: without it the invoice lands
// in the current working directory, which is how this tool has always behaved.
// A leading "~" is expanded so the value can be kept portable across machines.
const resolveOutputPath = (filename) => {
  const configured = process.env.OUTPUT_DIR?.trim();

  if (!configured) {
    return resolvePath(filename);
  }

  const expanded =
    configured === "~" || configured.startsWith("~/")
      ? join(homedir(), configured.slice(1))
      : configured;

  const directory = resolvePath(expanded);
  mkdirSync(directory, { recursive: true });

  return join(directory, filename);
};

export const generateInvoice = async (invoice, filename) => {
  // Validate invoice
  const validation = await validateInvoice(invoice);
  if (!validation.valid) {
    throw new Error(`Validation errors: ${JSON.stringify(validation.errors)}`);
  }

  // Resolved up front so a bad OUTPUT_DIR fails before the API call is spent.
  const outputPath = resolveOutputPath(filename);

  const invoiceData = JSON.stringify(invoice);

  const options = {
    hostname: apiHost,
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
    const req = https.request(options, (res) => {
      // The stream is opened only after a success, so a failed request never
      // leaves a truncated PDF behind in the invoice archive.
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Request failed with status code: ${res.statusCode}`));
        return;
      }

      const file = createWriteStream(outputPath);

      file.on("error", reject);
      file.on("finish", () => {
        console.log("Invoice generated.");
        resolve(outputPath);
      });

      res.on("error", reject);
      res.pipe(file);
    });

    req.on("error", (e) => {
      console.error(`Error when generating invoice: ${e.message}`);
      reject(e);
    });

    req.write(invoiceData);
    req.end();
  });
};
