import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { userProfile } from "./user-profile";

export const company = pgTable("company", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  taxId: text("tax_id").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const companyRelations = relations(company, ({ many }) => ({
  members: many(userProfile),
}));
