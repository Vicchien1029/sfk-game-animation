const { createApp } = require("./app");
const store = require("./lib/store");

async function main() {
  await store.loadStore();
  const port = Number(process.env.PORT) || 80;
  const host = process.env.HOST || "0.0.0.0";
  const app = createApp();
  app.listen(port, host, () => {
    console.log(`[sfk-auth] listening on ${host}:${port}`);
  });
}

main().catch(error => {
  console.error("[sfk-auth] failed to start", error);
  process.exit(1);
});
