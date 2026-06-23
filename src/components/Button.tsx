import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "whatsapp";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
}

const variants = {
  primary: "bg-earth-700 text-white hover:bg-earth-800",
  secondary: "bg-cream-200 text-earth-800 hover:bg-cream-300",
  outline: "border-2 border-earth-700 text-earth-700 hover:bg-earth-700 hover:text-white",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1da851]",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200",
    variants[variant],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
