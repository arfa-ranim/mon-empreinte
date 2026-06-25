// src/components/EmptyState.tsx
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionVariant?: "primary" | "secondary" | "outline";
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  actionVariant = "primary",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 max-w-sm mx-auto">
      {icon && (
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-peach-light/30 flex items-center justify-center text-peach">
            {icon}
          </div>
        </div>
      )}
      <h3 className="font-serif text-2xl font-semibold text-earth-800 mb-2">
        {title}
      </h3>
      <p className="text-earth-500 text-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref} variant={actionVariant}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}