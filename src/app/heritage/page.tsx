import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Landmark, QrCode } from "lucide-react";
import { Button } from "@/components/Buttons";
import { getDb } from "@/lib/storage";

export default async function HeritageIndexPage({ searchParams }: { searchParams: { category?: string } }) {
  const db = await getDb();
  const categories = ["Тарихи орындар", "Тұлғалар", "Жәдігерлер", "Ұлттық тағамдар"];
  const selected = searchParams.category;
  const items = db.heritageItems.filter((item) => item.status !== "hidden" && (!selected || item.category === selected));

  return (
    <main className="min-h-screen bg-ink text-porcelain">
      <section className="relative overflow-hidden border-b border-white/10">
        <Image src={db.settings.heroImage} alt="Мұра жобасы" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-ink/75 to-ink" />
        <div className="relative mx-auto max-w-7xl px-5 py-5">
          <header className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
            <Link href="/" className="font-[var(--font-display)] text-2xl font-semibold">Nauat</Link>
            <nav className="hidden items-center gap-5 text-sm text-linen/75 md:flex">
              <Link href="/">Басты бет</Link>
              <Link href="/menu">Негізгі мәзір</Link>
              <Link href="/heritage-menu">Қазалы мұрасы мәзірі</Link>
              <a href="#heritage-list">Жәдігерлер</a>
            </nav>
            <Button href="/heritage-menu" tone="gold">Мұра мәзірі</Button>
          </header>

          <div className="max-w-3xl py-16 md:py-24">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-gold/40 bg-black/35 px-3 py-2 text-sm text-gold">
              <QrCode size={16} /> Цифрлық музей
            </p>
            <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-tight md:text-6xl">Мұра жобасы</h1>
            <p className="mt-5 text-lg leading-8 text-linen/80">
              Қазалы өңірінің тарихи орындары, тұлғалары, жәдігерлері және ұлттық тағам тарихы Nauat кеңістігінде QR арқылы таныстырылады.
            </p>
          </div>
        </div>
      </section>

      <section id="heritage-list" className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link className={`rounded-md border px-3 py-2 text-sm ${!selected ? "border-gold bg-gold text-ink" : "border-white/15 bg-white/[0.04] text-linen/75"}`} href="/heritage">
            Барлығы
          </Link>
          {categories.map((category) => (
            <Link className={`rounded-md border px-3 py-2 text-sm ${selected === category ? "border-gold bg-gold text-ink" : "border-white/15 bg-white/[0.04] text-linen/75"}`} href={`/heritage?category=${encodeURIComponent(category)}`} key={category}>
              {category}
            </Link>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]" href={`/heritage/${item.slug}`} key={item.slug}>
              <Image src={item.image} alt={item.title.kk} width={640} height={420} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-4">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  <Landmark size={14} /> {item.category}
                </p>
                <h2 className="font-[var(--font-display)] text-2xl font-semibold">{item.title.kk}</h2>
                <p className="mt-2 min-h-20 text-sm leading-6 text-linen/75">{item.short.kk}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold">
                  Ашу <ArrowRight className="ml-2" size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
