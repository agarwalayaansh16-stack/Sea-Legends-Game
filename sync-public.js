const fs = require("fs");
const path = require("path");

const files = ["game.js", "styles.css", "index.html"];

files.forEach((file) => {
  const src = path.join(__dirname, file);
  const dest = path.join(__dirname, "public", file);
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[sync-public] Synced ${file} -> public/${file}`);
    }
  } catch (err) {
    console.error(`[sync-public] Error syncing ${file}:`, err);
  }
});
