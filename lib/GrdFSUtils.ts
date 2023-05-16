import { Readable } from "stream";
import { connectToDb } from "./mongo";

export class GridFSUtils {
  static async fileExists(filename: string): Promise<boolean> {
    const { client } = await connectToDb();
    const count = await client
      .db()
      .collection("images.files")
      .countDocuments({ filename });

    return !!count;
  }
}
