-- Private storage for atomic submission rate-limit buckets.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;

create table if not exists private.vibez_rate_limit_buckets (
  bucket_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0)
);

alter table private.vibez_rate_limit_buckets enable row level security;
revoke all on table private.vibez_rate_limit_buckets from public, anon, authenticated, service_role;
