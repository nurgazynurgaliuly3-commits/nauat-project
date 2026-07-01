import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/Buttons";
import { QrTools } from "@/components/QrTools";
import { formatPrice, getDb } from "@/lib/storage";
import type { Locale } from "@/lib/types";

const localeLabels: Record<Locale, string> = {
  kk: "Қазақша",
  ru: "Орысша",
  en: "Ағылшынша"
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
    <main className="bg-ink text-porcelain">
      <section className="relative min-h-[74svh] overflow-hidden">
        <Image src={item.image} alt={item.title[locale]} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/42 to-ink" />
        <div className="relative mx-auto flex min-h-[74svh] max-w-7xl flex-col px-5 py-5">
          <header className="flex items-center justify-between gap-3">
            <Link href="/" className="rounded-md border border-white/15 bg-black/30 px-4 py-3 font-[var(--font-display)] text-xl font-semibold backdrop-blur">Nauat</Link>
            <div className="flex gap-2">
              <Button href="/heritage" tone="ghost">Мұра жобасы</Button>
              <Button href="/heritage-menu" tone="gold">Мұра мәзірі</Button>
            </div>
          </header>
          <div className="flex flex-1 items-end pb-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-md border border-gold/40 bg-black/35 px-3 py-2 text-sm text-gold">{item.category}</p>
              <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-tight sm:text-6xl">{item.title[locale]}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-linen">{item.short[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_340px]">
        <article className="space-y-8">
          <div className="glass rounded-lg p-5">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Globe2 className="mr-1 text-gold" size={18} />
              {(["kk", "ru", "en"] as Locale[]).map((lang) => (
                <Link
                  key={lang}
                  className={`rounded-md border px-3 py-2 text-sm ${locale === lang ? "border-gold bg-gold text-ink" : "border-white/15 bg-white/5 text-linen"}`}
                  href={`/heritage/${item.slug}?lang=${lang}`}
                >
                  {localeLabels[lang]}
                </Link>
              ))}
            </div>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold">Толық мәтін</h2>
            <p className="mt-4 text-lg leading-9 text-linen/90">{item.body[locale]}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-5">
              <h2 className="font-[var(--font-display)] text-3xl font-semibold">Қызықты деректер</h2>
              <ul className="mt-4 space-y-3">
                {item.facts.map((fact) => (
                  <li className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-linen" key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-[var(--font-display)] text-3xl font-semibold">Байланысты тағамдар</h2>
              <p className="mt-2 text-sm leading-6 text-linen/65">Бұл тағамдар Қазалы мұрасы мәзіріне жатады, негізгі Dzumba мәзірін алмастырмайды.</p>
              <div className="mt-4 grid gap-3">
                {related.length ? related.map((menuItem) => (
                  <div className="rounded-md border border-white/10 bg-black/20 p-4" key={menuItem.id}>
                    <p className="font-semibold text-porcelain">{menuItem.title}</p>
                    <p className="mt-1 text-sm leading-6 text-linen/75">{menuItem.shortDescription}</p>
                    <p className="mt-2 text-gold">{formatPrice(menuItem.price)}</p>
                  </div>
                )) : (
                  <p className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-linen/70">Бұл мұраға байланысты арнайы тағам әлі қосылмаған.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {next ? (
              <Button href={`/heritage/${next.slug}`} tone="gold">
                Келесі мұра <ArrowRight className="ml-2" size={16} />
              </Button>
            ) : null}
            <Button href="/menu" tone="ghost">Негізгі мәзірге өту</Button>
          </div>
        </article>

        <aside className="lg:sticky lg:top-5 lg:self-start">
          <QrTools slug={item.slug} title={item.title.kk} />
        </aside>
      </section>
    </main>
  );
}
