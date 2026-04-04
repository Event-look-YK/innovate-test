import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { truckStatusEnum, truckTypeEnum } from "./enums";

export const truck = pgTable(
  "truck",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    assignedDriverId: text("assigned_driver_id").references(() => user.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    type: truckTypeEnum("type").notNull(),
    payloadT: real("payload_t").notNull(),
    trailerId: text("trailer_id"),
    trackerId: text("tracker_id").notNull(),
    status: truckStatusEnum("status").default("idle").notNull(),
    locationLabel: text("location_label").notNull(),
    locationLat: real("location_lat").notNull(),
    locationLng: real("location_lng").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("truck_company_id_idx").on(table.companyId),
    index("truck_status_idx").on(table.status),
    index("truck_assigned_driver_id_idx").on(table.assignedDriverId),
  ],
);

export const truckRelations = relations(truck, ({ one }) => ({
  company: one(company, {
    fields: [truck.companyId],
    references: [company.id],
  }),
  assignedDriver: one(user, {
    fields: [truck.assignedDriverId],
    references: [user.id],
  }),
}));
