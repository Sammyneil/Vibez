import { cp, lstat, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

// Recreate the public site from a strict allowlist. Never copy API handlers,
// Supabase migrations, repository metadata, or configuration into public assets.
const publicFiles = ["index.html", "airdrop.js", "logo.jpg"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of publicFiles) {
  const source = new URL(file, root);
  const info = await lstat(source);
  if (!info.isFile() || info.isSymbolicLink() || info.size === 0) {
    throw new Error(`Required public asset is missing, empty, or not a regular file: ${file}`);
  }
  await cp(source, new URL(file, dist));
}

console.log(`Cloudflare public assets prepared: ${publicFiles.join(", ")}`);
