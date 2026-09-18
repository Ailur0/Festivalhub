-- Activity lines read "<who> <message>", so the message must work for both
-- "You" and someone else's name. The old self-payment wording produced
-- "You recorded their own payment".

create or replace function private.log_payment()
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
    case when new.member_id is not distinct from new.recorded_by then 'recorded a payment'
         else format('recorded a payment from %s', v_member_name) end,
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

-- Reword the rows already written with the old text
update public.activity
set message = 'recorded a payment'
where type = 'payment' and message = 'recorded their own payment';
