-- Access-control tests for the FestivalHub schema.
-- Run with: npx supabase test db   (needs the local stack running)
--
-- NOTE: these were written alongside the schema but have not been run yet,
-- because Docker could not start on the development machine.

begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

-- Test accounts and a group. They only exist inside this transaction, which is rolled back at the end.
\set admin_user '''a0000000-0000-4000-8000-000000000001'''
\set treasurer_user '''a0000000-0000-4000-8000-000000000002'''
\set plain_member '''a0000000-0000-4000-8000-000000000003'''
\set outsider '''a0000000-0000-4000-8000-000000000004'''
\set diwali '''b0000000-0000-4000-8000-000000000001'''

-- Profiles are created by the on_auth_user_created trigger
insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  (:admin_user, 'authenticated', 'authenticated', 'admin@example.com', '{"name": "Test Admin"}'),
  (:treasurer_user, 'authenticated', 'authenticated', 'treasurer@example.com', '{"name": "Test Treasurer"}'),
  (:plain_member, 'authenticated', 'authenticated', 'member@example.com', '{"name": "Test Member"}'),
  (:outsider, 'authenticated', 'authenticated', 'outsider@example.com', '{"name": "Test Outsider"}');

insert into public.groups (id, name, festival_type, location, start_date, end_date, total_budget, created_by)
values (:diwali, 'Diwali Test Group', 'diwali', 'Community Center', '2026-11-08', '2026-11-10', 3200, :admin_user);

insert into public.role_permissions (group_id, role, manage_expenses, invite_members, view_member_contacts)
values
  (:diwali, 'organizer', true, true, true),
  (:diwali, 'treasurer', true, false, true),
  (:diwali, 'member', false, false, false);

insert into public.group_members (group_id, user_id, role)
values
  (:diwali, :admin_user, 'admin'),
  (:diwali, :treasurer_user, 'treasurer'),
  (:diwali, :plain_member, 'member');

insert into public.invites (group_id, code, created_by)
values (:diwali, 'DIWALI26', :admin_user);

create schema if not exists tests;

create or replace function tests.sign_in_as(p_user_id uuid) returns void
language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', p_user_id, 'role', 'authenticated')::text, true);
end;
$$;

-- --- A member of the group can read it, an outsider cannot ------------------

select tests.sign_in_as(:admin_user);
select is(
  (select count(*)::int from public.groups where id = :diwali),
  1,
  'A member can read their own group'
);

select tests.sign_in_as(:outsider);
select is(
  (select count(*)::int from public.groups where id = :diwali),
  0,
  'Someone outside the group cannot read it'
);
select throws_ok(
  format('select public.get_group_detail(%s)', :diwali),
  'Group not found',
  'get_group_detail refuses people who are not members'
);

-- --- Expenses follow the manage_expenses permission -------------------------

select tests.sign_in_as(:plain_member);
select throws_ok(
  format($$insert into public.expenses (group_id, category, description, amount) values (%s, 'Decoration', 'Sneaky expense', 10)$$, :diwali),
  '42501',
  'A plain member cannot add an expense'
);

select tests.sign_in_as(:treasurer_user);
select lives_ok(
  format($$insert into public.expenses (group_id, category, description, amount) values (%s, 'Decoration', 'Treasurer expense', 10)$$, :diwali),
  'A treasurer can add an expense'
);

-- --- Only admins change group settings and roles ----------------------------

select tests.sign_in_as(:treasurer_user);
select is(
  (with attempt as (update public.groups set total_budget = 99 where id = :diwali returning 1) select count(*)::int from attempt),
  0,
  'A treasurer cannot change the budget'
);

select tests.sign_in_as(:admin_user);
select is(
  (with attempt as (update public.groups set total_budget = 3300 where id = :diwali returning 1) select count(*)::int from attempt),
  1,
  'An admin can change the budget'
);

select is(
  (select amount from public.activity where group_id = :diwali and type = 'budget-updated' order by created_at desc limit 1),
  3300::numeric,
  'Changing the budget is recorded in the activity feed'
);

-- --- A group always keeps an admin -----------------------------------------

select throws_ok(
  format($$update public.group_members set role = 'member' where group_id = %s and user_id = %s$$, :diwali, :admin_user),
  'A group needs at least one admin. Make someone else an admin first.',
  'The last admin cannot step down'
);

-- --- Invite codes -----------------------------------------------------------

select tests.sign_in_as(:outsider);
select throws_ok(
  $$select public.join_group('NOPE1234')$$,
  'That invite code is not valid or has expired.',
  'An unknown invite code is refused'
);

select tests.sign_in_as(:plain_member);
select throws_ok(
  $$select public.join_group('DIWALI26')$$,
  'You''re already a member of this group.',
  'Joining a group you are already in is refused'
);

-- --- Contact details follow the view_member_contacts permission -------------

select tests.sign_in_as(:plain_member);
select is(
  (select count(*)::int
   from jsonb_array_elements(public.get_group_detail(:diwali) -> 'members') as m
   where m ->> 'email' is not null),
  1,
  'A plain member only sees their own contact details'
);

select * from finish();
rollback;
