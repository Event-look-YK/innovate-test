import { auth } from "@innovate-test/auth";
import { db } from "@innovate-test/db";
import { company } from "@innovate-test/db/schema/company";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { eq } from "drizzle-orm";
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: string | null;
  companyId: string | null;
  companyName: string | null;
  profileComplete: boolean;
  phone: string | null;
  language: string;
};

declare module "fastify" {
  interface FastifyRequest {
    sessionUser: SessionUser;
  }
}

export function registerAuthDecorator(fastify: FastifyInstance) {
  fastify.decorateRequest("sessionUser", null as unknown as SessionUser);
}

async function resolveSession(request: FastifyRequest): Promise<SessionUser | null> {
  const headers = new Headers();
  Object.entries(request.headers).forEach(([key, value]) => {
    if (value) headers.append(key, Array.isArray(value) ? value.join(", ") : value);
  });

  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;

  const profile = await db
    .select({
      role: userProfile.role,
      companyId: userProfile.companyId,
      phone: userProfile.phone,
      language: userProfile.language,
    })
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  const p = profile[0];

  let companyName: string | null = null;
  if (p?.companyId) {
    const c = await db
      .select({ name: company.name })
      .from(company)
      .where(eq(company.id, p.companyId))
      .limit(1);
    companyName = c[0]?.name ?? null;
  }

  return {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: p?.role ?? null,
    companyId: p?.companyId ?? null,
    companyName,
    profileComplete: !!p,
    phone: p?.phone ?? null,
    language: p?.language ?? "uk",
  };
}

export const authPreHandler: preHandlerHookHandler = async (request, reply) => {
  const user = await resolveSession(request);
  if (!user) {
    reply.status(401).send({ error: "Unauthorized", code: "UNAUTHORIZED" });
    return;
  }
  request.sessionUser = user;
};

export function requireRole(
  ...roles: string[]
): preHandlerHookHandler {
  return async (request, reply) => {
    const user = request.sessionUser;
    if (!user) {
      reply.status(401).send({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    if (!user.role || !roles.includes(user.role)) {
      reply.status(403).send({ error: "Forbidden", code: "FORBIDDEN" });
      return;
    }
  };
}

export function requireProfile(): preHandlerHookHandler {
  return async (request, reply) => {
    if (!request.sessionUser?.profileComplete) {
      reply.status(403).send({
        error: "Profile setup required",
        code: "PROFILE_INCOMPLETE",
      });
      return;
    }
  };
}
