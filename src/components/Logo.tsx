import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  brandName?: string;
  logoUrl?: string;
  priority?: boolean;
}

export default function Logo({
  size = 48,
  showText = true,
  className = "",
  brandName = "Mon Empreinte",
  logoUrl = "/logo.png",
  priority = false,
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div
        className={`relative rounded-full overflow-hidden border-2 border-earth-300 dark:border-earth-600 shadow-sm 
                   group-hover:shadow-glow bg-cream-100 dark:bg-earth-800 shrink-0 group-hover:scale-105 
                   transition-all duration-300`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <Image
          src={logoUrl}
          alt={brandName}
          width={size}
          height={size}
          className="object-cover"
          priority={priority}
        />
      </div>

      {showText && (
        <span className="font-serif text-xl font-semibold text-earth-800 dark:text-cream-100 tracking-wide transition-colors">
          {brandName}
        </span>
      )}
    </Link>
  );
}