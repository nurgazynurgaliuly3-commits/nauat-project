"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  Palette,
  Plus,
  QrCode,
  Save,
  Settings,
  Trash2,
  UserRound,
  Users,
  UtensilsCrossed
} from "lucide-react";
import type { HeritageItem, HeritageMenuItem, NauatDb, SiteSection, SiteSettings } from "@/lib/types";
import { QrTools } from "@/components/QrTools";

const inputClass = "w-full rounded-md border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15";
const selectClass = inputClass;
const cardClass = "rounded-md border border-[#e5e7eb] bg-white";
const accent = "#7c3aed";
const fallbackImage = "/images/nauat-heritage-hero.png";
const siteUrl = "https://nauat-project.vercel.app";
const heritageCategories = ["Тарихи орындар", "Тұлғалар", "Жәдігерлер", "Ұлттық тағам тарихы"];
const heritageMenuCategories = ["Ұлттық тағамдар", "Қазалы мұрасынан шабыт алған тағамдар", "Тарихи тұлғаларға арналған тағамдар", "Арнайы сеттер", "Дәстүрлі сусындар", "Десерттер"];

const blankHeritage: HeritageItem = {
  id: "",
  slug: "",
  category: "Тарихи орындар",
  title: { kk: "", ru: "", en: "" },
  short: { kk: "", ru: "", en: "" },
  body: { kk: "", ru: "", en: "" },
  facts: [],
  relatedMenuIds: [],
  image: fallbackImage,
  galleryImages: [],
  status: "published",
  createdAt: "",
  updatedAt: ""
};

const blankHeritageMenuItem: HeritageMenuItem = {
  id: "",
  title: "",
  slug: "",
  category: "Ұлттық тағамдар",
  price: 0,
  image: fallbackImage,
  shortDescription: "",
  linkedHeritageSlug: "",
  status: "published",
  createdAt: "",
  updatedAt: ""
};

type AdminTab = "home" | "content" | "heritage" | "menu" | "orders" | "booking" | "users" | "settings" | "qr";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm text-[#374151]">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PrimaryButton({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#7c3aed] bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6d28d9]">
      {children}
    </button>
  );
}

function SoftButton({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#7c3aed]/60 hover:bg-[#f5f3ff]">
      {children}
    </button>
  );
}

function Panel({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className={`${cardClass} p-5`}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
        {text ? <p className="mt-1 text-sm leading-6 text-[#6b7280]">{text}</p> : null}
      </div>
      {children}
    </section>
  );
}

function StatCard({ icon: Icon, label, value, note }: { icon: typeof FileText; label: string; value: number | string; note: string }) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-md bg-[#f3efff] text-[#7c3aed]">
          <Icon size={26} />
        </span>
        <div>
          <p className="text-sm text-[#6b7280]">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-[#111827]">{value}</p>
          <p className="mt-1 text-sm text-[#6b7280]">{note}</p>
        </div>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яәғқңөұүһіё\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AdminPanel({ initialDb }: { initialDb: NauatDb }) {
  const [db, setDb] = useState(initialDb);
  const [settings, setSettings] = useState<SiteSettings>(initialDb.settings);
  const [heritage, setHeritage] = useState<HeritageItem>(blankHeritage);
  const [heritageMenuItem, setHeritageMenuItem] = useState<HeritageMenuItem>(blankHeritageMenuItem);
  const [activeTab, setActiveTab] = useState<AdminTab>("home");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDb(initialDb);
    setSettings(initialDb.settings);
  }, [initialDb]);

  const heritageOptions = useMemo(() => db.heritageItems.filter((item) => item.status !== "hidden"), [db.heritageItems]);
  const selectedQr = heritage.slug ? heritage : heritageOptions[0];
  const publishedMenuCount = db.heritageMenuItems.filter((item) => item.status === "published").length;
  const activeHeritageCount = db.heritageItems.filter((item) => item.status !== "hidden").length;

  async function persist(nextDb: NauatDb) {
    setMessage("Сақталуда...");
    const response = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDb)
    });
    if (!response.ok) {
      setMessage("Сақтау кезінде қате шықты");
      return;
    }
    const saved = (await response.json().catch(() => null)) as NauatDb | null;
    setDb(saved || nextDb);
    setSettings((saved || nextDb).settings);
    setMessage("Сақталды.");
  }

  async function uploadPhoto(file: File, target: "settings" | "heritage" | "heritageMenu" | "section", sectionId?: string) {
    setMessage("Фото жүктелуде...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(result?.error || "Фото жүктеу кезінде қате шықты");
      return;
    }
    const result = (await response.json()) as { path: string };
    if (target === "settings") setSettings((current) => ({ ...current, heroImage: result.path }));
    if (target === "heritage") setHeritage((current) => ({ ...current, image: result.path }));
    if (target === "heritageMenu") setHeritageMenuItem((current) => ({ ...current, image: result.path }));
    if (target === "section" && sectionId) {
      setSettings((current) => ({
        ...current,
        sections: current.sections.map((section) => (section.id === sectionId ? { ...section, image: result.path } : section))
      }));
    }
    setMessage("Фото жүктелді. Қажетті бөлімді сақтаңыз.");
  }

  function saveSettings(event: FormEvent) {
    event.preventDefault();
    persist({ ...db, settings });
  }

  function addSection() {
    const section: SiteSection = {
      id: `section-${Date.now()}`,
      title: "Жаңа бөлім",
      text: "Бөлім мәтінін осы жерден өзгертіңіз.",
      image: settings.heroImage,
      enabled: true
    };
    setSettings({ ...settings, sections: [...settings.sections, section] });
    setActiveTab("content");
  }

  function updateSection(id: string, patch: Partial<SiteSection>) {
    setSettings({
      ...settings,
      sections: settings.sections.map((section) => (section.id === id ? { ...section, ...patch } : section))
    });
  }

  function deleteSection(id: string) {
    setSettings({ ...settings, sections: settings.sections.filter((section) => section.id !== id) });
  }

  function toggleVisibility(key: keyof SiteSettings["visibility"]) {
    setSettings({ ...settings, visibility: { ...settings.visibility, [key]: !settings.visibility[key] } });
  }

  function saveHeritage(event: FormEvent) {
    event.preventDefault();
    const stamp = new Date().toISOString();
    const slug = heritage.slug || slugify(heritage.title.kk);
    const item: HeritageItem = {
      ...heritage,
      id: heritage.id || slug,
      slug,
      facts: heritage.facts.filter(Boolean),
      relatedMenuIds: heritage.relatedMenuIds.filter(Boolean),
      galleryImages: heritage.galleryImages || [],
      status: heritage.status || "published",
      createdAt: heritage.createdAt || stamp,
      updatedAt: stamp
    };
    const next = db.heritageItems.some((entry) => entry.slug === item.slug)
      ? db.heritageItems.map((entry) => (entry.slug === item.slug ? item : entry))
      : [...db.heritageItems, item];
    persist({ ...db, heritageItems: next });
    setHeritage(item);
  }

  function deleteHeritage(slug: string) {
    persist({
      ...db,
      heritageItems: db.heritageItems.filter((item) => item.slug !== slug),
      heritageMenuItems: db.heritageMenuItems.map((item) => (item.linkedHeritageSlug === slug ? { ...item, linkedHeritageSlug: "" } : item))
    });
    if (heritage.slug === slug) setHeritage(blankHeritage);
  }

  function saveHeritageMenuItem(event: FormEvent) {
    event.preventDefault();
    const stamp = new Date().toISOString();
    const slug = heritageMenuItem.slug || slugify(heritageMenuItem.title);
    const item: HeritageMenuItem = {
      ...heritageMenuItem,
      id: heritageMenuItem.id || `hm-${crypto.randomUUID()}`,
      slug,
      status: heritageMenuItem.status || "published",
      createdAt: heritageMenuItem.createdAt || stamp,
      updatedAt: stamp
    };
    const next = db.heritageMenuItems.some((entry) => entry.id === item.id)
      ? db.heritageMenuItems.map((entry) => (entry.id === item.id ? item : entry))
      : [...db.heritageMenuItems, item];
    persist({ ...db, heritageMenuItems: next });
    setHeritageMenuItem(item);
  }

  function deleteHeritageMenuItem(id: string) {
    persist({ ...db, heritageMenuItems: db.heritageMenuItems.filter((item) => item.id !== id) });
    if (heritageMenuItem.id === id) setHeritageMenuItem(blankHeritageMenuItem);
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: "home", label: "Басты бет", icon: LayoutDashboard },
    { id: "content", label: "Мазмұн", icon: FileText },
    { id: "heritage", label: "Heritage объектілер", icon: Package },
    { id: "menu", label: "Мәзір", icon: UtensilsCrossed },
    { id: "orders", label: "Тапсырыстар", icon: ClipboardList },
    { id: "booking", label: "Брондау", icon: CalendarDays },
    { id: "users", label: "Пайдаланушылар", icon: Users },
    { id: "settings", label: "Баптаулар", icon: Settings }
  ];

  const quickActions = [
    { label: "Жаңа Heritage объект қосу", icon: Package, action: () => { setHeritage(blankHeritage); setActiveTab("heritage"); } },
    { label: "Жаңа мәзір тағамы", icon: UtensilsCrossed, action: () => { setHeritageMenuItem(blankHeritageMenuItem); setActiveTab("menu"); } },
    { label: "Жаңа тапсырыс", icon: ClipboardList, action: () => setActiveTab("orders") },
    { label: "Жаңа брондау", icon: CalendarDays, action: () => setActiveTab("booking") },
    { label: "Жаңа парақ қосу", icon: FileText, action: addSection },
    { label: "Жаңалық жариялау", icon: ExternalLink, action: () => setActiveTab("content") },
    { label: "Галереяға фото қосу", icon: Camera, action: () => setActiveTab("content") },
    { label: "Пайдаланушы қосу", icon: UserRound, action: () => setActiveTab("users") }
  ];

  const modules = [
    { title: "Мазмұн", text: "Сайттың беттерін, мәтіндерін және бөлімдерін басқару", icon: FileText, tab: "content" as AdminTab },
    { title: "Heritage объектілер", text: "Тарихи орындар, тұлғалар, жәдігерлер және мұралар", icon: Package, tab: "heritage" as AdminTab },
    { title: "Мәзір", text: "Қазалы мұрасы мәзіріндегі тағамдарды басқару", icon: UtensilsCrossed, tab: "menu" as AdminTab },
    { title: "Тапсырыстар", text: "Клиенттердің тапсырыстарын қарау және басқару", icon: ClipboardList, tab: "orders" as AdminTab },
    { title: "Брондау", text: "Үстел брондауларын қарау және басқару", icon: CalendarDays, tab: "booking" as AdminTab },
    { title: "Галерея", text: "Суреттер мен галереяларды басқару", icon: ImageIcon, tab: "content" as AdminTab },
    { title: "Пайдаланушылар", text: "Админдер мен пайдаланушыларды басқару", icon: Users, tab: "users" as AdminTab },
    { title: "Баптаулар", text: "Сайт параметрлері және жалпы баптаулар", icon: Settings, tab: "settings" as AdminTab }
  ];

  return (
    <div className="min-h-screen rounded-md border border-[#d1d5db] bg-white text-[#111827]">
      <header className="flex flex-col gap-3 border-b border-[#e5e7eb] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <a href={siteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-sm text-[#111827]">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-[#e5e7eb] text-[#111827]">
            <ExternalLink size={17} />
          </span>
          <span>
            <span className="block font-semibold">Сайтқа өту</span>
            <span className="text-xs text-[#6b7280]">{siteUrl}</span>
          </span>
        </a>
        <nav className="flex gap-1 overflow-x-auto text-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 font-medium transition ${
                  activeTab === tab.id ? "border-[#7c3aed] text-[#7c3aed]" : "border-transparent text-[#111827] hover:text-[#7c3aed]"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="hidden h-10 w-10 place-items-center rounded-full border border-[#111827] lg:grid">
          <UserRound size={22} />
        </div>
      </header>

      <div className="px-5 py-7">
        {activeTab === "home" ? (
          <div className="grid gap-6">
            <section>
              <h1 className="text-2xl font-semibold">Қош келдіңіз, Админ!</h1>
              <p className="mt-2 text-sm text-[#6b7280]">Nauat Heritage 2.0 админ панеліне қош келдіңіз</p>
            </section>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Package} label="Heritage объектілер" value={activeHeritageCount} note="Барлығы" />
              <StatCard icon={UtensilsCrossed} label="Мәзір тағамдары" value={publishedMenuCount} note="Жарияланған" />
              <StatCard icon={ClipboardList} label="Тапсырыстар" value="0" note="Жаңа тапсырыс" />
              <StatCard icon={CalendarDays} label="Брондау" value="0" note="Бүгінгі брондау" />
            </section>
            <Panel title="Жылдам әрекеттер">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button key={action.label} type="button" onClick={action.action} className="flex items-center gap-4 rounded-md border border-[#e5e7eb] bg-white px-5 py-4 text-left transition hover:border-[#7c3aed]/50 hover:bg-[#faf9ff]">
                      <Icon size={21} color={accent} />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>
            <Panel title="Басқару модульдері">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button key={module.title} type="button" onClick={() => setActiveTab(module.tab)} className="flex gap-4 rounded-md border border-[#e5e7eb] bg-white p-5 text-left transition hover:border-[#7c3aed]/50 hover:bg-[#faf9ff]">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#f3efff] text-[#7c3aed]">
                        <Icon size={24} />
                      </span>
                      <span>
                        <span className="block font-semibold">{module.title}</span>
                        <span className="mt-2 block text-sm leading-6 text-[#6b7280]">{module.text}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>
        ) : null}

        {activeTab === "content" ? (
          <Panel title="Мазмұн" text="Сайттың мәтіндері, басты экраны және қосымша бөлімдері осы жерде басқарылады.">
            <form className="grid gap-5" onSubmit={saveSettings}>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Бренд атауы"><input className={inputClass} value={settings.brandName} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} /></Field>
                <Field label="Басты белгі мәтіні"><input className={inputClass} value={settings.heroEyebrow} onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })} /></Field>
                <Field label="Басты тақырып"><input className={inputClass} value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></Field>
                <Field label="Басты фото жолы"><input className={inputClass} value={settings.heroImage} onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })} /></Field>
              </div>
              <Field label="Басты сипаттама"><textarea className={`${inputClass} min-h-24`} value={settings.heroText} onChange={(e) => setSettings({ ...settings, heroText: e.target.value })} /></Field>
              <label className="inline-flex min-h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 text-sm font-semibold hover:border-[#7c3aed]/60 hover:bg-[#f5f3ff]">
                <Camera size={16} /> Фото жүктеу
                <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "settings")} />
              </label>

              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">Қосымша бөлімдер</h3>
                  <SoftButton onClick={addSection}><Plus size={16} /> Бөлім қосу</SoftButton>
                </div>
                {settings.sections.map((section) => (
                  <article className="rounded-md border border-[#e5e7eb] bg-[#fafafa] p-4" key={section.id}>
                    <div className="mb-3 flex flex-wrap justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-[#374151]">
                        <input type="checkbox" checked={section.enabled} onChange={(e) => updateSection(section.id, { enabled: e.target.checked })} />
                        Сайтта көрсету
                      </label>
                      <button className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600" type="button" onClick={() => deleteSection(section.id)}>
                        <Trash2 size={16} /> Өшіру
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Бөлім атауы"><input className={inputClass} value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} /></Field>
                      <Field label="Фото жолы"><input className={inputClass} value={section.image} onChange={(e) => updateSection(section.id, { image: e.target.value })} /></Field>
                    </div>
                    <Field label="Мәтін"><textarea className={`${inputClass} min-h-24`} value={section.text} onChange={(e) => updateSection(section.id, { text: e.target.value })} /></Field>
                  </article>
                ))}
              </div>
              <PrimaryButton type="submit"><Save size={16} /> Мазмұнды сақтау</PrimaryButton>
            </form>
          </Panel>
        ) : null}

        {activeTab === "heritage" ? (
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Panel title="Heritage объектілер" text="Тарихи орын, тұлға, жәдігер немесе ұлттық тағам тарихын үш тілде енгізіңіз.">
              <form className="grid gap-3" onSubmit={saveHeritage}>
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="URL атауы"><input className={inputClass} placeholder="jankent" value={heritage.slug} onChange={(e) => setHeritage({ ...heritage, slug: e.target.value })} required /></Field>
                  <Field label="Категория"><select className={selectClass} value={heritage.category} onChange={(e) => setHeritage({ ...heritage, category: e.target.value })}>{heritageCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
                  <Field label="Күйі"><select className={selectClass} value={heritage.status || "published"} onChange={(e) => setHeritage({ ...heritage, status: e.target.value as HeritageItem["status"] })}><option value="published">Жариялау</option><option value="draft">Жоба күйі</option><option value="hidden">Жасыру</option></select></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Қазақ тілі"><input className={inputClass} value={heritage.title.kk} onChange={(e) => setHeritage({ ...heritage, title: { ...heritage.title, kk: e.target.value } })} required /></Field>
                  <Field label="Русский"><input className={inputClass} value={heritage.title.ru} onChange={(e) => setHeritage({ ...heritage, title: { ...heritage.title, ru: e.target.value } })} /></Field>
                  <Field label="English"><input className={inputClass} value={heritage.title.en} onChange={(e) => setHeritage({ ...heritage, title: { ...heritage.title, en: e.target.value } })} /></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Қазақ тілі - қысқа мәтін"><textarea className={`${inputClass} min-h-24`} value={heritage.short.kk} onChange={(e) => setHeritage({ ...heritage, short: { ...heritage.short, kk: e.target.value } })} /></Field>
                  <Field label="Русский - краткий текст"><textarea className={`${inputClass} min-h-24`} value={heritage.short.ru} onChange={(e) => setHeritage({ ...heritage, short: { ...heritage.short, ru: e.target.value } })} /></Field>
                  <Field label="English - short text"><textarea className={`${inputClass} min-h-24`} value={heritage.short.en} onChange={(e) => setHeritage({ ...heritage, short: { ...heritage.short, en: e.target.value } })} /></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Қазақ тілі - толық мәтін"><textarea className={`${inputClass} min-h-40`} value={heritage.body.kk} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, kk: e.target.value } })} /></Field>
                  <Field label="Русский - полный текст"><textarea className={`${inputClass} min-h-40`} value={heritage.body.ru} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, ru: e.target.value } })} /></Field>
                  <Field label="English - full text"><textarea className={`${inputClass} min-h-40`} value={heritage.body.en} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, en: e.target.value } })} /></Field>
                </div>
                <Field label="Қызықты деректер, үтірмен бөліңіз"><input className={inputClass} value={heritage.facts.join(", ")} onChange={(e) => setHeritage({ ...heritage, facts: e.target.value.split(",").map((value) => value.trim()) })} /></Field>
                <Field label="Фото жолы"><input className={inputClass} value={heritage.image} onChange={(e) => setHeritage({ ...heritage, image: e.target.value })} /></Field>
                <input className={inputClass} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "heritage")} />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit"><Save size={16} /> Сақтау</PrimaryButton>
                  <SoftButton onClick={() => setHeritage(blankHeritage)}><Plus size={16} /> Жаңа объект</SoftButton>
                  {heritage.slug ? <SoftButton onClick={() => deleteHeritage(heritage.slug)}><Trash2 size={16} /> Өшіру</SoftButton> : null}
                </div>
              </form>
            </Panel>
            <Panel title="Объектілер тізімі">
              <div className="grid gap-2">
                {db.heritageItems.map((item) => (
                  <button key={item.slug} className="rounded-md border border-[#e5e7eb] bg-white px-3 py-3 text-left hover:border-[#7c3aed]/60" onClick={() => setHeritage(item)}>
                    <span className="font-semibold">{item.title.kk}</span> <span className="text-[#6b7280]">/{item.slug}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}

        {activeTab === "menu" ? (
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Panel title="Мәзір" text="Бұл Dzumba мәзірі емес. Тек сайт ішіндегі арнайы heritage тағамдары.">
              <form className="grid gap-3" onSubmit={saveHeritageMenuItem}>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Тағам атауы"><input className={inputClass} value={heritageMenuItem.title} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, title: e.target.value })} required /></Field>
                  <Field label="URL атауы"><input className={inputClass} placeholder="jankent-set" value={heritageMenuItem.slug} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, slug: e.target.value })} /></Field>
                  <Field label="Категория"><select className={selectClass} value={heritageMenuItem.category} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, category: e.target.value })}>{heritageMenuCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
                  <Field label="Баға"><input className={inputClass} type="number" value={heritageMenuItem.price} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, price: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Қысқа сипаттама"><textarea className={`${inputClass} min-h-24`} value={heritageMenuItem.shortDescription} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, shortDescription: e.target.value })} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Байланысты мұра"><select className={selectClass} value={heritageMenuItem.linkedHeritageSlug} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, linkedHeritageSlug: e.target.value })}><option value="">Мұраны таңдаңыз</option>{heritageOptions.map((item) => <option value={item.slug} key={item.slug}>{item.title.kk} /{item.slug}</option>)}</select></Field>
                  <Field label="Күйі"><select className={selectClass} value={heritageMenuItem.status} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, status: e.target.value as HeritageMenuItem["status"] })}><option value="published">Жариялау</option><option value="draft">Жоба күйі</option><option value="hidden">Жасыру</option></select></Field>
                </div>
                <Field label="Фото жолы"><input className={inputClass} value={heritageMenuItem.image} onChange={(e) => setHeritageMenuItem({ ...heritageMenuItem, image: e.target.value })} /></Field>
                <input className={inputClass} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "heritageMenu")} />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit">Тағамды сақтау</PrimaryButton>
                  <SoftButton onClick={() => setHeritageMenuItem(blankHeritageMenuItem)}><Plus size={16} /> Жаңа тағам</SoftButton>
                  {heritageMenuItem.id ? <SoftButton onClick={() => deleteHeritageMenuItem(heritageMenuItem.id)}><Trash2 size={16} /> Өшіру</SoftButton> : null}
                </div>
              </form>
            </Panel>
            <Panel title="Тағамдар тізімі">
              <div className="grid gap-2">
                {db.heritageMenuItems.map((item) => (
                  <button key={item.id} className="rounded-md border border-[#e5e7eb] bg-white px-3 py-3 text-left hover:border-[#7c3aed]/60" onClick={() => setHeritageMenuItem(item)}>
                    <span className="font-semibold">{item.title}</span> <span className="text-[#6b7280]">/{item.linkedHeritageSlug || "байланыс жоқ"}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <Panel title="Баптаулар" text="Dzumba сілтемесі, түстер және сайт бөлімдерінің көрінуі.">
            <form className="grid gap-5" onSubmit={saveSettings}>
              <Field label="Негізгі мәзір сілтемесі (Dzumba)"><input className={inputClass} value={settings.dzumbaMenuUrl} onChange={(e) => setSettings({ ...settings, dzumbaMenuUrl: e.target.value })} /></Field>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(settings.colors).map(([key, value]) => (
                  <Field label={key} key={key}>
                    <div className="flex gap-2">
                      <input className="h-11 w-14 rounded-md border border-[#e5e7eb] bg-transparent" type="color" value={value} onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })} />
                      <input className={`${inputClass} min-w-0 flex-1`} value={value} onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })} />
                    </div>
                  </Field>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["introCards", "Кіріспе карточкалар"],
                  ["menu", "Қазалы мұрасы мәзірі"],
                  ["heritage", "Мұра жобасы"],
                  ["customSections", "Қосымша бөлімдер"],
                  ["booking", "Байланыс/брондау"]
                ].map(([key, label]) => (
                  <button className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm" type="button" key={key} onClick={() => toggleVisibility(key as keyof SiteSettings["visibility"])}>
                    {settings.visibility[key as keyof SiteSettings["visibility"]] ? <Eye size={16} /> : <EyeOff size={16} />}
                    {label}
                  </button>
                ))}
              </div>
              <PrimaryButton type="submit"><Save size={16} /> Баптауларды сақтау</PrimaryButton>
            </form>
          </Panel>
        ) : null}

        {activeTab === "qr" ? (
          <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
            <Panel title="QR кодтар" text="Әр мұра объектінің жеке URL адресі бар. Осы жерден PNG немесе PDF жүктей аласыз.">
              <div className="grid gap-2">
                {heritageOptions.map((item) => (
                  <button key={item.slug} className={`rounded-md border px-3 py-3 text-left ${selectedQr?.slug === item.slug ? "border-[#7c3aed] bg-[#f5f3ff]" : "border-[#e5e7eb] bg-white"}`} onClick={() => setHeritage(item)}>
                    {item.title.kk}
                  </button>
                ))}
              </div>
            </Panel>
            {selectedQr ? <QrTools slug={selectedQr.slug} title={selectedQr.title.kk} /> : null}
          </div>
        ) : null}

        {activeTab === "orders" ? <Panel title="Тапсырыстар" text="Бұл бөлім кейін тапсырыс жүйесі қосылғанда толық жұмыс істейді. Қазіргі негізгі кафе тапсырыстары Dzumba ішінде басқарылады."><p className="text-sm text-[#6b7280]">Қазіргі уақытта тапсырыстар Dzumba админ панелінде басқарылады.</p></Panel> : null}
        {activeTab === "booking" ? <Panel title="Брондау" text="Брондау өтінімдерін бөлек беттен қарауға болады."><a className="inline-flex rounded-md border border-[#7c3aed] bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white" href="/admin/bookings">Брондауларға өту</a></Panel> : null}
        {activeTab === "users" ? <Panel title="Пайдаланушылар" text="Қазір бір әкімші аккаунты қолданылады. Кейін Supabase Auth арқылы бірнеше пайдаланушы қосуға болады."><p className="text-sm text-[#6b7280]">Қосымша пайдаланушы рөлдерін кейін бөлек қосуға болады.</p></Panel> : null}
        {message ? <p className="mt-5 text-sm font-medium text-[#7c3aed]">{message}</p> : null}
      </div>
      <footer className="border-t border-[#e5e7eb] px-5 py-6 text-center text-sm text-[#6b7280]">Nauat Heritage 2.0 © 2026. Барлық құқықтар қорғалған.</footer>
    </div>
  );
}
