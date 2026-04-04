import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { freelanceVehicleTypeEnum, userRoleEnum } from "./enums";

export const userProfile = pgTable(
  "user_profile",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    phone: text("phone"),
    language: text("language").default("uk").notNull(),
    companyId: text("company_id").references(() => company.id, {
      onDelete: "set null",
    }),
    licenseNumber: text("license_number"),
    vehicleType: freelanceVehicleTypeEnum("vehicle_type"),
    payloadT: real("payload_t"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_profile_user_id_idx").on(table.userId),
    index("user_profile_company_id_idx").on(table.companyId),
  ],
);

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
  company: one(company, {
    fields: [userProfile.companyId],
    references: [company.id],
  }),
}));
