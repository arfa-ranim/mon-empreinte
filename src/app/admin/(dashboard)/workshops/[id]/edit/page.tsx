"use client";

import { useState, useEffect } from "react";
import WorkshopForm from "@/components/WorkshopForm";

interface Workshop {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration?: string;
  location?: string;
  maxParticipants?: number;
  image?: string;
  // Add any other fields your WorkshopForm expects
}

export default function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const [workshopId, setWorkshopId] = useState<string>("");
  const [initialData, setInitialData] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ id }) => {
      setWorkshopId(id);
      try {
        const res = await fetch(`/api/workshops/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInitialData(data);
        }
      } catch (error) {
        console.error("Failed to fetch workshop:", error);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  if (loading) {
    return <p className="text-earth-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-earth-800">
          Modifier l{"'"}atelier
        </h1>
        <span className="text-sm text-earth-500 bg-cream-100 px-4 py-2 rounded-full">
          ✨ Version améliorée
        </span>
      </div>

      {initialData ? (
        <WorkshopForm 
          initialData={initialData} 
          isEditing={true} 
          workshopId={workshopId}
        />
      ) : (
        <p className="text-red-600">Impossible de charger l{"'"}atelier.</p>
      )}
    </div>
  );
}