"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { parseImages } from "@/lib/utils";

export default function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    availability: "",
    date: "", // 👈 ADD THIS
    images: [] as string[],
  });

  useEffect(() => {
    params.then(async ({ id: workshopId }) => {
      setId(workshopId);
      const res = await fetch(`/api/workshops/${workshopId}`);
      if (res.ok) {
        const workshop = await res.json();
        setForm({
          title: workshop.title,
          description: workshop.description,
          price: workshop.price.toString(),
          duration: workshop.duration,
          availability: workshop.availability || "",
          date: workshop.date ? workshop.date.split("T")[0] : "", // 👈 ADD THIS
          images: parseImages(workshop.images),
        });
      }
      setFetching(false);
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/workshops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        date: form.date ? new Date(form.date).toISOString() : null, // 👈 ADD THIS
      }),
    });

    if (res.ok) {
      router.push("/admin/workshops");
      router.refresh();
    } else {
      setLoading(false);
      alert("Erreur lors de la mise à jour");
    }
  }

  if (fetching) return <p className="text-earth-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-earth-800 mb-8">Modifier l&apos;atelier</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 bg-white rounded-2xl p-6 border border-earth-100">
            
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-1">
                    Titre *
                </label>
                <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
                />
            </div>

        <div>
                <label htmlFor="description" className="block text-sm font-medium text-earth-700 mb-1">
                    Description *
                </label>
                <textarea
                    id="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300 resize-none"
                />
            </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="price" className="block text-sm font-medium text-earth-700 mb-1">
                    Prix (DT) *
                </label>
                <input
                    id="price"
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
                  <label htmlFor="duration" className="block text-sm font-medium text-earth-700 mb-1">
                      Durée *
                  </label>
                  <input
                      id="duration"
                      required
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
                  />
              </div>
          </div>

        {/* Date and Availability */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-earth-700 mb-1">
                Date *
            </label>
            <input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
            />
        </div>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-earth-700 mb-1">
                Disponibilité
            </label>
            <input
                id="availability"
                placeholder="ex: Samedis"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
              Images
          </label>
          <ImageUpload images={form.images} onChange={(images) => setForm({ ...form, images })} />
        </div>

       <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button href="/admin/workshops" variant="secondary">
                Annuler
            </Button>
        </div>
      </form>
    </div>
  );
}