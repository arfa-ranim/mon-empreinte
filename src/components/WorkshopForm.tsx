"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { 
  Calendar, DollarSign, Image as ImageIcon, 
  AlertCircle, CheckCircle,
  ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { useValidation } from "@/hooks/useValidation";

interface WorkshopFormData {
  [key: string]: string | string[];

  title: string;
  description: string;
  price: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  availableSeats: string;
  maxSpots: string;
  status: string;
  location: string;
  materials: string;
  skillLevel: string;
  availability: string;
  images: string[];
}

interface WorkshopFormProps {
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    price?: number;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    availableSeats?: number;
    maxSpots?: number;
    status?: string;
    location?: string;
    materials?: string;
    skillLevel?: string;
    availability?: string;
    images?: string;
  };
  isEditing?: boolean;
  workshopId?: string;
}

const SectionHeader = ({ title, icon, isOpen, onToggle }: {
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
  value: string | number | boolean | string[];
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
  const isValid =
    touched &&
    !error &&
    (Array.isArray(value) ? value.length > 0 : Boolean(value));

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-earth-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={id}
          value={Array.isArray(value) ? value[0] || "" : String(value)}
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
          aria-invalid={isError}                   
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
            value={Array.isArray(value) ? value.join(", ") : String(value)}
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
            aria-invalid={isError}                  
            aria-describedby={isError ? `${id}-error` : undefined}
          />
          {showCharCount && maxLength && (
            <div className={`char-counter ${String(value).length >= maxLength ? "limit" : ""}`}>
              {String(value).length || 0} / {maxLength}
            </div>
          )}
        </>
      ) : type === "checkbox" ? (
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={value as boolean}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={onBlur}
            className="w-5 h-5 rounded border-earth-300 text-peach focus:ring-peach"
            aria-invalid={isError}                  
          />
          <label htmlFor={id} className="text-sm text-earth-700 font-medium">
            {label}
          </label>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={Array.isArray(value) ? value.join(", ") : String(value)}
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
          aria-invalid={isError}                    
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

export default function WorkshopForm({ initialData, isEditing, workshopId }: WorkshopFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState({
    basic: true,
    date: true,
    pricing: true,
    status: true,
    image: true,
  });

  const initialFormData: WorkshopFormData = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    startDate: initialData?.startDate?.split("T")[0] || "",
    endDate: initialData?.endDate?.split("T")[0] || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    availableSeats: initialData?.availableSeats?.toString() || "",
    maxSpots: initialData?.maxSpots?.toString() || "",
    status: initialData?.status || "available",
    location: initialData?.location || "",
    materials: initialData?.materials || "",
    skillLevel: initialData?.skillLevel || "",
    availability: initialData?.availability || "",
    images: initialData?.images ? JSON.parse(initialData.images) : [],
  };

  const validationRules = {
    title: { required: true, minLength: 3, maxLength: 100, message: "Titre requis (3-100 caractères)" },
    description: { required: true, minLength: 10, maxLength: 2000, message: "Description requise (10-2000 caractères)" },
    price: { required: true, min: 0.01, message: "Prix valide requis" },
    startDate: { required: true, message: "Date de début requise" },
    endDate: { required: true, message: "Date de fin requise" },
    startTime: { required: true, message: "Heure de début requise" },
    endTime: { required: true, message: "Heure de fin requise" },
    availableSeats: { required: true, min: 0, message: "Places disponibles requises (≥ 0)" },
    maxSpots: { min: 0, message: "Le nombre de places doit être ≥ 0" },
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

  const validateForm = (): boolean => {
    if (!validateAll()) return false;

    if (form.startDate && form.endDate) {
      const start = new Date(String(form.startDate));
      const end = new Date(String(form.endDate));
      if (end < start) {
        toast.error("La date de fin doit être après la date de début");
        return false;
      }
    }

    if (form.startDate === form.endDate && form.startTime && form.endTime) {
      if (form.endTime <= form.startTime) {
        toast.error("L'heure de fin doit être après l'heure de début");
        return false;
      }
    }

    return true;
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const statusOptions = [
    { value: "available", label: "✅ Disponible" },
    { value: "full", label: "🔴 Complet" },
    { value: "cancelled", label: "❌ Annulé" },
    { value: "draft", label: "📝 Brouillon" },
  ];

  const skillLevels = [
    { value: "débutant", label: "🌱 Débutant" },
    { value: "intermédiaire", label: "🌿 Intermédiaire" },
    { value: "avancé", label: "🌳 Avancé" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(String(form.price)) || 0,
      startDate: form.startDate ? new Date(String(form.startDate)).toISOString() : null,
      endDate: form.endDate ? new Date(String(form.endDate)).toISOString() : null,
      startTime: form.startTime,
      endTime: form.endTime,
      duration: form.startTime && form.endTime ? `${form.startTime} - ${form.endTime}` : "",
      availableSeats: form.availableSeats ? parseInt(String(form.availableSeats)) : null,
      maxSpots: form.maxSpots ? parseInt(String(form.maxSpots)) : null,
      status: form.status,
      location: form.location,
      materials: form.materials,
      skillLevel: form.skillLevel,
      availability: form.availability,
      images: form.images,
    };

    const url = isEditing ? `/api/workshops/${workshopId}` : "/api/workshops";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(isEditing ? "Atelier mis à jour ! ✅" : "Atelier créé avec succès ! 🎉");
      router.push("/admin/workshops");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Erreur lors de l'enregistrement");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Informations générales"
          icon={<span className="text-peach text-xl">📝</span>}
          isOpen={sections.basic}
          onToggle={() => toggleSection("basic")}
        />
        {sections.basic && (
          <div className="mt-4 space-y-4">
            <FormField
              id="title"
              label="Titre de l'atelier"
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={errors.title}
              touched={touched.title}
              required
              placeholder="ex: Atelier Macramé Débutant"
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
              placeholder="Décrivez votre atelier en détail..."
              maxLength={2000}
              showCharCount
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="skillLevel"
                label="Niveau requis"
                type="select"
                value={form.skillLevel}
                onChange={(e) => handleChange('skillLevel', e.target.value)}
                onBlur={() => handleBlur('skillLevel')}
                error={errors.skillLevel}
                touched={touched.skillLevel}
                options={[
                  { label: "Sélectionnez un niveau", value: "" },
                  ...skillLevels
                ]}
              />
              <FormField
                id="location"
                label="Lieu"
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                error={errors.location}
                touched={touched.location}
                placeholder="Adresse du lieu"
              />
            </div>
          </div>
        )}
      </section>

      {/* Date & Heure Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Date & Heure"
          icon={<Calendar className="text-mint" size={20} />}
          isOpen={sections.date}
          onToggle={() => toggleSection("date")}
        />
        {sections.date && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="startDate"
                label="Date de début"
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                onBlur={() => handleBlur('startDate')}
                error={errors.startDate}
                touched={touched.startDate}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <FormField
                id="endDate"
                label="Date de fin"
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                error={errors.endDate}
                touched={touched.endDate}
                required
                min={form.startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="startTime"
                label="Heure de début"
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                onBlur={() => handleBlur('startTime')}
                error={errors.startTime}
                touched={touched.startTime}
                required
              />
              <FormField
                id="endTime"
                label="Heure de fin"
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                onBlur={() => handleBlur('endTime')}
                error={errors.endTime}
                touched={touched.endTime}
                required
              />
            </div>
          </div>
        )}
      </section>

      {/* Prix & Places Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Prix & Places"
          icon={<DollarSign className="text-gold" size={20} />}
          isOpen={sections.pricing}
          onToggle={() => toggleSection("pricing")}
        />
        {sections.pricing && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="price"
                label="Prix par personne (DT)"
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
                id="availableSeats"
                label="Places disponibles"
                type="number"
                value={form.availableSeats}
                onChange={(e) => handleChange('availableSeats', e.target.value)}
                onBlur={() => handleBlur('availableSeats')}
                error={errors.availableSeats}
                touched={touched.availableSeats}
                required
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <FormField
              id="materials"
              label="Matériel fourni"
              type="text"
              value={form.materials}
              onChange={(e) => handleChange('materials', e.target.value)}
              onBlur={() => handleBlur('materials')}
              error={errors.materials}
              touched={touched.materials}
              placeholder="ex: Tissus, fils, ciseaux, colle..."
            />
          </div>
        )}
      </section>

      {/* Statut Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Statut de l'atelier"
          icon={<AlertCircle className="text-lavender" size={20} />}
          isOpen={sections.status}
          onToggle={() => toggleSection("status")}
        />
        {sections.status && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {statusOptions.map((option) => {
                const isSelected = form.status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFieldValue('status', option.value)}
                    className={`p-2 sm:p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center ${
                      isSelected
                        ? "border-peach bg-peach-light/20 shadow-sm"
                        : "border-earth-200 hover:border-earth-300"
                    }`}
                    aria-label={`Statut: ${option.label}`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Image Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Image de l'atelier"
          icon={<ImageIcon className="text-lavender" size={20} />}
          isOpen={sections.image}
          onToggle={() => toggleSection("image")}
        />
        {sections.image && (
          <div className="mt-4 space-y-2">
            <ImageUpload
              images={Array.isArray(form.images) ? form.images : []}
              onChange={(images) => setFieldValue("images", images)}
            />
            <p className="text-xs text-earth-400">Formats acceptés: JPG, PNG • Taille max: 5MB</p>
          </div>
        )}
      </section>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base"
        >
          {loading
            ? "Enregistrement..."
            : isEditing
              ? "Mettre à jour"
              : "Créer l'atelier"}
        </Button>
        <Button href="/admin/workshops" variant="secondary" className="w-full sm:w-auto">
          Annuler
        </Button>
      </div>
    </form>
  );
}