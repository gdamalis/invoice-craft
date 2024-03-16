import "dotenv/config.js";
import { connect } from "./services/database.service.js";
import { generateInvoice } from "./services/generate-invoice.service.js";
import { saveInvoice } from "./services/save-invoice.service.js";
import invoiceData from "../invoice.json" assert { type: 'json' };

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

// Generate invoice
generateInvoice(invoice, fileName).then(async () => {
  console.log("Invoice generated");
  // Setup connection to MongoDB
  const client = await connect();

  // Save invoice to MongoDB
  saveInvoice(invoice, client);
});
