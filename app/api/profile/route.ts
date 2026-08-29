import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: profile, error } = await supabase
    .from("alumni")
    .select(
      "id, alumni_number, first_name, last_name, email, occupation, company, graduation_year, avatar_url"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const firstName = String(body.first_name ?? "").trim();
  const lastName = String(body.last_name ?? "").trim();
  const occupation = String(body.occupation ?? "").trim();
  const company = String(body.company ?? "").trim();

  const graduationYear =
    body.graduation_year === "" ||
    body.graduation_year === null
      ? null
      : Number(body.graduation_year);

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First name and last name are required." },
      { status: 400 }
    );
  }

  if (
    graduationYear !== null &&
    (!Number.isInteger(graduationYear) ||
      graduationYear < 1900 ||
      graduationYear > new Date().getFullYear() + 10)
  ) {
    return NextResponse.json(
      { error: "Invalid graduation year." },
      { status: 400 }
    );
  }

  const { data: profile, error } = await supabase
    .from("alumni")
    .update({
      first_name: firstName,
      last_name: lastName,
      occupation: occupation || null,
      company: company || null,
      graduation_year: graduationYear,
    })
    .eq("id", user.id)
    .select(
      "id, alumni_number, first_name, last_name, email, occupation, company, graduation_year, avatar_url"
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    profile,
  });
}

