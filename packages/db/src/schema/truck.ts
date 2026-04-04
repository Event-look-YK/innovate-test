import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { company } from "./company";
import { truckStatusEnum, truckTypeEnum } from "./enums";

export const truck = pgTable(
  "truck",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: truckTypeEnum("type").notNull(),
    payloadT: real("payload_t").notNull(),
    trailerId: text("trailer_id"),
    trackerId: text("tracker_id").notNull(),
    status: truckStatusEnum("status").default("idle").notNull(),
    locationLabel: text("location_label").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("truck_company_id_idx").on(table.companyId),
    index("truck_status_idx").on(table.status),
  ],
);

export const truckRelations = relations(truck, ({ one }) => ({
  company: one(company, {
    fields: [truck.companyId],
    references: [company.id],
  }),
}));
