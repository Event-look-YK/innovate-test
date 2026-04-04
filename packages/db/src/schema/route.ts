import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { routeStatusEnum } from "./enums";
import { task } from "./task";
import { truck } from "./truck";

export const routePlan = pgTable(
  "route_plan",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    truckId: text("truck_id")
      .notNull()
      .references(() => truck.id),
    driverId: text("driver_id").references(() => user.id, {
      onDelete: "set null",
    }),
    distanceKm: real("distance_km").notNull(),
    durationHours: real("duration_hours").notNull(),
    loadT: real("load_t").notNull(),
    capacityT: real("capacity_t").notNull(),
    status: routeStatusEnum("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("route_plan_company_id_idx").on(table.companyId),
    index("route_plan_truck_id_idx").on(table.truckId),
    index("route_plan_driver_id_idx").on(table.driverId),
    index("route_plan_status_idx").on(table.status),
  ],
);

export const routeStop = pgTable(
  "route_stop",
  {
    id: text("id").primaryKey(),
    routePlanId: text("route_plan_id")
      .notNull()
      .references(() => routePlan.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    eta: timestamp("eta").notNull(),
    note: text("note"),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [index("route_stop_route_plan_id_idx").on(table.routePlanId)],
);

export const routePlanTask = pgTable(
  "route_plan_task",
  {
    routePlanId: text("route_plan_id")
      .notNull()
      .references(() => routePlan.id, { onDelete: "cascade" }),
    taskId: text("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.routePlanId, table.taskId] })],
);

export const routePlanRelations = relations(routePlan, ({ one, many }) => ({
  company: one(company, {
    fields: [routePlan.companyId],
    references: [company.id],
  }),
  truck: one(truck, {
    fields: [routePlan.truckId],
    references: [truck.id],
  }),
  driver: one(user, {
    fields: [routePlan.driverId],
    references: [user.id],
  }),
  stops: many(routeStop),
  routePlanTasks: many(routePlanTask),
}));

export const routeStopRelations = relations(routeStop, ({ one }) => ({
  routePlan: one(routePlan, {
    fields: [routeStop.routePlanId],
    references: [routePlan.id],
  }),
}));

export const routePlanTaskRelations = relations(routePlanTask, ({ one }) => ({
  routePlan: one(routePlan, {
    fields: [routePlanTask.routePlanId],
    references: [routePlan.id],
  }),
  task: one(task, {
    fields: [routePlanTask.taskId],
    references: [task.id],
  }),
}));
