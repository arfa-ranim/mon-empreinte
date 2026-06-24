"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { 
  Calendar, Users, DollarSign, Image as ImageIcon, 
  MapPin, Package, AlertCircle, CheckCircle, XCircle,
  ChevronDown, ChevronUp
} from "lucide-react";
// Clock removed (unused)

// --- Types ---
interface WorkshopFormData {
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

// --- SectionHeader component (moved outside to avoid render-time creation) ---
const SectionHeader = ({
  title,
  icon,
  isOpen,
  onToggle,
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

// --- Main Component ---
export default function WorkshopForm({ initialData, isEditing, workshopId }: WorkshopFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sections, setSections] = useState({
    basic: true,
    date: true,
    pricing: true,
    status: true,
    image: true,
  });

  const [form, setForm] = useState<WorkshopFormData>({
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
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const statusOptions = [
    { value: "available", label: "✅ Disponible", icon: CheckCircle, color: "text-green-600" },
    { value: "full", label: "🔴 Complet", icon: XCircle, color: "text-red-600" },
    { value: "cancelled", label: "❌ Annulé", icon: XCircle, color: "text-gray-500" },
    { value: "draft", label: "📝 Brouillon", icon: AlertCircle, color: "text-yellow-600" },
  ];

  const skillLevels = [
    { value: "débutant", label: "🌱 Débutant" },
    { value: "intermédiaire", label: "🌿 Intermédiaire" },
    { value: "avancé", label: "🌳 Avancé" },
  ];

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        newErrors.endDate = "La date de fin doit être après la date de début";
      }
    }

    if (form.startDate === form.endDate && form.startTime && form.endTime) {
      if (form.endTime <= form.startTime) {
        newErrors.endTime = "L'heure de fin doit être après l'heure de début";
      }
    }

    if (form.availableSeats && parseInt(form.availableSeats) < 0) {
      newErrors.availableSeats = "Les places doivent être ≥ 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      startTime: form.startTime,
      endTime: form.endTime,
      duration: form.startTime && form.endTime ? `${form.startTime} - ${form.endTime}` : "",
      availableSeats: form.availableSeats ? parseInt(form.availableSeats) : null,
      maxSpots: form.maxSpots ? parseInt(form.maxSpots) : null,
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
      router.push("/admin/workshops");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Erreur lors de l'enregistrement");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* 📝 Basic Info */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Informations générales"
          icon={<span className="text-peach text-xl">📝</span>}
          isOpen={sections.basic}
          onToggle={() => toggleSection("basic")}
        />

        {sections.basic && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Titre de l&apos;atelier *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent transition-all text-base sm:text-sm"
                placeholder="ex: Atelier Macramé Débutant"
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
                placeholder="Décrivez votre atelier en détail..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Niveau requis
                </label>
                <select
                  value={form.skillLevel}
                  onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  aria-label="Niveau requis"
                >
                  <option value="">Sélectionnez un niveau</option>
                  {skillLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Lieu
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="Adresse du lieu"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 📅 Date & Time - Mobile Optimized */}
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
              <div>
                    <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-earth-700 mb-1"
                    >
                    Date de début *
                    </label>

                    <input
                    id="startDate"
                    type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1"
                htmlFor="endDate">
                  Date de fin *
                </label>
                <input
                  id="endDate"
                 type="date"
                  required
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.endDate ? "border-red-400" : "border-earth-200"
                  } focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-earth-700 mb-1">
                  Heure de début *
                </label>
                <input
                  id="startTime"
                 type="time" 
                  required
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-earth-700 mb-1">
                  Heure de fin *
                </label>
                <input
                  id="endTime"
                 type="time" 
                  required
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.endTime ? "border-red-400" : "border-earth-200"
                  } focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm`}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 💰 Pricing & Seats */}
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
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Prix par personne (DT) *
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
                  Places disponibles *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.availableSeats}
                    onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.availableSeats ? "border-red-400" : "border-earth-200"
                    } focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm`}
                    placeholder="0"
                  />
                </div>
                {errors.availableSeats && (
                  <p className="text-red-500 text-sm mt-1">{errors.availableSeats}</p>
                )}
                <p className="text-xs text-earth-500 mt-2 flex items-start gap-1">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Indique le nombre de places disponibles sur Warshati.</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Matériel fourni
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                <input
                  value={form.materials}
                  onChange={(e) => setForm({ ...form, materials: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  placeholder="ex: Tissus, fils, ciseaux, colle..."
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 📊 Status - Mobile Friendly Grid */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Statut de l&apos;atelier"
          icon={<AlertCircle className="text-lavender" size={20} />}
          isOpen={sections.status}
          onToggle={() => toggleSection("status")}
        />

        {sections.status && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = form.status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, status: option.value })}
                    className={`p-2 sm:p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center ${
                      isSelected
                        ? "border-peach bg-peach-light/20 shadow-sm"
                        : "border-earth-200 hover:border-earth-300"
                    }`}
                    aria-label={`Statut: ${option.label}`}
                  >
                    <Icon size={16} className={`${option.color} sm:size-[18px]`} />
                    <span className={`text-xs sm:text-sm ${isSelected ? "font-medium" : ""}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 🖼️ Image */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <SectionHeader
          title="Image de l&apos;atelier"
          icon={<ImageIcon className="text-lavender" size={20} />}
          isOpen={sections.image}
          onToggle={() => toggleSection("image")}
        />

        {sections.image && (
          <div className="mt-4 space-y-2">
            <ImageUpload images={form.images} onChange={(images) => setForm({ ...form, images })} />
            <p className="text-xs text-earth-400">Formats acceptés: JPG, PNG • Taille max: 5MB</p>
          </div>
        )}
      </section>

      {/* Actions - Mobile Optimized */}
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