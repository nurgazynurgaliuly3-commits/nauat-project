import Link from "next/link";
import { BookOpen, Contact, History, Home, UtensilsCrossed } from "lucide-react";

export function MobileBottomNav() {
  const items = [
    { href: "/", label: "Басты бет", icon: Home },
    { href: "/menu", label: "Негізгі", icon: UtensilsCrossed },
    { href: "/heritage-menu", label: "Қазалы", icon: BookOpen },
    { href: "/heritage", label: "Heritage", icon: History },
    { href: "/#booking", label: "Байланыс", icon: Contact }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#1B3022]/10 bg-[#F7F1E7]/96 px-1 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-2xl backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-h-[54px] flex-col items-center justify-center rounded-md px-1 text-[10px] font-semibold text-[#1B3022] transition active:bg-[#1B3022]/8">
              <Icon size={18} className="mb-1 text-[#C5A059]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
