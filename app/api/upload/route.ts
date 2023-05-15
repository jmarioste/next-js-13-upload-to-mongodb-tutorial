import { connectToMongo } from "@/lib/connectToMongo";
import { NextResponse } from "next/server";
import { Readable } from "stream";
export async function POST(req: Request, response: Response) {
  const { bucket, client } = await connectToMongo();
  const data = await req.formData();
  for (const entry of Array.from(data.entries())) {
    const [filename, value] = entry;

    const count = (await bucket.find({ filename }).toArray()).length;

    const existing = count > 0;

    if (existing) {
      return NextResponse.json(
        { message: `Filename ${filename} already exists.` },
        { status: 400 }
      );
    }

    const blob = value as unknown as Blob;
    const isBlob = "arrayBuffer" in blob;

    if (!existing && isBlob) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(filename);
      await stream.pipe(uploadStream);
    }
  }

  return NextResponse.json({ success: true });
}
