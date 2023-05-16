import { MongoClient, GridFSBucket } from "mongodb";
declare global {
  var client: MongoClient | null;
  var bucket: GridFSBucket | null;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/* 
  Initializes the connection to mongodb and creates a GridFSBucket
  Once connected, it will use the cached connection.
 */
export async function connectToDb() {
  if (global.client) {
    return {
      client: global.client,
      bucket: global.bucket!,
    };
  }

  const client = (global.client = new MongoClient(MONGODB_URI!, {}));
  const bucket = (global.bucket = new GridFSBucket(client.db(), {
    bucketName: "images",
  }));

  await global.client.connect();
  console.log("Connected to the Database ");
  return { client, bucket: bucket! };
}

// utility to check if a file exists in the images bucket.
export async function fileExists(filename: string): Promise<boolean> {
  const { client } = await connectToDb();
  const count = await client
    .db()
    .collection("images.files")
    .countDocuments({ filename });

  return !!count;
}
