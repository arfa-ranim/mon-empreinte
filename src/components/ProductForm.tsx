"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { 
  Package, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useValidation, FormValue } from "@/hooks/useValidation";

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
    className="w-full flex items-center justify-between py-2 hover:bg-cream-50 px-2 -mx-2 rounded-lg transition-colors touch-manipulation"
  >
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">{title}</h2>
    </div>
    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
        <label htmlFor={id} className="block text-sm font-medium text-earth-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          value={Array.isArray(value) ? (value[0] || "") : String(value)}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          onBlur={onBlur}
          className={`w-full px-4 py-3 rounded-lg border transition-all text-base sm:text-sm ${
            isError
              ? "border-red-400 ring-2 ring-red-200"
              : isValid
              ? "border-green-400 ring-2 ring-green-200"
              : "border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent"
          }`}
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
            className={`w-full px-4 py-3 rounded-lg border transition-all resize-none text-base sm:text-sm ${
              isError
                ? "border-red-400 ring-2 ring-red-200"
                : isValid
                ? "border-green-400 ring-2 ring-green-200"
                : "border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent"
            }`}
            aria-invalid={isError ? "true" : "false"}
            aria-describedby={isError ? `${id}-error` : undefined}
          />
          {showCharCount && maxLength && (
            <div className={`char-counter ${stringValue.length >= maxLength ? "limit" : ""}`}>
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
            className="w-5 h-5 rounded border-earth-300 text-peach focus:ring-peach"
            aria-invalid={isError ? "true" : "false"}
          />
          <label htmlFor={id} className="text-sm text-earth-700 font-medium">
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
          className={`w-full px-4 py-3 rounded-lg border transition-all text-base sm:text-sm ${
            isError
              ? "border-red-400 ring-2 ring-red-200"
              : isValid
              ? "border-green-400 ring-2 ring-green-200"
              : "border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent"
          }`}
          aria-invalid={isError ? "true" : "false"}
          aria-describedby={isError ? `${id}-error` : undefined}
        />
      )}

      {isError && (
        <div id={`${id}-error`} className="error-message mt-1 flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {isValid && type !== "checkbox" && (
        <div className="success-message mt-1 flex items-center gap-1 text-green-600 text-sm">
          <CheckCircle size={14} />
          Valide
        </div>
      )}
    </div>
  );
};

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState({
    basic: true,
    inventory: true,
    status: true,
    images: true,
  });

  const initialFormData: ProductFormData = {
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
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Informations générales" 
          icon={<Package className="text-peach" size={20} />}
          isOpen={sections.basic}
          onToggle={() => toggleSection('basic')}
        />
        {sections.basic && (
          <div className="mt-4 space-y-4">
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
          </div>
        )}
      </section>

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
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Statut & Visibilité" 
          icon={<Package className="text-gold" size={20} />}
          isOpen={sections.status}
          onToggle={() => toggleSection('status')}
        />
        {sections.status && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                id="inStock"
                label="En stock"
                type="checkbox"
                value={form.inStock}
                // ✅ Cast to HTMLInputElement to access .checked safely
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
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader 
          title="Images du produit" 
          icon={<Package className="text-lavender" size={20} />}
          isOpen={sections.images}
          onToggle={() => toggleSection('images')}
        />
        {sections.images && (
          <div className="mt-4 space-y-2">
            <ImageUpload 
              // ✅ Cast needed because hook returns FormValue, but ImageUpload expects string[]
              images={form.images as string[]} 
              onChange={(images) => setFieldValue('images', images)} 
            />
            <p className="text-xs text-earth-400">
              Formats acceptés: JPG, PNG • Taille max: 5MB
            </p>
          </div>
        )}
      </section>

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