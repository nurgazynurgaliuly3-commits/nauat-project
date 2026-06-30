import { NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import type { Booking } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: Partial<Booking>;
  try {
    body = (await request.json()) as Partial<Booking>;
  } catch {
    return NextResponse.json({ error: "Сұраныс форматы дұрыс емес" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const date = String(body.date || "").trim();
  const guests = Number(body.guests || 0);

  if (!name || !phone || !date || !Number.isFinite(guests) || guests < 1) {
    return NextResponse.json({ error: "Барлық өрісті дұрыс толтырыңыз" }, { status: 400 });
  }

  const booking: Booking = {
    id: crypto.randomUUID(),
    name,
    phone,
    date,
    guests,
    status: "new",
    note: "",
    createdAt: new Date().toISOString()
  };
  await createBooking(booking);

  return NextResponse.json({ ok: true, booking });
}
