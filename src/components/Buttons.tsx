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
  gold: "border-gold bg-gold text-ink hover:bg-[#d7b777]",
  light: "border-porcelain bg-porcelain text-ink hover:bg-white",
  ghost: "border-white/20 bg-white/5 text-porcelain hover:border-gold/70 hover:bg-gold/10"
};

export function Button({ href, children, tone = "ghost", onClick, type = "button" }: ButtonProps) {
  const className =
    "inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/70 " +
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
