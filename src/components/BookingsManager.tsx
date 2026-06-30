"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/Buttons";

type Booking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  guests: number;
  status?: "new" | "confirmed" | "done" | "cancelled";
  note?: string;
  createdAt: string;
};

const statuses = {
  new: "Жаңа",
  confirmed: "Расталды",
  done: "Аяқталды",
  cancelled: "Бас тартылды"
};

export function BookingsManager({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [message, setMessage] = useState("");

  async function updateBooking(id: string, patch: Partial<Booking>) {
    const current = bookings.find((booking) => booking.id === id);
    if (!current) return;
    const nextItem = { ...current, ...patch };
    setBookings(bookings.map((booking) => (booking.id === id ? nextItem : booking)));
    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextItem)
    });
    setMessage(response.ok ? "Өтінім жаңартылды" : "Өтінімді жаңарту кезінде қате шықты");
  }

  async function deleteBooking(id: string) {
    const response = await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (response.ok) {
      setBookings(bookings.filter((booking) => booking.id !== id));
      setMessage("Өтінім өшірілді");
    } else {
      setMessage("Өтінімді өшіру кезінде қате шықты");
    }
  }

  return (
    <section className="glass rounded-lg p-4">
      {bookings.length ? (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={booking.id}>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_0.8fr_0.5fr]">
                <div>
                  <p className="font-semibold text-porcelain">{booking.name}</p>
                  <p className="text-sm text-linen/75">{booking.createdAt.slice(0, 10)}</p>
                </div>
                <a className="text-gold" href={`tel:${booking.phone}`}>{booking.phone}</a>
                <p className="text-linen">{booking.date}</p>
                <p className="text-linen">{booking.guests} адам</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
                <select
                  className="rounded-md border border-white/15 bg-ink px-3 py-3"
                  value={booking.status || "new"}
                  onChange={(event) => updateBooking(booking.id, { status: event.target.value as Booking["status"] })}
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
                <input
                  className="rounded-md border border-white/15 bg-white/5 px-3 py-3"
                  placeholder="Әкімші ескертпесі"
                  value={booking.note || ""}
                  onChange={(event) => updateBooking(booking.id, { note: event.target.value })}
                />
                <button className="inline-flex items-center justify-center rounded-md border border-red-400/40 px-3 py-3 text-red-200" type="button" onClick={() => deleteBooking(booking.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="px-2 py-6 text-linen/75">Әзірге өтінім жоқ.</p>
      )}
      {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
      <div className="mt-5">
        <Button href="/admin" tone="ghost">Әкімші панеліне қайту</Button>
      </div>
    </section>
  );
}
