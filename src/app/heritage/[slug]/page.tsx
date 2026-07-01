import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/Buttons";
import { Logo } from "@/components/Logo";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { QrTools } from "@/components/QrTools";
import { BodyText, Heading } from "@/components/Typography";
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
    <main className="frontend-type bg-ink pb-24 text-porcelain lg:pb-0">
      <section className="relative min-h-[72svh] overflow-hidden lg:min-h-[74svh]">
        <Image src={item.image} alt={item.title[locale]} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/48 to-ink" />
        <div className="relative mx-auto flex min-h-[72svh] max-w-7xl flex-col px-4 py-4 sm:px-5 lg:min-h-[74svh]">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <Logo compact />
            <div className="hidden gap-2 sm:flex">
              <Button href="/heritage" tone="ghost">Heritage жобасы</Button>
              <Button href="/heritage-menu" tone="gold">Қазалы мұрасы мәзірі</Button>
            </div>
          </header>
          <div className="flex flex-1 items-end pb-8">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-gold/45 bg-black/35 px-4 py-2 text-sm font-medium text-gold">{item.category}</p>
              <Heading as="h1" size="article">{item.title[locale]}</Heading>
              <BodyText className="mt-4 max-w-2xl text-linen">{item.short[locale]}</BodyText>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[1fr_340px] lg:gap-8 lg:py-12">
        <article className="space-y-5 lg:space-y-8">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              <Globe2 className="mr-1 mt-2 shrink-0 text-gold" size={18} />
              {(["kk", "ru", "en"] as Locale[]).map((lang) => (
                <Link
                  key={lang}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${locale === lang ? "border-gold bg-gold text-ink" : "border-white/15 bg-white/5 text-linen"}`}
                  href={`/heritage/${item.slug}?lang=${lang}`}
                >
                  {localeLabels[lang]}
                </Link>
              ))}
            </div>
            <Heading as="h2" size="card">Толық мәтін</Heading>
            <p className="mt-4 text-body text-base text-linen/90 sm:text-lg">{item.body[locale]}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            <div className="rounded-md border border-gold/30 bg-gold/10 p-4 sm:p-5">
              <Heading as="h2" size="card">Қызықты деректер</Heading>
              <ul className="mt-4 space-y-3">
                {item.facts.map((fact) => (
                  <li className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-linen sm:text-base" key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <Heading as="h2" size="card">Байланысты тағамдар</Heading>
              <p className="mt-2 text-helper !text-linen/65">Бұл тағамдар Қазалы мұрасы мәзіріне жатады, негізгі Dzumba мәзірін алмастырмайды.</p>
              <div className="mt-4 grid gap-3">
                {related.length ? related.map((menuItem) => (
                  <div className="rounded-md border border-white/10 bg-black/20 p-4" key={menuItem.id}>
                    <p className="font-semibold text-porcelain">{menuItem.title}</p>
                    <p className="mt-1 text-helper !text-linen/75">{menuItem.shortDescription}</p>
                    <p className="mt-2 text-gold">{formatPrice(menuItem.price)}</p>
                  </div>
                )) : (
                  <p className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-linen/70">Бұл мұраға байланысты арнайы тағам әлі қосылмаған.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:flex sm:flex-row sm:gap-3">
            {next ? <Button href={`/heritage/${next.slug}`} tone="gold">Келесі мұра <ArrowRight className="ml-2" size={16} /></Button> : null}
            <Button href="/menu" tone="ghost">Негізгі мәзірге өту</Button>
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
