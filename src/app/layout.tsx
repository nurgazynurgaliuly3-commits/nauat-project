import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  weight: ["600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Nauat Мұра 2.0",
  description: "Қазалы өңірінің тарихы мен дастархан мәдениетін біріктіретін premium heritage restaurant сайты.",
  icons: {
    icon: "/images/nauat-icon.png",
    shortcut: "/images/nauat-icon.png",
    apple: "/images/nauat-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
