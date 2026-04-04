import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { cargoTypeEnum, taskPriorityEnum, taskStatusEnum } from "./enums";
import { truck } from "./truck";

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    cargoDescription: text("cargo_description").notNull(),
    cargoType: cargoTypeEnum("cargo_type").notNull(),
    weightT: real("weight_t").notNull(),
    originLabel: text("origin_label").notNull(),
    destinationLabel: text("destination_label").notNull(),
    distanceKm: real("distance_km").notNull(),
    deadline: timestamp("deadline").notNull(),
    priority: taskPriorityEnum("priority").notNull(),
    status: taskStatusEnum("status").default("Pending").notNull(),
    assignedTruckId: text("assigned_truck_id").references(() => truck.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("task_company_id_idx").on(table.companyId),
    index("task_status_idx").on(table.status),
    index("task_assigned_truck_id_idx").on(table.assignedTruckId),
    index("task_priority_idx").on(table.priority),
  ],
);

export const taskRelations = relations(task, ({ one }) => ({
  company: one(company, {
    fields: [task.companyId],
    references: [company.id],
  }),
  assignedTruck: one(truck, {
    fields: [task.assignedTruckId],
    references: [truck.id],
  }),
  createdBy: one(user, {
    fields: [task.createdById],
    references: [user.id],
  }),
}));
