import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2, Menu, Search } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { QrTools } from "@/components/QrTools";
import { formatPrice, getDb } from "@/lib/storage";
import type { Locale } from "@/lib/types";

const localeLabels: Record<Locale, string> = {
  kk: "Қазақ тілі",
  ru: "Русский",
  en: "English"
};

export async function generateStaticParams() {
  const db = await getDb();
  return db.heritageItems.map((item) => ({ slug: item.slug }));
}

export default async function HeritagePage({ params, searchParams }: { params: { slug: string }; searchParams: { lang?: Locale } }) {
  const db = await getDb();
  const item = db.heritageItems.find((entry) => entry.slug === params.slug && entry.status !== "hidden");
  if (!item) notFound();

  const locale: Locale = searchParams.lang && ["kk", "ru", "en"].includes(searchParams.lang) ? searchParams.lang : "kk";
  const related = db.heritageMenuItems.filter((menuItem) => menuItem.linkedHeritageSlug === item.slug && menuItem.status === "published");
  const visibleItems = db.heritageItems.filter((entry) => entry.status !== "hidden");
  const currentIndex = visibleItems.findIndex((entry) => entry.slug === item.slug);
  const next = visibleItems[(currentIndex + 1) % visibleItems.length];

  return (
    <main className="frontend-type bg-[#F7F1E7] pb-24 text-[#1B3022] lg:pb-0">
      <section className="relative min-h-[74svh] overflow-hidden bg-[#1B3022] text-white">
        <Image src={item.image} alt={item.title[locale]} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B3022]/78 via-[#1B3022]/48 to-[#1B3022]" />
        <div className="relative mx-auto flex min-h-[74svh] max-w-6xl flex-col px-4 py-5 sm:px-6">
          <header className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022]" aria-label="Мәзір">
              <Menu size={21} />
            </button>
            <Link href="/" className="text-center text-[13px] font-semibold tracking-[0.18em]">NAUAT HERITAGE 2.0</Link>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022]" aria-label="Іздеу">
              <Search size={20} />
            </button>
          </header>

          <div className="flex flex-1 items-end pb-8">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-medium text-[#C5A059]">{item.category}</p>
              <h1 className="font-display text-[42px] font-semibold leading-tight sm:text-6xl">{item.title[locale]}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">{item.short[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_340px] lg:gap-8 lg:py-10">
        <article className="space-y-5">
          <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-[#1B3022]/10 sm:p-5">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              <Globe2 className="mr-1 mt-2 shrink-0 text-[#C5A059]" size={18} />
              {(["kk", "ru", "en"] as Locale[]).map((lang) => (
                <Link
                  key={lang}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${locale === lang ? "border-[#1B3022] bg-[#1B3022] text-white" : "border-[#1B3022]/10 bg-[#F7F1E7] text-[#1B3022]"}`}
                  href={`/heritage/${item.slug}?lang=${lang}`}
                >
                  {localeLabels[lang]}
                </Link>
              ))}
            </div>
            <h2 className="font-display text-3xl font-semibold">Толық мәтін</h2>
            <p className="mt-4 text-base leading-8 text-black/72 sm:text-lg">{item.body[locale]}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-[#1B3022] p-4 text-white shadow-sm sm:p-5">
              <h2 className="font-display text-3xl font-semibold">Қызықты деректер</h2>
              <ul className="mt-4 space-y-3">
                {item.facts.map((fact) => (
                  <li className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm leading-6 text-white/78" key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-[#1B3022]/10 sm:p-5">
              <h2 className="font-display text-3xl font-semibold">Байланысты тағамдар</h2>
              <p className="mt-2 text-sm leading-6 text-black/58">Бұл тағамдар Қазалы мұрасы мәзіріне жатады, негізгі Dzumba мәзірін алмастырмайды.</p>
              <div className="mt-4 grid gap-3">
                {related.length ? related.map((menuItem) => (
                  <div className="rounded-md bg-[#F7F1E7] p-4" key={menuItem.id}>
                    <p className="font-semibold">{menuItem.title}</p>
                    <p className="mt-1 text-sm leading-6 text-black/62">{menuItem.shortDescription}</p>
                    <p className="mt-2 text-[#6D4C41]">{formatPrice(menuItem.price)}</p>
                  </div>
                )) : (
                  <p className="rounded-md bg-[#F7F1E7] p-4 text-sm text-black/62">Бұл мұраға байланысты арнайы тағам әлі қосылмаған.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:flex">
            {next ? (
              <Link href={`/heritage/${next.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#1B3022] px-4 py-2 text-sm font-semibold text-white">
                Келесі мұра <ArrowRight className="ml-2" size={16} />
              </Link>
            ) : null}
            <Link href="/menu" className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#1B3022]/14 px-4 py-2 text-sm font-semibold text-[#1B3022]">
              Негізгі мәзірге өту
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-5 lg:self-start">
          <QrTools slug={item.slug} title={item.title.kk} />
        </aside>
      </section>
      <MobileBottomNav />
    </main>
  );
}
