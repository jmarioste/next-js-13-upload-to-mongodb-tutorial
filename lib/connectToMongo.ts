import { MongoClient, GridFSBucket } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoClient: MongoClient | null;
  var gridFSBucket: GridFSBucket | null;
}
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

export async function connectToMongo() {
  if (global.mongoClient) {
    return {
      client: global.mongoClient,
      bucket: global.gridFSBucket!,
    };
  }

  const client = (global.mongoClient = new MongoClient(MONGODB_URI!, {}));
  const bucket = (global.gridFSBucket = new GridFSBucket(client.db(), {
    bucketName: "images",
  }));

  await global.mongoClient.connect();
  console.log("Connected to db");
  return { client, bucket: bucket! };
}
