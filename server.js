const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  const requestedPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    if (path.basename(filePath) === "index.html" && process.env.NEXT_PUBLIC_MULTIPLAYER_URL) {
      const multiplayerUrl = process.env.NEXT_PUBLIC_MULTIPLAYER_URL.replace(/[&"<>]/g, "");
      data = Buffer.from(data.toString("utf8").replace(
        /<meta name="sea-legends-multiplayer-url" content="[^"]*">/,
        `<meta name="sea-legends-multiplayer-url" content="${multiplayerUrl}">`,
      ));
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log(`Sea Legends running at http://localhost:${port}`);
});
