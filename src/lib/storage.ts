import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/db.json";
import type { HeritageMenuItem, NauatDb } from "@/lib/types";
import { readSupabaseDb, writeSupabaseDb } from "@/lib/supabase";

const dataPath = path.join(process.cwd(), "src", "data", "db.json");
const defaultDzumbaMenuUrl = process.env.DZUMBA_MENU_URL || "https://nauatcafe.dzumba.kz/";
const fallbackImage = "/images/nauat-heritage-hero.png";

function nowIso() {
  return new Date().toISOString();
}

export function normalizeDb(db: NauatDb): NauatDb {
  const stamp = nowIso();
  const settings = {
    ...db.settings,
    dzumbaMenuUrl: !db.settings.dzumbaMenuUrl || db.settings.dzumbaMenuUrl === "https://dzumba.kz/" ? defaultDzumbaMenuUrl : db.settings.dzumbaMenuUrl,
    menuTitle: db.settings.menuTitle || "Қазалы мұрасы мәзірі",
    menuSubtitle: db.settings.menuSubtitle || "Арнайы концепциялық мәзір"
  };
  const heritageMenuItems: HeritageMenuItem[] = db.heritageMenuItems?.length
    ? db.heritageMenuItems
    : [
        {
          id: "hm-ulpershek",
          title: "Үлпершек",
          slug: "ulpershek",
          category: "Ұлттық тағамдар",
          price: 4200,
          image: fallbackImage,
          shortDescription: "Сағыныш пен сыйластық мағынасын сақтаған дәстүрлі ас.",
          linkedHeritageSlug: "qazaly-dastarkhan",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        },
        {
          id: "hm-myzhyma-nan",
          title: "Мыжыма нан",
          slug: "myzhyma-nan",
          category: "Ұлттық тағамдар",
          price: 1800,
          image: fallbackImage,
          shortDescription: "Дала дастарханының қарапайым, жылы әрі тойымды дәмі.",
          linkedHeritageSlug: "qazaly-dastarkhan",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        },
        {
          id: "hm-jankent-set",
          title: "Жанкент сеты",
          slug: "jankent-set",
          category: "Қазалы мұрасынан шабыт алған тағамдар",
          price: 7900,
          image: fallbackImage,
          shortDescription: "Оғыз дәуірі мен Сыр бойы тарихынан шабыт алған арнайы сет.",
          linkedHeritageSlug: "jankent",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        },
        {
          id: "hm-ghani-tea",
          title: "Ғани Мұратбаев шайы",
          slug: "ghani-muratbayev-tea",
          category: "Тарихи тұлғаларға арналған тағамдар",
          price: 2400,
          image: fallbackImage,
          shortDescription: "Жастар рухы мен білімге құштарлықты бейнелейтін шай жиынтығы.",
          linkedHeritageSlug: "ghani-muratbayev",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        },
        {
          id: "hm-korkyt-drink",
          title: "Қорқыт сусыны",
          slug: "korkyt-drink",
          category: "Дәстүрлі сусындар",
          price: 2100,
          image: fallbackImage,
          shortDescription: "Қобыз сарыны мен Сыр бойы аңыздарына арналған салқын сусын.",
          linkedHeritageSlug: "korkyt-ata",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        },
        {
          id: "hm-begim-ana-dessert",
          title: "Бегім ана десерті",
          slug: "begim-ana-dessert",
          category: "Десерттер",
          price: 2600,
          image: fallbackImage,
          shortDescription: "Бегім ана мұнарасының нәзік аңызына арналған жеңіл десерт.",
          linkedHeritageSlug: "begim-ana",
          status: "published",
          createdAt: stamp,
          updatedAt: stamp
        }
      ];

  const requiredHeritage = [
    {
      id: "qazaly-dastarkhan",
      slug: "qazaly-dastarkhan",
      category: "Ұлттық тағам тарихы",
      title: { kk: "Қазалының дәстүрлі ас мәдениеті", ru: "Традиционная кухня Казалы", en: "Kazaly Table Culture" },
      short: {
        kk: "Дала дастарханы, қонақасы және ұлттық тағамдар арқылы сақталған жергілікті мәдениет.",
        ru: "Местная культура, сохраненная через традиционный дастархан и гостеприимство.",
        en: "Local culture preserved through the traditional table and hospitality."
      },
      body: {
        kk: "Қазалы дастарханы қонақты құрметтеу, үлкенді сыйлау және елдік жадыны тағам арқылы жеткізу дәстүрімен ерекшеленеді. Үлпершек, нан, шай, ет тағамдары бір ғана дәм емес, отбасы мен ауыл арасындағы байланысты білдіретін мәдени белгі ретінде қабылданады.",
        ru: "Казалинский дастархан связан с уважением к гостю, семейной памятью и местной культурой.",
        en: "Kazaly table culture connects hospitality, family memory, and regional identity."
      },
      facts: ["Қонақасы дәстүрімен байланысты", "Ұлттық тағамдар арқылы мәдени жады сақталады", "Қазалы мұрасы мәзірі үшін негізгі тақырыптардың бірі"],
      relatedMenuIds: [],
      image: fallbackImage,
      galleryImages: [],
      status: "published" as const,
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "korkyt-ata",
      slug: "korkyt-ata",
      category: "Тұлғалар",
      title: { kk: "Қорқыт ата", ru: "Коркыт ата", en: "Korkyt Ata" },
      short: {
        kk: "Сыр бойы аңыздары мен қобыз сарынымен байланысқан рухани тұлға.",
        ru: "Духовный образ, связанный с легендами Сырдарьи и кобызом.",
        en: "A spiritual figure associated with Syr Darya legends and the kobyz."
      },
      body: {
        kk: "Қорқыт ата мұрасы Сыр бойының рухани кеңістігінде ерекше орын алады. Оның аты қобыз үнімен, мәңгілік өмір туралы аңыздармен және түркі дүниесінің терең дүниетанымымен байланыстырылады.",
        ru: "Наследие Коркыта занимает особое место в духовной культуре Сырдарьи.",
        en: "Korkyt Ata's legacy holds a special place in the spiritual culture of the Syr Darya region."
      },
      facts: ["Қобыз дәстүрімен байланысты", "Сыр бойы аңыздарында жиі айтылады", "Түркі дүниесіне ортақ тұлға"],
      relatedMenuIds: [],
      image: fallbackImage,
      galleryImages: [],
      status: "published" as const,
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "begim-ana",
      slug: "begim-ana",
      category: "Тарихи орындар",
      title: { kk: "Бегім ана мұнарасы", ru: "Башня Бегим ана", en: "Begim Ana Tower" },
      short: {
        kk: "Сыр бойындағы аңыз бен сәулет мұрасын біріктіретін тарихи нысан.",
        ru: "Исторический объект, объединяющий легенду и архитектурное наследие.",
        en: "A heritage site connecting legend and architectural memory."
      },
      body: {
        kk: "Бегім ана мұнарасы Сыр өңіріндегі аңызға толы тарихи нысандардың бірі. Мұнара туралы әңгімелер адалдық, тағдыр және жергілікті рухани жады тақырыптарымен сабақтасады.",
        ru: "Башня Бегим ана является одним из легендарных исторических объектов региона.",
        en: "Begim Ana Tower is one of the legendary historical sites of the region."
      },
      facts: ["Аңыздық мұрамен байланысты", "Сыр бойы сәулетінің белгісі", "Heritage десерт концепциясына негіз болды"],
      relatedMenuIds: [],
      image: fallbackImage,
      galleryImages: [],
      status: "published" as const,
      createdAt: stamp,
      updatedAt: stamp
    }
  ];
  const mergedHeritage = [...db.heritageItems];
  for (const item of requiredHeritage) {
    if (!mergedHeritage.some((entry) => entry.slug === item.slug)) mergedHeritage.push(item);
  }

  return {
    ...db,
    settings,
    heritageMenuItems,
    heritageItems: mergedHeritage.map((item) => ({
      ...item,
      id: item.id || item.slug,
      status: item.status || "published",
      createdAt: item.createdAt || stamp,
      updatedAt: item.updatedAt || stamp,
      galleryImages: item.galleryImages || []
    }))
  };
}

export async function getDb(): Promise<NauatDb> {
  const supabaseDb = await readSupabaseDb();
  if (supabaseDb) return normalizeDb(supabaseDb);

  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return normalizeDb(JSON.parse(raw) as NauatDb);
  } catch {
    return normalizeDb(seed as NauatDb);
  }
}

export async function saveDb(db: NauatDb) {
  const normalized = normalizeDb(db);
  if (await writeSupabaseDb(normalized)) return;
  await backupDb();
  await fs.writeFile(dataPath, JSON.stringify(normalized, null, 2), "utf8");
}

export async function backupDb() {
  try {
    const backupDir = path.join(process.cwd(), "src", "data", "backups");
    await fs.mkdir(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copyFile(dataPath, path.join(backupDir, `db-${stamp}.json`));
  } catch {
    // Backup errors must not block the main save operation.
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("kk-KZ").format(price) + " тг";
}
