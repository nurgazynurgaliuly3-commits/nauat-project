import Link from "next/link";
import { BookingsManager } from "@/components/BookingsManager";
import { readBookings } from "@/lib/bookings";

export default async function AdminBookingsPage() {
  const bookings = await readBookings();

  return (
    <main className="mx-auto max-w-6xl px-5 py-6">
      <header className="mb-8">
        <Link href="/" className="font-[var(--font-display)] text-2xl font-semibold text-gold">Nauat</Link>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">Брондау өтінімдері</h1>
        <p className="mt-2 text-linen/75">Қонақтар қалдырған өтінімдерді растау, аяқтау, өшіру және ескертпе жазу.</p>
      </header>
      <BookingsManager initialBookings={bookings} />
    </main>
  );
}
