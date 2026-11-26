-- Harden the trigger function's name resolution.
create or replace function public.set_airdrop_entries_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;
