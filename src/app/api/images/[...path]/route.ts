import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathname = path.join('/');

    if (!pathname) {
      return NextResponse.json({ error: "Missing pathname" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 500 });
    }

    const result = await get(pathname, {
      token: token,
      access: "private",
    });

    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Type": result.blob.contentType || "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}