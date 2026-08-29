-- ============================================
-- AlumniConnect Database Schema
-- INCUSAAF
-- ============================================

create extension if not exists "pgcrypto";

-- ============================================
-- STUDENTS
-- ============================================

create table if not exists public.students (

    id uuid primary key default gen_random_uuid(),

    admission_number text unique not null,

    first_name text not null,

    last_name text not null,

    email text,

    phone text,

    gender text,

    class text,

    graduation_year integer,

    status text default 'Student',

    created_at timestamptz default now()

);

-- ============================================
-- ALUMNI
-- ============================================

create table if not exists public.alumni (

    id uuid primary key default gen_random_uuid(),

    alumni_number text unique,

    first_name text not null,

    last_name text not null,

    email text,

    phone text,

    occupation text,

    company text,

    graduation_year integer,

    created_at timestamptz default now()

);

-- ============================================
-- EVENTS
-- ============================================

create table if not exists public.events (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    venue text,

    starts_at timestamptz,

    ends_at timestamptz,

    created_at timestamptz default now()

);

-- ============================================
-- JOBS
-- ============================================

create table if not exists public.jobs (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    company text,

    description text,

    application_link text,

    created_at timestamptz default now()

);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================

create table if not exists public.announcements (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    body text,

    created_at timestamptz default now()

);

-- ============================================
-- PROFILES
-- ============================================

create table if not exists public.profiles (

    id uuid primary key references auth.users(id) on delete cascade,

    full_name text,

    role text default 'member',

    avatar_url text,

    created_at timestamptz default now()

);

alter table public.students enable row level security;
alter table public.alumni enable row level security;
alter table public.events enable row level security;
alter table public.jobs enable row level security;
alter table public.announcements enable row level security;
alter table public.profiles enable row level security;

create policy "Authenticated Read Students"
on public.students
for select
to authenticated
using (true);

create policy "Authenticated Read Alumni"
on public.alumni
for select
to authenticated
using (true);

create policy "Authenticated Read Events"
on public.events
for select
to authenticated
using (true);

create policy "Authenticated Read Jobs"
on public.jobs
for select
to authenticated
using (true);

create policy "Authenticated Read Announcements"
on public.announcements
for select
to authenticated
using (true);

create policy "Users Read Own Profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users Update Own Profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

