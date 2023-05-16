import { GridFSUtils } from "@/lib/GrdFSUtils";
import { connectToMongo } from "@/lib/connectToMongo";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: Request, response: Response) {
  const { bucket } = await connectToMongo();
  const data = await req.formData();
  for (const entry of Array.from(data.entries())) {
    const [key, value] = entry;
    // FormDataEntryValue can either be type `Blob` or `string`
    // if its type is object then it's a Blob
    const isFile = typeof value == "object";

    if (isFile) {
      const blob = value as Blob;
      const filename = blob.name;

      const existing = await GridFSUtils.fileExists(filename);
      if (existing) {
        // If file already exists, let's skip it.
        // If you want a different behavior such as override, modify this part.
        continue;
      }

      const buffer = Buffer.from(await blob.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(filename);
      await stream.pipe(uploadStream);
    }
  }

  // return the response after all the entries have been processed.
  return NextResponse.json({ success: true });
}
