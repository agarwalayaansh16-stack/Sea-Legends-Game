/**
 * Builds the browser assets from the organised sources.
 *
 *   src/game/*.js     -> game.js     (concatenated in file-name order)
 *   src/styles/*.css  -> styles.css  (concatenated in file-name order)
 *
 * The game files share one closure that opens in 00-bootstrap.js and closes in
 * 99-init.js, so they must be joined rather than loaded as separate scripts.
 * The outputs are written to the project root (used by server.js and the Next.js
 * layout) and copied with index.html into public/ (served by Next.js).
 *
 * Run with: npm run build:assets   (also runs automatically before dev/build)
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

function concatDir(dir, ext, commentStart, commentEnd) {
  const fullDir = path.join(root, dir);
  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(ext)).sort();
  if (!files.length) throw new Error(`No ${ext} files found in ${dir}`);
  const banner = `${commentStart} GENERATED FILE - do not edit. Edit ${dir}/ and run "npm run build:assets". ${commentEnd}\n`;
  return banner + files.map((f) => fs.readFileSync(path.join(fullDir, f), "utf8").replace(/\s+$/, "\n")).join("");
}

function write(file, contents) {
  fs.writeFileSync(path.join(root, file), contents);
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, file), contents);
  console.log(`[build-assets] ${file} (${(Buffer.byteLength(contents) / 1024).toFixed(0)} KB)`);
}

write("game.js", concatDir("src/game", ".js", "//", ""));
write("styles.css", concatDir("src/styles", ".css", "/*", "*/"));
fs.copyFileSync(path.join(root, "index.html"), path.join(publicDir, "index.html"));
console.log("[build-assets] index.html -> public/index.html");
