import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { put } from "@vercel/blob"; 

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.log("Upload error: No file found in request");
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5MB)" }, { status: 400 });
    }

    const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;
    
    console.log("✅ Token status:", token ? "Present" : "MISSING");
    console.log("📁 File name:", file.name);
    console.log("📏 File size:", file.size);

    if (!token) {
      console.error("❌ BLOB_READ_WRITE_TOKEN is not set on Vercel runtime");
      return NextResponse.json({ error: "Upload configuration missing" }, { status: 500 });
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: token,
      addRandomSuffix: true,
    });

    console.log("✅ Upload successful:", blob.url);
    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("❌ Upload error details:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}