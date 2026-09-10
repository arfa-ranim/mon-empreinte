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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non supporté" },
        { status: 400 }
      );
    }
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;

    console.log("✅ Token status:", token ? "Present" : "MISSING");
    console.log("📁 Original filename:", file.name);
    console.log("📏 File size:", file.size);

    if (!token) {
      console.error("❌ PUBLIC_BLOB_READ_WRITE_TOKEN is not set on Vercel runtime");
      return NextResponse.json(
        { error: "Upload configuration missing" },
        { status: 500 }
      );
    }

    // ✅ Sanitize filename — prevents URL-encoding issues that cause
    // Next.js image optimizer timeouts (spaces, commas, accents, etc.)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")         // strip extension
      .toLowerCase()
      .normalize("NFD")                  // decompose accented chars
      .replace(/[\u0300-\u036f]/g, "")   // remove diacritics
      .replace(/\s+/g, "-")              // spaces → dashes
      .replace(/[^a-z0-9-]/g, "")        // remove anything else
      .replace(/-+/g, "-")               // collapse multiple dashes
      .replace(/^-|-$/g, "")             // trim leading/trailing dashes
      .slice(0, 40) || "image";          // limit length, fallback

    const sanitizedName = `${baseName}.${extension}`;
    console.log("✨ Sanitized filename:", sanitizedName);

    const blob = await put(sanitizedName, file, {
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