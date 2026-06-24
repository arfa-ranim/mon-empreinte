import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 48, showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div
        className="relative rounded-full overflow-hidden border-2 border-earth-300 shadow-sm group-hover:shadow-glow bg-cream-100 shrink-0 group-hover:scale-105 transition-all duration-300"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.jpeg"
          alt={BRAND.name}
          width={size}
          height={size}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <span className="font-serif text-xl font-semibold text-earth-800 tracking-wide">
          {BRAND.name}
        </span>
      )}
    </Link>
  );
}