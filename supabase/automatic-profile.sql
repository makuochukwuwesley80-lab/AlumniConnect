-- AlumniConnect automatic alumni profile creation

create table if not exists public.alumni (
  id uuid primary key references auth.users(id) on delete cascade,
  alumni_number text unique,
  first_name text not null default '',
  last_name text not null default '',
  email text,
  occupation text,
  company text,
  graduation_year integer,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.alumni enable row level security;

drop policy if exists "Authenticated users can view alumni"
on public.alumni;

create policy "Authenticated users can view alumni"
on public.alumni
for select
to authenticated
using (true);

drop policy if exists "Users can update their own alumni profile"
on public.alumni;

create policy "Users can update their own alumni profile"
on public.alumni
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.alumni (
    id,
    first_name,
    last_name,
    email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.update_alumni_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists alumni_updated_at
on public.alumni;

create trigger alumni_updated_at
before update on public.alumni
for each row
execute function public.update_alumni_updated_at();
