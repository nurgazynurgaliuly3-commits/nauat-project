import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BookOpen, ExternalLink, Landmark, Languages, QrCode, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/Buttons";
import { BookingForm } from "@/components/BookingForm";
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
    <main style={style} className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <section className="relative min-h-[96svh] overflow-hidden">
        <Image src={settings.heroImage} alt="Nauat премиум мұра мейрамханасы" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,11,.92),rgba(18,15,11,.66),rgba(18,15,11,.24))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,11,.12),rgba(18,15,11,.88))]" />

        <div className="relative mx-auto flex min-h-[96svh] max-w-7xl flex-col px-5 py-4">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <Link href="/" className="font-[var(--font-display)] text-3xl font-semibold tracking-normal">Nauat</Link>
            <nav className="hidden items-center gap-5 text-sm text-[var(--site-muted)] lg:flex">
              <Link href="/">Басты бет</Link>
              <Link href="/menu">Негізгі мәзір</Link>
              <Link href="/heritage-menu">Қазалы мұрасы мәзірі</Link>
              <Link href="/heritage">Мұра жобасы</Link>
              <a href="#booking">Байланыс</a>
            </nav>
            <Button href="/menu" tone="gold">
              Мәзір <ExternalLink className="ml-2" size={15} />
            </Button>
          </header>

          <div className="grid flex-1 items-end gap-8 pb-8 pt-16 lg:grid-cols-[1fr_420px]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--site-gold)]/55 bg-black/30 px-4 py-2 text-sm text-[var(--site-gold)] backdrop-blur">
                <Sparkles size={16} /> Қазалы мұрасы бар премиум мейрамхана
              </div>
              <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-[0.96] sm:text-6xl lg:text-7xl">Nauat Мұра 2.0</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--site-muted)]">
                Қонаққа тек ас емес, Қазалы өңірінің тарихын, тұлғаларын және дастархан мәдениетін сезіндіретін premium heritage restaurant.
              </p>
              <p className="mt-4 max-w-xl font-[var(--font-accent)] text-xl italic leading-8 text-white/82">
                Дәм арқылы тарихқа жақындау. QR арқылы мұраны ашу. Бір үстелде мәдениет пен мейрамхана тәжірибесін біріктіру.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Button href="/menu" tone="gold">Негізгі мәзір</Button>
                <Button href="/heritage-menu" tone="light">Мұра мәзірі</Button>
                <Button href="/heritage" tone="ghost">Мұра жобасы</Button>
              </div>
            </div>

            <div className="grid gap-3">
              <Link href="/menu" className="rounded-md border border-white/12 bg-white/[0.07] p-4 backdrop-blur transition hover:border-[var(--site-gold)]/70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="text-[var(--site-gold)]" size={22} />
                    <div>
                      <p className="font-semibold">Негізгі мәзір</p>
                      <p className="mt-1 text-sm text-[var(--site-muted)]">Толық кафе мәзірі Dzumba арқылы ашылады.</p>
                    </div>
                  </div>
                  <ExternalLink className="text-[var(--site-gold)]" size={18} />
                </div>
              </Link>
              <Link href="/heritage-menu" className="rounded-md border border-[var(--site-gold)]/45 bg-[var(--site-gold)]/14 p-4 backdrop-blur transition hover:bg-[var(--site-gold)]/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-[var(--site-gold)]" size={22} />
                    <div>
                      <p className="font-semibold">Қазалы мұрасы мәзірі</p>
                      <p className="mt-1 text-sm text-[var(--site-muted)]">Арнайы концепциялық тағамдар және олардың тарихы.</p>
                    </div>
                  </div>
                  <ArrowRight className="text-[var(--site-gold)]" size={18} />
                </div>
              </Link>
              <Link href="/heritage" className="rounded-md border border-white/12 bg-white/[0.07] p-4 backdrop-blur transition hover:border-[var(--site-gold)]/70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <QrCode className="text-[var(--site-gold)]" size={22} />
                    <div>
                      <p className="font-semibold">QR цифрлық музей</p>
                      <p className="mt-1 text-sm text-[var(--site-muted)]">Әр мұра объектінің жеке беті және QR коды бар.</p>
                    </div>
                  </div>
                  <ArrowRight className="text-[var(--site-gold)]" size={18} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--site-light)] text-[var(--site-dark)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--site-green)]">Концепция</p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">Nauat - жай кафе емес</h2>
          </div>
          <p className="leading-7 text-black/70">Негізгі мәзір бөлек сақталады. Бұл сайт Қазалы мұрасы, тұлғалар, аңыздар және арнайы heritage тағамдар арқылы брендтің мәдени деңгейін көтереді.</p>
          <p className="font-[var(--font-accent)] text-xl italic leading-8 text-black/72">Қонақ мәзірді көреді, тағам тарихын оқиды, QR арқылы мұра бетіне өтеді.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[var(--site-gold)]">Арнайы концепциялық мәзір</p>
            <h2 className="font-[var(--font-display)] text-4xl font-semibold">Қазалы мұрасы мәзірі</h2>
          </div>
          <Button href="/heritage-menu" tone="ghost">Барлығын көру</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {heritageMenu.map((item) => (
            <article className="overflow-hidden rounded-md border border-white/10 bg-white/[0.04]" key={item.id}>
              <Image src={item.image} alt={item.title} width={720} height={460} className="h-56 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--site-gold)]">{item.category}</p>
                <h3 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">{item.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[var(--site-muted)]">{item.shortDescription}</p>
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

      <section className="bg-[var(--site-light)] py-14 text-[var(--site-dark)]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[var(--site-green)]">QR арқылы ашылатын мұра</p>
              <h2 className="font-[var(--font-display)] text-4xl font-semibold">Қонақ оқитын негізгі тұлғалар</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-black/70">
              <Languages size={16} /> Қазақ тілі · Русский · English
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heritageItems.map((item) => (
              <Link className="group overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" href={`/heritage/${item.slug}`} key={item.slug}>
                <Image src={item.image} alt={item.title.kk} width={720} height={460} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--site-green)]">{item.category}</p>
                  <h3 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">{item.title.kk}</h3>
                  <p className="mt-2 min-h-16 text-sm leading-6 text-black/68">{item.short.kk}</p>
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
        <section id="booking" className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-8 rounded-md border border-[var(--site-gold)]/35 bg-black/24 p-6 md:grid-cols-[1fr_0.85fr] md:p-8">
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
    </main>
  );
}
