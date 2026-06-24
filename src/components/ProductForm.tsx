"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { 
  Package, Tag, Ruler, Weight, 
  Image as ImageIcon, Star, ChevronDown, ChevronUp 
} from "lucide-react";

// --- Types ---
interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  sku: string;
  weight: string;
  dimensions: string;
  tags: string;
  featured: boolean;
  images: string[];
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    price?: number;
    category?: string | null;
    inStock?: boolean;
    sku?: string | null;
    weight?: number | null;
    dimensions?: string | null;
    tags?: string | null;
    featured?: boolean;
    images?: string;
  };
  isEditing?: boolean;
  productId?: string;
}

// --- SectionHeader component (moved outside to avoid render-time creation) ---
const SectionHeader = ({ 
  title, icon, isOpen, onToggle 
}: { 
  title: string; 
  icon: React.ReactNode; 
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex items-center justify-between py-2 hover:bg-cream-50 px-2 -mx-2 rounded-lg transition-colors touch-manipulation"
  >
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
        {title}
      </h2>
    </div>
    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);

// --- Main Component ---
export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState({
    basic: true,
    inventory: true,
    status: true,
    images: true,
  });
  
  const [form, setForm] = useState<ProductFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    category: initialData?.category || "",
    inStock: initialData?.inStock ?? true,
    sku: initialData?.sku || "",
    weight: initialData?.weight?.toString() || "",
    dimensions: initialData?.dimensions || "",
    tags: initialData?.tags || "",
    featured: initialData?.featured ?? false,
    images: initialData?.images ? JSON.parse(initialData.images) : [],
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categoryOptions = [
    "Accessoires",
    "Bijoux",
    "Décoration",
    "Textile",
    "Bougies",
    "Sac",
    "Art mural",
    "Vêtements",
    "Autre"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category: form.category,
      inStock: form.inStock,
      sku: form.sku,
      weight: form.weight ? parseFloat(form.weight) : null,
      dimensions: form.dimensions,
      tags: form.tags,
      featured: form.featured,
      images: form.images,
    };

    const url = isEditing ? `/api/products/${productId}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Erreur lors de l'enregistrement");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* Basic Info */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Informations générales" 
          icon={<Package className="text-peach" size={20} />}
          isOpen={sections.basic}
          onToggle={() => toggleSection('basic')}
        />
        
        {sections.basic && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Titre du produit *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent transition-all text-base sm:text-sm"
                placeholder="ex: Sac en macramé naturel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent transition-all resize-none text-base sm:text-sm"
                placeholder="Décrivez votre produit en détail..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Prix (DT) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 font-medium">
                    DT
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  aria-label="Catégorie du produit"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Inventaire & Détails" 
          icon={<Package className="text-mint" size={20} />}
          isOpen={sections.inventory}
          onToggle={() => toggleSection('inventory')}
        />
        
        {sections.inventory && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  SKU
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="PROD-001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Poids (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="0.5"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Dimensions
                </label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="20x15x10 cm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  placeholder="fait main, macramé, bohème"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Status */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Statut & Visibilité" 
          icon={<Star className="text-gold" size={20} />}
          isOpen={sections.status}
          onToggle={() => toggleSection('status')}
        />
        
        {sections.status && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-earth-200">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="w-5 h-5 rounded border-earth-300 text-peach focus:ring-peach"
                  aria-label="En stock"
                />
                <label htmlFor="inStock" className="text-sm text-earth-700 font-medium">
                  En stock
                </label>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-earth-200">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-earth-300 text-gold focus:ring-gold"
                  aria-label="Mettre en avant"
                />
                <label htmlFor="featured" className="text-sm text-earth-700 font-medium flex items-center gap-1">
                  <Star size={16} className="text-gold" />
                  Mettre en avant
                </label>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Images du produit" 
          icon={<ImageIcon className="text-lavender" size={20} />}
          isOpen={sections.images}
          onToggle={() => toggleSection('images')}
        />
        
        {sections.images && (
          <div className="mt-4 space-y-2">
            <ImageUpload 
              images={form.images} 
              onChange={(images) => setForm({ ...form, images })} 
            />
            <p className="text-xs text-earth-400">
              Formats acceptés: JPG, PNG • Taille max: 5MB
            </p>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base"
        >
          {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button href="/admin/products" variant="secondary" className="w-full sm:w-auto">
          Annuler
        </Button>
      </div>
    </form>
  );
}