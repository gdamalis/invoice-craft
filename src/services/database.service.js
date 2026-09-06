import { MongoClient, ServerApiVersion } from "mongodb";

// The client is built inside connect() rather than at module load, so that
// MONGODB_URI is only required when the invoice is actually being archived.
// Constructing it eagerly meant an unset or placeholder URI threw on import
// and took the PDF generation down with it, even without --save.
export async function connect() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is not set; it is required for --save"
    );
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB");

    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
