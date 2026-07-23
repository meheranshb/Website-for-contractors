import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const quoteStatus = pgEnum("quote_status", [
  "pending",
  "estimated",
  "approved",
  "rejected",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
]);

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceType: text("service_type").notNull(),
  projectDetails: text("project_details").notNull(),
  address: text("address"),
  squareFootage: integer("square_footage"),
  budget: text("budget"),
  timeline: text("timeline"),
  estimatedAmount: numeric("estimated_amount", { precision: 10, scale: 2 }),
  status: quoteStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  quoteId: integer("quote_id").references(() => quotes.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  method: text("method").notNull().default("card"),
  status: paymentStatus("status").notNull().default("pending"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
