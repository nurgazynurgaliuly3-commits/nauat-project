import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Landmark, QrCode, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/Buttons";
import { BookingForm } from "@/components/BookingForm";
import { formatPrice, getDb } from "@/lib/storage";

export default async function HomePage() {
  const db = await getDb();
  const settings = db.settings;
  const categories = Array.from(new Set(db.menuItems.map((item) => item.category)));
  const heritageMenu = db.menuItems.filter((item) => item.heritage);
  const enabledSections = settings.sections.filter((section) => section.enabled);

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
    <main style={style} className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <section className="relative min-h-[92svh] overflow-hidden">
        <Image src={settings.heroImage} alt={`${settings.brandName} басты суреті`} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/42 to-[var(--site-bg)]" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col px-5 py-5">
          <header className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
            <Link href="/" className="font-[var(--font-display)] text-2xl font-semibold tracking-normal">{settings.brandName}</Link>
            <nav className="hidden items-center gap-5 text-sm text-[var(--site-muted)] md:flex">
              {settings.visibility.menu ? <a href="#menu">Мәзір</a> : null}
              {settings.visibility.heritage ? <a href="#heritage">Мұра</a> : null}
              {settings.visibility.booking ? <a href="#booking">Брондау</a> : null}
              <Link href="/admin">Әкімші</Link>
            </nav>
            {settings.visibility.booking ? <Button href="#booking" tone="gold">Брондау</Button> : null}
          </header>

          <div className="flex flex-1 items-end pb-10 pt-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: settings.colors.gold, color: settings.colors.gold, background: "rgba(0,0,0,.35)" }}>
                <Sparkles size={16} /> {settings.heroEyebrow}
              </div>
              <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                {settings.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--site-muted)]">{settings.heroText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {settings.visibility.menu ? <Button href="#menu" tone="gold">Мәзірді көру</Button> : null}
                {settings.visibility.booking ? <Button href="#booking" tone="light">Үстел брондау</Button> : null}
                {settings.visibility.heritage ? <Button href="#heritage" tone="ghost">Мұра жобасы</Button> : null}
              </div>
            </div>
          </div>
          <div className="gold-line" />
        </div>
      </section>

      {settings.visibility.introCards ? (
        <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:grid-cols-3">
          {enabledSections.slice(0, 3).map((section) => (
            <div className="glass rounded-lg p-5" key={section.id}>
              <p className="text-lg font-semibold text-[var(--site-gold)]">{section.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--site-muted)]">{section.text}</p>
            </div>
          ))}
        </section>
      ) : null}

      {settings.visibility.menu ? (
        <section id="menu" className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[var(--site-gold)]">{settings.menuSubtitle}</p>
              <h2 className="font-[var(--font-display)] text-4xl font-semibold">{settings.menuTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span className="rounded-md border border-white/15 px-3 py-2 text-sm text-[var(--site-muted)]" key={category}>{category}</span>
              ))}
            </div>
          </div>

          {heritageMenu.length ? (
            <div className="mb-8 rounded-lg border p-5" style={{ borderColor: settings.colors.gold, background: `${settings.colors.gold}1f` }}>
              <div className="mb-4 flex items-center gap-3 text-[var(--site-gold)]">
                <UtensilsCrossed size={22} />
                <h3 className="font-[var(--font-display)] text-2xl">Мұра тағамдары</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {heritageMenu.map((item) => (
                  <article className="grid grid-cols-[112px_1fr] gap-4 rounded-lg border border-white/10 bg-black/20 p-3" key={item.id}>
                    <Image src={item.image} alt={item.name} width={112} height={112} className="h-28 w-28 rounded-md object-cover" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--site-muted)]">{item.description}</p>
                      <p className="mt-2 font-semibold text-[var(--site-gold)]">{formatPrice(item.price)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {db.menuItems.map((item) => (
              <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]" key={item.id}>
                <Image src={item.image} alt={item.name} width={520} height={360} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.name}</p>
                    {item.heritage ? <span className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--site-dark)]" style={{ background: settings.colors.gold }}>Мұра</span> : null}
                  </div>
                  <p className="min-h-16 text-sm leading-6 text-[var(--site-muted)]">{item.description}</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--site-gold)]">{formatPrice(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {settings.visibility.customSections && enabledSections.length > 3 ? (
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="grid gap-5 md:grid-cols-2">
            {enabledSections.slice(3).map((section) => (
              <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]" key={section.id}>
                <Image src={section.image} alt={section.title} width={900} height={520} className="h-56 w-full object-cover" />
                <div className="p-5">
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold">{section.title}</h2>
                  <p className="mt-3 leading-7 text-[var(--site-muted)]">{section.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {settings.visibility.heritage ? (
        <section id="heritage" className="py-14 text-[var(--site-dark)]" style={{ background: settings.colors.light }}>
          <div className="mx-auto max-w-7xl px-5">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.22em]" style={{ color: settings.colors.surface }}>{settings.heritageSubtitle}</p>
                <h2 className="font-[var(--font-display)] text-4xl font-semibold">{settings.heritageTitle}</h2>
              </div>
              <QrCode style={{ color: settings.colors.surface }} size={34} />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {db.heritageItems.map((item) => (
                <Link className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm" href={`/heritage/${item.slug}`} key={item.slug}>
                  <Image src={item.image} alt={item.title.kk} width={640} height={420} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: settings.colors.surface }}>{item.category}</p>
                    <h3 className="font-[var(--font-display)] text-2xl font-semibold">{item.title.kk}</h3>
                    <p className="mt-2 text-sm leading-6 text-black/70">{item.short.kk}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold" style={{ color: settings.colors.green }}>
                      Ашу <ArrowRight className="ml-2" size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {settings.visibility.booking ? (
        <section id="booking" className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-8 rounded-lg border p-6 md:grid-cols-[1fr_0.8fr] md:p-8" style={{ borderColor: settings.colors.gold, background: "rgba(0,0,0,.28)" }}>
            <div>
              <div className="mb-4 flex items-center gap-3 text-[var(--site-gold)]">
                <Landmark size={24} />
                <p className="font-semibold">Үстел брондау</p>
              </div>
              <h2 className="font-[var(--font-display)] text-4xl font-semibold">{settings.bookingTitle}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[var(--site-muted)]">{settings.bookingText}</p>
            </div>
            <BookingForm />
          </div>
        </section>
      ) : null}
    </main>
  );
}
