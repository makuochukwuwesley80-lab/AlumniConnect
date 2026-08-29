import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: user.id,
      title: "Welcome to AlumniConnect 🎓",
      message:
        "This is a real notification from your INCUSAAF AlumniConnect system.",
      type: "system",
      read: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    notification: data,
  });
}
