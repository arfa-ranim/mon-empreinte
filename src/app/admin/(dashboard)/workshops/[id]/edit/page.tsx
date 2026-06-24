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
    date: "",
    startTime: "",
    endTime: "",
    availability: "",
    maxSpots: "", // 👈 ADD THIS as string (for input)
    images: [] as string[],
  });

  useEffect(() => {
    params.then(async ({ id: workshopId }) => {
      setId(workshopId);
      const res = await fetch(`/api/workshops/${workshopId}`);
      if (res.ok) {
        const workshop = await res.json();
        
        // Extract start and end times from duration
        let startTime = "";
        let endTime = "";
        if (workshop.duration) {
          const parts = workshop.duration.split(" - ");
          if (parts.length === 2) {
            startTime = parts[0];
            endTime = parts[1];
          }
        }

        setForm({
          title: workshop.title,
          description: workshop.description,
          price: workshop.price.toString(),
          date: workshop.date ? workshop.date.split("T")[0] : "",
          startTime: startTime,
          endTime: endTime,
          availability: workshop.availability || "",
          maxSpots: workshop.maxSpots ? workshop.maxSpots.toString() : "", // 👈 ADD THIS
          images: parseImages(workshop.images),
        });
      }
      setFetching(false);
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Combine date + times for display
    const duration = form.startTime && form.endTime 
      ? `${form.startTime} - ${form.endTime}`
      : "";

    const res = await fetch(`/api/workshops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        date: form.date ? new Date(form.date).toISOString() : null,
        duration: duration,
        startTime: form.startTime,
        endTime: form.endTime,
        maxSpots: form.maxSpots ? parseInt(form.maxSpots) : null, // 👈 ADD THIS
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

        {/* Description */}
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

        {/* Date & Heure */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold text-earth-800">Date & Heure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label htmlFor="startTime" className="block text-sm font-medium text-earth-700 mb-1">
                Heure de début *
              </label>
              <input
                id="startTime"
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-earth-700 mb-1">
                Heure de fin *
              </label>
              <input
                id="endTime"
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
              />
            </div>
          </div>
        </div>

        {/* Prix & Visuel */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold text-earth-800">Prix & Visuel</h3>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-earth-700 mb-1">
              Prix par personne (DT) *
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
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Ajouter une image de l'atelier (JPG/PNG)
            </label>
            <ImageUpload images={form.images} onChange={(images) => setForm({ ...form, images })} />
          </div>
        </div>

        {/* Places ouvertes sur Warshati */}
        <div className="space-y-2">
          <label htmlFor="maxSpots" className="block text-sm font-medium text-earth-700 mb-1">
            Places ouvertes sur Warshati
          </label>
          <input
            id="maxSpots"
            type="number"
            min="1"
            value={form.maxSpots}
            onChange={(e) => setForm({ ...form, maxSpots: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
            placeholder="ex: 6"
          />
          <p className="text-xs text-earth-500">
            Indique le nombre de places que tu réserves aux participants venant de Warshati. Si tes places se remplissent ailleurs, pense à mettre l'atelier en pause ou à le marquer complet.
          </p>
        </div>

        {/* Availability (optional) */}
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-earth-700 mb-1">
            Disponibilité (optionnel)
          </label>
          <input
            id="availability"
            placeholder="ex: Places limitées, sur réservation..."
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-earth-300"
          />
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