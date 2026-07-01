import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BookOpen, ExternalLink, Landmark, Languages, QrCode, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/Buttons";
import { BookingForm } from "@/components/BookingForm";
import { Logo } from "@/components/Logo";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BodyText, Eyebrow, Heading } from "@/components/Typography";
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
    <main style={style} className="frontend-type bg-[#101711] pb-24 text-porcelain lg:pb-0">
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image src={settings.heroImage} alt="Nauat премиум мұра мейрамханасы" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,10,.78),rgba(8,13,10,.58),rgba(8,13,10,.95))] lg:bg-[linear-gradient(90deg,rgba(8,13,10,.94),rgba(8,13,10,.68),rgba(8,13,10,.22))]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 py-4 sm:px-5 lg:px-8">
          <header className="flex items-center justify-between gap-3 rounded-md border border-white/12 bg-black/18 px-3 py-3 backdrop-blur-md">
            <Logo />
            <nav className="hidden items-center gap-5 text-sm font-medium text-linen/78 lg:flex">
              <Link href="/">Басты бет</Link>
              <Link href="/menu">Негізгі мәзір</Link>
              <Link href="/heritage-menu">Қазалы мұрасы мәзірі</Link>
              <Link href="/heritage">Heritage жобасы</Link>
              <a href="#booking">Байланыс</a>
            </nav>
            <div className="hidden sm:block">
              <Button href="/menu" tone="gold">Негізгі мәзір <ExternalLink className="ml-2" size={15} /></Button>
            </div>
          </header>

          <div className="grid flex-1 items-end gap-5 pb-6 pt-10 lg:grid-cols-[1fr_420px] lg:gap-10 lg:pb-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gold/45 bg-black/35 px-3 py-2 text-xs font-medium text-gold backdrop-blur sm:text-sm">
                <Sparkles size={15} /> Қазалы мұрасы бар premium heritage restaurant
              </div>
              <Heading as="h1" size="hero" className="max-w-[12ch]">Nauat Мұра 2.0</Heading>
              <BodyText className="mt-4 max-w-2xl text-linen/82">
                Қонаққа тек ас емес, Қазалы өңірінің тарихын, тұлғаларын және дастархан мәдениетін сезіндіретін премиум кеңістік.
              </BodyText>
              <p className="mt-3 max-w-xl font-accent text-lg italic leading-7 text-white/82 sm:text-xl sm:leading-8">
                Дәм арқылы тарихқа жақындау. QR арқылы мұраны ашу.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">
                <Button href="/menu" tone="gold">Негізгі мәзір</Button>
                <Button href="/heritage-menu" tone="light">Қазалы мұрасы мәзірі</Button>
                <Button href="/heritage" tone="ghost">Heritage жобасы</Button>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { href: "/menu", icon: UtensilsCrossed, title: "Негізгі мәзір", text: "Толық кафе мәзірі Dzumba арқылы ашылады.", external: true },
                { href: "/heritage-menu", icon: BookOpen, title: "Қазалы мұрасы мәзірі", text: "Тарих пен жергілікті мұрадан шабыт алған арнайы тағамдар." },
                { href: "/heritage", icon: QrCode, title: "QR цифрлық музей", text: "Әр мұра объектінің жеке беті және QR коды бар." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link href={item.href} className="group rounded-md border border-white/12 bg-white/[0.08] p-4 backdrop-blur-md transition active:bg-white/12 lg:hover:border-gold/70" key={item.href}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold/12 text-gold">
                          <Icon size={20} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold sm:text-base">{item.title}</p>
                          <p className="mt-1 text-helper !text-linen/70">{item.text}</p>
                        </div>
                      </div>
                      {item.external ? <ExternalLink className="shrink-0 text-gold" size={17} /> : <ArrowRight className="shrink-0 text-gold transition group-hover:translate-x-0.5" size={17} />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e7] text-ink">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-5 lg:grid-cols-[0.8fr_1fr_1fr] lg:px-8">
          <div>
            <Eyebrow tone="dark" className="!text-sage">Концепция</Eyebrow>
            <Heading tone="dark" className="mt-2" size="card">Nauat - жай кафе емес</Heading>
          </div>
          <p className="text-body text-black/70">Негізгі мәзір бөлек сақталады. Бұл сайт Қазалы мұрасы, тұлғалар, аңыздар және арнайы heritage тағамдар арқылы брендтің мәдени деңгейін көтереді.</p>
          <p className="font-accent text-xl italic leading-8 text-black/72">Қонақ мәзірді көреді, тағам тарихын оқиды, QR арқылы мұра бетіне өтеді.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Арнайы концепциялық мәзір</Eyebrow>
            <Heading className="mt-2">Қазалы мұрасы мәзірі</Heading>
          </div>
          <Button href="/heritage-menu" tone="ghost">Барлығын көру</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {heritageMenu.map((item) => (
            <article className="group overflow-hidden rounded-md border border-white/10 bg-white/[0.045]" key={item.id}>
              <Image src={item.image} alt={item.title} width={720} height={460} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56" />
              <div className="p-4 sm:p-5">
                <Eyebrow className="!text-gold">{item.category}</Eyebrow>
                <Heading as="h3" size="card" className="mt-2">{item.title}</Heading>
                <p className="mt-3 text-helper !text-linen/72">{item.shortDescription}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-gold">{formatPrice(item.price)}</p>
                  <Link className="inline-flex items-center text-sm font-semibold text-gold" href={`/heritage/${item.linkedHeritageSlug}`}>
                    Тарихын оқу <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f1e7] py-12 text-ink lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow tone="dark" className="!text-sage">QR арқылы ашылатын мұра</Eyebrow>
              <Heading tone="dark" className="mt-2">Қонақ оқитын негізгі тұлғалар</Heading>
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
                  <Eyebrow tone="dark" className="!text-sage">{item.category}</Eyebrow>
                  <Heading as="h3" size="card" tone="dark" className="mt-2">{item.title.kk}</Heading>
                  <p className="mt-2 text-helper !text-black/68">{item.short.kk}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-sage">
                    Бетін ашу <ArrowRight className="ml-2" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {settings.visibility.booking ? (
        <section id="booking" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:px-8 lg:py-16">
          <div className="grid gap-6 rounded-md border border-gold/35 bg-white/[0.055] p-4 md:grid-cols-[1fr_0.85fr] md:p-8">
            <div>
              <div className="mb-4 flex items-center gap-3 text-gold">
                <Landmark size={24} />
                <p className="text-sm font-semibold sm:text-base">Байланыс және брондау</p>
              </div>
              <Heading>{settings.bookingTitle}</Heading>
              <BodyText className="mt-3 max-w-2xl text-linen/75">{settings.bookingText}</BodyText>
            </div>
            <BookingForm />
          </div>
        </section>
      ) : null}
      <MobileBottomNav />
    </main>
  );
}
