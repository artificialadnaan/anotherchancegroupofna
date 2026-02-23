# Another Chance Group of NA - Website

## Overview
A comprehensive Narcotics Anonymous group website for the "Another Chance" group. Members can check meeting schedules, browse NA literature, learn about service positions (trusted servant roles), view the group calendar with recurring events, sign up for birthday night celebrations, read daily meditations, and subscribe to a newsletter for group updates.

## Recent Changes
- **2026-02-23**: Consolidated Events + Group Calendar into single `/calendar` page with monthly grid calendar view (Google Calendar-style). Events from DB and recurring group events all shown on same calendar.
- **2026-02-23**: Consolidated Meetings + Area Meetings into single `/meetings` page with tabbed interface ("Our Meetings" / "Area Meetings").
- **2026-02-23**: Sorted Informational Pamphlets by ascending IP number (1, 2, 5, 6, 7...).
- **2026-02-23**: Added Daily Readings page (`/daily-readings`) with links to jftna.org (Just for Today) and spadna.org (Spiritual Principle a Day).
- **2026-02-23**: Fixed Birthday Night logic - members celebrating milestones in month X now celebrate on the first Friday of month X+1 (e.g., February milestones celebrate on first Friday of March).
- **2026-02-22**: Added group calendar, birthday signup, speaker management, admin dashboard sections.
- **2026-02-22**: Added Fort Worth Area Meetings with 23 area NA groups.
- **2026-02-22**: Initial MVP built with all core features.

## Project Architecture
- **Frontend**: React SPA with Wouter routing, Shadcn UI components, TanStack Query, Tailwind CSS
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Blue-toned theme with light/dark mode support via CSS custom properties

### Key Pages
- `/` - Home page with hero, quick links, and helpline info
- `/meetings` - Combined meeting schedule (tabbed: Our Meetings + Area Meetings with 23 Fort Worth area groups)
- `/calendar` - Monthly grid calendar with recurring group events (Birthday Night, Speaker Meeting, Group Conscience, Game Night, Women's Meeting) and database events
- `/literature` - NA literature library with category filtering, IPs sorted by number
- `/daily-readings` - Links to Just for Today (jftna.org) and Spiritual Principle a Day (spadna.org)
- `/service-positions` - All trusted servant positions with requirements, clean time, and responsibilities
- `/birthday-signup` - Sign up for birthday night celebration (milestone month X → celebrates first Friday of month X+1)
- `/newsletter` - Newsletter subscription form
- `/admin` - Admin dashboard for managing meetings, events, literature, speakers, birthdays, and newsletter

### Database Models
- `meetings` - Meeting schedules with day, time, type, location
- `events` - Group and area events with dates and details
- `literature` - NA literature resources with categories
- `service_positions` - Trusted servant roles with requirements from Another Chance guidelines
- `newsletter_subscribers` - Email subscriptions for group communications
- `newsletters` - Sent newsletter records
- `speakers` - Speaker meeting assignments (speaker_name, meeting_date, topic, is_confirmed)
- `birthday_signups` - Birthday night sign-ups (name, clean_date, celebration_month)

### Birthday Night Logic
Members who have a clean time milestone (anniversary) in a given month celebrate at the Birthday Night on the first Friday of the FOLLOWING month. For example: February milestone → March first Friday celebration. The `celebrationMonth` field stores the milestone month (e.g., "2026-02"), and the sign-up page automatically calculates which month's milestones are being collected for the next Birthday Night.

### Service Positions Data
All 25 trusted servant positions from the Another Chance Group guidelines are seeded, including Admin Committee positions (Facilitator, Co-Facilitator, Notestaker, Money Handler, etc.), Group Committee positions (Activities, Cleanup, Cinderblock, etc.), Meeting Support roles, and Group Representatives.

## User Preferences
- Focus on clean, accessible design appropriate for recovery community
- Long-term scalability in mind
- Newsletter functionality for member communications
