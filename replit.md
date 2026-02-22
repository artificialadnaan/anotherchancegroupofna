# Another Chance Group of NA - Website

## Overview
A comprehensive Narcotics Anonymous group website for the "Another Chance" group. Members can check meeting schedules, browse NA literature, learn about service positions (trusted servant roles), view upcoming events, and subscribe to a newsletter for group updates.

## Recent Changes
- **2026-02-22**: Initial MVP built with all core features - meetings, literature, service positions, events, newsletter subscription, and admin dashboard.

## Project Architecture
- **Frontend**: React SPA with Wouter routing, Shadcn UI components, TanStack Query, Tailwind CSS
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Blue-toned theme with light/dark mode support via CSS custom properties

### Key Pages
- `/` - Home page with hero, quick links, and helpline info
- `/meetings` - Weekly meeting schedule grouped by day
- `/literature` - NA literature library with category filtering
- `/service-positions` - All trusted servant positions with requirements, clean time, and responsibilities
- `/events` - Upcoming and past events calendar
- `/newsletter` - Newsletter subscription form
- `/admin` - Admin dashboard for managing meetings, events, literature, and sending newsletters

### Database Models
- `meetings` - Meeting schedules with day, time, type, location
- `events` - Group and area events with dates and details
- `literature` - NA literature resources with categories
- `service_positions` - Trusted servant roles with requirements from Another Chance guidelines
- `newsletter_subscribers` - Email subscriptions for group communications
- `newsletters` - Sent newsletter records

### Service Positions Data
All 25 trusted servant positions from the Another Chance Group guidelines are seeded, including Admin Committee positions (Facilitator, Co-Facilitator, Notestaker, Money Handler, etc.), Group Committee positions (Activities, Cleanup, Cinderblock, etc.), Meeting Support roles, and Group Representatives.

## User Preferences
- Focus on clean, accessible design appropriate for recovery community
- Long-term scalability in mind
- Newsletter functionality for member communications
