import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/db.json";
import type { HeritageItem, HeritageMenuItem, NauatDb } from "@/lib/types";
import { readSupabaseDb, writeSupabaseDb } from "@/lib/supabase";

const dataPath = path.join(process.cwd(), "src", "data", "db.json");
const defaultDzumbaMenuUrl = process.env.DZUMBA_MENU_URL || "https://nauatcafe.dzumba.kz/";
const fallbackImage = "/images/nauat-heritage-hero.png";

const heritageImages = {
  dastarkhan: fallbackImage,
  jankent: fallbackImage,
  korkyt: "https://seykhuninfo.kz/uploads/posts/2021-11/medium/1637242000_shara.jpeg",
  begim: "https://seykhuninfo.kz/uploads/posts/2021-08/medium/1628419920_sharau.png",
  zhankozha: "https://e-history.kz/storage/tmp/resize/history_calendars/1200_0_d54d9e3be4314567537a032fc9023ebf.jpg",
  ghani: "https://cdn05.qazaqstan.tv/720x/old/articles/4/article_42364.jpg",
  roza: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Roza_Baglanova_%28crop%29.jpg/640px-Roza_Baglanova_%28crop%29.jpg",
  madina: "https://gdb.rferl.org/1602BD9C-0B1E-4379-B3DB-B59ED1D20661_w250_s.jpg"
};

function nowIso() {
  return new Date().toISOString();
}

function defaultHeritageMenuItems(stamp: string): HeritageMenuItem[] {
  return [
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
      shortDescription: "Бегім ана мұнарасы туралы аңыздың нәзік әсеріне арналған жеңіл десерт.",
      linkedHeritageSlug: "begim-ana",
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    }
  ];
}

function curatedHeritageItems(stamp: string): HeritageItem[] {
  return [
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
        kk: "Қазалы дастарханы қонақты құрметтеу, үлкенді сыйлау және елдік жадты тағам арқылы жеткізу дәстүрімен ерекшеленеді. Үлпершек, нан, шай, ет тағамдары бір ғана дәм емес, отбасы мен ауыл арасындағы байланысты білдіретін мәдени белгі ретінде қабылданады.",
        ru: "Казалинский дастархан связан с уважением к гостю, семейной памятью и местной культурой.",
        en: "Kazaly table culture connects hospitality, family memory, and regional identity."
      },
      facts: ["Қонақасы дәстүрімен байланысты", "Ұлттық тағамдар арқылы мәдени жады сақталады", "Қазалы мұрасы мәзірінің негізгі тақырыптарының бірі"],
      relatedMenuIds: [],
      image: heritageImages.dastarkhan,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "korkyt-ata",
      slug: "korkyt-ata",
      category: "Тұлғалар",
      title: { kk: "Қорқыт ата", ru: "Коркыт ата", en: "Korkyt Ata" },
      short: {
        kk: "Сыр бойы аңыздары, қобыз сарыны және түркі дүниесінің ортақ рухани жадымен байланысты тұлға.",
        ru: "Духовный образ, связанный с легендами Сырдарьи, кобызом и общетюркской памятью.",
        en: "A spiritual figure associated with Syr Darya legends, the kobyz, and Turkic cultural memory."
      },
      body: {
        kk: "Қорқыт ата мұрасы Сыр бойының рухани кеңістігінде ерекше орын алады. Ашық деректерде ол оғыз-қыпшақ дәуірімен, қобыз дәстүрімен, жыршылық және даналық бейнесімен байланыстырылады. Қорқыт туралы аңыздарда адамның өмір, өлім, мәңгілік және өнер алдындағы жауапкершілігі көркем тілмен айтылады. Сондықтан Nauat мұрасы ішінде Қорқыт ата Қазалыда туған тұлға ретінде емес, Сыр өңірінің терең рухани қабатын танытатын ортақ мұра ретінде беріледі.",
        ru: "Наследие Коркыта занимает особое место в духовной культуре Сырдарьи. В открытых источниках он связан с огузо-кыпчакской эпохой, кобызом, эпическими сказаниями и образом мудреца.",
        en: "Korkyt Ata's legacy holds a special place in the spiritual culture of the Syr Darya region. Open sources connect him with Oghuz-Kipchak tradition, the kobyz, epic storytelling, and the figure of a wise bard."
      },
      facts: ["Қобыз дәстүрімен байланыстырылады", "Сыр бойы аңыздарында жиі айтылады", "ЮНЕСКО тізіміндегі Dede Qorqud/Korkyt Ata эпикалық мұрасымен сабақтас ортақ түркілік бейне"],
      relatedMenuIds: [],
      image: heritageImages.korkyt,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "begim-ana",
      slug: "begim-ana",
      category: "Тарихи орындар",
      title: { kk: "Бегім ана мұнарасы", ru: "Башня Бегим ана", en: "Begim Ana Tower" },
      short: {
        kk: "Сыр мен Арал-Қазалы кеңістігіндегі аңыз бен сәулет мұрасын біріктіретін тарихи нысан.",
        ru: "Исторический объект, соединяющий легенду и архитектурную память Сырдарьинского региона.",
        en: "A heritage site connecting legend and architectural memory in the Syr-Aral region."
      },
      body: {
        kk: "Бегім ана мұнарасы - ел жадында адалдық, тағдыр және әйел бейнесінің қадірі туралы аңыздармен сақталған мұра. Ашық деректерде мұнара ортағасырлық сәулет ескерткіші ретінде аталады, ал халық аңызында Бегім ана есімі әділетсіздік, сабыр және рухани тазалық тақырыптарымен байланысты айтылады. Nauat бетінде бұл нысан нақты тарихи-мәдени ескерткіш әрі өңірлік аңыздың көркем символы ретінде ұсынылады.",
        ru: "Башня Бегим ана известна как памятник средневековой архитектуры и объект местных легенд, связанных с честью, судьбой и образом женщины.",
        en: "Begim Ana Tower is known as a medieval architectural monument and a site of local legends about honor, fate, and the dignity of a woman."
      },
      facts: ["Ортағасырлық сәулет мұрасы ретінде танылады", "Жергілікті аңыздармен тығыз байланысты", "Сыр-Арал өңірінің мәдени маршруттарына лайық нысан"],
      relatedMenuIds: [],
      image: heritageImages.begim,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "zhankozha-batyr",
      slug: "zhankozha-batyr",
      category: "Тұлғалар",
      title: { kk: "Жанқожа батыр", ru: "Жанкожа батыр", en: "Zhankozha Batyr" },
      short: {
        kk: "Сыр бойы халқының еркіндігі үшін күрескен батыр, Қазалы өңірінің тарихи жадындағы ірі тұлға.",
        ru: "Батыр, связанный с борьбой народа Сырдарьи за свободу и исторической памятью Казалинского региона.",
        en: "A batyr remembered in the Kazaly region for defending the freedom of the Syr Darya people."
      },
      body: {
        kk: "Жанқожа Нұрмұхамедұлы туралы деректерде ол Сыр бойындағы елді қорғаған, Хиуа және отарлық қысымға қарсы күрестермен аты шыққан батыр ретінде сипатталады. Қазалы өңірінде оның есімі ерлік, жерге адалдық және халық намысын қорғау ұғымдарымен қатар аталады. Бұл бетте Жанқожа батыр романтикалық әсірелеусіз, ел жадында сақталған тарихи тұлға ретінде ұсынылады.",
        ru: "Жанкожа Нурмухамедулы в открытых источниках описывается как батыр Сырдарьинского региона, связанный с борьбой против хивинского и колониального давления.",
        en: "Zhankozha Nurmukhameduly is described in open sources as a Syr Darya batyr connected with resistance against Khivan and colonial pressure."
      },
      facts: ["1774-1860 жылдар аралығында өмір сүргені көрсетіледі", "Сыр бойы мен Қазалы өңірінің тарихи жадында ерекше орны бар", "Ел қорғаған батыр ретінде халық ауыз әдебиетінде де айтылады"],
      relatedMenuIds: ["m2"],
      image: heritageImages.zhankozha,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "ghani-muratbayev",
      slug: "ghani-muratbayev",
      category: "Тұлғалар",
      title: { kk: "Ғани Мұратбаев", ru: "Гани Муратбаев", en: "Ghani Muratbayev" },
      short: {
        kk: "Қазалы топырағынан шыққан қоғам қайраткері, жастар қозғалысының жарқын өкілі.",
        ru: "Общественный деятель из Казалы, яркий представитель молодежного движения.",
        en: "A public figure from Kazaly and a prominent youth movement leader."
      },
      body: {
        kk: "Ғани Мұратбаев 1902 жылы Қазалы өңірінде дүниеге келгені ашық деректерде көрсетіледі. Оның қысқа ғұмыры жастарды білімге, қоғамдық жауапкершілікке және елдік іске жұмылдыру идеясымен есте қалды. Қазалы үшін Ғани есімі - жастық жігердің, сергек ойдың және туған жерден басталған үлкен арманның белгісі.",
        ru: "Открытые источники указывают, что Гани Муратбаев родился в 1902 году в Казалинском регионе. Его наследие связано с молодежным движением, образованием и общественной ответственностью.",
        en: "Open sources state that Ghani Muratbayev was born in 1902 in the Kazaly region. His legacy is associated with youth activism, education, and civic responsibility."
      },
      facts: ["1902 жылы Қазалы өңірінде туған", "Жастар қозғалысымен байланысты қоғам қайраткері", "Қазалыда оның есіміне қатысты музейлік және естелік кеңістік бар"],
      relatedMenuIds: ["m3", "m4"],
      image: heritageImages.ghani,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "roza-baglanova",
      slug: "roza-baglanova",
      category: "Тұлғалар",
      title: { kk: "Роза Бағланова", ru: "Роза Багланова", en: "Roza Baglanova" },
      short: {
        kk: "Қазалыда туған Қазақстанның әйгілі әншісі, халық жүрегінде қалған сахна аңызы.",
        ru: "Знаменитая певица, родившаяся в Казалы, легенда казахстанской сцены.",
        en: "A celebrated singer born in Kazaly and remembered as a legend of the Kazakh stage."
      },
      body: {
        kk: "Роза Бағланова 1922 жылы Қазалыда дүниеге келгені ашық деректерде көрсетіледі. Оның дауысы қазақ ән өнерінің ғана емес, тұтас бір дәуірдің үніне айналды. Майдан даласында ән салған жылдары, кейінгі үлкен сахнадағы ғұмыры және халыққа жақын болмысы Роза Бағланованы Қазалының мақтанышы әрі ұлттық мәдениеттің биік тұлғасына айналдырды.",
        ru: "Открытые источники указывают, что Роза Багланова родилась в 1922 году в Казалы. Ее творчество стало важной частью казахстанской музыкальной культуры.",
        en: "Open sources state that Roza Baglanova was born in 1922 in Kazaly. Her voice became an important part of Kazakhstan's musical culture and wartime memory."
      },
      facts: ["1922 жылы Қазалыда туған", "Қазақстанның халық әртісі ретінде кең танылған", "Халық Қаһарманы атағымен марапатталғаны ашық деректерде көрсетіледі"],
      relatedMenuIds: [],
      image: heritageImages.roza,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    },
    {
      id: "madina-eraliyeva",
      slug: "madina-eraliyeva",
      category: "Тұлғалар",
      title: { kk: "Мәдина Ералиева", ru: "Мадина Ералиева", en: "Madina Eraliyeva" },
      short: {
        kk: "Қазалыдан шыққан лирикалық дауыс иесі, қазақ эстрадасында нәзік болмысымен есте қалған әнші.",
        ru: "Лирическая певица из Казалы, запомнившаяся нежным голосом и особой сценической манерой.",
        en: "A lyrical singer from Kazaly remembered for her gentle voice and distinctive stage presence."
      },
      body: {
        kk: "Мәдина Ералиева туралы ашық деректерде оның Қазалы өңірінде туғаны және қазақ ән сахнасында өзіндік лирикалық қолтаңба қалдырғаны айтылады. Оның орындауындағы әндерде сыршылдық, сағыныш және әйел жанының нәзік әлемі анық сезіледі. Nauat мұрасы ішінде Мәдина Ералиева Қазалының мәдени жадындағы әсем дауыс ретінде ұсынылады.",
        ru: "Открытые источники связывают Мадину Ералиеву с Казалинским регионом и отмечают ее лирический вклад в казахскую эстраду.",
        en: "Open sources connect Madina Eraliyeva with the Kazaly region and note her lyrical contribution to Kazakh popular music."
      },
      facts: ["Қазалы өңірімен байланысты әнші", "Қазақстанның еңбек сіңірген әртісі ретінде аталады", "1999 жылы жол апатынан қаза болғаны ашық деректерде көрсетіледі"],
      relatedMenuIds: [],
      image: heritageImages.madina,
      galleryImages: [],
      status: "published",
      createdAt: stamp,
      updatedAt: stamp
    }
  ];
}

export function normalizeDb(db: NauatDb): NauatDb {
  const stamp = nowIso();
  const settings = {
    ...db.settings,
    dzumbaMenuUrl: !db.settings.dzumbaMenuUrl || db.settings.dzumbaMenuUrl === "https://dzumba.kz/" ? defaultDzumbaMenuUrl : db.settings.dzumbaMenuUrl,
    menuTitle: db.settings.menuTitle || "Қазалы мұрасы мәзірі",
    menuSubtitle: db.settings.menuSubtitle || "Арнайы концепциялық мәзір"
  };
  const heritageMenuItems = db.heritageMenuItems?.length ? db.heritageMenuItems : defaultHeritageMenuItems(stamp);
  const mergedHeritage = [...(db.heritageItems || [])];

  for (const curated of curatedHeritageItems(stamp)) {
    const index = mergedHeritage.findIndex((entry) => entry.slug === curated.slug);
    if (index === -1) {
      mergedHeritage.push(curated);
    } else {
      const existing = mergedHeritage[index];
      const adminEdited = Boolean(existing.createdAt && existing.updatedAt && existing.createdAt !== existing.updatedAt);
      mergedHeritage[index] = adminEdited
        ? {
            ...curated,
            ...existing,
            id: existing.id || curated.id,
            galleryImages: existing.galleryImages?.length ? existing.galleryImages : curated.galleryImages,
            status: existing.status || curated.status
          }
        : {
            ...existing,
            ...curated,
            id: existing.id || curated.id,
            galleryImages: existing.galleryImages?.length ? existing.galleryImages : curated.galleryImages,
            status: existing.status || curated.status,
            createdAt: existing.createdAt || curated.createdAt,
            updatedAt: existing.updatedAt || curated.updatedAt
          };
    }
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
