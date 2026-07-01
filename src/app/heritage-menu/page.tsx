import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/Buttons";
import { Logo } from "@/components/Logo";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { formatPrice, getDb } from "@/lib/storage";

const categories = ["Ұлттық тағамдар", "Қазалы мұрасынан шабыт алған тағамдар", "Тарихи тұлғаларға арналған тағамдар", "Арнайы сеттер", "Дәстүрлі сусындар", "Десерттер"];

export default async function HeritageMenuPage() {
  const db = await getDb();
  const items = db.heritageMenuItems.filter((item) => item.status === "published");

  return (
    <main className="min-h-screen bg-ink pb-24 text-porcelain lg:pb-0">
      <section className="relative overflow-hidden border-b border-white/10">
        <Image src={db.settings.heroImage} alt="Қазалы мұрасы мәзірі" fill priority className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-ink/82 to-ink" />
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-5">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <Logo compact />
            <nav className="hidden items-center gap-5 text-sm text-linen/75 md:flex">
              <Link href="/">Басты бет</Link>
              <Link href="/menu">Негізгі мәзір</Link>
              <Link href="/heritage">Мұра жобасы</Link>
            </nav>
            <div className="hidden sm:block">
              <Button href="/menu" tone="gold">Негізгі мәзір <ExternalLink className="ml-2" size={16} /></Button>
            </div>
          </header>

          <div className="max-w-3xl py-12 md:py-24">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/45 bg-black/35 px-4 py-2 text-sm text-gold">
              <UtensilsCrossed size={16} /> Nauat Мұра 2.0
            </p>
            <h1 className="font-[var(--font-display)] text-[42px] font-semibold leading-tight md:text-6xl">Қазалы мұрасы мәзірі</h1>
            <p className="mt-4 text-base leading-7 text-linen/82 sm:text-lg sm:leading-8">
              Бұл толық кафе мәзірі емес. Мұнда тек Қазалы тарихымен, жергілікті мұрамен, ұлттық тағам мәдениетімен және тарихи тұлғалармен байланысқан арнайы концепциялық тағамдар көрсетіледі.
            </p>
            <p className="mt-4 font-[var(--font-accent)] text-xl italic text-linen/78">Толық негізгі мәзір Dzumba сервисінде бөлек ашылады.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:py-10">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-linen/75" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const heritage = db.heritageItems.find((entry) => entry.slug === item.linkedHeritageSlug);
            return (
              <article className="overflow-hidden rounded-md border border-white/10 bg-white/[0.04] shadow-glow" key={item.id}>
                <Image src={item.image} alt={item.title} width={720} height={460} className="h-52 w-full object-cover sm:h-56" />
                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">{item.category}</span>
                    <span className="text-lg font-semibold text-gold">{formatPrice(item.price)}</span>
                  </div>
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-linen/75">{item.shortDescription}</p>
                  <p className="mt-4 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-linen/80">
                    Байланысты мұра: <span className="text-gold">{heritage?.title.kk || item.linkedHeritageSlug}</span>
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Button href={`/heritage/${item.linkedHeritageSlug}`} tone="gold">Тарихын оқу <ArrowRight className="ml-2" size={16} /></Button>
                    <Button href="/menu" tone="ghost">Негізгі мәзір</Button>
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
