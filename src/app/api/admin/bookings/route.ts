import { NextResponse } from "next/server";
import { deleteBooking, readBookings, updateBooking } from "@/lib/bookings";
import type { Booking } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json(await readBookings());
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<Booking> & { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Өтінім коды қажет" }, { status: 400 });
  }
  await updateBooking({
    id: body.id,
    status: body.status || "new",
    note: typeof body.note === "string" ? body.note : ""
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Өтінім коды қажет" }, { status: 400 });
  }
  await deleteBooking(id);
  return NextResponse.json({ ok: true });
}
