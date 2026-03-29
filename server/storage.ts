import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users, meetings, events, literature, servicePositions,
  newsletterSubscribers, newsletters, speakers, birthdaySignups,
  type User, type InsertUser,
  type Meeting, type InsertMeeting,
  type Event, type InsertEvent,
  type Literature, type InsertLiterature,
  type ServicePosition, type InsertServicePosition,
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type Newsletter, type InsertNewsletter,
  type Speaker, type InsertSpeaker,
  type BirthdaySignup, type InsertBirthdaySignup,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMeetings(): Promise<Meeting[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  deleteMeeting(id: number): Promise<void>;

  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  getLiterature(): Promise<Literature[]>;
  getLiteratureItem(id: number): Promise<Literature | undefined>;
  createLiterature(item: InsertLiterature): Promise<Literature>;
  deleteLiterature(id: number): Promise<void>;

  getServicePositions(): Promise<ServicePosition[]>;
  getServicePosition(id: number): Promise<ServicePosition | undefined>;
  createServicePosition(position: InsertServicePosition): Promise<ServicePosition>;
  updateServicePosition(id: number, data: Partial<ServicePosition>): Promise<ServicePosition>;
  deleteServicePosition(id: number): Promise<void>;

  getSubscribers(): Promise<NewsletterSubscriber[]>;
  getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;

  getNewsletters(): Promise<Newsletter[]>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  updateNewsletter(id: number, data: Partial<Newsletter>): Promise<Newsletter>;

  getSpeakers(): Promise<Speaker[]>;
  createSpeaker(speaker: InsertSpeaker): Promise<Speaker>;
  updateSpeaker(id: number, data: Partial<Speaker>): Promise<Speaker>;
  deleteSpeaker(id: number): Promise<void>;

  getBirthdaySignups(): Promise<BirthdaySignup[]>;
  createBirthdaySignup(signup: InsertBirthdaySignup): Promise<BirthdaySignup>;
  deleteBirthdaySignup(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getMeetings(): Promise<Meeting[]> {
    return db.select().from(meetings).where(eq(meetings.isActive, true));
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const [created] = await db.insert(meetings).values(meeting).returning();
    return created;
  }

  async deleteMeeting(id: number): Promise<void> {
    await db.delete(meetings).where(eq(meetings.id, id));
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).where(eq(events.isActive, true));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getLiterature(): Promise<Literature[]> {
    return db.select().from(literature).where(eq(literature.isActive, true));
  }

  async getLiteratureItem(id: number): Promise<Literature | undefined> {
    const [item] = await db.select().from(literature).where(eq(literature.id, id));
    return item;
  }

  async createLiterature(item: InsertLiterature): Promise<Literature> {
    const [created] = await db.insert(literature).values(item).returning();
    return created;
  }

  async deleteLiterature(id: number): Promise<void> {
    await db.delete(literature).where(eq(literature.id, id));
  }

  async getServicePositions(): Promise<ServicePosition[]> {
    return db.select().from(servicePositions).where(eq(servicePositions.isActive, true));
  }

  async getServicePosition(id: number): Promise<ServicePosition | undefined> {
    const [position] = await db.select().from(servicePositions).where(eq(servicePositions.id, id));
    return position;
  }

  async createServicePosition(position: InsertServicePosition): Promise<ServicePosition> {
    const [created] = await db.insert(servicePositions).values(position).returning();
    return created;
  }

  async updateServicePosition(id: number, data: Partial<ServicePosition>): Promise<ServicePosition> {
    const [updated] = await db.update(servicePositions).set(data).where(eq(servicePositions.id, id)).returning();
    return updated;
  }

  async deleteServicePosition(id: number): Promise<void> {
    await db.delete(servicePositions).where(eq(servicePositions.id, id));
  }

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select().from(newsletterSubscribers);
  }

  async getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [sub] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return sub;
  }

  async createSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [created] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return created;
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return db.select().from(newsletters);
  }

  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const [created] = await db.insert(newsletters).values(newsletter).returning();
    return created;
  }

  async updateNewsletter(id: number, data: Partial<Newsletter>): Promise<Newsletter> {
    const [updated] = await db.update(newsletters).set(data).where(eq(newsletters.id, id)).returning();
    return updated;
  }

  async getSpeakers(): Promise<Speaker[]> {
    return db.select().from(speakers);
  }

  async createSpeaker(speaker: InsertSpeaker): Promise<Speaker> {
    const [created] = await db.insert(speakers).values(speaker).returning();
    return created;
  }

  async updateSpeaker(id: number, data: Partial<Speaker>): Promise<Speaker> {
    const [updated] = await db.update(speakers).set(data).where(eq(speakers.id, id)).returning();
    return updated;
  }

  async deleteSpeaker(id: number): Promise<void> {
    await db.delete(speakers).where(eq(speakers.id, id));
  }

  async getBirthdaySignups(): Promise<BirthdaySignup[]> {
    return db.select().from(birthdaySignups);
  }

  async createBirthdaySignup(signup: InsertBirthdaySignup): Promise<BirthdaySignup> {
    const [created] = await db.insert(birthdaySignups).values(signup).returning();
    return created;
  }

  async deleteBirthdaySignup(id: number): Promise<void> {
    await db.delete(birthdaySignups).where(eq(birthdaySignups.id, id));
  }
}

export const storage = new DatabaseStorage();
