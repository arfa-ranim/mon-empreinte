"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { 
  Package, ChevronDown, ChevronUp, Sparkles,
  AlertCircle, CheckCircle, Save, X,
  Loader2, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { useValidation, FormValue } from "@/hooks/useValidation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


interface ProductFormData {
  [key: string]: FormValue;
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
    className="w-full flex items-center justify-between py-2 hover:bg-cream-50 dark:hover:bg-earth-800 px-2 -mx-2 rounded-lg transition-colors touch-manipulation group"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-peach-light/20 dark:bg-peach/10 flex items-center justify-center text-peach group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-left">
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800 dark:text-earth-200">
          {title}
        </h2>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-earth-400 dark:text-earth-500 bg-cream-100 dark:bg-earth-800 px-2 py-0.5 rounded-full">
        {isOpen ? "Ouvert" : "Fermé"}
      </span>
      {isOpen ? <ChevronUp size={20} className="text-earth-400" /> : <ChevronDown size={20} className="text-earth-400" />}
    </div>
  </button>
);

const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  placeholder,
  rows,
  options,
  className = "",
  min,
  max,
  step,
  maxLength,
  showCharCount,
}: {
  label: string;
  id: string;
  type?: string;
  value: FormValue;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { label: string; value: string }[];
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  maxLength?: number;
  showCharCount?: boolean;
}) => {
  const isError = touched && !!error;
  const isValid = touched && !error && 
    (Array.isArray(value) ? value.length > 0 : Boolean(value));

  const stringValue = Array.isArray(value) ? value.join(", ") : String(value);

  return (
    <div className={className}>
      {type !== "checkbox" && (
        <label htmlFor={id} className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          value={Array.isArray(value) ? (value[0] || "") : String(value)}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          onBlur={onBlur}
          className={cn(
            "w-full px-4 py-3 rounded-lg border transition-all text-base sm:text-sm appearance-none bg-white dark:bg-earth-900",
            "focus:outline-none focus:ring-2 focus:ring-peach focus:border-transparent",
            isError
              ? "border-red-400 ring-2 ring-red-200"
              : isValid
              ? "border-green-400 ring-2 ring-green-200"
              : "border-earth-200 dark:border-earth-700"
          )}
          aria-label={label}
          aria-invalid={isError ? "true" : "false"}
          aria-describedby={isError ? `${id}-error` : undefined}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <>
          <textarea
            id={id}
            rows={rows || 4}
            value={stringValue}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-all resize-none text-base sm:text-sm",
              "focus:outline-none focus:ring-2 focus:ring-peach focus:border-transparent",
              isError
                ? "border-red-400 ring-2 ring-red-200"
                : isValid
                ? "border-green-400 ring-2 ring-green-200"
                : "border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900"
            )}
            aria-invalid={isError ? "true" : "false"}
            aria-describedby={isError ? `${id}-error` : undefined}
          />
          {showCharCount && maxLength && (
            <div className={cn(
              "text-xs text-right mt-1",
              stringValue.length >= maxLength ? "text-red-500" : "text-earth-400"
            )}>
              {stringValue.length} / {maxLength}
            </div>
          )}
        </>
      ) : type === "checkbox" ? (
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={onBlur}
            className="w-5 h-5 rounded border-earth-300 dark:border-earth-600 text-peach focus:ring-peach focus:ring-2 focus:ring-offset-2 transition-colors"
            aria-invalid={isError ? "true" : "false"}
          />
          <label htmlFor={id} className="text-sm text-earth-700 dark:text-earth-300 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={stringValue}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          className={cn(
            "w-full px-4 py-3 rounded-lg border transition-all text-base sm:text-sm",
            "focus:outline-none focus:ring-2 focus:ring-peach focus:border-transparent",
            isError
              ? "border-red-400 ring-2 ring-red-200"
              : isValid
              ? "border-green-400 ring-2 ring-green-200"
              : "border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900"
          )}
          aria-invalid={isError ? "true" : "false"}
          aria-describedby={isError ? `${id}-error` : undefined}
        />
      )}

      {isError && (
        <div id={`${id}-error`} className="error-message mt-1.5 flex items-center gap-1.5 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {isValid && type !== "checkbox" && (
        <div className="success-message mt-1.5 flex items-center gap-1.5 text-green-600 text-sm">
          <CheckCircle size={14} />
          Valide
        </div>
      )}
    </div>
  );
};

// Progress indicator component
function FormProgress({ current, total, label }: { current: number; total: number; label: string }) {
  const percentage = (current / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-earth-100 dark:bg-earth-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-warm rounded-full"
        />
      </div>
      <span className="text-xs text-earth-400 dark:text-earth-500 font-medium whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

// Auto-save indicator
function AutoSaveIndicator({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {saving && (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-xs text-earth-500 dark:text-earth-400"
        >
          <Loader2 size={14} className="animate-spin" />
          Sauvegarde automatique...
        </motion.div>
      )}
      {saved && !saving && (
        <motion.div
          key="saved"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-1.5 text-xs text-green-500"
        >
          <CheckCircle size={14} />
          Sauvegardé
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [sections, setSections] = useState({
    basic: true,
    inventory: true,
    status: true,
    images: true,
  });

 const initialFormData = useMemo<ProductFormData>(() => ({
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
  }), [initialData]);


  const validationRules = {
    title: { required: true, minLength: 3, maxLength: 100, message: "Titre requis (3-100 caractères)" },
    description: { required: true, minLength: 10, maxLength: 2000, message: "Description requise (10-2000 caractères)" },
    price: { required: true, min: 0.01, message: "Prix valide requis" },
    sku: { maxLength: 50, message: "SKU maximum 50 caractères" },
    weight: { min: 0, message: "Le poids doit être ≥ 0" },
  };

  const {
    values: form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setFieldValue,
  } = useValidation(initialFormData, validationRules);

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categoryOptions = [
    "Accessoires", "Bijoux", "Décoration", "Textile", 
    "Bougies", "Sac", "Art mural", "Vêtements", "Autre"
  ];

  // Define handleAutoSave BEFORE it's used in useEffect
  const handleAutoSave = useCallback(async () => {
    setSaving(true);
    // Simulate auto-save - in production, this would save to a draft
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!isEditing) return;
    
    const interval = setInterval(() => {
      // Check if any field has changed from initial
      const hasChanges = Object.keys(initialFormData).some(key => {
        if (key === 'images') {
          return JSON.stringify(form[key]) !== JSON.stringify(initialFormData[key]);
        }
        return form[key] !== initialFormData[key];
      });
      
      if (hasChanges) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [form, initialFormData, isEditing, handleAutoSave]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    const payload = {
      title: String(form.title),
      description: String(form.description),
      price: parseFloat(String(form.price)) || 0,
      category: String(form.category),
      inStock: Boolean(form.inStock),
      sku: String(form.sku),
      weight: form.weight ? parseFloat(String(form.weight)) : null,
      dimensions: String(form.dimensions),
      tags: String(form.tags),
      featured: Boolean(form.featured),
      images: form.images as string[],
    };

    const url = isEditing ? `/api/products/${productId}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "Produit mis à jour ! ✅" : "Produit créé avec succès ! 🎉");
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'enregistrement");
        setLoading(false);
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  }

  const sectionCount = Object.keys(sections).length;
  const completedSections = Object.values(sections).filter(v => v).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-peach" />
            <span className="text-sm font-medium text-earth-700 dark:text-earth-300">
              Progression du formulaire
            </span>
          </div>
          <AutoSaveIndicator saving={saving} saved={saved} />
        </div>
        <FormProgress 
          current={completedSections} 
          total={sectionCount} 
          label={`${completedSections}/${sectionCount}`}
        />
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200 transition-colors"
        >
          {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          {previewMode ? "Masquer l'aperçu" : "Aperçu en direct"}
        </button>
      </div>

      {/* Section 1: Basic Info */}
      <motion.section
        initial={false}
        animate={{ opacity: previewMode ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
      >
        <SectionHeader 
          title="Informations générales" 
          icon={<Package className="text-peach" size={20} />}
          isOpen={sections.basic}
          onToggle={() => toggleSection('basic')}
        />
        <AnimatePresence>
          {sections.basic && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              <FormField
                id="title"
                label="Titre du produit"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                error={errors.title}
                touched={touched.title}
                required
                placeholder="ex: Sac en macramé naturel"
                maxLength={100}
                showCharCount
              />
              <FormField
                id="description"
                label="Description"
                type="textarea"
                rows={4}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                error={errors.description}
                touched={touched.description}
                required
                placeholder="Décrivez votre produit en détail..."
                maxLength={2000}
                showCharCount
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="price"
                  label="Prix (DT)"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  onBlur={() => handleBlur('price')}
                  error={errors.price}
                  touched={touched.price}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <FormField
                  id="category"
                  label="Catégorie"
                  type="select"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  error={errors.category}
                  touched={touched.category}
                  options={[
                    { label: "Sélectionnez une catégorie", value: "" },
                    ...categoryOptions.map(cat => ({ label: cat, value: cat }))
                  ]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Section 2: Inventory */}
      <motion.section
        initial={false}
        animate={{ opacity: previewMode ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
      >
        <SectionHeader 
          title="Inventaire & Détails" 
          icon={<Package className="text-mint" size={20} />}
          isOpen={sections.inventory}
          onToggle={() => toggleSection('inventory')}
        />
        <AnimatePresence>
          {sections.inventory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="sku"
                  label="SKU"
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  onBlur={() => handleBlur('sku')}
                  error={errors.sku}
                  touched={touched.sku}
                  placeholder="PROD-001"
                  maxLength={50}
                  showCharCount
                />
                <FormField
                  id="weight"
                  label="Poids (kg)"
                  type="number"
                  value={form.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  onBlur={() => handleBlur('weight')}
                  error={errors.weight}
                  touched={touched.weight}
                  placeholder="0.5"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="dimensions"
                  label="Dimensions"
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => handleChange('dimensions', e.target.value)}
                  onBlur={() => handleBlur('dimensions')}
                  error={errors.dimensions}
                  touched={touched.dimensions}
                  placeholder="20x15x10 cm"
                />
                <FormField
                  id="tags"
                  label="Tags (séparés par des virgules)"
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  onBlur={() => handleBlur('tags')}
                  error={errors.tags}
                  touched={touched.tags}
                  placeholder="fait main, macramé, bohème"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Section 3: Status */}
      <motion.section
        initial={false}
        animate={{ opacity: previewMode ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
      >
        <SectionHeader 
          title="Statut & Visibilité" 
          icon={<Package className="text-gold" size={20} />}
          isOpen={sections.status}
          onToggle={() => toggleSection('status')}
        />
        <AnimatePresence>
          {sections.status && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  id="inStock"
                  label="En stock"
                  type="checkbox"
                  value={form.inStock}
                  onChange={(e) => handleChange('inStock', (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
                  onBlur={() => handleBlur('inStock')}
                  error={errors.inStock}
                  touched={touched.inStock}
                />
                <FormField
                  id="featured"
                  label="Mettre en avant"
                  type="checkbox"
                  value={form.featured}
                  onChange={(e) => handleChange('featured', (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
                  onBlur={() => handleBlur('featured')}
                  error={errors.featured}
                  touched={touched.featured}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Section 4: Images */}
      <motion.section
        initial={false}
        animate={{ opacity: previewMode ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
      >
        <SectionHeader 
          title="Images du produit" 
          icon={<Package className="text-lavender" size={20} />}
          isOpen={sections.images}
          onToggle={() => toggleSection('images')}
        />
        <AnimatePresence>
          {sections.images && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              <ImageUpload 
                images={form.images as string[]} 
                onChange={(images) => setFieldValue('images', images)} 
              />
              <p className="text-xs text-earth-400 dark:text-earth-500">
                Formats acceptés: JPG, PNG • Taille max: 5MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Action Buttons with sticky footer */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sticky bottom-0 bg-cream-50/95 dark:bg-earth-900/95 backdrop-blur-sm p-4 -mx-4 px-4 sm:mx-0 sm:px-0 rounded-t-2xl border-t border-earth-100 dark:border-earth-800 z-10">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? "Mettre à jour" : "Créer le produit"}
            </>
          )}
        </Button>
        <Button 
          href="/admin/products" 
          variant="secondary" 
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <X size={18} />
          Annuler
        </Button>
        {isEditing && productId && (
          <Button 
            href={`/produits/${productId}`} 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            external
          >
            <Eye size={18} />
            Voir sur le site
          </Button>
        )}
      </div>
    </form>
  );
}