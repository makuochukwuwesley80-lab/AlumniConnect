export interface Student {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  graduation_year: number | null;
  department: string | null;
  faculty: string | null;
  student_id: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  role: string | null;
  created_at: string;
  is_active?: boolean | null;
}
