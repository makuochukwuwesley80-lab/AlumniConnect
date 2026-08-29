import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GENERAL_ROOM, resolveConversationId } from "@/lib/chat/rooms";
import GeneralChat from "@/components/chat/GeneralChat";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversationId = await resolveConversationId(supabase, GENERAL_ROOM);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <GeneralChat
        currentUserId={user.id}
        room={GENERAL_ROOM}
        conversationId={conversationId}
      />
    </div>
  );
}