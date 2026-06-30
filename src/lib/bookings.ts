import { promises as fs } from "fs";
import path from "path";
import {
  createSupabaseBooking,
  deleteSupabaseBooking,
  readSupabaseBookings,
  updateSupabaseBooking,
  type Booking
} from "@/lib/supabase";

const bookingsPath = path.join(process.cwd(), "src", "data", "bookings.json");

export async function readBookings(): Promise<Booking[]> {
  const supabaseBookings = await readSupabaseBookings();
  if (supabaseBookings) return supabaseBookings;

  try {
    const raw = await fs.readFile(bookingsPath, "utf8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

async function writeLocalBookings(bookings: Booking[]) {
  await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2), "utf8");
}

export async function createBooking(booking: Booking) {
  if (await createSupabaseBooking(booking)) return;
  const bookings = await readBookings();
  bookings.unshift(booking);
  await writeLocalBookings(bookings);
}

export async function updateBooking(booking: Partial<Booking> & { id: string }) {
  if (await updateSupabaseBooking(booking)) return;
  const bookings = await readBookings();
  await writeLocalBookings(
    bookings.map((item) =>
      item.id === booking.id
        ? {
            ...item,
            status: booking.status || item.status || "new",
            note: typeof booking.note === "string" ? booking.note : item.note || ""
          }
        : item
    )
  );
}

export async function deleteBooking(id: string) {
  if (await deleteSupabaseBooking(id)) return;
  const bookings = await readBookings();
  await writeLocalBookings(bookings.filter((booking) => booking.id !== id));
}
