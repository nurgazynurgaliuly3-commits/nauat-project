export type Locale = "kk" | "ru" | "en";

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  heritage: boolean;
};

export type HeritageItem = {
  slug: string;
  category: string;
  title: Record<Locale, string>;
  short: Record<Locale, string>;
  body: Record<Locale, string>;
  facts: string[];
  relatedMenuIds: string[];
  image: string;
};

export type SiteSection = {
  id: string;
  title: string;
  text: string;
  image: string;
  enabled: boolean;
};

export type SiteSettings = {
  brandName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroImage: string;
  menuTitle: string;
  menuSubtitle: string;
  heritageTitle: string;
  heritageSubtitle: string;
  bookingTitle: string;
  bookingText: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    gold: string;
    green: string;
    light: string;
    dark: string;
  };
  sections: SiteSection[];
  visibility: {
    introCards: boolean;
    menu: boolean;
    heritage: boolean;
    customSections: boolean;
    booking: boolean;
  };
};

export type NauatDb = {
  settings: SiteSettings;
  menuItems: MenuItem[];
  heritageItems: HeritageItem[];
};
