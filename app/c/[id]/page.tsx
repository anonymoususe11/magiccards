import { notFound } from "next/navigation";
import CardExperience from "@/components/experiences/CardExperience";
import { supabase } from "@/lib/supabase";
import type { Card } from "@/types/card";

export default async function CardPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!supabase) {
    return (
      <CardExperience
        card={{
          id,
          type: "birthday",
          recipient_name: "Someone Special",
          sender_name: "MagicCards",
          message:
            "Connect Supabase to load real cards.",
          theme: "glass"
        }}
      />
    );
  }

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <CardExperience card={data as Card} />;
}
