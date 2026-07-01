import Link from "next/link";
import { BookOpen, Home, QrCode, UtensilsCrossed } from "lucide-react";

export function MobileBottomNav() {
  const items = [
    { href: "/", label: "Басты", icon: Home },
    { href: "/menu", label: "Мәзір", icon: UtensilsCrossed },
    { href: "/heritage-menu", label: "Мұра ас", icon: BookOpen },
    { href: "/heritage", label: "Мұра", icon: QrCode }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-[#0f1712]/92 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-2xl backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-h-[54px] flex-col items-center justify-center rounded-md px-2 text-[11px] font-semibold text-linen/82 transition active:bg-white/10">
              <Icon size={18} className="mb-1 text-gold" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
