const fs = require("fs");
const path = require("path");
const cloudbase = require("@cloudbase/node-sdk");

const ROOT = path.join(__dirname, "..", "..");
const ASSETS = path.join(ROOT, "assets");
const MANIFEST_FILE = path.join(__dirname, "..", "asset-manifest.json");
const PREFIX = "ga-site/";
const CONCURRENCY = 3;

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function shouldUpload(abs) {
  const rel = path.relative(ASSETS, abs).replace(/\\/g, "/");
  if (rel.startsWith("cases-v2/")) return true;
  return /\.mp4$/i.test(abs);
}

async function main() {
  const envId = process.env.CLOUDBASE_ENV_ID;
  const accessKey = process.env.CLOUDBASE_APIKEY;
  if (!envId || !accessKey) {
    throw new Error("CLOUDBASE_ENV_ID / CLOUDBASE_APIKEY required");
  }
  const app = cloudbase.init({ env: envId, accessKey });
  const files = walk(ASSETS).filter(shouldUpload);
  const existing = fs.existsSync(MANIFEST_FILE)
    ? JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"))
    : {};
  const pending = files.filter(abs => {
    const rel = "assets/" + path.relative(ASSETS, abs).replace(/\\/g, "/");
    return !existing[rel];
  });
  console.log(`[upload] total=${files.length} pending=${pending.length} cached=${files.length - pending.length}`);

  let ok = files.length - pending.length;
  let fail = 0;
  let index = 0;

  async function worker() {
    while (index < pending.length) {
      const current = pending[index++];
      const rel = "assets/" + path.relative(ASSETS, current).replace(/\\/g, "/");
      const cloudPath = PREFIX + rel;
      try {
        const result = await app.uploadFile({
          cloudPath,
          fileContent: fs.createReadStream(current)
        });
        if (!result || !result.fileID) throw new Error("no fileID");
        existing[rel] = result.fileID;
        ok += 1;
        if (ok % 10 === 0 || ok === files.length) {
          fs.writeFileSync(MANIFEST_FILE, JSON.stringify(existing, null, 2));
          console.log(`[upload] ${ok}/${files.length} ${rel}`);
        }
      } catch (error) {
        fail += 1;
        console.error(`[upload] FAIL ${rel}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(existing, null, 2));
  console.log(`[upload] done ok=${ok} fail=${fail} manifest=${MANIFEST_FILE}`);
  if (fail) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
