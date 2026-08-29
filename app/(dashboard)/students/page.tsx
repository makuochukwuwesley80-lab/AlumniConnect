import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StudentDatabasePage from "./StudentDatabasePage";

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return <StudentDatabasePage isAdmin={isAdmin} userId={user.id} />;
}
