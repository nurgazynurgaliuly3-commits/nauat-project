"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Download, FileDown, QrCode } from "lucide-react";

export function QrTools({ slug, title }: { slug: string; title: string }) {
  const [origin, setOrigin] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const url = useMemo(() => `${origin}/heritage/${slug}`, [origin, slug]);

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  useEffect(() => {
    if (!origin) return;
    QRCode.toDataURL(url, { margin: 2, width: 420, color: { dark: "#111827", light: "#ffffff" } }).then(setDataUrl);
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
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 148, 210, "F");
    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(18);
    pdf.text("Nauat Heritage 2.0", 18, 24);
    pdf.setFontSize(12);
    pdf.text(title, 18, 36);
    pdf.addImage(dataUrl, "PNG", 29, 52, 90, 90);
    pdf.setFontSize(9);
    pdf.text(url, 18, 158, { maxWidth: 112 });
    pdf.save(`${slug}-qr.pdf`);
  }

  return (
    <div className="rounded-md border border-[#e5e7eb] bg-white p-5">
      <div className="mb-4 flex items-center gap-3 text-[#7c3aed]">
        <QrCode size={22} />
        <p className="font-semibold text-[#111827]">QR коды</p>
      </div>
      {dataUrl ? (
        <img className="mx-auto aspect-square w-52 rounded-md border border-[#e5e7eb] bg-white p-3" src={dataUrl} alt={`${title} QR коды`} />
      ) : (
        <div className="grid aspect-square w-52 place-items-center rounded-md bg-[#f3f4f6] text-sm text-[#6b7280]">Дайындалуда</div>
      )}
      <p className="mt-4 break-all text-xs text-[#6b7280]">{url}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button onClick={downloadPng} type="button" className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#7c3aed] bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white">
          <Download className="mr-2" size={16} /> PNG
        </button>
        <button onClick={downloadPdf} type="button" className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827]">
          <FileDown className="mr-2" size={16} /> PDF
        </button>
      </div>
    </div>
  );
}
