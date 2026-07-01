import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}
