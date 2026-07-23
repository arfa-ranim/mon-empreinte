"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

// Helper to convert blob URL to proxy URL
function getProxyUrl(url: string): string {
  if (url.includes('.private.blob.vercel-storage.com')) {
    // Convert private blob URL to proxy URL
    const blobUrl = new URL(url);
    const pathname = blobUrl.pathname.substring(1);
    return `/api/images/${pathname}`;
  }
  return url;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        newImages.push(data.url);
      }
    }

    onChange(newImages);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => {
          const displayUrl = getProxyUrl(url);
          return (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-earth-200">
              <Image src={displayUrl} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Supprimer l'image ${i + 1}`}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <label className="inline-flex items-center gap-2 px-4 py-2 bg-earth-100 text-earth-700 rounded-lg cursor-pointer hover:bg-earth-200 transition-colors">
        <Upload size={18} />
        {uploading ? "Upload en cours..." : "Ajouter des images"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}