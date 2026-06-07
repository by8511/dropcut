import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const prototypePath = "/prototypes/drop-cut-v1-1.html";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function safePath(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  return join(root, clean);
}

async function sendFile(res, filePath) {
  try {
    const file = await stat(filePath);
    if (!file.isFile()) throw new Error("not a file");
    res.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
      "content-length": file.size,
      "cache-control": "no-cache"
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/") {
    res.writeHead(302, { location: prototypePath });
    res.end();
    return;
  }
  sendFile(res, safePath(url.pathname));
}).listen(port, "0.0.0.0", () => {
  console.log(`dropcut server listening on ${port}`);
});
