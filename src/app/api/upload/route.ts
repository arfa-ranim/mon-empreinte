import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { put } from "@vercel/blob"; 

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error("BLOB_READ_WRITE_TOKEN is not set");
      return NextResponse.json({ error: "Upload configuration missing" }, { status: 500 });
    }


const blob = await put(file.name, file, {
  access: "public", // 👈 Change to public
  token: token,
  addRandomSuffix: true,
});

return NextResponse.json({ url: blob.url });

  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}
