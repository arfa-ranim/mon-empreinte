"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Leaf } from "lucide-react";
import Button from "@/components/Button";

interface Settings {
  brandName: string;
  tagline: string;
  description: string;
  instagram: string;
  logo: string;
}

interface HeroSectionProps {
  settings: Settings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 -left-20 w-72 h-72 bg-peach rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-mint rounded-full blur-3xl opacity-20 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-600px h-600px bg-lavender rounded-full blur-3xl opacity-10" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gold rounded-full blur-2xl opacity-15 animate-pulse-glow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-earth-600 mb-6 border border-earth-100"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Artisanat tunisien fait main
            <Sparkles size={14} className="text-gold ml-1" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-earth-800 leading-tight"
          >
            {settings.brandName}
            <span className="block text-gradient-warm mt-2">
              Créations authentiques
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-earth-600 max-w-2xl mx-auto leading-relaxed"
          >
            {settings.tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-3 text-earth-500 max-w-xl mx-auto text-sm"
          >
            {settings.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              href="/produits"
              variant="primary"
              className="px-8 py-4 text-lg shadow-soft hover:shadow-elevation-3 transition-all duration-300 group"
            >
              <span className="mr-2">✨</span>
              Découvrir nos produits
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              href="/ateliers"
              variant="outline"
              className="px-8 py-4 text-lg border-2 hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              🎨 Nos ateliers
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-earth-500"
          >
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-peach" />
              <span>Fait main avec passion</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-mint" />
              <span>Upcycling & durable</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-lavender" />
              <span>Pièces uniques</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}