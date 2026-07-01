import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  tone?: "gold" | "light" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
};

const toneClass = {
  gold: "border-gold bg-gold text-ink shadow-[0_14px_30px_rgba(197,155,86,0.22)] hover:bg-[#d7b777]",
  light: "border-porcelain bg-porcelain text-ink hover:bg-white",
  ghost: "border-white/25 bg-white/[0.06] text-porcelain hover:border-gold/70 hover:bg-gold/10"
};

export function Button({ href, children, tone = "ghost", onClick, type = "button" }: ButtonProps) {
  const className =
    "inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold/70 sm:min-h-11 sm:px-5 sm:py-2.5 " +
    toneClass[tone];

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
