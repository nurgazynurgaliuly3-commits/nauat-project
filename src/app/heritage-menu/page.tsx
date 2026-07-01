import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Menu, Search, UtensilsCrossed } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { formatPrice, getDb } from "@/lib/storage";

const categories = [
  "Ұлттық тағамдар",
  "Қазалы мұрасынан шабыт алған тағамдар",
  "Тарихи тұлғаларға арналған тағамдар",
  "Арнайы сеттер",
  "Дәстүрлі сусындар",
  "Десерттер"
];

const menuCopy: Record<string, { title: string; category: string; description: string }> = {
  ulpershek: { title: "Үлпершек", category: "Ұлттық тағамдар", description: "Сағыныш пен сыйластық мағынасын сақтаған дәстүрлі ас." },
  "myzhyma-nan": { title: "Мыжыма нан", category: "Ұлттық тағамдар", description: "Дала дастарханының қарапайым, жылы әрі тойымды дәмі." },
  "jankent-set": { title: "Жанкент сеты", category: "Қазалы мұрасынан шабыт алған тағамдар", description: "Оғыз дәуірі мен Сыр бойы тарихынан шабыт алған арнайы сет." },
  "ghani-muratbayev-tea": { title: "Ғани Мұратбаев шайы", category: "Тарихи тұлғаларға арналған тағамдар", description: "Жастар рухы мен білімге құштарлықты бейнелейтін шай жиынтығы." },
  "korkyt-drink": { title: "Қорқыт сусыны", category: "Дәстүрлі сусындар", description: "Қобыз сарыны мен Сыр бойы аңыздарына арналған салқын сусын." },
  "begim-ana-dessert": { title: "Бегім ана десерті", category: "Десерттер", description: "Бегім ана мұнарасы туралы аңыздың нәзік әсеріне арналған жеңіл десерт." }
};

export default async function HeritageMenuPage() {
  const db = await getDb();
  const items = db.heritageMenuItems
    .filter((item) => item.status === "published")
    .map((item) => ({ ...item, ...(menuCopy[item.slug] || {}) }));

  return (
    <main className="frontend-type min-h-screen bg-[#F7F1E7] pb-24 text-[#1B3022] lg:pb-0">
      <section className="relative overflow-hidden bg-[#1B3022] text-white">
        <Image src={db.settings.heroImage} alt="Қазалы мұрасы мәзірі" fill priority className="object-cover opacity-38" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B3022]/78 via-[#1B3022]/84 to-[#1B3022]" />
        <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <header className="grid grid-cols-[44px_1fr_44px] items-center gap-3 text-white">
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
              <UtensilsCrossed size={16} /> Nauat Heritage 2.0
            </p>
            <h1 className="font-display text-[42px] font-semibold leading-tight sm:text-6xl">Қазалы мұрасы мәзірі</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Бұл толық кафе мәзірі емес. Мұнда Қазалы тарихымен, жергілікті мұрамен және ұлттық тағам мәдениетімен байланысқан арнайы концепциялық тағамдар көрсетіледі.
            </p>
            <Link href="/menu" className="mt-6 inline-flex items-center rounded-md bg-[#C5A059] px-4 py-2 text-sm font-semibold text-[#1B3022]">
              Негізгі мәзірге өту <ExternalLink className="ml-2" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <span className="shrink-0 rounded-full border border-[#1B3022]/10 bg-white px-4 py-2 text-sm font-medium text-[#1B3022]" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const heritage = db.heritageItems.find((entry) => entry.slug === item.linkedHeritageSlug);
            return (
              <article className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-[#1B3022]/10" key={item.id}>
                <Image src={item.image} alt={item.title} width={720} height={460} className="h-52 w-full object-cover sm:h-56" />
                <div className="p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#F7F1E7] px-3 py-1 text-xs font-semibold text-[#6D4C41]">{item.category}</span>
                    <span className="text-lg font-semibold text-[#6D4C41]">{formatPrice(item.price)}</span>
                  </div>
                  <h2 className="font-display text-3xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-black/62">{item.description || item.shortDescription}</p>
                  <p className="mt-4 rounded-md bg-[#F7F1E7] px-3 py-2 text-sm leading-6 text-black/68">
                    Байланысты мұра: <span className="font-semibold text-[#1B3022]">{heritage?.title.kk || item.linkedHeritageSlug}</span>
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link href={`/heritage/${item.linkedHeritageSlug}`} className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#1B3022] px-4 py-2 text-sm font-semibold text-white">
                      Тарихын оқу <ArrowRight className="ml-2" size={16} />
                    </Link>
                    <Link href="/menu" className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#1B3022]/14 px-4 py-2 text-sm font-semibold text-[#1B3022]">
                      Негізгі мәзір
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
