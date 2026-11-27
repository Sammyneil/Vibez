# $VIBEZ

Landing page for $VIBEZ, a meme token on Solana. The site is a static HTML page with Vercel serverless API routes; no frontend build step is required.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

The API routes require the deployment environment variables listed below, so a static file server alone will not provide live Telegram, X, or participant-submission verification.

## Deploy

Vercel serves `index.html` from the project root and deploys the `api/` directory as serverless functions. `vercel.json` adds baseline security headers.

Cloudflare Workers uses a separate static-assets build. Run `node scripts/build-worker.mjs` to create `dist/` from the explicit public allowlist (`index.html`, `airdrop.js`, and `logo.jpg`). API handlers, Supabase migrations, secrets, and repository configuration are deliberately excluded from that public directory. The GitHub Actions workflow checks the allowlist and required logo references on pull requests and pushes to `main`.

## Required Vercel environment variables

Configure these as encrypted or sensitive server-side variables in Preview and Production. Never put these values in browser JavaScript.

- `TELEGRAM_BOT_TOKEN` — bot token used to validate Telegram Login Widget signatures and check channel membership.
- `X_API_BEARER_TOKEN` — X API bearer token used by `/api/submit` to confirm the submitted post is a direct reply to the official Vibez launch post and that the URL username matches the author.
- `SUPABASE_URL` — Supabase project URL (or `NEXT_PUBLIC_SUPABASE_URL` as a fallback).
- `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` — server-side key used to write participant records. Keep it out of all client-side code. New `sb_secret_*` keys are sent as the `apikey` header and are not treated as JWT Bearer tokens.
- `RATE_LIMIT_SECRET` — optional dedicated secret for HMAC-hashing rate-limit identifiers. If unset, the configured Supabase server key is used as the HMAC secret; set a separate random value in Preview and Production for key separation.

Optional:
- `TELEGRAM_CHAT_ID` — channel to check; defaults to `@vibecoinonsoll`.

Add the Telegram bot as an administrator of the channel and configure the bot's website domain with BotFather.

## Database setup

Apply the SQL migrations in `supabase/migrations/` to the linked Supabase project before accepting submissions. The participant table has row-level security enabled and grants table access only to `service_role`.

## Airdrop verification behavior

- The browser validates input formats and stores unfinished task progress in local storage.
- Telegram login signatures and channel membership are checked server-side.
- The follow and like/repost tasks are user-confirmed; they are not independently verified against X.
- The submitted X post is checked server-side for a direct `replied_to` reference to the official Vibez launch post (`2125564862365364671`); the username in the submitted URL must match the post author.
- Submission requires consent, a valid Telegram login and current channel membership, a valid email, a valid Solana address, and successful X reply verification.
- Participant records are written to `public.airdrop_entries` by the server. Duplicate wallet addresses are upserted.

## Project settings

- **Contract address:** set `CONTRACT_ADDRESS` in the first inline script in `index.html` when the token contract is live.
- **Airdrop tasks:** edit the `TASKS` array in `airdrop.js`.

## Disclaimer

$VIBEZ is a meme coin with no intrinsic value or expectation of financial return. Cryptocurrency trading carries substantial risk of loss and is not suitable for everyone. Always DYOR.


## Protected X reply verification test

The feature-branch workflow `.github/workflows/safe-x-reply-verification.yml` calls the Preview deployment's protected `POST /api/test-x-reply` route. It reuses the production X reply verifier and asserts `persisted: false`; it does not create or update participant records.

Configure these values before pushing to `fix/safe-x-reply-test-on-current-main`:

- **Vercel Preview environment:** `VIBEZ_TEST_ROUTE_SECRET` and `X_API_BEARER_TOKEN`.
- **GitHub Actions repository secrets:** `VIBEZ_TEST_ENDPOINT_URL` (the HTTPS Preview URL ending in `/api/test-x-reply`), `VIBEZ_TEST_ROUTE_SECRET` (must match the Vercel Preview value), and `VIBEZ_TEST_COMMENT_URL` (the X reply URL to verify on push).
- **Optional GitHub Actions repository secret:** `VERCEL_AUTOMATION_BYPASS_SECRET`, generated in Vercel's Deployment Protection settings. When present, the workflow sends it using Vercel's `x-vercel-protection-bypass` header. This does not guarantee access through system-level mitigations or active attack blocks; do not weaken global or Production protection.

The push-triggered run uses `VIBEZ_TEST_COMMENT_URL`. The workflow's manual `workflow_dispatch` input is available only after the workflow file exists on the repository's default branch; after it is merged, select the feature branch when manually dispatching and supply the X reply URL. Never place `X_API_BEARER_TOKEN` in GitHub Actions secrets, browser code, or a request body; it stays in Vercel Preview.

**Known Preview limitation:** Vercel's managed Bot Protection has returned HTTP 429 before the test route executes. The route-specific firewall exception bypasses ordinary bot challenges only; system-level protection remains enabled. Do not disable global protection or weaken Production security to make this test pass. Treat the X verification workflow as blocked until a supported, narrowly scoped Preview access method is available.
