"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ImagePlus, Palette, Plus, QrCode, Save, Trash2, UtensilsCrossed } from "lucide-react";
import type { HeritageItem, HeritageMenuItem, NauatDb, SiteSection, SiteSettings } from "@/lib/types";
import { Button } from "@/components/Buttons";
import { QrTools } from "@/components/QrTools";

const inputClass = "w-full rounded-md border border-white/15 bg-white/5 px-3 py-3 text-porcelain outline-none transition focus:border-gold";
const selectClass = "w-full rounded-md border border-white/15 bg-ink px-3 py-3 text-porcelain outline-none transition focus:border-gold";
const fallbackImage = "/images/nauat-heritage-hero.png";
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm text-linen">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Panel({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5">
        <h2 className="font-[var(--font-display)] text-3xl font-semibold">{title}</h2>
        {text ? <p className="mt-1 text-sm leading-6 text-linen/70">{text}</p> : null}
      </div>
      {children}
    </section>
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
  const [activeTab, setActiveTab] = useState<"site" | "heritage" | "menu" | "qr">("site");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDb(initialDb);
    setSettings(initialDb.settings);
  }, [initialDb]);

  const heritageOptions = useMemo(() => db.heritageItems.filter((item) => item.status !== "hidden"), [db.heritageItems]);
  const selectedQr = heritage.slug ? heritage : heritageOptions[0];

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

  const tabs = [
    { id: "site", label: "Сайт", icon: Palette },
    { id: "heritage", label: "Мұра объектілері", icon: QrCode },
    { id: "menu", label: "Мұра мәзірі", icon: UtensilsCrossed },
    { id: "qr", label: "QR кодтар", icon: QrCode }
  ] as const;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition ${activeTab === tab.id ? "bg-gold text-ink" : "text-linen/75 hover:bg-white/10"}`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "site" ? (
        <Panel title="Сайт көрінісі" text="Басты экран, түстер, Dzumba сілтемесі және бөлімдердің көрінуі осы жерден басқарылады.">
          <form className="grid gap-6" onSubmit={saveSettings}>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Бренд атауы"><input className={inputClass} value={settings.brandName} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} /></Field>
              <Field label="Негізгі мәзір сілтемесі (Dzumba)"><input className={inputClass} value={settings.dzumbaMenuUrl} onChange={(e) => setSettings({ ...settings, dzumbaMenuUrl: e.target.value })} /></Field>
              <Field label="Басты белгі мәтіні"><input className={inputClass} value={settings.heroEyebrow} onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })} /></Field>
              <Field label="Басты тақырып"><input className={inputClass} value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></Field>
            </div>
            <Field label="Басты сипаттама"><textarea className={`${inputClass} min-h-24`} value={settings.heroText} onChange={(e) => setSettings({ ...settings, heroText: e.target.value })} /></Field>
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <Field label="Басты фото жолы"><input className={inputClass} value={settings.heroImage} onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })} /></Field>
              <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-sm text-linen hover:border-gold/70">
                <ImagePlus size={16} /> Фото жүктеу
                <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "settings")} />
              </label>
            </div>

            <div>
              <h3 className="mb-3 font-[var(--font-display)] text-2xl">Түстер</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(settings.colors).map(([key, value]) => (
                  <Field label={key} key={key}>
                    <div className="flex gap-2">
                      <input className="h-12 w-14 rounded-md border border-white/15 bg-transparent" type="color" value={value} onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })} />
                      <input className={`${inputClass} min-w-0 flex-1`} value={value} onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })} />
                    </div>
                  </Field>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-[var(--font-display)] text-2xl">Бөлімдерді қосу/өшіру</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  ["introCards", "Кіріспе карточкалар"],
                  ["menu", "Қазалы мұрасы мәзірі"],
                  ["heritage", "Мұра жобасы"],
                  ["customSections", "Қосымша бөлімдер"],
                  ["booking", "Байланыс/брондау"]
                ].map(([key, label]) => (
                  <button className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm" type="button" key={key} onClick={() => toggleVisibility(key as keyof SiteSettings["visibility"])}>
                    {settings.visibility[key as keyof SiteSettings["visibility"]] ? <Eye size={16} /> : <EyeOff size={16} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-[var(--font-display)] text-2xl">Қосымша бөлімдер</h3>
                <Button onClick={addSection} tone="ghost"><Plus className="mr-2" size={16} /> Бөлім қосу</Button>
              </div>
              <div className="grid gap-4">
                {settings.sections.map((section) => (
                  <article className="rounded-md border border-white/10 bg-black/18 p-4" key={section.id}>
                    <div className="mb-3 flex flex-wrap justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-linen">
                        <input type="checkbox" checked={section.enabled} onChange={(e) => updateSection(section.id, { enabled: e.target.checked })} />
                        Сайтта көрсету
                      </label>
                      <button className="inline-flex items-center gap-2 rounded-md border border-red-400/40 px-3 py-2 text-sm text-red-200" type="button" onClick={() => deleteSection(section.id)}>
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
            </div>

            <Button type="submit" tone="gold"><Save className="mr-2" size={16} /> Сайт баптауларын сақтау</Button>
          </form>
        </Panel>
      ) : null}

      {activeTab === "heritage" ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Panel title="Мұра объектісі" text="Тарихи орын, тұлға, жәдігер немесе ұлттық тағам тарихын үш тілде енгізіңіз.">
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
                <Field label="Русский - қысқа мәтін"><textarea className={`${inputClass} min-h-24`} value={heritage.short.ru} onChange={(e) => setHeritage({ ...heritage, short: { ...heritage.short, ru: e.target.value } })} /></Field>
                <Field label="English - short text"><textarea className={`${inputClass} min-h-24`} value={heritage.short.en} onChange={(e) => setHeritage({ ...heritage, short: { ...heritage.short, en: e.target.value } })} /></Field>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Қазақ тілі - толық мәтін"><textarea className={`${inputClass} min-h-40`} value={heritage.body.kk} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, kk: e.target.value } })} /></Field>
                <Field label="Русский - полный текст"><textarea className={`${inputClass} min-h-40`} value={heritage.body.ru} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, ru: e.target.value } })} /></Field>
                <Field label="English - full text"><textarea className={`${inputClass} min-h-40`} value={heritage.body.en} onChange={(e) => setHeritage({ ...heritage, body: { ...heritage.body, en: e.target.value } })} /></Field>
              </div>
              <Field label="Қызықты деректер, үтірмен бөліңіз"><input className={inputClass} value={heritage.facts.join(", ")} onChange={(e) => setHeritage({ ...heritage, facts: e.target.value.split(",").map((value) => value.trim()) })} /></Field>
              <Field label="Фото жолы"><input className={inputClass} value={heritage.image} onChange={(e) => setHeritage({ ...heritage, image: e.target.value })} /></Field>
              <input className={`${inputClass} text-sm`} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "heritage")} />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" tone="gold"><Save className="mr-2" size={16} /> Сақтау</Button>
                <Button onClick={() => setHeritage(blankHeritage)} tone="ghost"><Plus className="mr-2" size={16} /> Жаңа объект</Button>
                {heritage.slug ? <Button onClick={() => deleteHeritage(heritage.slug)} tone="ghost"><Trash2 className="mr-2" size={16} /> Өшіру</Button> : null}
              </div>
            </form>
          </Panel>
          <Panel title="Объектілер тізімі">
            <div className="grid gap-2">
              {db.heritageItems.map((item) => (
                <button key={item.slug} className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-left hover:border-gold/60" onClick={() => setHeritage(item)}>
                  <span className="font-semibold">{item.title.kk}</span> <span className="text-linen/60">/{item.slug}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}

      {activeTab === "menu" ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Panel title="Қазалы мұрасы мәзірі" text="Бұл Dzumba мәзірі емес. Тек сайт ішіндегі арнайы heritage тағамдары.">
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
              <input className={`${inputClass} text-sm`} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "heritageMenu")} />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" tone="gold">Тағамды сақтау</Button>
                <Button onClick={() => setHeritageMenuItem(blankHeritageMenuItem)} tone="ghost"><Plus className="mr-2" size={16} /> Жаңа тағам</Button>
                {heritageMenuItem.id ? <Button onClick={() => deleteHeritageMenuItem(heritageMenuItem.id)} tone="ghost"><Trash2 className="mr-2" size={16} /> Өшіру</Button> : null}
              </div>
            </form>
          </Panel>
          <Panel title="Тағамдар тізімі">
            <div className="grid gap-2">
              {db.heritageMenuItems.map((item) => (
                <button key={item.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-left hover:border-gold/60" onClick={() => setHeritageMenuItem(item)}>
                  <span className="font-semibold">{item.title}</span> <span className="text-linen/60">/{item.linkedHeritageSlug || "байланыс жоқ"}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}

      {activeTab === "qr" ? (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Panel title="QR кодтар" text="Әр мұра объектінің жеке URL адресі бар. Осы жерден PNG немесе PDF жүктей аласыз.">
            <div className="grid gap-2">
              {heritageOptions.map((item) => (
                <button key={item.slug} className={`rounded-md border px-3 py-3 text-left ${selectedQr?.slug === item.slug ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"}`} onClick={() => setHeritage(item)}>
                  {item.title.kk}
                </button>
              ))}
            </div>
          </Panel>
          {selectedQr ? <QrTools slug={selectedQr.slug} title={selectedQr.title.kk} /> : null}
        </div>
      ) : null}

      {message ? <p className="text-sm text-gold">{message}</p> : null}
    </div>
  );
}
