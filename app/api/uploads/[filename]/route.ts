import { connectToDb } from "@/lib/mongo";
import { NextResponse } from "next/server";

type Params = {
  params: { filename: string };
};

export async function GET(req: Request, { params }: Params) {
  // 1. get GridFS bucket
  const { bucket } = await connectToDb();

  const filename = params.filename as string;
  // 2. validate the filename
  if (!filename) {
    return new NextResponse(null, { status: 400, statusText: "Bad Request" });
  }

  const files = await bucket.find({ filename }).toArray();
  if (!files.length) {
    return new NextResponse(null, { status: 404, statusText: "Not found" });
  }

  // 3. get file data
  const file = files.at(0)!;

  // 4. get the file contents as stream
  // Force the type to be ReadableStream since NextResponse doesn't accept GridFSBucketReadStream
  const stream = bucket.openDownloadStreamByName(
    filename
  ) as unknown as ReadableStream;

  // 5. return a streamed response
  return new NextResponse(stream, {
    headers: {
      "Content-Type": file.contentType!,
    },
  });
}
