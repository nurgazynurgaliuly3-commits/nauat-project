import type { NauatDb } from "@/lib/types";

export type Booking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  guests: number;
  status?: "new" | "confirmed" | "done" | "cancelled";
  note?: string;
  createdAt: string;
};

export function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseHeaders(contentType = "application/json") {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": contentType
  };
}

function supabaseUrl(path: string) {
  return `${process.env.SUPABASE_URL}${path}`;
}

async function supabaseFetch(path: string, init?: RequestInit) {
  const response = await fetch(supabaseUrl(path), init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase қатесі: ${response.status} ${text}`);
  }
  return response;
}

export async function readSupabaseDb(): Promise<NauatDb | null> {
  if (!hasSupabase()) return null;
  const response = await supabaseFetch("/rest/v1/site_state?id=eq.main&select=data", {
    headers: supabaseHeaders()
  });
  const rows = (await response.json()) as Array<{ data: NauatDb }>;
  return rows[0]?.data || null;
}

export async function writeSupabaseDb(db: NauatDb) {
  if (!hasSupabase()) return false;
  await supabaseFetch("/rest/v1/site_state", {
    method: "POST",
    headers: { ...supabaseHeaders(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ id: "main", data: db, updated_at: new Date().toISOString() })
  });
  return true;
}

export async function readSupabaseBookings(): Promise<Booking[] | null> {
  if (!hasSupabase()) return null;
  const response = await supabaseFetch("/rest/v1/bookings?select=*&order=created_at.desc", {
    headers: supabaseHeaders()
  });
  const rows = (await response.json()) as Array<{
    id: string;
    name: string;
    phone: string;
    booking_date: string;
    guests: number;
    status: Booking["status"];
    note: string;
    created_at: string;
  }>;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    date: row.booking_date,
    guests: row.guests,
    status: row.status,
    note: row.note || "",
    createdAt: row.created_at
  }));
}

export async function createSupabaseBooking(booking: Booking) {
  if (!hasSupabase()) return false;
  await supabaseFetch("/rest/v1/bookings", {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({
      id: booking.id,
      name: booking.name,
      phone: booking.phone,
      booking_date: booking.date,
      guests: booking.guests,
      status: booking.status || "new",
      note: booking.note || "",
      created_at: booking.createdAt
    })
  });
  return true;
}

export async function updateSupabaseBooking(booking: Partial<Booking> & { id: string }) {
  if (!hasSupabase()) return false;
  await supabaseFetch(`/rest/v1/bookings?id=eq.${booking.id}`, {
    method: "PATCH",
    headers: supabaseHeaders(),
    body: JSON.stringify({
      status: booking.status,
      note: booking.note || ""
    })
  });
  return true;
}

export async function deleteSupabaseBooking(id: string) {
  if (!hasSupabase()) return false;
  await supabaseFetch(`/rest/v1/bookings?id=eq.${id}`, {
    method: "DELETE",
    headers: supabaseHeaders()
  });
  return true;
}

export async function uploadSupabaseImage(file: File, name: string) {
  if (!hasSupabase()) return null;
  const bucket = process.env.SUPABASE_BUCKET || "nauat-assets";
  const bytes = Buffer.from(await file.arrayBuffer());
  await supabaseFetch(`/storage/v1/object/${bucket}/${name}`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: bytes
  });
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${name}`;
}
