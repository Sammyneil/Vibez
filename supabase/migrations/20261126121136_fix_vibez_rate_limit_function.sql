-- Atomic fixed-window rate limiting. Only service_role may invoke this function.
create or replace function public.consume_vibez_rate_limits(
  p_ip_key text,
  p_telegram_key text,
  p_wallet_key text
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_check record;
  v_count integer;
  v_started timestamptz;
  v_retry integer := 0;
begin
  if p_ip_key is null or p_telegram_key is null or p_wallet_key is null then
    raise exception 'Rate-limit keys are required';
  end if;

  for v_check in
    select * from (values
      (p_ip_key, 30, 900),
      (p_telegram_key, 5, 900),
      (p_wallet_key, 3, 3600)
    ) as limits(bucket_key, max_requests, window_seconds)
  loop
    insert into private.vibez_rate_limit_buckets as current_bucket
      (bucket_key, window_started_at, request_count)
    values
      (v_check.bucket_key, v_now, 1)
    on conflict (bucket_key) do update
      set window_started_at = case
            when current_bucket.window_started_at <= v_now - pg_catalog.make_interval(secs => v_check.window_seconds)
              then v_now
            else current_bucket.window_started_at
          end,
          request_count = case
            when current_bucket.window_started_at <= v_now - pg_catalog.make_interval(secs => v_check.window_seconds)
              then 1
            else least(current_bucket.request_count + 1, v_check.max_requests + 1)
          end
    returning request_count, window_started_at
      into v_count, v_started;

    if v_count > v_check.max_requests then
      v_retry := greatest(
        v_retry,
        pg_catalog.ceil(extract(epoch from (
          v_started + pg_catalog.make_interval(secs => v_check.window_seconds) - v_now
        )))::integer
      );
    end if;
  end loop;

  return query select (v_retry = 0), v_retry;
end;
$function$;

revoke all on function public.consume_vibez_rate_limits(text, text, text) from public, anon, authenticated;
grant execute on function public.consume_vibez_rate_limits(text, text, text) to service_role;
