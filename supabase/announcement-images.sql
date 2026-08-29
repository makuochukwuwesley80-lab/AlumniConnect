-- ============================================
-- AlumniConnect Announcements
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

drop policy if exists "Authenticated Insert Announcements"
on public.announcements;

create policy "Authenticated Insert Announcements"
on public.announcements
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated Update Announcements"
on public.announcements;

create policy "Authenticated Update Announcements"
on public.announcements
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated Delete Announcements"
on public.announcements;

create policy "Authenticated Delete Announcements"
on public.announcements
for delete
to authenticated
using (true);

-- ============================================
-- Announcement image storage
-- ============================================

insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do update
set public = true;

drop policy if exists "Authenticated Upload Announcement Images"
on storage.objects;

create policy "Authenticated Upload Announcement Images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'announcement-images'
);

drop policy if exists "Public Read Announcement Images"
on storage.objects;

create policy "Public Read Announcement Images"
on storage.objects
for select
to public
using (
    bucket_id = 'announcement-images'
);

drop policy if exists "Authenticated Update Announcement Images"
on storage.objects;

create policy "Authenticated Update Announcement Images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'announcement-images'
)
with check (
    bucket_id = 'announcement-images'
);

drop policy if exists "Authenticated Delete Announcement Images"
on storage.objects;

create policy "Authenticated Delete Announcement Images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'announcement-images'
);
