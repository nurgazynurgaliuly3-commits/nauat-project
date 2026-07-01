import Image from "next/image";
import Link from "next/link";
import { ArrowRight, History, Menu, Search } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { getDb } from "@/lib/storage";

export default async function HeritageIndexPage({ searchParams }: { searchParams: { category?: string } }) {
  const db = await getDb();
  const categories = ["Тарихи орындар", "Тұлғалар", "Жәдігерлер", "Ұлттық тағам тарихы"];
  const selected = searchParams.category;
  const items = db.heritageItems.filter((item) => item.status !== "hidden" && (!selected || item.category === selected));

  return (
    <main className="frontend-type min-h-screen bg-[#F7F1E7] pb-24 text-[#1B3022] lg:pb-0">
      <section className="relative overflow-hidden bg-[#1B3022] text-white">
        <Image src={db.settings.heroImage} alt="Heritage жобасы" fill priority className="object-cover opacity-34" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B3022]/78 via-[#1B3022]/84 to-[#1B3022]" />
        <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <header className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022]" aria-label="Мәзір">
              <Menu size={21} />
            </button>
            <Link href="/" className="text-center text-[13px] font-semibold tracking-[0.18em]">NAUAT HERITAGE 2.0</Link>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022]" aria-label="Іздеу">
              <Search size={20} />
            </button>
          </header>

          <div className="max-w-3xl py-16 md:py-24">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-medium text-[#C5A059]">
              <History size={16} /> Мұрағат
            </p>
            <h1 className="font-display text-[42px] font-semibold leading-tight sm:text-6xl">Heritage жобасы</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Қазалы өңірінің тарихи орындары, тұлғалары, жәдігерлері және ұлттық тағам тарихы Nauat кеңістігінде QR арқылы таныстырылады.
            </p>
          </div>
        </div>
      </section>

      <section id="heritage-list" className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
          <Link className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${!selected ? "border-[#1B3022] bg-[#1B3022] text-white" : "border-[#1B3022]/10 bg-white text-[#1B3022]"}`} href="/heritage">
            Барлығы
          </Link>
          {categories.map((category) => (
            <Link className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${selected === category ? "border-[#1B3022] bg-[#1B3022] text-white" : "border-[#1B3022]/10 bg-white text-[#1B3022]"}`} href={`/heritage?category=${encodeURIComponent(category)}`} key={category}>
              {category}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-[#1B3022]/10 transition hover:-translate-y-1 hover:shadow-xl" href={`/heritage/${item.slug}`} key={item.slug}>
              <Image src={item.image} alt={item.title.kk} width={720} height={460} className="h-48 w-full object-cover sm:h-52" />
              <div className="p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6D4C41]">{item.category}</p>
                <h2 className="font-display text-3xl font-semibold">{item.title.kk}</h2>
                <p className="mt-2 text-sm leading-6 text-black/62">{item.short.kk}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#1B3022]">
                  Толығырақ <ArrowRight className="ml-2" size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
