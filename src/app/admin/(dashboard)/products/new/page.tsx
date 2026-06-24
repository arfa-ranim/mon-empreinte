"use client";

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-earth-800">
          Nouveau produit
        </h1>
        <span className="text-sm text-earth-500 bg-cream-100 px-4 py-2 rounded-full">
          ✨ Version améliorée
        </span>
      </div>
      <ProductForm />
    </div>
  );
}