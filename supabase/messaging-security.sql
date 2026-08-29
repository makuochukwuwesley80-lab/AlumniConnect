-- ============================================================
-- AlumniConnect Messaging Security
-- General Chat + Class Chats + Private One-to-One Chats
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILE CLASS INFORMATION
-- ============================================================

alter table public.profiles
add column if not exists graduation_year integer;

-- ============================================================
-- CONVERSATIONS
-- ============================================================

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),

    type text not null
        check (type in ('general', 'class', 'personal')),

    class_year integer,

    created_by uuid references auth.users(id) on delete set null,

    created_at timestamptz not null default now(),

    constraint class_year_required_for_class_chat
        check (
            (type = 'class' and class_year is not null)
            or
            (type <> 'class')
        ),

    constraint class_year_forbidden_for_non_class_chat
        check (
            (type = 'class')
            or
            (class_year is null)
        )
);

-- ============================================================
-- CONVERSATION PARTICIPANTS
-- ============================================================

create table if not exists public.conversation_participants (
    conversation_id uuid not null
        references public.conversations(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    created_at timestamptz not null default now(),

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

    content text not null
        check (length(trim(content)) > 0),

    created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists conversations_type_idx
on public.conversations(type);

create index if not exists conversations_class_year_idx
on public.conversations(class_year);

create index if not exists conversation_participants_user_idx
on public.conversation_participants(user_id);

create index if not exists conversation_participants_conversation_idx
on public.conversation_participants(conversation_id);

create index if not exists messages_conversation_created_idx
on public.messages(conversation_id, created_at);

create index if not exists messages_sender_idx
on public.messages(sender_id);

-- ============================================================
-- UNIQUE GENERAL CHAT
-- ============================================================

create unique index if not exists one_general_chat
on public.conversations(type)
where type = 'general';

-- ============================================================
-- UNIQUE CLASS CHAT PER GRADUATION YEAR
-- ============================================================

create unique index if not exists one_class_chat_per_year
on public.conversations(class_year)
where type = 'class';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- ============================================================
-- CONVERSATION ACCESS
--
-- A user can see:
--   1. General Chat
--   2. Their own graduation-year Class Chat
--   3. Personal conversations they participate in
-- ============================================================

drop policy if exists "Users can read accessible conversations"
on public.conversations;

create policy "Users can read accessible conversations"
on public.conversations
for select
to authenticated
using (
    type = 'general'

    or

    (
        type = 'class'
        and class_year = (
            select p.graduation_year
            from public.profiles p
            where p.id = auth.uid()
        )
    )

    or

    (
        type = 'personal'
        and exists (
            select 1
            from public.conversation_participants cp
            where cp.conversation_id = conversations.id
              and cp.user_id = auth.uid()
        )
    )
);

-- ============================================================
-- PARTICIPANT ACCESS
--
-- Users may only see participant records belonging to
-- conversations they are allowed to access.
-- ============================================================

drop policy if exists "Users can read conversation participants"
on public.conversation_participants;

create policy "Users can read conversation participants"
on public.conversation_participants
for select
to authenticated
using (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_participants.conversation_id
          and (
              c.type = 'general'

              or

              (
                  c.type = 'class'
                  and c.class_year = (
                      select p.graduation_year
                      from public.profiles p
                      where p.id = auth.uid()
                  )
              )

              or

              (
                  c.type = 'personal'
                  and exists (
                      select 1
                      from public.conversation_participants own_cp
                      where own_cp.conversation_id = c.id
                        and own_cp.user_id = auth.uid()
                  )
              )
          )
    )
);

-- ============================================================
-- MESSAGE READ SECURITY
--
-- General:
--   authenticated users
--
-- Class:
--   matching graduation year only
--
-- Personal:
--   participants only
-- ============================================================

drop policy if exists "Users can read accessible messages"
on public.messages;

create policy "Users can read accessible messages"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
          and (
              c.type = 'general'

              or

              (
                  c.type = 'class'
                  and c.class_year = (
                      select p.graduation_year
                      from public.profiles p
                      where p.id = auth.uid()
                  )
              )

              or

              (
                  c.type = 'personal'
                  and exists (
                      select 1
                      from public.conversation_participants cp
                      where cp.conversation_id = c.id
                        and cp.user_id = auth.uid()
                  )
              )
          )
    )
);

-- ============================================================
-- MESSAGE INSERT SECURITY
--
-- Sender MUST be the currently authenticated user.
-- Sender MUST belong to the conversation.
-- ============================================================

drop policy if exists "Users can send accessible messages"
on public.messages;

create policy "Users can send accessible messages"
on public.messages
for insert
to authenticated
with check (
    sender_id = auth.uid()

    and

    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
          and (
              c.type = 'general'

              or

              (
                  c.type = 'class'
                  and c.class_year = (
                      select p.graduation_year
                      from public.profiles p
                      where p.id = auth.uid()
                  )
              )

              or

              (
                  c.type = 'personal'
                  and exists (
                      select 1
                      from public.conversation_participants cp
                      where cp.conversation_id = c.id
                        and cp.user_id = auth.uid()
                  )
              )
          )
    )
);

-- ============================================================
-- MESSAGE UPDATE
--
-- Users can only edit their own messages.
-- ============================================================

drop policy if exists "Users can update own messages"
on public.messages;

create policy "Users can update own messages"
on public.messages
for update
to authenticated
using (
    sender_id = auth.uid()
)
with check (
    sender_id = auth.uid()
);

-- ============================================================
-- MESSAGE DELETE
--
-- Users can only delete their own messages.
-- ============================================================

drop policy if exists "Users can delete own messages"
on public.messages;

create policy "Users can delete own messages"
on public.messages
for delete
to authenticated
using (
    sender_id = auth.uid()
);

-- ============================================================
-- PERSONAL CHAT CREATION
--
-- Secure function:
-- The caller cannot create a personal conversation involving
-- arbitrary fake users. The authenticated caller is always
-- participant #1.
-- ============================================================

create or replace function public.create_personal_conversation(
    target_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    existing_conversation uuid;
    new_conversation uuid;
begin

    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if target_user_id is null then
        raise exception 'Target user is required';
    end if;

    if target_user_id = auth.uid() then
        raise exception 'You cannot start a personal chat with yourself';
    end if;

    select c.id
    into existing_conversation
    from public.conversations c
    where c.type = 'personal'
      and (
          select count(*)
          from public.conversation_participants cp
          where cp.conversation_id = c.id
      ) = 2
      and exists (
          select 1
          from public.conversation_participants cp
          where cp.conversation_id = c.id
            and cp.user_id = auth.uid()
      )
      and exists (
          select 1
          from public.conversation_participants cp
          where cp.conversation_id = c.id
            and cp.user_id = target_user_id
      )
    limit 1;

    if existing_conversation is not null then
        return existing_conversation;
    end if;

    if not exists (
        select 1
        from auth.users
        where id = target_user_id
    ) then
        raise exception 'Target user does not exist';
    end if;

    insert into public.conversations (
        type,
        created_by
    )
    values (
        'personal',
        auth.uid()
    )
    returning id into new_conversation;

    insert into public.conversation_participants (
        conversation_id,
        user_id
    )
    values
        (new_conversation, auth.uid()),
        (new_conversation, target_user_id);

    return new_conversation;
end;
$$;

revoke all on function public.create_personal_conversation(uuid)
from public;

grant execute on function public.create_personal_conversation(uuid)
to authenticated;

-- ============================================================
-- GENERAL CHAT CREATION
-- ============================================================

insert into public.conversations (
    type
)
values ('general')
on conflict do nothing;

-- ============================================================
-- REALTIME
-- ============================================================

do $$
begin
    alter publication supabase_realtime add table public.messages;
exception
    when duplicate_object then
        null;
end $$;

do $$
begin
    alter publication supabase_realtime add table public.conversation_participants;
exception
    when duplicate_object then
        null;
end $$;

-- ============================================================
-- DONE
-- ============================================================
