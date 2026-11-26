-- Vibez airdrop participant submissions.
-- Only the server-side service role may access participant records.

create table if not exists public.airdrop_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  wallet_address text not null unique,
  comment_url text not null,
  x_follow_self_reported boolean not null default false,
  x_like_repost_self_reported boolean not null default false,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists airdrop_entries_created_at_idx
  on public.airdrop_entries (created_at desc);

alter table public.airdrop_entries enable row level security;
revoke all on table public.airdrop_entries from anon, authenticated;
grant all on table public.airdrop_entries to service_role;

create or replace function public.set_airdrop_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists airdrop_entries_updated_at on public.airdrop_entries;
create trigger airdrop_entries_updated_at
before update on public.airdrop_entries
for each row execute function public.set_airdrop_entries_updated_at();
