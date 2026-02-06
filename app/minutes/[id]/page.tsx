import { getSupabaseServer } from "@/lib/supabaseServer";
import MinutesClient from "@/app/minutes/[id]/MinutesClient";

interface PageProps {
  params: { id: string };
}

export default async function MinutesPage({ params }: PageProps) {
  const supabase = getSupabaseServer();
  const { data: minutes } = await supabase
    .from("meeting_minutes")
    .select("sections, summary")
    .eq("meeting_id", params.id)
    .single();

  return (
    <MinutesClient
      meetingId={params.id}
      initialSections={minutes?.sections || undefined}
      initialSummary={minutes?.summary || ""}
    />
  );
}
