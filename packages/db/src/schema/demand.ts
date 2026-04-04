import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { company } from "./company";
import { cargoTypeEnum, demandStatusEnum, truckTypeEnum } from "./enums";
import { task } from "./task";

export const demandRequest = pgTable(
  "demand_request",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    taskId: text("task_id").references(() => task.id, {
      onDelete: "set null",
    }),
    requiredTruckType: truckTypeEnum("required_truck_type").notNull(),
    cargoType: cargoTypeEnum("cargo_type").notNull(),
    payloadT: real("payload_t").notNull(),
    originLabel: text("origin_label").notNull(),
    originLat: real("origin_lat").notNull(),
    originLng: real("origin_lng").notNull(),
    destinationLabel: text("destination_label").notNull(),
    destinationLat: real("destination_lat").notNull(),
    destinationLng: real("destination_lng").notNull(),
    distanceKm: real("distance_km").notNull(),
    deadline: timestamp("deadline").notNull(),
    budgetUah: real("budget_uah").notNull(),
    status: demandStatusEnum("status").default("Open").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("demand_request_company_id_idx").on(table.companyId),
    index("demand_request_status_idx").on(table.status),
  ],
);

export const demandRequestRelations = relations(
  demandRequest,
  ({ one }) => ({
    company: one(company, {
      fields: [demandRequest.companyId],
      references: [company.id],
    }),
    task: one(task, {
      fields: [demandRequest.taskId],
      references: [task.id],
    }),
  }),
);
