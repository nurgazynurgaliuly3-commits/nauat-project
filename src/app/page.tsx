import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BookOpen, ExternalLink, Landmark, Languages, QrCode, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/Buttons";
import { BookingForm } from "@/components/BookingForm";
import { Logo } from "@/components/Logo";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { formatPrice, getDb } from "@/lib/storage";

export default async function HomePage() {
  const db = await getDb();
  const settings = db.settings;
  const heritageMenu = db.heritageMenuItems.filter((item) => item.status === "published").slice(0, 3);
  const heritageItems = db.heritageItems
    .filter((item) => item.status !== "hidden" && ["korkyt-ata", "begim-ana", "zhankozha-batyr", "ghani-muratbayev", "roza-baglanova", "madina-eraliyeva"].includes(item.slug))
    .slice(0, 6);

  const style = {
    "--site-bg": settings.colors.background,
    "--site-surface": settings.colors.surface,
    "--site-text": settings.colors.text,
    "--site-muted": settings.colors.muted,
    "--site-gold": settings.colors.gold,
    "--site-green": settings.colors.green,
    "--site-light": settings.colors.light,
    "--site-dark": settings.colors.dark
  } as CSSProperties;

  return (
    <main style={style} className="bg-[var(--site-bg)] pb-24 text-[var(--site-text)] lg:pb-0">
      <section className="relative min-h-[100svh] overflow-hidden lg:min-h-[94svh]">
        <Image src={settings.heroImage} alt="Nauat премиум мұра мейрамханасы" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,11,.78),rgba(18,15,11,.68),rgba(18,15,11,.94))] lg:bg-[linear-gradient(90deg,rgba(18,15,11,.93),rgba(18,15,11,.64),rgba(18,15,11,.22))]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 py-4 sm:px-5 lg:min-h-[94svh]">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <Logo />
            <nav className="hidden items-center gap-5 text-sm text-[var(--site-muted)] lg:flex">
              <Link href="/">Басты бет</Link>
              <Link href="/menu">Негізгі мәзір</Link>
              <Link href="/heritage-menu">Қазалы мұрасы мәзірі</Link>
              <Link href="/heritage">Мұра жобасы</Link>
              <a href="#booking">Байланыс</a>
            </nav>
            <div className="hidden sm:block">
              <Button href="/menu" tone="gold">Мәзір <ExternalLink className="ml-2" size={15} /></Button>
            </div>
          </header>

          <div className="grid flex-1 items-end gap-5 pb-5 pt-10 lg:grid-cols-[1fr_420px] lg:gap-8 lg:pb-8 lg:pt-16">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--site-gold)]/55 bg-black/30 px-3 py-2 text-xs text-[var(--site-gold)] backdrop-blur sm:text-sm">
                <Sparkles size={15} /> Қазалы мұрасы бар премиум мейрамхана
              </div>
              <h1 className="font-[var(--font-display)] text-[46px] font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">Nauat Мұра 2.0</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--site-muted)] sm:text-lg sm:leading-8">
                Қонаққа тек ас емес, Қазалы өңірінің тарихын, тұлғаларын және дастархан мәдениетін сезіндіретін premium heritage restaurant.
              </p>
              <p className="mt-3 max-w-xl font-[var(--font-accent)] text-lg italic leading-7 text-white/82 sm:text-xl sm:leading-8">
                Дәм арқылы тарихқа жақындау. QR арқылы мұраны ашу.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">
                <Button href="/menu" tone="gold">Негізгі мәзір</Button>
                <Button href="/heritage-menu" tone="light">Мұра мәзірі</Button>
                <Button href="/heritage" tone="ghost">Мұра жобасы</Button>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3">
              {[
                { href: "/menu", icon: UtensilsCrossed, title: "Негізгі мәзір", text: "Толық кафе мәзірі Dzumba арқылы ашылады.", external: true },
                { href: "/heritage-menu", icon: BookOpen, title: "Қазалы мұрасы мәзірі", text: "Арнайы концепциялық тағамдар және олардың тарихы." },
                { href: "/heritage", icon: QrCode, title: "QR цифрлық музей", text: "Әр мұра объектінің жеке беті және QR коды бар." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link href={item.href} className="rounded-md border border-white/12 bg-white/[0.08] p-3 backdrop-blur transition active:bg-white/12 sm:p-4 lg:hover:border-[var(--site-gold)]/70" key={item.href}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon className="shrink-0 text-[var(--site-gold)]" size={21} />
                        <div className="min-w-0">
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm leading-5 text-[var(--site-muted)]">{item.text}</p>
                        </div>
                      </div>
                      {item.external ? <ExternalLink className="shrink-0 text-[var(--site-gold)]" size={17} /> : <ArrowRight className="shrink-0 text-[var(--site-gold)]" size={17} />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--site-light)] text-[var(--site-dark)]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-5 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--site-green)] sm:text-sm">Концепция</p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">Nauat - жай кафе емес</h2>
          </div>
          <p className="leading-7 text-black/70">Негізгі мәзір бөлек сақталады. Бұл сайт Қазалы мұрасы, тұлғалар, аңыздар және арнайы heritage тағамдар арқылы брендтің мәдени деңгейін көтереді.</p>
          <p className="font-[var(--font-accent)] text-xl italic leading-8 text-black/72">Қонақ мәзірді көреді, тағам тарихын оқиды, QR арқылы мұра бетіне өтеді.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 lg:py-14">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[var(--site-gold)] sm:text-sm">Арнайы концепциялық мәзір</p>
            <h2 className="font-[var(--font-display)] text-4xl font-semibold">Қазалы мұрасы мәзірі</h2>
          </div>
          <Button href="/heritage-menu" tone="ghost">Барлығын көру</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {heritageMenu.map((item) => (
            <article className="overflow-hidden rounded-md border border-white/10 bg-white/[0.04]" key={item.id}>
              <Image src={item.image} alt={item.title} width={720} height={460} className="h-52 w-full object-cover sm:h-56" />
              <div className="p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--site-gold)]">{item.category}</p>
                <h3 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--site-muted)]">{item.shortDescription}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-[var(--site-gold)]">{formatPrice(item.price)}</p>
                  <Link className="inline-flex items-center text-sm font-semibold text-[var(--site-gold)]" href={`/heritage/${item.linkedHeritageSlug}`}>
                    Тарихын оқу <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--site-light)] py-10 text-[var(--site-dark)] lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[var(--site-green)] sm:text-sm">QR арқылы ашылатын мұра</p>
              <h2 className="font-[var(--font-display)] text-4xl font-semibold">Қонақ оқитын негізгі тұлғалар</h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-black/70">
              <Languages size={16} /> Қазақ тілі · Русский · English
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heritageItems.map((item) => (
              <Link className="group overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition active:scale-[0.99] lg:hover:-translate-y-1 lg:hover:shadow-xl" href={`/heritage/${item.slug}`} key={item.slug}>
                <Image src={item.image} alt={item.title.kk} width={720} height={460} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48" />
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--site-green)]">{item.category}</p>
                  <h3 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">{item.title.kk}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/68">{item.short.kk}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--site-green)]">
                    Бетін ашу <ArrowRight className="ml-2" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {settings.visibility.booking ? (
        <section id="booking" className="mx-auto max-w-7xl px-4 py-10 sm:px-5 lg:py-14">
          <div className="grid gap-6 rounded-md border border-[var(--site-gold)]/35 bg-black/24 p-4 md:grid-cols-[1fr_0.85fr] md:p-8">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[var(--site-gold)]">
                <Landmark size={24} />
                <p className="font-semibold">Байланыс және брондау</p>
              </div>
              <h2 className="font-[var(--font-display)] text-4xl font-semibold">{settings.bookingTitle}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[var(--site-muted)]">{settings.bookingText}</p>
            </div>
            <BookingForm />
          </div>
        </section>
      ) : null}
      <MobileBottomNav />
    </main>
  );
}
