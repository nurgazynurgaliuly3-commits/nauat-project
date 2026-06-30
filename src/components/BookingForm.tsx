"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Buttons";

export function BookingForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        date: form.get("date"),
        guests: Number(form.get("guests"))
      })
    });

    setPending(false);
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(result?.error || "Өтінім жіберілмеді");
      return;
    }

    event.currentTarget.reset();
    setMessage("Өтінім қабылданды. Әкімші сізбен байланысады.");
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <input name="name" className="rounded-md border border-white/15 bg-white/5 px-4 py-3" placeholder="Атыңыз" required />
      <input name="phone" className="rounded-md border border-white/15 bg-white/5 px-4 py-3" placeholder="Телефон" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="date" className="rounded-md border border-white/15 bg-white/5 px-4 py-3" placeholder="Күні" type="date" required />
        <input name="guests" className="rounded-md border border-white/15 bg-white/5 px-4 py-3" placeholder="Қонақ саны" type="number" min="1" required />
      </div>
      <Button tone="gold" type="submit">{pending ? "Жіберілуде..." : "Өтінім қалдыру"}</Button>
      {message ? <p className="text-sm text-gold">{message}</p> : null}
    </form>
  );
}
