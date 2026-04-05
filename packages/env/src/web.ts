import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv:
    typeof window !== "undefined" ? (import.meta as any).env : process.env,
  emptyStringAsUndefined: true,
});
