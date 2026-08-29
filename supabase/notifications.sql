-- ============================================
-- AlumniConnect Notifications
-- ============================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null,
  message text not null,

  type text not null default 'info'
    check (
      type in (
        'info',
        'message',
        'alumni',
        'system',
        'event'
      )
    ),

  read boolean not null default false,

  created_at timestamptz not null default now()
);

-- --------------------------------------------
-- INDEXES
-- --------------------------------------------

create index if not exists notifications_user_id_idx
on public.notifications(user_id);

create index if not exists notifications_created_at_idx
on public.notifications(created_at desc);

create index if not exists notifications_unread_idx
on public.notifications(user_id, read)
where read = false;

-- --------------------------------------------
-- ROW LEVEL SECURITY
-- --------------------------------------------

alter table public.notifications enable row level security;

-- Users can see only their own notifications
drop policy if exists "Users can view their own notifications"
on public.notifications;

create policy "Users can view their own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);

-- Users can mark only their own notifications as read
drop policy if exists "Users can update their own notifications"
on public.notifications;

create policy "Users can update their own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- --------------------------------------------
-- INSERT POLICY
-- --------------------------------------------
-- Keep notification creation restricted.
-- Server-side/admin operations can create notifications.

drop policy if exists "Users can create their own notifications"
on public.notifications;

create policy "Users can create their own notifications"
on public.notifications
for insert
to authenticated
with check (auth.uid() = user_id);

-- --------------------------------------------
-- REALTIME
-- --------------------------------------------

alter table public.notifications replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime
    add table public.notifications;
  end if;
end
$$;

-- --------------------------------------------
-- TEST NOTIFICATION
-- --------------------------------------------
-- Run this separately AFTER the table is created
-- if you want to test the notification center.
--
-- Replace USER_UUID with a real auth.users id.
--
-- insert into public.notifications
--   (user_id, title, message, type)
-- values
--   (
--     'USER_UUID',
--     'Welcome to AlumniConnect',
--     'Your INCUSAAF alumni account is ready.',
--     'system'
--   );

-- ============================================
-- DONE
-- ============================================
