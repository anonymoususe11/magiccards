"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CARD_TYPES } from "@/lib/card-config";

export default function CreatePage() {
  const searchParams = useSearchParams();

  const initialType =
    searchParams.get("type") || "birthday";

  const [type, setType] = useState(initialType);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [theme, setTheme] = useState("glass");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const selected = useMemo(
    () => CARD_TYPES.find((x) => x.id === type),
    [type]
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type,
          recipient_name: recipient,
          sender_name: sender,
          message,
          birthday_date: birthday || null,
          theme,
          extra_data: {}
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      window.location.href = `/c/${data.id}`;
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Unable to create card."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={submit}
            className="glass card-shadow rounded-3xl p-6 md:p-8"
          >
            <h1 className="text-3xl font-black">
              Create your card ✨
            </h1>

            <p className="mt-2 text-white/55">
              Fill in the details and create a unique experience.
            </p>

            <label className="mt-7 block text-sm text-white/70">
              Card type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
            >
              {CARD_TYPES.map((card) => (
                <option
                  key={card.id}
                  value={card.id}
                  className="bg-black"
                >
                  {card.emoji} {card.title}
                </option>
              ))}
            </select>

            <label className="mt-5 block text-sm text-white/70">
              Recipient name
            </label>

            <input
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Ayesha"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
            />

            <label className="mt-5 block text-sm text-white/70">
              Your name
            </label>

            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. Ali"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
            />

            {type === "birthday" && (
              <>
                <label className="mt-5 block text-sm text-white/70">
                  Birthday date
                </label>

                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
                />
              </>
            )}

            <label className="mt-5 block text-sm text-white/70">
              Personal message
            </label>

            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something meaningful..."
              rows={5}
              maxLength={1500}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
            />

            <label className="mt-5 block text-sm text-white/70">
              Theme
            </label>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 outline-none"
            >
              <option value="glass">Glassmorphism</option>
              <option value="elegant">Elegant</option>
              <option value="colorful">Colorful</option>
              <option value="dark">Dark Luxury</option>
              <option value="minimal">Minimal</option>
              <option value="pastel">Pastel</option>
              <option value="celebration">Celebration</option>
              <option value="night">Night Sky</option>
            </select>

            {result && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {result}
              </div>
            )}

            <button
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-white px-5 py-4 font-bold text-black transition hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Magic ✨"}
            </button>
          </form>

          <div className="glass card-shadow flex min-h-[500px] flex-col items-center justify-center rounded-3xl p-8 text-center">
            <div className="text-7xl">
              {selected?.emoji || "✨"}
            </div>

            <p className="mt-7 text-sm uppercase tracking-[.25em] text-white/40">
              Preview
            </p>

            <h2 className="mt-4 text-4xl font-black">
              {recipient || "Someone Special"}
            </h2>

            <p className="mt-5 max-w-md whitespace-pre-wrap text-white/60">
              {message ||
                "Your personalized message will appear here."}
            </p>

            {sender && (
              <p className="mt-8 text-sm text-white/40">
                — {sender}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
