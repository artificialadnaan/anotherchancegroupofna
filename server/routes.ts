import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import path from "path";
import express from "express";
import session from "express-session";
import { storage } from "./storage";
import { insertMeetingSchema, insertEventSchema, insertLiteratureSchema, insertNewsletterSubscriberSchema, insertSpeakerSchema, insertBirthdaySignupSchema } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use("/literature", express.static(path.join(process.cwd(), "public/literature")));

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      return res.json({ ok: true });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  app.get("/api/meetings", async (_req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", requireAdmin, async (req, res) => {
    try {
      const parsed = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(parsed);
      res.status(201).json(meeting);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid meeting data" });
    }
  });

  app.delete("/api/meetings/:id", requireAdmin, async (req, res) => {
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

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const parsed = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(parsed);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
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

  app.post("/api/literature", requireAdmin, async (req, res) => {
    try {
      const parsed = insertLiteratureSchema.parse(req.body);
      const item = await storage.createLiterature(parsed);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid literature data" });
    }
  });

  app.delete("/api/literature/:id", requireAdmin, async (req, res) => {
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

  app.patch("/api/service-positions/:id", requireAdmin, async (req, res) => {
    try {
      const { filledBy, isFilled } = req.body;
      const updated = await storage.updateServicePosition(parseInt(req.params.id as string), { filledBy, isFilled });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update service position" });
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

  app.get("/api/newsletter/subscribers", requireAdmin, async (_req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.get("/api/newsletters", requireAdmin, async (_req, res) => {
    try {
      const items = await storage.getNewsletters();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletters" });
    }
  });

  app.post("/api/newsletters/send", requireAdmin, async (req, res) => {
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

  // Speaker management routes
  app.get("/api/speakers", async (_req, res) => {
    try {
      const items = await storage.getSpeakers();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch speakers" });
    }
  });

  app.post("/api/speakers", requireAdmin, async (req, res) => {
    try {
      const parsed = insertSpeakerSchema.parse(req.body);
      const speaker = await storage.createSpeaker(parsed);
      res.status(201).json(speaker);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid speaker data" });
    }
  });

  app.patch("/api/speakers/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateSpeaker(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update speaker" });
    }
  });

  app.delete("/api/speakers/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSpeaker(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete speaker" });
    }
  });

  // Birthday night signup routes
  app.get("/api/birthday-signups", async (_req, res) => {
    try {
      const items = await storage.getBirthdaySignups();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch birthday signups" });
    }
  });

  app.post("/api/birthday-signups", async (req, res) => {
    try {
      const parsed = insertBirthdaySignupSchema.parse(req.body);
      const signup = await storage.createBirthdaySignup(parsed);
      res.status(201).json(signup);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid signup data" });
    }
  });

  app.delete("/api/birthday-signups/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBirthdaySignup(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete signup" });
    }
  });

  return httpServer;
}
