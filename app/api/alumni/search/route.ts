import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  let requestQuery = supabase
    .from("alumni")
    .select(
      "id, alumni_number, first_name, last_name, email, occupation, company, graduation_year"
    )
    .order("graduation_year", { ascending: false })
    .order("last_name", { ascending: true })
    .limit(50);

  if (query) {
    const safeQuery = query.replace(/[%_]/g, "");

    requestQuery = requestQuery.or(
      `first_name.ilike.%${safeQuery}%,last_name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%,occupation.ilike.%${safeQuery}%,company.ilike.%${safeQuery}%,alumni_number.ilike.%${safeQuery}%`
    );
  }

  const { data, error } = await requestQuery;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    alumni: data ?? [],
  });
}
