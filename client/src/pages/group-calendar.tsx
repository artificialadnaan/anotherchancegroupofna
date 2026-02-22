import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Cake, Mic, Users, Gamepad2, Heart, ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Speaker } from "@shared/schema";

function getFirstFriday(year: number, month: number): Date {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return d;
}

function getLastSunday(year: number, month: number): Date {
  const d = new Date(year, month + 1, 0);
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  return d;
}

function getLastSaturday(year: number, month: number): Date {
  const d = new Date(year, month + 1, 0);
  while (d.getDay() !== 6) d.setDate(d.getDate() - 1);
  return d;
}

function getEveryOtherFriday(year: number, month: number, firstFriday: Date): Date[] {
  const fridays: Date[] = [];
  const d = new Date(firstFriday);
  d.setDate(d.getDate() + 7);
  while (d.getMonth() === month) {
    fridays.push(new Date(d));
    d.setDate(d.getDate() + 14);
  }
  return fridays;
}

function getMondaysInMonth(year: number, month: number): Date[] {
  const mondays: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  while (d.getMonth() === month) {
    mondays.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return mondays;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface CalendarEvent {
  date: Date;
  title: string;
  time: string;
  type: "birthday" | "speaker" | "conscience" | "gamenight" | "women";
  icon: typeof CalendarDays;
  description: string;
  speaker?: Speaker;
}

export default function GroupCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const { data: speakers } = useQuery<Speaker[]>({ queryKey: ["/api/speakers"] });

  const firstFriday = getFirstFriday(year, month);
  const speakerFridays = getEveryOtherFriday(year, month, firstFriday);
  const lastSunday = getLastSunday(year, month);
  const lastSaturday = getLastSaturday(year, month);
  const mondays = getMondaysInMonth(year, month);

  const events: CalendarEvent[] = [];

  events.push({
    date: firstFriday,
    title: "Birthday Night",
    time: "6:00 PM",
    type: "birthday",
    icon: Cake,
    description: "Monthly celebration of recovery milestones. Come celebrate with members who are marking clean time anniversaries!",
  });

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  speakerFridays.forEach((friday) => {
    const dateStr = `${friday.getFullYear()}-${String(friday.getMonth() + 1).padStart(2, "0")}-${String(friday.getDate()).padStart(2, "0")}`;
    const matchingSpeaker = speakers?.find((s) => s.meetingDate === dateStr);
    events.push({
      date: friday,
      title: "Speaker Meeting",
      time: "6:00 PM",
      type: "speaker",
      icon: Mic,
      description: matchingSpeaker
        ? `Speaker: ${matchingSpeaker.speakerName}${matchingSpeaker.topic ? ` - "${matchingSpeaker.topic}"` : ""}${matchingSpeaker.isConfirmed ? "" : " (Tentative)"}`
        : "Speaker to be announced. Check back for updates.",
      speaker: matchingSpeaker,
    });
  });

  events.push({
    date: lastSunday,
    title: "Group Conscience",
    time: "1:30 PM",
    type: "conscience",
    icon: Users,
    description: "Monthly group conscience meeting. All members are encouraged to attend and participate in group decisions.",
  });

  events.push({
    date: lastSaturday,
    title: "Game Night",
    time: "7:00 PM",
    type: "gamenight",
    icon: Gamepad2,
    description: "Join us for an evening of games, fellowship, and clean fun! Bring a snack to share.",
  });

  mondays.forEach((monday) => {
    events.push({
      date: monday,
      title: "Women's Meeting",
      time: "7:30 PM",
      type: "women",
      icon: Heart,
      description: "A safe space for women in recovery to share, support, and grow together.",
    });
  });

  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  const typeColors: Record<string, string> = {
    birthday: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    speaker: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    conscience: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    gamenight: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    women: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  const typeLabels: Record<string, string> = {
    birthday: "Birthday Night",
    speaker: "Speaker Meeting",
    conscience: "Group Conscience",
    gamenight: "Game Night",
    women: "Women's Meeting",
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-calendar-heading">Group Calendar</h1>
        <p className="text-muted-foreground">
          Recurring events and special meetings for the Another Chance Group.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 gap-2">
        <Button variant="outline" size="icon" onClick={prevMonth} data-testid="button-prev-month">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold" data-testid="text-current-month">{monthName}</h2>
          {!isCurrentMonth && (
            <Button variant="ghost" size="sm" onClick={today} className="text-xs p-0 h-auto" data-testid="button-today">
              Back to Today
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth} data-testid="button-next-month">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {Object.entries(typeLabels).map(([key, label]) => (
          <Badge key={key} className={`${typeColors[key]} shrink-0 text-xs`} data-testid={`badge-legend-${key}`}>
            {label}
          </Badge>
        ))}
      </div>

      <div className="space-y-3 mb-8">
        {events.map((event, idx) => {
          const isToday = event.date.toDateString() === new Date().toDateString();
          const isPast = event.date < new Date() && !isToday;
          return (
            <Card
              key={idx}
              className={`transition-all ${isPast ? "opacity-60" : ""} ${isToday ? "ring-2 ring-primary" : ""}`}
              data-testid={`card-event-${event.type}-${idx}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center text-center min-w-[60px]">
                    <span className="text-xs text-muted-foreground uppercase">
                      {event.date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-2xl font-bold">{event.date.getDate()}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <event.icon className="w-4 h-4 shrink-0" />
                      <h3 className="font-semibold text-sm">{event.title}</h3>
                      <Badge className={`${typeColors[event.type]} text-xs`}>{event.time}</Badge>
                      {isToday && <Badge variant="default" className="text-xs">Today</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    {event.type === "birthday" && (
                      <Link href="/birthday-signup">
                        <Button variant="outline" size="sm" className="mt-2" data-testid="button-birthday-signup">
                          <PartyPopper className="w-3 h-3 mr-2" />
                          Sign Up to Celebrate
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="p-6 bg-muted/50 rounded-md">
        <h2 className="text-xl font-semibold mb-3">Recurring Schedule</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 shrink-0" />
            <span><strong>Birthday Night</strong> - 1st Friday of every month at 6:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 shrink-0" />
            <span><strong>Speaker Meeting</strong> - Every other Friday at 6:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <span><strong>Group Conscience</strong> - Last Sunday of every month at 1:30 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 shrink-0" />
            <span><strong>Game Night</strong> - Last Saturday of every month at 7:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 shrink-0" />
            <span><strong>Women's Meeting</strong> - Every Monday at 7:30 PM</span>
          </div>
        </div>
      </section>
    </div>
  );
}
