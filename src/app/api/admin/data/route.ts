import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/storage";
import type { NauatDb } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getDb());
}

export async function POST(request: Request) {
  const db = (await request.json()) as NauatDb;
  await saveDb(db);
  return NextResponse.json(await getDb());
}
