import { serve } from "srvx/node";
import handler from "./dist/server/server.js";

serve({
  fetch: (req) => handler.fetch(req),
  port: Number(process.env.PORT) || 3001,
  hostname: "0.0.0.0",
});
