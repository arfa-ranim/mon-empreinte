"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/ProductForm";

interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string;
  category?: string | null;
  inStock: boolean;
  sku?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  tags?: string | null;
  featured?: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string>("");
  const [initialData, setInitialData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ id }) => {
      setProductId(id);
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInitialData(data);
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return <p className="text-earth-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-earth-800">
          Modifier le produit
        </h1>
        <span className="text-sm text-earth-500 bg-cream-100 px-4 py-2 rounded-full">
          ✨ Version améliorée
        </span>
      </div>
      <ProductForm 
        initialData={initialData} 
        isEditing={true} 
        productId={productId}
      />
    </div>
  );
}