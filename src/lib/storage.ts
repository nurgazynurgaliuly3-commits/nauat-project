import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/db.json";
import type { NauatDb } from "@/lib/types";
import { readSupabaseDb, writeSupabaseDb } from "@/lib/supabase";

const dataPath = path.join(process.cwd(), "src", "data", "db.json");

export async function getDb(): Promise<NauatDb> {
  const supabaseDb = await readSupabaseDb();
  if (supabaseDb) return supabaseDb;

  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw) as NauatDb;
  } catch {
    return seed as NauatDb;
  }
}

export async function saveDb(db: NauatDb) {
  if (await writeSupabaseDb(db)) return;
  await backupDb();
  await fs.writeFile(dataPath, JSON.stringify(db, null, 2), "utf8");
}

export async function backupDb() {
  try {
    const backupDir = path.join(process.cwd(), "src", "data", "backups");
    await fs.mkdir(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copyFile(dataPath, path.join(backupDir, `db-${stamp}.json`));
  } catch {
    // Қор көшірме қатесі негізгі сақтауды тоқтатпауы керек.
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("kk-KZ").format(price) + " тг";
}
