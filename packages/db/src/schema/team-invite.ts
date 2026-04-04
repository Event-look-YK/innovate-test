import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { userRoleEnum } from "./enums";

export const teamInvite = pgTable(
  "team_invite",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    role: userRoleEnum("role").notNull(),
    status: text("status").default("invited").notNull(),
    invitedById: text("invited_by_id")
      .notNull()
      .references(() => user.id),
    acceptedUserId: text("accepted_user_id").references(() => user.id),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    acceptedAt: timestamp("accepted_at"),
  },
  (table) => [
    index("team_invite_company_id_idx").on(table.companyId),
    index("team_invite_email_idx").on(table.email),
  ],
);

export const teamInviteRelations = relations(teamInvite, ({ one }) => ({
  company: one(company, {
    fields: [teamInvite.companyId],
    references: [company.id],
  }),
  invitedBy: one(user, {
    fields: [teamInvite.invitedById],
    references: [user.id],
  }),
}));
