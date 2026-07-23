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
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would send this to your API
      // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
      
      setSubscribed(true);
      toast.success("✅ Merci de vous être abonné !");
      setEmail("");
      
      // Reset subscribed state after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-peach-light/30 dark:bg-earth-800 rounded-2xl p-6 sm:p-8 text-center">
      <AnimatePresence mode="wait">
        {subscribed ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle size={48} className="text-green-500" />
            <h4 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200">
              Merci pour votre abonnement !
            </h4>
            <p className="text-earth-600 dark:text-earth-400 text-sm">
              Vous recevrez nos prochaines nouveautés.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200">
              Newsletter
            </h3>
            <p className="text-earth-600 dark:text-earth-400 text-sm mt-2">
              Recevez nos nouveautés et offres exclusives
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-peach focus:border-transparent dark:bg-earth-900 dark:text-earth-200 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-peach text-earth-900 rounded-lg font-medium hover:bg-peach/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? "..." : "S'abonner"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}