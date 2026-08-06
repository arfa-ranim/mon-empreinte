"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        toast.success("✅ Merci de vous être abonné !");
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-earth-800/50 dark:bg-earth-800/50 rounded-2xl p-4 sm:p-6">
      <AnimatePresence mode="wait">
        {subscribed ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <CheckCircle size={40} className="text-green-400" />
            <h4 className="font-serif text-lg font-semibold text-cream-100">
              Merci !
            </h4>
            <p className="text-cream-300 text-sm text-center">
              Vous recevrez nos prochaines nouveautés.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="w-full px-4 py-3 rounded-xl border border-earth-700/50 bg-earth-900/50 text-cream-100 placeholder:text-cream-400/60 focus:outline-none focus:ring-2 focus:ring-peach/50 focus:border-transparent transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-peach text-earth-900 rounded-xl font-medium hover:bg-peach/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send size={16} />
              {loading ? "Envoi..." : "S'abonner"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}