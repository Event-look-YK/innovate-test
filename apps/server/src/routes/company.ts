import { db } from "@innovate-test/db";
import { company } from "@innovate-test/db/schema/company";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, notFound } from "../lib/errors";
import { companyUpdateSchema, requireCompanyId, validateBody } from "../lib/zod-schemas";

export async function companyRoutes(fastify: FastifyInstance) {
  // GET /company
  fastify.get(
    "/company",
    { preHandler: [authPreHandler] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const rows = await db
        .select()
        .from(company)
        .where(eq(company.id, companyId))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Company not found");
      return rows[0];
    },
  );

  // POST /company — update (admin only)
  fastify.post(
    "/company",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(companyUpdateSchema, request.body, reply);
      if (!data) return;

      const updates: Record<string, unknown> = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.taxId !== undefined) updates.taxId = data.taxId;
      if (data.country !== undefined) updates.country = data.country;
      if (data.city !== undefined) updates.city = data.city;
      if (data.logoUrl !== undefined) updates.logoUrl = data.logoUrl;

      if (Object.keys(updates).length === 0) {
        return badRequest(reply, "No fields to update");
      }

      await db.update(company).set(updates).where(eq(company.id, companyId));

      const updated = await db
        .select()
        .from(company)
        .where(eq(company.id, companyId))
        .limit(1);

      return updated[0];
    },
  );
}
