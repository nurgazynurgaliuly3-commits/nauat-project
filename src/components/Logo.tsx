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
        src="/images/nauat-logo.jpg"
        alt="Nauat"
        width={compact ? 116 : 150}
        height={compact ? 54 : 70}
        priority
        className="h-auto w-[116px] rounded-sm bg-white/95 object-contain px-2 py-1 shadow-sm sm:w-[150px]"
      />
    </Link>
  );
}
