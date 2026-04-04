import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { company } from "./company";
import { messageStatusEnum, threadTypeEnum } from "./enums";
import { task } from "./task";

export const thread = pgTable(
  "thread",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").references(() => company.id, {
      onDelete: "cascade",
    }),
    type: threadTypeEnum("type").notNull(),
    title: text("title").notNull(),
    taskId: text("task_id").references(() => task.id, {
      onDelete: "set null",
    }),
    lastMessage: text("last_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("thread_company_id_idx").on(table.companyId),
    index("thread_task_id_idx").on(table.taskId),
  ],
);

export const threadParticipant = pgTable(
  "thread_participant",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => thread.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("thread_participant_thread_id_idx").on(table.threadId),
    index("thread_participant_user_id_idx").on(table.userId),
  ],
);

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => thread.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    body: text("body").notNull(),
    status: messageStatusEnum("status").default("sent").notNull(),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => [index("message_thread_id_idx").on(table.threadId)],
);

export const threadRelations = relations(thread, ({ one, many }) => ({
  company: one(company, {
    fields: [thread.companyId],
    references: [company.id],
  }),
  task: one(task, {
    fields: [thread.taskId],
    references: [task.id],
  }),
  participants: many(threadParticipant),
  messages: many(message),
}));

export const threadParticipantRelations = relations(
  threadParticipant,
  ({ one }) => ({
    thread: one(thread, {
      fields: [threadParticipant.threadId],
      references: [thread.id],
    }),
    user: one(user, {
      fields: [threadParticipant.userId],
      references: [user.id],
    }),
  }),
);

export const messageRelations = relations(message, ({ one }) => ({
  thread: one(thread, {
    fields: [message.threadId],
    references: [thread.id],
  }),
  author: one(user, {
    fields: [message.authorId],
    references: [user.id],
  }),
}));
