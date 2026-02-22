import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertMeetingSchema, insertEventSchema, insertLiteratureSchema, insertNewsletterSubscriberSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/meetings", async (_req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const parsed = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(parsed);
      res.status(201).json(meeting);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid meeting data" });
    }
  });

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      await storage.deleteMeeting(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meeting" });
    }
  });

  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const parsed = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(parsed);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.get("/api/literature", async (_req, res) => {
    try {
      const items = await storage.getLiterature();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch literature" });
    }
  });

  app.post("/api/literature", async (req, res) => {
    try {
      const parsed = insertLiteratureSchema.parse(req.body);
      const item = await storage.createLiterature(parsed);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid literature data" });
    }
  });

  app.delete("/api/literature/:id", async (req, res) => {
    try {
      await storage.deleteLiterature(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete literature" });
    }
  });

  app.get("/api/service-positions", async (_req, res) => {
    try {
      const positions = await storage.getServicePositions();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service positions" });
    }
  });

  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const parsed = insertNewsletterSubscriberSchema.parse(req.body);
      const existing = await storage.getSubscriberByEmail(parsed.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      const subscriber = await storage.createSubscriber(parsed);
      res.status(201).json(subscriber);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid subscription data" });
    }
  });

  app.get("/api/newsletter/subscribers", async (_req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.get("/api/newsletters", async (_req, res) => {
    try {
      const items = await storage.getNewsletters();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletters" });
    }
  });

  app.post("/api/newsletters/send", async (req, res) => {
    try {
      const { subject, content } = req.body;
      if (!subject || !content) {
        return res.status(400).json({ message: "Subject and content are required" });
      }

      const subscribers = await storage.getSubscribers();
      const activeSubscribers = subscribers.filter((s) => s.isActive);

      const newsletter = await storage.createNewsletter({
        subject,
        content,
        status: "sent",
      });

      await storage.updateNewsletter(newsletter.id, {
        sentAt: new Date(),
        recipientCount: activeSubscribers.length,
        status: "sent",
      });

      res.status(201).json({
        ...newsletter,
        sentAt: new Date(),
        recipientCount: activeSubscribers.length,
        status: "sent",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to send newsletter" });
    }
  });

  return httpServer;
}
