"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Sparkles, Calendar, CalendarRange, Leaf, TreePine, Check } from "lucide-react";

const filters = [
  { value: "", label: "Tous", icon: Sparkles },
  { value: "week", label: "Cette semaine", icon: Calendar },
  { value: "month", label: "Ce mois", icon: CalendarRange },
  { value: "débutant", label: "Débutant", icon: Leaf },
  { value: "intermédiaire", label: "Intermédiaire", icon: Leaf },
  { value: "avancé", label: "Avancé", icon: TreePine },
  { value: "available", label: "Disponible", icon: Check },
];

export default function WorkshopFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("filter") || "";

  const buildHref = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("filter", value);
    else params.delete("filter");
    params.delete("page"); // reset pagination on filter change
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav
      className="flex flex-wrap justify-center gap-2"
      aria-label="Filtrer les ateliers"
    >
      {filters.map(({ value, label, icon: Icon }) => {
        const isActive = current === value;
        return (
          <Link
            key={value || "all"}
            href={buildHref(value)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
              isActive
                ? "bg-peach text-earth-900 border-peach shadow-soft"
                : "bg-white dark:bg-earth-900 text-earth-700 dark:text-earth-300 border-earth-200 dark:border-earth-700 hover:bg-cream-100 dark:hover:bg-earth-800 hover:border-earth-300 dark:hover:border-earth-600"
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}