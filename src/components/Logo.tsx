import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className = "", compact = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Nauat басты беті">
      <Image
        src="/images/nauat-logo-white.png"
        alt="Nauat"
        width={compact ? 116 : 150}
        height={compact ? 54 : 70}
        priority
        className="h-auto w-[116px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:w-[150px]"
      />
    </Link>
  );
}
