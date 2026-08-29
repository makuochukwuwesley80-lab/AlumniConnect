-- ============================================================
-- AlumniConnect Messaging System
-- General Chat + Class Chat + Personal 1-to-1 Chat
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- CONVERSATIONS
-- ============================================================

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),

    type text not null
        check (type in ('general', 'class', 'personal')),

    name text,

    graduation_year integer,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint conversations_class_year_check
        check (
            (type = 'class' and graduation_year is not null)
            or
            (type <> 'class')
        )
);

-- ============================================================
-- CONVERSATION MEMBERS
-- ============================================================

create table if not exists public.conversation_members (
    conversation_id uuid not null
        references public.conversations(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    joined_at timestamptz not null default now(),

    last_read_at timestamptz,

    primary key (conversation_id, user_id)
);

-- ============================================================
-- MESSAGES
-- ============================================================

create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null
        references public.conversations(id)
        on delete cascade,

    sender_id uuid not null
        references auth.users(id)
        on delete cascade,

    body text not null,

    created_at timestamptz not null default now(),

    read_at timestamptz,

    constraint messages_body_not_empty
        check (length(trim(body)) > 0)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists conversations_type_idx
    on public.conversations(type);

create index if not exists conversations_class_year_idx
    on public.conversations(graduation_year);

create index if not exists conversations_updated_at_idx
    on public.conversations(updated_at desc);

create index if not exists conversation_members_user_idx
    on public.conversation_members(user_id);

create index if not exists conversation_members_conversation_idx
    on public.conversation_members(conversation_id);

create index if not exists messages_conversation_created_idx
    on public.messages(conversation_id, created_at);

create index if not exists messages_sender_idx
    on public.messages(sender_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.conversations
    set updated_at = now()
    where id = new.conversation_id;

    return new;
end;
$$;

drop trigger if exists messages_update_conversation_timestamp
on public.messages;

create trigger messages_update_conversation_timestamp
after insert on public.messages
for each row
execute function public.update_conversation_timestamp();

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- ============================================================
-- CONVERSATION POLICIES
-- ============================================================

drop policy if exists "Members can view conversations"
on public.conversations;

create policy "Members can view conversations"
on public.conversations
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = conversations.id
          and cm.user_id = auth.uid()
    )
);

-- ============================================================
-- MEMBER POLICIES
-- ============================================================

drop policy if exists "Users can view their memberships"
on public.conversation_members;

create policy "Users can view their memberships"
on public.conversation_members
for select
to authenticated
using (
    user_id = auth.uid()
    or
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = conversation_members.conversation_id
          and cm.user_id = auth.uid()
    )
);

drop policy if exists "Users can join allowed conversations"
on public.conversation_members;

create policy "Users can join allowed conversations"
on public.conversation_members
for insert
to authenticated
with check (
    user_id = auth.uid()
);

-- ============================================================
-- MESSAGE POLICIES
-- ============================================================

drop policy if exists "Members can view messages"
on public.messages;

create policy "Members can view messages"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = messages.conversation_id
          and cm.user_id = auth.uid()
    )
);

drop policy if exists "Members can send messages"
on public.messages;

create policy "Members can send messages"
on public.messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = messages.conversation_id
          and cm.user_id = auth.uid()
    )
);

drop policy if exists "Users can mark their messages read"
on public.messages;

create policy "Users can mark their messages read"
on public.messages
for update
to authenticated
using (
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = messages.conversation_id
          and cm.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.conversation_members cm
        where cm.conversation_id = messages.conversation_id
          and cm.user_id = auth.uid()
    )
);

-- ============================================================
-- GENERAL CHAT
-- ============================================================

insert into public.conversations (
    type,
    name
)
select
    'general',
    'General Chat'
where not exists (
    select 1
    from public.conversations
    where type = 'general'
);

-- ============================================================
-- REALTIME
-- ============================================================

do $$
begin
    begin
        alter publication supabase_realtime
        add table public.messages;
    exception
        when duplicate_object then
            null;
    end;

    begin
        alter publication supabase_realtime
        add table public.conversations;
    exception
        when duplicate_object then
            null;
    end;

    begin
        alter publication supabase_realtime
        add table public.conversation_members;
    exception
        when duplicate_object then
            null;
    end;
end;
$$;

-- ============================================================
-- DONE
-- ============================================================
