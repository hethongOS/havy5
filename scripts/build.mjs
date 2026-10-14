import { rm, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { render, routes } from '../src/site.mjs';
const out = new URL('../dist/', import.meta.url);
await rm(out, { force: true, recursive: true });
await mkdir(out, { recursive: true });
for (const path of routes) {
  const dir = join(out.pathname, path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), render(path), 'utf8');
}
await copyFile(new URL('../src/styles.css', import.meta.url), new URL('../dist/styles.css', import.meta.url));
await copyFile(new URL('../src/main.js', import.meta.url), new URL('../dist/main.js', import.meta.url));
await copyFile(new URL('../src/advisor.mjs', import.meta.url), new URL('../dist/advisor.mjs', import.meta.url));
await writeFile(new URL('../dist/favicon.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#183e32"/><text x="32" y="44" fill="#f3e7d4" font-size="36" text-anchor="middle" font-family="Georgia,serif">H</text></svg>`);
await writeFile(new URL('../dist/robots.txt', import.meta.url), 'User-agent: *\nDisallow: /\n');
console.log(`BUILT ${routes.length} static pages into dist/`);
