import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nauat Мұра 2.0",
  description: "Қазалы өңірінің тарихы мен дастархан мәдениетін біріктіретін премиум heritage restaurant сайты."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}
