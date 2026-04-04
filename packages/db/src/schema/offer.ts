import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { demandRequest } from "./demand";
import { offerStatusEnum } from "./enums";

export const freightOffer = pgTable(
  "freight_offer",
  {
    id: text("id").primaryKey(),
    demandRequestId: text("demand_request_id")
      .notNull()
      .references(() => demandRequest.id, { onDelete: "cascade" }),
    freelancerUserId: text("freelancer_user_id")
      .notNull()
      .references(() => user.id),
    taskTitle: text("task_title").notNull(),
    originLabel: text("origin_label").notNull(),
    destinationLabel: text("destination_label").notNull(),
    distanceKm: real("distance_km").notNull(),
    cargoType: text("cargo_type").notNull(),
    weightT: real("weight_t").notNull(),
    deadline: timestamp("deadline").notNull(),
    offeredPriceUah: real("offered_price_uah").notNull(),
    status: offerStatusEnum("status").default("open").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("freight_offer_demand_request_id_idx").on(table.demandRequestId),
    index("freight_offer_freelancer_user_id_idx").on(table.freelancerUserId),
    index("freight_offer_status_idx").on(table.status),
  ],
);

export const freightOfferRelations = relations(freightOffer, ({ one }) => ({
  demandRequest: one(demandRequest, {
    fields: [freightOffer.demandRequestId],
    references: [demandRequest.id],
  }),
  freelancer: one(user, {
    fields: [freightOffer.freelancerUserId],
    references: [user.id],
  }),
}));
