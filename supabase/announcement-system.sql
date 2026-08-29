-- ============================================
-- ALUMNICONNECT ANNOUNCEMENTS
-- ============================================

create table if not exists public.announcements (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    body text,
    image_url text,
    created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "Authenticated Read Announcements"
on public.announcements;

create policy "Authenticated Read Announcements"
on public.announcements
for select
to authenticated
using (true);

-- ============================================
-- ANNOUNCEMENT IMAGE STORAGE
-- ============================================

insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do update
set public = true;

drop policy if exists "Authenticated upload announcement images"
on storage.objects;

create policy "Authenticated upload announcement images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'announcement-images'
);

drop policy if exists "Authenticated update announcement images"
on storage.objects;

create policy "Authenticated update announcement images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'announcement-images'
)
with check (
    bucket_id = 'announcement-images'
);

drop policy if exists "Authenticated delete announcement images"
on storage.objects;

create policy "Authenticated delete announcement images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'announcement-images'
);

drop policy if exists "Public read announcement images"
on storage.objects;

create policy "Public read announcement images"
on storage.objects
for select
to public
using (
    bucket_id = 'announcement-images'
);
