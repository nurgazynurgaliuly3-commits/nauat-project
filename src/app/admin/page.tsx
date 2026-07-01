import { AdminPanel } from "@/components/AdminPanel";
import { getDb } from "@/lib/storage";
import { getProductionWarnings } from "@/lib/env";

export default async function AdminPage() {
  const db = await getDb();
  const warnings = getProductionWarnings();

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-5 text-[#111827]">
      {warnings.length ? (
        <section className="mx-auto mb-4 max-w-[1500px] rounded-md border border-[#fde68a] bg-[#fffbeb] p-4 text-sm text-[#92400e]">
          <p className="mb-2 font-semibold">Production ескертулері</p>
          <ul className="space-y-1">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mx-auto max-w-[1500px]">
        <AdminPanel initialDb={db} />
      </div>
    </main>
  );
}
