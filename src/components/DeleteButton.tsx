"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; 

export default function DeleteButton({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    if (res.ok) {
      toast.success("Élément supprimé avec succès ! 🗑️");
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 sm:p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 touch-manipulation min-h-11 min-w-11 flex items-center justify-center"
      aria-label="Supprimer"
    >
      <Trash2 size={18} className="sm:size-4" />
    </button>
  );
}