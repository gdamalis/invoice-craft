import { invoiceSchema } from "../model/invoice.schema.js";

export async function validateInvoice(invoice) {
  try {
    await invoiceSchema.validate(invoice, { abortEarly: false });
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.inner };
  }
}
