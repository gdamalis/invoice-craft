export const saveInvoice = async (invoice, client) => {
  try {
    // Created date is set here to avoid issues with the object schema for the invoice generator API
    invoice.created_at = new Date();

    const db = client.db("contractor");

    const invoices = db.collection("invoices");
    const result = await invoices.insertOne(invoice);

    console.log("Invoice saved", result.insertedId);
  } catch (error) {
    // Rethrow for the same reason as connect(): a failed insert must not exit 0.
    throw new Error(`Error saving invoice: ${error.message}`);
  } finally {
    await client.close();
  }
};
