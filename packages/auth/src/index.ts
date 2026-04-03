import { createDb } from "@innovate-test/db";
import * as schema from "@innovate-test/db/schema/auth";
import { env } from "@innovate-test/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const isLocalHttpAuthUrl = () => {
  try {
    const u = new URL(env.BETTER_AUTH_URL);
    const host = u.hostname.toLowerCase();
    return (
      u.protocol === "http:" &&
      (host === "localhost" || host === "127.0.0.1" || host === "[::1]")
    );
  } catch {
    return false;
  }
};

export function createAuth() {
  const db = createDb();
  const localHttp = isLocalHttpAuthUrl();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: localHttp
        ? {
            sameSite: "lax",
            secure: false,
            httpOnly: true,
          }
        : {
            sameSite: "none",
            secure: true,
            httpOnly: true,
          },
    },
    plugins: [],
  });
}

export const auth = createAuth();
