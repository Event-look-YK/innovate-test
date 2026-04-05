import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "srvx/node";
import handler from "./dist/server/server.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(__dirname, "dist/client");

const MIME = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".json": "application/json",
  ".txt": "text/plain",
};

serve({
  fetch: async (req) => {
    const { pathname } = new URL(req.url);

    if (pathname !== "/" && !pathname.endsWith(".html")) {
      const filePath = join(clientDir, pathname);
      try {
        const [file, info] = await Promise.all([
          readFile(filePath),
          stat(filePath),
        ]);
        if (info.isFile()) {
          const ext = extname(pathname).toLowerCase();
          const isHashed = /\/assets\//.test(pathname);
          return new Response(file, {
            headers: {
              "content-type": MIME[ext] ?? "application/octet-stream",
              "cache-control": isHashed
                ? "public, max-age=31536000, immutable"
                : "public, max-age=3600",
            },
          });
        }
      } catch {
        // not a static file — fall through to SSR
      }
    }

    return handler.fetch(req);
  },
  port: Number(process.env.PORT) || 3001,
  hostname: "0.0.0.0",
});
