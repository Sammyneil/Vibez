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
- **Backend (optional):** set `CONFIG.VERIFY_ENDPOINT` and `CONFIG.SUBMIT_ENDPOINT` to verify tasks and collect submissions. Without them, progress is stored only in the visitor's browser.

## Disclaimer

$VIBEZ is a meme coin with no intrinsic value or expectation of financial return. Always DYOR.
