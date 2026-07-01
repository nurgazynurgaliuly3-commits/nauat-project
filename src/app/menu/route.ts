import { redirect } from "next/navigation";
import { getDb } from "@/lib/storage";

export async function GET() {
  const db = await getDb();
  redirect(process.env.DZUMBA_MENU_URL || db.settings.dzumbaMenuUrl || "/");
}
