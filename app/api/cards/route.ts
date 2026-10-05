import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const CardSchema = z.object({
  type: z.string().min(1).max(40),
  recipient_name: z.string().min(1).max(100),
  sender_name: z.string().max(100).optional().default(""),
  message: z.string().min(1).max(1500),
  birthday_date: z.string().nullable().optional(),
  theme: z.string().max(40),
  extra_data: z.record(z.string(), z.unknown()).optional()
});

function fallbackId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid card data." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (!supabase) {
      return NextResponse.json({
        id: fallbackId(),
        demo: true,
        message:
          "Supabase is not configured. This is a demo card."
      });
    }

    const { data: card, error } = await supabase
      .from("cards")
      .insert({
        type: data.type,
        recipient_name: data.recipient_name,
        sender_name: data.sender_name,
        message: data.message,
        birthday_date: data.birthday_date,
        theme: data.theme,
        extra_data: data.extra_data || {}
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: card.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
