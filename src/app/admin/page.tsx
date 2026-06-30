import Link from "next/link";
import { AdminPanel } from "@/components/AdminPanel";
import { getDb } from "@/lib/storage";
import { Button } from "@/components/Buttons";
import { getProductionWarnings } from "@/lib/env";

export default async function AdminPage() {
  const db = await getDb();
  const warnings = getProductionWarnings();

  return (
    <main className="mx-auto max-w-7xl px-5 py-6">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link href="/" className="font-[var(--font-display)] text-2xl font-semibold text-gold">Nauat</Link>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">Әкімші панелі</h1>
          <p className="mt-2 max-w-2xl text-linen/75">Мұра объектілерін, мәзір тағамдарын және QR кодтарын басқару.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/bookings" tone="gold">Брондаулар</Button>
          <Button href="/" tone="ghost">Сайтқа қайту</Button>
        </div>
      </header>
      {warnings.length ? (
        <section className="mb-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-linen">
          <p className="mb-2 font-semibold text-gold">Production ескертулері</p>
          <ul className="space-y-1">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <AdminPanel initialDb={db} />
    </main>
  );
}
