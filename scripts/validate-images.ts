import fs from "node:fs";
import path from "node:path";

const LISTING_FILE = path.resolve(process.cwd(), "data", "listings.ts");
const TIMEOUT = 6000;
const FALLBACKS = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
];

function timeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((res, rej) => {
    const t = setTimeout(() => rej(new Error("timeout")), ms);
    p.then((v) => { clearTimeout(t); res(v); }, (e) => { clearTimeout(t); rej(e); });
  });
}

async function check(url: string) {
  try {
    const r = await timeout(fetch(url, { method: "HEAD" }), TIMEOUT);
    if (r.ok) return true;
    const g = await timeout(fetch(url, { method: "GET", headers: { Range: "bytes=0-64" } }), TIMEOUT);
    return g.ok;
  } catch {
    return false;
  }
}

(async () => {
  let txt = fs.readFileSync(LISTING_FILE, "utf8");
  const blockRe = /images\s*:\s*\[([\s\S]*?)\]/g;
  const urlRe = /["'`](https?:\/\/[^"'`]+)["'`]/g;

  const urls = new Set<string>();
  let m;
  while ((m = blockRe.exec(txt))) {
    const inner = m[1];
    let u;
    while ((u = urlRe.exec(inner))) urls.add(u[1]);
  }
  const list = [...urls];
  const status = new Map<string, boolean>();
  for (const u of list) status.set(u, await check(u));

  // Replace broken ones with fallbacks (rotate)
  let fb = 0;
  for (const [u, ok] of status) {
    if (!ok) {
      const repl = FALLBACKS[fb++ % FALLBACKS.length];
      const esc = u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      txt = txt.replace(new RegExp(esc, "g"), repl);
    }
  }
  fs.writeFileSync(LISTING_FILE, txt, "utf8");
  console.log("Done. Broken images:", [...status.values()].filter(v => !v).length);
})();
