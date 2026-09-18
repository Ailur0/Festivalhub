-- FestivalHub schema: people, festival groups, money and vendors.
--
-- Access model
--   * Every table has row-level security (RLS). Nothing is readable without signing in.
--   * Group access comes from public.group_members. Admins can do everything in their group;
--     other roles get the switches stored in public.role_permissions, adjusted by the group's
--     privacy settings (see private.has_permission).
--   * Screens read through the get_* functions below, which return only what the caller's role
--     may see (for example, member contacts are hidden unless allowed).
--   * Multi-step writes (create group, join with a code, leave) go through functions so they
--     happen atomically. Simple writes go straight to tables and are checked by RLS.

create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  email text,
  phone text check (phone is null or char_length(phone) <= 30),
  created_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 3 and 60),
  festival_type text not null
    check (festival_type in ('diwali', 'navratri', 'holi', 'ganesh-chaturthi', 'durga-puja', 'other')),
  description text not null default '' check (char_length(description) <= 300),
  location text not null check (char_length(trim(location)) between 1 and 120),
  start_date date not null,
  end_date date not null,
  total_budget numeric(12, 2) not null default 0 check (total_budget >= 0),
  public_group boolean not null default false,
  invite_only boolean not null default true,
  share_financial_summary boolean not null default true,
  allow_member_invites boolean not null default false,
  show_member_contacts boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint groups_dates_check check (end_date >= start_date)
);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'organizer', 'treasurer', 'member')),
  responsibility text not null default 'Member' check (char_length(responsibility) <= 60),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_id_idx on public.group_members (user_id);

-- What each non-admin role may do. Admins always have every permission.
create table public.role_permissions (
  group_id uuid not null references public.groups (id) on delete cascade,
  role text not null check (role in ('organizer', 'treasurer', 'member')),
  view_budget boolean not null default true,
  manage_expenses boolean not null default false,
  invite_members boolean not null default false,
  access_marketplace boolean not null default true,
  edit_group_details boolean not null default false,
  view_member_contacts boolean not null default false,
  primary key (group_id, role)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  category text not null
    check (category in ('Decoration', 'Prasad', 'Pooja Items', 'Logistics', 'Cultural Events', 'Miscellaneous')),
  description text not null check (char_length(trim(description)) between 3 and 80),
  amount numeric(12, 2) not null check (amount > 0),
  paid_by uuid references public.profiles (id) on delete set null,
  spent_on date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index expenses_group_id_idx on public.expenses (group_id);

-- Contributions are a ledger of payments, so a member's paid amount is always the sum of real records.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  recorded_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index payments_group_member_idx on public.payments (group_id, member_id);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  code text not null unique check (code ~ '^[A-Z0-9]{6,12}$'),
  max_uses integer not null default 25 check (max_uses between 1 and 1000),
  uses integer not null default 0 check (uses >= 0),
  expires_at date not null default (current_date + 30),
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index invites_group_id_idx on public.invites (group_id);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (
    category in ('Catering', 'Decoration', 'Sound & Lighting', 'Photography', 'Transportation', 'Supplies', 'Security', 'Cleaning')
  ),
  description text not null default '',
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  location text not null,
  phone text not null,
  email text not null,
  price_min numeric(12, 2) not null check (price_min >= 0),
  price_max numeric(12, 2) not null,
  verified boolean not null default false,
  recommended_by_group text,
  recommended_by_admin text,
  recommended_on date,
  created_at timestamptz not null default now(),
  constraint vendors_price_check check (price_max >= price_min)
);

create table public.vendor_reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  reviewed_on date not null default current_date
);
create index vendor_reviews_vendor_id_idx on public.vendor_reviews (vendor_id);

create table public.favorite_vendors (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vendor_id)
);

create table public.activity (
  id bigint generated always as identity primary key,
  group_id uuid not null references public.groups (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  type text not null check (
    type in ('payment', 'member-joined', 'expense-added', 'expense-removed', 'budget-updated', 'group-created')
  ),
  -- Written without the actor's name ("added ..."); the app prefixes "You" or the person's name
  message text not null,
  amount numeric(12, 2),
  created_at timestamptz not null default now()
);
create index activity_group_created_idx on public.activity (group_id, created_at desc);

create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null,
  amount numeric(12, 2),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

create table public.notification_preferences (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  topic text not null check (
    topic in ('budgetChanges', 'newExpenses', 'paymentReminders', 'newMembers', 'announcements', 'newVendors', 'securityAlerts')
  ),
  push boolean not null default true,
  email boolean not null default false,
  sms boolean not null default false,
  primary key (user_id, topic)
);

-- ---------------------------------------------------------------------------
-- Permission helpers (private schema: not exposed through the API)
-- ---------------------------------------------------------------------------

create function private.group_role(p_group_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.group_members
  where group_id = p_group_id and user_id = (select auth.uid());
$$;

create function private.is_group_member(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = (select auth.uid())
  );
$$;

create function private.has_permission(p_group_id uuid, p_permission text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_role text;
  v_group public.groups%rowtype;
  v_perms public.role_permissions%rowtype;
begin
  select role into v_role from public.group_members
  where group_id = p_group_id and user_id = (select auth.uid());

  if v_role is null then
    return false;
  end if;
  if v_role = 'admin' then
    return true;
  end if;

  select * into v_group from public.groups where id = p_group_id;
  select * into v_perms from public.role_permissions where group_id = p_group_id and role = v_role;

  return case p_permission
    -- Turning off "share financial summary" hides money from plain members only
    when 'view_budget' then coalesce(v_perms.view_budget, false)
      and (v_role <> 'member' or v_group.share_financial_summary)
    when 'manage_expenses' then coalesce(v_perms.manage_expenses, false)
    when 'invite_members' then coalesce(v_perms.invite_members, false) or v_group.allow_member_invites
    when 'access_marketplace' then coalesce(v_perms.access_marketplace, false)
    when 'edit_group_details' then coalesce(v_perms.edit_group_details, false)
    when 'view_member_contacts' then coalesce(v_perms.view_member_contacts, false) and v_group.show_member_contacts
    else false
  end;
end;
$$;

create function private.generate_invite_code()
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  -- No 0/O or 1/I, so codes are easy to read out loud
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
begin
  loop
    select string_agg(substr(v_alphabet, 1 + (get_byte(b, 0) % 32), 1), '')
      into v_code
      from (select extensions.gen_random_bytes(1) as b from generate_series(1, 8)) as bytes;
    exit when not exists (select 1 from public.invites where code = v_code);
  end loop;
  return v_code;
end;
$$;

alter table public.invites alter column code set default private.generate_invite_code();

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Create a profile for every new account, using the name and phone given at sign-up
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1), 'New member'),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create function private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function private.sync_profile_email();

-- Expenses can only be paid by, and payments only recorded for, members of the group
create function private.check_group_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
begin
  -- Separate statements: each table only has one of these columns
  if tg_table_name = 'expenses' then
    v_user_id := new.paid_by;
  else
    v_user_id := new.member_id;
  end if;

  if v_user_id is not null and not exists (
    select 1 from public.group_members where group_id = new.group_id and user_id = v_user_id
  ) then
    raise exception 'That person is not a member of this group' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger expenses_check_payer
  before insert or update of paid_by, group_id on public.expenses
  for each row execute function private.check_group_membership();

create trigger payments_check_member
  before insert on public.payments
  for each row execute function private.check_group_membership();

-- A group always keeps at least one admin
create function private.keep_an_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_losing_admin boolean;
begin
  if tg_op = 'DELETE' then
    v_losing_admin := old.role = 'admin';
  else
    v_losing_admin := old.role = 'admin' and new.role <> 'admin';
  end if;

  if v_losing_admin
    -- Skip the check when the whole group is being deleted
    and exists (select 1 from public.groups where id = old.group_id)
    and not exists (
      select 1 from public.group_members
      where group_id = old.group_id and role = 'admin' and user_id <> old.user_id
    )
  then
    raise exception 'A group needs at least one admin. Make someone else an admin first.' using errcode = '23514';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger group_members_keep_an_admin
  before update of role or delete on public.group_members
  for each row execute function private.keep_an_admin();

create function private.log_expense_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity (group_id, actor_id, type, message, amount)
    values (new.group_id, coalesce(new.created_by, (select auth.uid())), 'expense-added',
            format('added "%s"', new.description), new.amount);
    return new;
  end if;

  -- Nothing to log when the expense goes because its whole group was deleted
  if not exists (select 1 from public.groups where id = old.group_id) then
    return old;
  end if;

  insert into public.activity (group_id, actor_id, type, message, amount)
  values (old.group_id, (select auth.uid()), 'expense-removed', format('removed "%s"', old.description), old.amount);
  return old;
end;
$$;

create trigger expenses_log_activity
  after insert or delete on public.expenses
  for each row execute function private.log_expense_activity();

create function private.log_payment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_name text;
  v_recorder_name text;
  v_group_name text;
begin
  select name into v_member_name from public.profiles where id = new.member_id;
  select name into v_recorder_name from public.profiles where id = new.recorded_by;
  select name into v_group_name from public.groups where id = new.group_id;

  insert into public.activity (group_id, actor_id, type, message, amount)
  values (
    new.group_id, new.recorded_by, 'payment',
    case when new.member_id = new.recorded_by then 'recorded their own payment'
         else format('recorded %s''s payment', v_member_name) end,
    new.amount
  );

  if new.recorded_by is distinct from new.member_id then
    insert into public.notifications (user_id, title, message, amount)
    values (
      new.member_id, 'Payment recorded',
      format('%s recorded a payment towards your share in %s', coalesce(v_recorder_name, 'An organizer'), v_group_name),
      new.amount
    );
  end if;
  return new;
end;
$$;

create trigger payments_log
  after insert on public.payments
  for each row execute function private.log_payment();

create function private.log_budget_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.activity (group_id, actor_id, type, message, amount)
  values (new.id, (select auth.uid()), 'budget-updated', 'updated the budget', new.total_budget);
  return new;
end;
$$;

create trigger groups_log_budget_change
  after update of total_budget on public.groups
  for each row when (old.total_budget is distinct from new.total_budget)
  execute function private.log_budget_change();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.role_permissions enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;
alter table public.invites enable row level security;
alter table public.vendors enable row level security;
alter table public.vendor_reviews enable row level security;
alter table public.favorite_vendors enable row level security;
alter table public.activity enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;

-- Start from nothing, then grant only what the app needs (column lists stop edits to ids and owners)
revoke all on all tables in schema public from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (name, phone) on public.profiles to authenticated;
create policy "People can read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "People can update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

grant select, delete on public.groups to authenticated;
grant update (name, description, location, start_date, end_date, total_budget, public_group, invite_only,
              share_financial_summary, allow_member_invites, show_member_contacts) on public.groups to authenticated;
create policy "Members can read their groups" on public.groups
  for select to authenticated using (private.is_group_member(id));
create policy "Editors can update group details" on public.groups
  for update to authenticated
  using (private.has_permission(id, 'edit_group_details'))
  with check (private.has_permission(id, 'edit_group_details'));
create policy "Admins can delete their group" on public.groups
  for delete to authenticated using (private.group_role(id) = 'admin');

grant select, delete on public.group_members to authenticated;
grant update (role, responsibility) on public.group_members to authenticated;
create policy "Members can see who is in their groups" on public.group_members
  for select to authenticated using (private.is_group_member(group_id));
create policy "Admins can change roles" on public.group_members
  for update to authenticated
  using (private.group_role(group_id) = 'admin')
  with check (private.group_role(group_id) = 'admin');
create policy "Admins can remove other members" on public.group_members
  for delete to authenticated
  using (private.group_role(group_id) = 'admin' and user_id <> (select auth.uid()));

grant select on public.role_permissions to authenticated;
grant update (view_budget, manage_expenses, invite_members, access_marketplace, edit_group_details, view_member_contacts)
  on public.role_permissions to authenticated;
create policy "Members can read role permissions" on public.role_permissions
  for select to authenticated using (private.is_group_member(group_id));
create policy "Admins can change role permissions" on public.role_permissions
  for update to authenticated
  using (private.group_role(group_id) = 'admin')
  with check (private.group_role(group_id) = 'admin');

grant select, delete on public.expenses to authenticated;
grant insert (group_id, category, description, amount, paid_by, spent_on) on public.expenses to authenticated;
create policy "Budget viewers can read expenses" on public.expenses
  for select to authenticated using (private.has_permission(group_id, 'view_budget'));
create policy "Expense managers can add expenses" on public.expenses
  for insert to authenticated
  with check (private.has_permission(group_id, 'manage_expenses') and created_by = (select auth.uid()));
create policy "Expense managers can delete expenses" on public.expenses
  for delete to authenticated using (private.has_permission(group_id, 'manage_expenses'));

grant select on public.payments to authenticated;
grant insert (group_id, member_id, amount) on public.payments to authenticated;
create policy "Budget viewers can read payments" on public.payments
  for select to authenticated
  using (private.has_permission(group_id, 'view_budget') or member_id = (select auth.uid()));
create policy "Expense managers can record payments" on public.payments
  for insert to authenticated
  with check (private.has_permission(group_id, 'manage_expenses') and recorded_by = (select auth.uid()));

grant select, delete on public.invites to authenticated;
grant insert (group_id, max_uses, expires_at) on public.invites to authenticated;
create policy "Inviters can read invite codes" on public.invites
  for select to authenticated using (private.has_permission(group_id, 'invite_members'));
create policy "Inviters can create invite codes" on public.invites
  for insert to authenticated
  with check (private.has_permission(group_id, 'invite_members') and created_by = (select auth.uid()));
create policy "Inviters can revoke invite codes" on public.invites
  for delete to authenticated using (private.has_permission(group_id, 'invite_members'));

grant select on public.vendors, public.vendor_reviews to authenticated;
create policy "Signed-in people can browse vendors" on public.vendors
  for select to authenticated using (true);
create policy "Signed-in people can read reviews" on public.vendor_reviews
  for select to authenticated using (true);

grant select, insert, delete on public.favorite_vendors to authenticated;
create policy "People manage their saved vendors" on public.favorite_vendors
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select on public.activity to authenticated;
create policy "Members can read group activity" on public.activity
  for select to authenticated using (private.is_group_member(group_id));

grant select on public.notifications to authenticated;
grant update (read) on public.notifications to authenticated;
create policy "People read their notifications" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));
create policy "People mark their notifications read" on public.notifications
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert, update on public.notification_preferences to authenticated;
create policy "People manage their notification preferences" on public.notification_preferences
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant usage on schema private to authenticated;
grant execute on function private.group_role(uuid), private.is_group_member(uuid), private.has_permission(uuid, text),
  private.generate_invite_code() to authenticated;

-- ---------------------------------------------------------------------------
-- Functions the app calls
-- ---------------------------------------------------------------------------

create function public.create_group(
  p_name text,
  p_festival_type text,
  p_location text,
  p_start_date date,
  p_end_date date default null,
  p_total_budget numeric default 0,
  p_description text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_group_id uuid;
begin
  if v_uid is null then
    raise exception 'Sign in to create a group' using errcode = '28000';
  end if;
  -- One day of slack for people ahead of the server's UTC date
  if p_start_date < current_date - 1 then
    raise exception 'The start date has already passed' using errcode = '22023';
  end if;

  insert into public.groups (name, festival_type, description, location, start_date, end_date, total_budget, created_by)
  values (trim(p_name), p_festival_type, coalesce(trim(p_description), ''), trim(p_location),
          p_start_date, coalesce(p_end_date, p_start_date), coalesce(p_total_budget, 0), v_uid)
  returning id into v_group_id;

  insert into public.group_members (group_id, user_id, role, responsibility)
  values (v_group_id, v_uid, 'admin', 'Management');

  insert into public.role_permissions
    (group_id, role, view_budget, manage_expenses, invite_members, access_marketplace, edit_group_details, view_member_contacts)
  values
    (v_group_id, 'organizer', true, true, true, true, false, true),
    (v_group_id, 'treasurer', true, true, false, false, false, true),
    (v_group_id, 'member', true, false, false, true, false, false);

  insert into public.activity (group_id, actor_id, type, message)
  values (v_group_id, v_uid, 'group-created', format('created %s', trim(p_name)));

  return v_group_id;
end;
$$;

create function public.join_group(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_invite public.invites%rowtype;
  v_name text;
  v_group_name text;
begin
  if v_uid is null then
    raise exception 'Sign in to join a group' using errcode = '28000';
  end if;

  -- Lock the invite so two people can't take the last use at once
  select * into v_invite from public.invites where code = upper(trim(p_code)) for update;

  if v_invite.id is null or v_invite.expires_at < current_date or v_invite.uses >= v_invite.max_uses then
    raise exception 'That invite code is not valid or has expired.' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.group_members where group_id = v_invite.group_id and user_id = v_uid) then
    raise exception 'You''re already a member of this group.' using errcode = '23505';
  end if;

  insert into public.group_members (group_id, user_id, role, responsibility)
  values (v_invite.group_id, v_uid, 'member', 'Member');

  update public.invites set uses = uses + 1 where id = v_invite.id;

  select name into v_name from public.profiles where id = v_uid;
  select name into v_group_name from public.groups where id = v_invite.group_id;

  insert into public.activity (group_id, actor_id, type, message)
  values (v_invite.group_id, v_uid, 'member-joined', 'joined the group');

  insert into public.notifications (user_id, title, message)
  select user_id, 'New member', format('%s joined %s', v_name, v_group_name)
  from public.group_members
  where group_id = v_invite.group_id and role = 'admin';

  return v_invite.group_id;
end;
$$;

create function public.leave_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if not exists (select 1 from public.group_members where group_id = p_group_id and user_id = v_uid) then
    raise exception 'You''re not a member of this group.' using errcode = 'P0002';
  end if;

  -- The last person leaving takes the group with them; otherwise keep_an_admin protects the admin role
  if (select count(*) from public.group_members where group_id = p_group_id) = 1 then
    delete from public.groups where id = p_group_id;
  else
    delete from public.group_members where group_id = p_group_id and user_id = v_uid;
  end if;
end;
$$;

-- Everything the Group, Finances and Settings screens show, filtered to what the caller may see
create function public.get_group_detail(p_group_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_role text;
  v_group public.groups%rowtype;
  v_can_budget boolean;
  v_can_contacts boolean;
  v_can_invite boolean;
begin
  select role into v_role from public.group_members where group_id = p_group_id and user_id = v_uid;
  if v_role is null then
    raise exception 'Group not found' using errcode = 'P0002';
  end if;

  select * into v_group from public.groups where id = p_group_id;
  v_can_budget := private.has_permission(p_group_id, 'view_budget');
  v_can_contacts := private.has_permission(p_group_id, 'view_member_contacts');
  v_can_invite := private.has_permission(p_group_id, 'invite_members');

  return jsonb_build_object(
    'id', v_group.id,
    'name', v_group.name,
    'festivalType', v_group.festival_type,
    'description', v_group.description,
    'location', v_group.location,
    'startDate', v_group.start_date,
    'endDate', v_group.end_date,
    'totalBudget', case when v_can_budget then v_group.total_budget end,
    'myRole', v_role,
    'myPermissions', jsonb_build_object(
      'viewBudget', v_can_budget,
      'manageExpenses', private.has_permission(p_group_id, 'manage_expenses'),
      'inviteMembers', v_can_invite,
      'accessMarketplace', private.has_permission(p_group_id, 'access_marketplace'),
      'editGroupDetails', private.has_permission(p_group_id, 'edit_group_details'),
      'viewMemberContacts', v_can_contacts
    ),
    'privacy', jsonb_build_object(
      'publicGroup', v_group.public_group,
      'inviteOnly', v_group.invite_only,
      'shareFinancialSummary', v_group.share_financial_summary,
      'allowMemberInvites', v_group.allow_member_invites,
      'showMemberContacts', v_group.show_member_contacts
    ),
    'permissions', case when v_role = 'admin' then (
      select jsonb_object_agg(rp.role, jsonb_build_object(
        'viewBudget', rp.view_budget,
        'manageExpenses', rp.manage_expenses,
        'inviteMembers', rp.invite_members,
        'accessMarketplace', rp.access_marketplace,
        'editGroupDetails', rp.edit_group_details,
        'viewMemberContacts', rp.view_member_contacts
      ))
      from public.role_permissions rp where rp.group_id = p_group_id
    ) end,
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', m.user_id,
        'name', p.name,
        'email', case when v_can_contacts or m.user_id = v_uid then p.email end,
        'phone', case when v_can_contacts or m.user_id = v_uid then p.phone end,
        'role', m.role,
        'responsibility', m.responsibility,
        'paidAmount', case when v_can_budget or m.user_id = v_uid then (
          select coalesce(sum(pay.amount), 0) from public.payments pay
          where pay.group_id = p_group_id and pay.member_id = m.user_id
        ) end
      ) order by m.role = 'admin' desc, m.joined_at), '[]'::jsonb)
      from public.group_members m
      join public.profiles p on p.id = m.user_id
      where m.group_id = p_group_id
    ),
    'expenses', case when v_can_budget then (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id,
        'category', e.category,
        'description', e.description,
        'amount', e.amount,
        'paidById', e.paid_by,
        'paidBy', coalesce(pb.name, 'Former member'),
        'date', e.spent_on
      ) order by e.spent_on desc, e.created_at desc), '[]'::jsonb)
      from public.expenses e
      left join public.profiles pb on pb.id = e.paid_by
      where e.group_id = p_group_id
    ) else '[]'::jsonb end,
    -- Money already collected from people who have since left, so totals still add up
    'formerMemberPayments', case when v_can_budget then (
      select coalesce(sum(pay.amount), 0) from public.payments pay
      where pay.group_id = p_group_id
        and not exists (select 1 from public.group_members gm where gm.group_id = p_group_id and gm.user_id = pay.member_id)
    ) else 0 end,
    'invites', case when v_can_invite then (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', i.id, 'code', i.code, 'maxUses', i.max_uses, 'uses', i.uses, 'expiresAt', i.expires_at
      ) order by i.created_at desc), '[]'::jsonb)
      from public.invites i
      where i.group_id = p_group_id and i.expires_at >= current_date
    ) else '[]'::jsonb end
  );
end;
$$;

-- One row per group for the Home screen and the group switcher
create function public.get_my_groups()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id,
    'name', g.name,
    'festivalType', g.festival_type,
    'location', g.location,
    'startDate', g.start_date,
    'endDate', g.end_date,
    'myRole', me.role,
    'memberCount', (select count(*) from public.group_members gm where gm.group_id = g.id),
    'canViewBudget', private.has_permission(g.id, 'view_budget'),
    'totalBudget', case when private.has_permission(g.id, 'view_budget') then g.total_budget end,
    'collected', case when private.has_permission(g.id, 'view_budget') then (
      select coalesce(sum(pay.amount), 0) from public.payments pay where pay.group_id = g.id
    ) end,
    'spent', case when private.has_permission(g.id, 'view_budget') then (
      select coalesce(sum(e.amount), 0) from public.expenses e where e.group_id = g.id
    ) end
  ) order by g.start_date, g.name), '[]'::jsonb)
  from public.group_members me
  join public.groups g on g.id = me.group_id
  where me.user_id = (select auth.uid());
$$;

create function public.get_activity(p_group_id uuid default null, p_limit integer default 20)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(row_data order by created_at desc), '[]'::jsonb)
  from (
    select
      a.created_at,
      jsonb_build_object(
        'id', a.id,
        'groupId', a.group_id,
        'groupName', g.name,
        'type', a.type,
        'actorId', a.actor_id,
        'actorName', coalesce(p.name, 'Someone'),
        'message', a.message,
        -- Amounts stay hidden from people who can't see the budget
        'amount', case when private.has_permission(a.group_id, 'view_budget') then a.amount end,
        'timestamp', a.created_at
      ) as row_data
    from public.activity a
    join public.group_members me on me.group_id = a.group_id and me.user_id = (select auth.uid())
    join public.groups g on g.id = a.group_id
    left join public.profiles p on p.id = a.actor_id
    where p_group_id is null or a.group_id = p_group_id
    order by a.created_at desc
    limit least(greatest(p_limit, 1), 100)
  ) recent;
$$;

-- Functions are callable by anyone by default; limit them to signed-in people
revoke execute on function public.create_group(text, text, text, date, date, numeric, text) from public, anon;
revoke execute on function public.join_group(text) from public, anon;
revoke execute on function public.leave_group(uuid) from public, anon;
revoke execute on function public.get_group_detail(uuid) from public, anon;
revoke execute on function public.get_my_groups() from public, anon;
revoke execute on function public.get_activity(uuid, integer) from public, anon;

grant execute on function public.create_group(text, text, text, date, date, numeric, text) to authenticated;
grant execute on function public.join_group(text) to authenticated;
grant execute on function public.leave_group(uuid) to authenticated;
grant execute on function public.get_group_detail(uuid) to authenticated;
grant execute on function public.get_my_groups() to authenticated;
grant execute on function public.get_activity(uuid, integer) to authenticated;
