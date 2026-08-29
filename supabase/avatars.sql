-- ============================================
-- AlumniConnect Avatar Storage
-- ============================================

-- Add avatar URL to alumni
alter table public.alumni
add column if not exists avatar_url text;

-- Create storage bucket
insert into storage.buckets (
  id,
  name,
  public
)
values (
  'avatars',
  'avatars',
  true
)
on conflict (id)
do update set public = true;

-- --------------------------------------------
-- STORAGE POLICIES
-- --------------------------------------------

drop policy if exists "Public avatar images"
on storage.objects;

create policy "Public avatar images"
on storage.objects
for select
to public
using (
  bucket_id = 'avatars'
);

drop policy if exists "Users can upload their avatar"
on storage.objects;

create policy "Users can upload their avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their avatar"
on storage.objects;

create policy "Users can update their avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their avatar"
on storage.objects;

create policy "Users can delete their avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
