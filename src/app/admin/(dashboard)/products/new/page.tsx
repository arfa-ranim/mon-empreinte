"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    images: [] as string[],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setLoading(false);
      alert("Erreur lors de la création");
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-earth-800 mb-8">Nouveau produit</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 bg-white rounded-2xl p-6 border border-earth-100">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Titre *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Prix (DT) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Catégorie</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            className="rounded border-earth-300"
          />
          <label htmlFor="inStock" className="text-sm text-earth-700">En stock</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Images</label>
          <ImageUpload images={form.images} onChange={(images) => setForm({ ...form, images })} />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer le produit"}
          </Button>
          <Button href="/admin/products" variant="secondary">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
