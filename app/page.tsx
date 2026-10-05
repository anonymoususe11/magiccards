"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { CARD_TYPES } from "@/lib/card-config";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-10 md:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="font-bold tracking-tight text-xl">
            ✨ MagicCards
          </div>

          <Link
            href="/create"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm hover:bg-white/15"
          >
            Create Card
          </Link>
        </div>

        <div className="py-24 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Sparkles size={16} />
              Interactive greeting experiences
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Create a Moment
              <br />
              They’ll Remember ✨
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Create a personalized interactive card, generate a unique link,
              and send it to someone special.
            </p>

            <Link
              href="/create"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-105"
            >
              Create Your Card
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        <h2 className="mb-6 text-2xl font-bold">
          Choose an experience
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_TYPES.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={`/create?type=${card.id}`}
                className="glass glow block rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="text-4xl">{card.emoji}</div>
                <h3 className="mt-5 text-xl font-bold">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {card.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
