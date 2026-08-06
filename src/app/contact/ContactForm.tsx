"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/Button";
import { toast } from "sonner";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    if (res.ok) {
      toast.success("Message envoyé avec succès ! ✅");
      e.currentTarget.reset();
    } else {
      const data = await res.json();
      toast.error(data.error || "Erreur lors de l'envoi");
    }
    setLoading(false);
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white rounded-2xl p-6 sm:p-8 border border-earth-100 shadow-sm space-y-5"
    >
      <h2 className="font-serif text-xl font-semibold text-earth-800">Envoyez-nous un message</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-1">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-earth-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50 resize-none"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        <Send size={18} />
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}