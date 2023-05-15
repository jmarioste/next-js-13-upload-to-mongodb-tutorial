import { Readable } from "stream";
import { connectToMongo } from "./connectToMongo";

export class GridFSService {
  static async fileExists(filename: string): Promise<boolean> {
    const { client } = await connectToMongo();
    const count = await client
      .db()
      .collection("fs.files")
      .countDocuments({ filename });

    return !!count;
  }

  static async blobToStream(blob: Blob) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const stream = Readable.from(buffer);
    return stream;
  }
}
