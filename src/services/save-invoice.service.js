export const saveInvoice = async (invoice, client) => {
  try {
    // Created date is set here to avoid issues with the object schema for the invoice generator API
    invoice.created_at = new Date();

    const db = client.db("contractor");

    const invoices = db.collection("invoices");
    const result = await invoices.insertOne(invoice, {creat});

    console.log("Invoice saved", result.insertedId);
  } catch (error) {
    console.error("Error saving invoice", error);
  } finally {
    await client.close();
  }
};
