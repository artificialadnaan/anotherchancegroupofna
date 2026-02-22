import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const meetings = pgTable("meetings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  meetingType: text("meeting_type").notNull(),
  format: text("format"),
  location: text("location").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  endTime: text("end_time"),
  location: text("location").notNull(),
  eventType: text("event_type").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const literature = pgTable("literature", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  externalUrl: text("external_url"),
  isActive: boolean("is_active").notNull().default(true),
});

export const servicePositions = pgTable("service_positions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  committee: text("committee").notNull(),
  cleanTimeRequirement: text("clean_time_requirement").notNull(),
  commitmentLength: text("commitment_length").notNull(),
  description: text("description"),
  responsibilities: text("responsibilities").array().notNull(),
  additionalNotes: text("additional_notes"),
  isFilled: boolean("is_filled").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  status: text("status").notNull().default("draft"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertLiteratureSchema = createInsertSchema(literature).omit({ id: true });
export const insertServicePositionSchema = createInsertSchema(servicePositions).omit({ id: true });
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ id: true, subscribedAt: true });
export const insertNewsletterSchema = createInsertSchema(newsletters).omit({ id: true, sentAt: true, recipientCount: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Literature = typeof literature.$inferSelect;
export type InsertLiterature = z.infer<typeof insertLiteratureSchema>;
export type ServicePosition = typeof servicePositions.$inferSelect;
export type InsertServicePosition = z.infer<typeof insertServicePositionSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
