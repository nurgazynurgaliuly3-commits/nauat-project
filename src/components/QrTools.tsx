"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Download, FileDown, QrCode } from "lucide-react";
import { Button } from "@/components/Buttons";

export function QrTools({ slug, title }: { slug: string; title: string }) {
  const [origin, setOrigin] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const url = useMemo(() => `${origin}/heritage/${slug}`, [origin, slug]);

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  useEffect(() => {
    if (!origin) return;
    QRCode.toDataURL(url, { margin: 2, width: 420, color: { dark: "#120f0b", light: "#f7f1e7" } }).then(setDataUrl);
  }, [origin, url]);

  function downloadPng() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `${slug}-qr.png`;
    link.href = dataUrl;
    link.click();
  }

  function downloadPdf() {
    if (!dataUrl) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    pdf.setFillColor(247, 241, 231);
    pdf.rect(0, 0, 148, 210, "F");
    pdf.setTextColor(18, 15, 11);
    pdf.setFontSize(18);
    pdf.text("Nauat Мұра 2.0", 18, 24);
    pdf.setFontSize(12);
    pdf.text(title, 18, 36);
    pdf.addImage(dataUrl, "PNG", 29, 52, 90, 90);
    pdf.setFontSize(9);
    pdf.text(url, 18, 158, { maxWidth: 112 });
    pdf.save(`${slug}-qr.pdf`);
  }

  return (
    <div className="glass rounded-lg p-5 shadow-glow">
      <div className="mb-4 flex items-center gap-3 text-gold">
        <QrCode size={22} />
        <p className="font-semibold">QR коды</p>
      </div>
      {dataUrl ? (
        <img className="mx-auto aspect-square w-52 rounded-md bg-porcelain p-3" src={dataUrl} alt={`${title} QR коды`} />
      ) : (
        <div className="grid aspect-square w-52 place-items-center rounded-md bg-white/10 text-sm text-linen">Дайындалуда</div>
      )}
      <p className="mt-4 break-all text-xs text-linen/80">{url}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button onClick={downloadPng} tone="gold">
          <Download className="mr-2" size={16} /> PNG
        </Button>
        <Button onClick={downloadPdf} tone="ghost">
          <FileDown className="mr-2" size={16} /> PDF
        </Button>
      </div>
    </div>
  );
}
