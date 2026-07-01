import type { ElementType, ReactNode } from "react";

type TextTone = "light" | "dark" | "gold" | "muted";
type HeadingSize = "hero" | "section" | "card" | "article";

const toneClass: Record<TextTone, string> = {
  light: "text-porcelain",
  dark: "text-ink",
  gold: "text-gold",
  muted: "text-linen/76"
};

const headingSizeClass: Record<HeadingSize, string> = {
  hero: "text-[44px] leading-[0.96] sm:text-6xl lg:text-7xl",
  section: "text-[34px] leading-tight sm:text-5xl",
  card: "text-[27px] leading-tight sm:text-3xl",
  article: "text-[36px] leading-tight sm:text-6xl"
};

export function Heading({
  as,
  size = "section",
  tone = "light",
  className = "",
  children
}: {
  as?: ElementType;
  size?: HeadingSize;
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as || "h2";
  return (
    <Tag className={`font-display font-semibold ${headingSizeClass[size]} ${toneClass[tone]} ${className}`}>
      {children}
    </Tag>
  );
}

export function BodyText({
  tone = "muted",
  className = "",
  children
}: {
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}) {
  return <p className={`text-body text-base sm:text-lg ${toneClass[tone]} ${className}`}>{children}</p>;
}

export function MutedText({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`text-helper ${className}`}>{children}</p>;
}

export function Eyebrow({
  tone = "gold",
  className = "",
  children
}: {
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}) {
  return <p className={`text-overline ${toneClass[tone]} ${className}`}>{children}</p>;
}
