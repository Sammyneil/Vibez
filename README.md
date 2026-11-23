# $VIBEZ

Landing page for $VIBEZ, a meme token on Solana. It is a single static page (`index.html`) with no build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Vercel serves `index.html` from the project root as a static site. `vercel.json` adds baseline security headers.

## Configure

- **Contract address:** set `CONTRACT_ADDRESS` in the first `<script>` block of `index.html` at launch.
- **Airdrop tasks:** edit the `TASKS` array in the second `<script>` block.
- **Telegram verification:** `/api/verify` validates Telegram Login Widget signatures and checks membership in `@vibecoinonsoll`. Set `TELEGRAM_BOT_TOKEN` in the Vercel project environment, add the bot as an administrator of the channel, and configure the bot's website domain with BotFather. `TELEGRAM_CHAT_ID` can override the default channel. Telegram task completion fails closed when the endpoint or bot is not configured.
- **Backend (optional):** set `CONFIG.VERIFY_ENDPOINT` and `CONFIG.SUBMIT_ENDPOINT` to verify tasks and collect submissions. Without a submission endpoint, progress is stored only in the visitor's browser.

## Disclaimer

$VIBEZ is a meme coin with no intrinsic value or expectation of financial return. Always DYOR.
