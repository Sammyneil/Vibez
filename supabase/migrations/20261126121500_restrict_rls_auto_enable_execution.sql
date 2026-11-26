-- This event-trigger function is internal DDL plumbing, not an RPC endpoint.
-- Revoking direct execution does not remove or disable its event trigger.
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
