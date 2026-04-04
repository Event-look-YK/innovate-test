import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { routeOfferStatusEnum, routeOfferTriggerEnum } from "./enums";
import { routePlan } from "./route";

export const routeOffer = pgTable(
  "route_offer",
  {
    id: text("id").primaryKey(),
    routePlanId: text("route_plan_id")
      .notNull()
      .references(() => routePlan.id, { onDelete: "cascade" }),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    status: routeOfferStatusEnum("status").default("open").notNull(),
    triggerType: routeOfferTriggerEnum("trigger_type").notNull(),
    acceptedByDriverId: text("accepted_by_driver_id").references(() => user.id, {
      onDelete: "set null",
    }),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("route_offer_company_id_idx").on(table.companyId),
    index("route_offer_status_idx").on(table.status),
    index("route_offer_route_plan_id_idx").on(table.routePlanId),
  ],
);

export const routeOfferRelations = relations(routeOffer, ({ one }) => ({
  routePlan: one(routePlan, {
    fields: [routeOffer.routePlanId],
    references: [routePlan.id],
  }),
  company: one(company, {
    fields: [routeOffer.companyId],
    references: [company.id],
  }),
  acceptedByDriver: one(user, {
    fields: [routeOffer.acceptedByDriverId],
    references: [user.id],
  }),
}));
