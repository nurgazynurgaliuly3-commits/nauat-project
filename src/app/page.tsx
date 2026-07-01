import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, History, Languages, Menu, Search } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { formatPrice, getDb } from "@/lib/storage";

const menuCopy: Record<string, { title: string; category: string; description: string }> = {
  ulpershek: {
    title: "Үлпершек",
    category: "Ұлттық тағамдар",
    description: "Сағыныш пен сыйластық мағынасын сақтаған дәстүрлі ас."
  },
  "myzhyma-nan": {
    title: "Мыжыма нан",
    category: "Ұлттық тағамдар",
    description: "Дала дастарханының қарапайым, жылы әрі тойымды дәмі."
  },
  "jankent-set": {
    title: "Жанкент сеты",
    category: "Қазалы мұрасынан шабыт алған тағамдар",
    description: "Оғыз дәуірі мен Сыр бойы тарихынан шабыт алған арнайы сет."
  },
  "ghani-muratbayev-tea": {
    title: "Ғани Мұратбаев шайы",
    category: "Тарихи тұлғаларға арналған тағамдар",
    description: "Жастар рухы мен білімге құштарлықты бейнелейтін шай жиынтығы."
  },
  "korkyt-drink": {
    title: "Қорқыт сусыны",
    category: "Дәстүрлі сусындар",
    description: "Қобыз сарыны мен Сыр бойы аңыздарына арналған салқын сусын."
  },
  "begim-ana-dessert": {
    title: "Бегім ана десерті",
    category: "Десерттер",
    description: "Бегім ана мұнарасы туралы аңыздың нәзік әсеріне арналған жеңіл десерт."
  }
};

export default async function HomePage() {
  const db = await getDb();
  const settings = db.settings;
  const heritageMenu = db.heritageMenuItems
    .filter((item) => item.status === "published")
    .slice(0, 3)
    .map((item) => ({ ...item, ...(menuCopy[item.slug] || {}) }));
  const heritageItems = db.heritageItems
    .filter((item) => item.status !== "hidden" && ["korkyt-ata", "begim-ana", "zhankozha-batyr", "ghani-muratbayev", "roza-baglanova", "madina-eraliyeva"].includes(item.slug))
    .slice(0, 6);

  return (
    <main className="frontend-type bg-[#F7F1E7] pb-24 text-[#1B3022] lg:pb-0">
      <section className="relative min-h-[100svh] overflow-hidden bg-[#1B3022] text-white">
        <Image src={settings.heroImage} alt="Nauat Heritage 2.0" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,48,34,.78),rgba(27,48,34,.58),rgba(27,48,34,.96))]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 py-5 sm:px-6">
          <header className="grid grid-cols-[44px_1fr_44px] items-center gap-3 text-white">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022] shadow-sm" aria-label="Мәзір">
              <Menu size={21} />
            </button>
            <Link href="/" className="text-center text-[13px] font-semibold tracking-[0.18em] text-white">
              NAUAT HERITAGE 2.0
            </Link>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#1B3022] shadow-sm" aria-label="Іздеу">
              <Search size={20} />
            </button>
          </header>

          <div className="flex flex-1 flex-col justify-end pb-9 pt-14">
            <p className="mb-3 text-sm font-medium text-white/78">Tradition Meets Modernity</p>
            <h1 className="font-display text-[46px] font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
              Nauat Heritage 2.0
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
              Қазалының тарихи мұрасы мен заманауи дәм мәдениетін біріктіретін жоба
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Link className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#C5A059] px-4 py-2.5 text-sm font-semibold text-[#1B3022]" href="/menu">
                Негізгі мәзір
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3022]" href="/heritage-menu">
                Қазалы мұрасы мәзірі
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/28 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white" href="/heritage">
                Heritage жобасы
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/64">
              Scroll <ArrowRight className="rotate-90" size={16} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-7 sm:px-6 md:grid-cols-[1fr_1fr_0.95fr]">
        <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-[#1B3022]/10">
          <h3 className="font-display text-3xl font-semibold text-[#1B3022]">Ұлттық тағамдар</h3>
          <p className="mt-3 text-sm leading-6 text-black/62">Ұрпақтан ұрпаққа жалғасқан бірегей рецепттердің заманауи орындалуы.</p>
        </article>

        <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-[#1B3022]/10">
          <History className="mb-4 text-[#C5A059]" size={26} />
          <h4 className="font-display text-2xl font-semibold text-[#1B3022]">Қазалы Тарихы</h4>
          <p className="mt-3 text-sm leading-6 text-black/62">Сыр бойындағы киелі өлке мен оның гастрономиялық құпиялары туралы деректер.</p>
          <Link href="/heritage" className="mt-4 inline-flex items-center text-sm font-semibold text-[#1B3022]">
            Толығырақ <ArrowRight className="ml-2" size={15} />
          </Link>
        </article>

        <article className="rounded-md bg-[#1B3022] p-5 text-white shadow-sm">
          <h3 className="font-display text-3xl font-semibold">Күнделікті Мәзір</h3>
          <Link href="/menu" className="mt-4 inline-flex items-center text-sm font-semibold text-[#C5A059]">
            Full Menu <ExternalLink className="ml-2" size={15} />
          </Link>
          <div className="mt-5 space-y-3 border-t border-white/14 pt-4 text-sm">
            <div className="flex justify-between gap-4"><span>Nauat Signature Tea</span><span>1,800 ₸</span></div>
            <div className="flex justify-between gap-4"><span>Kazaly Honey Cake</span><span>2,400 ₸</span></div>
            <div className="flex justify-between gap-4"><span>Traditional Kurt Assortment</span><span>3,200 ₸</span></div>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-md bg-[#1B3022] px-5 py-10 text-center text-white shadow-sm sm:px-8">
          <p className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#C5A059]/18 text-[#C5A059]">✦</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
            "Біз тарихты тек сақтамаймыз, біз оны дәм арқылы тірілтеміз."
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/76 sm:text-base">
            Nauat Heritage 2.0 - бұл жай ғана мейрамхана емес, бұл Қазалы өңірінің ұмытылып бара жатқан гастрономиялық дәстүрлерін зерттейтін және оларды жаңа биікке көтеретін мәдени орталық.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {["Традиция", "Эстетика", "Сапа"].map((item) => (
              <span key={item} className="rounded-full border border-white/18 px-4 py-2 text-xs font-semibold text-white/80">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D4C41]">Арнайы мәзір</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-[#1B3022]">Қазалы мұрасы мәзірі</h2>
          </div>
          <Link href="/heritage-menu" className="hidden rounded-md bg-[#1B3022] px-4 py-2 text-sm font-semibold text-white sm:inline-flex">Барлығы</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {heritageMenu.map((item) => (
            <article className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-[#1B3022]/10" key={item.id}>
              <Image src={item.image} alt={item.title} width={720} height={460} className="h-52 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4C41]">{item.category}</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-[#1B3022]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{item.description || item.shortDescription}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-[#6D4C41]">{formatPrice(item.price)}</p>
                  <Link className="inline-flex items-center text-sm font-semibold text-[#1B3022]" href={`/heritage/${item.linkedHeritageSlug}`}>
                    Тарихын оқу <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 text-[#1B3022]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D4C41]">Мұрағат</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">Heritage жобасы</h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-black/65">
              <Languages size={16} /> Қазақ тілі · Русский · English
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heritageItems.map((item) => (
              <Link className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" href={`/heritage/${item.slug}`} key={item.slug}>
                <Image src={item.image} alt={item.title.kk} width={720} height={460} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4C41]">{item.category}</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold">{item.title.kk}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/62">{item.short.kk}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#1B3022]">
                    Толығырақ <ArrowRight className="ml-2" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {settings.visibility.booking ? (
        <section id="booking" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 rounded-md bg-[#1B3022] p-5 text-white md:grid-cols-[1fr_0.85fr] md:p-8">
            <div>
              <p className="text-sm font-semibold text-[#C5A059]">Байланыс</p>
              <h2 className="mt-2 font-display text-4xl font-semibold">{settings.bookingTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/74">{settings.bookingText}</p>
            </div>
            <BookingForm />
          </div>
        </section>
      ) : null}

      <footer className="border-t border-[#1B3022]/10 bg-[#F7F1E7] px-4 py-8 text-center text-[#1B3022]">
        <p className="text-sm font-semibold tracking-[0.16em]">NAUAT HERITAGE 2.0</p>
        <nav className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-black/64">
          <a href="#">Инстаграм</a>
          <a href="#">Фейсбук</a>
          <a href="#booking">Байланыс</a>
          <a href="#">Құпиялылық саясаты</a>
        </nav>
        <p className="mt-4 text-xs text-black/52">© 2024 Nauat Heritage 2.0. Барлық құқықтар қорғалған.</p>
      </footer>

      <MobileBottomNav />
    </main>
  );
}
