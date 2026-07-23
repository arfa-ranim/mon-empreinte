import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "warm" | "cool";
}

export default function GradientText({
  children,
  className,
  variant = "warm",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "text-gradient-warm",
        variant === "cool" && "bg-gradient-cool",
        className
      )}
      style={{
        backgroundImage:
          variant === "warm"
            ? "linear-gradient(135deg, #FFB5A0 0%, #F0DBA8 100%)"
            : "linear-gradient(135deg, #A8D8C8 0%, #D4C5F9 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}