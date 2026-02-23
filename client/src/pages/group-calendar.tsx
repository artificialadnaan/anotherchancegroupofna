import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Cake, Mic, Users, Gamepad2, Heart, ChevronLeft, ChevronRight, PartyPopper, CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Speaker, Event as DbEvent } from "@shared/schema";
import { format, parseISO } from "date-fns";

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

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

interface CalendarEvent {
  date: Date;
  title: string;
  time: string;
  type: "birthday" | "speaker" | "conscience" | "gamenight" | "women" | "event";
  description?: string;
}

const typeColors: Record<string, { bg: string; text: string; dot: string }> = {
  birthday: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-800 dark:text-pink-200", dot: "bg-pink-500" },
  speaker: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-200", dot: "bg-blue-500" },
  conscience: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-200", dot: "bg-amber-500" },
  gamenight: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-200", dot: "bg-green-500" },
  women: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-200", dot: "bg-purple-500" },
  event: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-200", dot: "bg-orange-500" },
};

const typeLabels: Record<string, string> = {
  birthday: "Birthday Night",
  speaker: "Speaker Meeting",
  conscience: "Group Conscience",
  gamenight: "Game Night",
  women: "Women's Meeting",
  event: "Group/Area Event",
};

export default function GroupCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const { data: speakers } = useQuery<Speaker[]>({ queryKey: ["/api/speakers"] });
  const { data: dbEvents } = useQuery<DbEvent[]>({ queryKey: ["/api/events"] });

  const firstFriday = getFirstFriday(year, month);
  const speakerFridays = getEveryOtherFriday(year, month, firstFriday);
  const lastSunday = getLastSunday(year, month);
  const lastSaturday = getLastSaturday(year, month);
  const mondays = getMondaysInMonth(year, month);

  const allEvents: CalendarEvent[] = [];

  allEvents.push({
    date: firstFriday,
    title: "Birthday Night",
    time: "6:00 PM",
    type: "birthday",
    description: "Monthly celebration of recovery milestones",
  });

  speakerFridays.forEach((friday) => {
    const dk = dateKey(friday);
    const matchingSpeaker = speakers?.find((s) => s.meetingDate === dk);
    allEvents.push({
      date: friday,
      title: "Speaker Meeting",
      time: "6:00 PM",
      type: "speaker",
      description: matchingSpeaker
        ? `${matchingSpeaker.speakerName}${matchingSpeaker.topic ? ` - "${matchingSpeaker.topic}"` : ""}${matchingSpeaker.isConfirmed ? "" : " (TBD)"}`
        : "Speaker TBA",
    });
  });

  allEvents.push({
    date: lastSunday,
    title: "Group Conscience",
    time: "1:30 PM",
    type: "conscience",
  });

  allEvents.push({
    date: lastSaturday,
    title: "Game Night",
    time: "7:00 PM",
    type: "gamenight",
  });

  mondays.forEach((monday) => {
    allEvents.push({
      date: monday,
      title: "Women's Meeting",
      time: "7:30 PM",
      type: "women",
    });
  });

  dbEvents?.forEach((evt) => {
    try {
      const eventDate = parseISO(evt.eventDate);
      if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
        allEvents.push({
          date: eventDate,
          title: evt.title,
          time: evt.eventTime || "",
          type: "event",
          description: evt.description || undefined,
        });
      }
    } catch {}
  });

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  allEvents.forEach((e) => {
    const key = dateKey(e.date);
    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push(e);
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = dateKey(new Date());

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); };
  const goToday = () => { setCurrentDate(new Date()); setSelectedDate(null); };

  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : null;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-calendar-heading">Calendar</h1>
        <p className="text-muted-foreground">
          Group events, special meetings, and activities for the Another Chance Group.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          {!isCurrentMonth && (
            <Button variant="outline" size="sm" onClick={goToday} data-testid="button-today">
              Today
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={prevMonth} data-testid="button-prev-month">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} data-testid="button-next-month">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold" data-testid="text-current-month">{monthName}</h2>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {Object.entries(typeLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors[key].dot}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden mb-6" data-testid="calendar-grid">
        <div className="grid grid-cols-7 bg-muted/50">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground border-b">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day, di) => {
              if (day === null) {
                return <div key={di} className="min-h-[80px] sm:min-h-[100px] border-r last:border-r-0 bg-muted/20" />;
              }
              const dk = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventsByDate[dk] || [];
              const isToday = dk === todayStr;
              const isSelected = dk === selectedDate;
              return (
                <div
                  key={di}
                  className={`min-h-[80px] sm:min-h-[100px] border-r last:border-r-0 p-1 cursor-pointer transition-colors hover:bg-muted/30 ${isSelected ? "bg-primary/5 ring-1 ring-primary/30" : ""}`}
                  onClick={() => setSelectedDate(dk === selectedDate ? null : dk)}
                  data-testid={`calendar-day-${dk}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs sm:text-sm font-medium ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center" : "text-foreground pl-1"}`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((evt, ei) => (
                      <div
                        key={ei}
                        className={`text-[10px] sm:text-xs px-1 py-0.5 rounded truncate ${typeColors[evt.type].bg} ${typeColors[evt.type].text}`}
                        title={`${evt.title} ${evt.time}`}
                        data-testid={`event-pill-${evt.type}-${dk}`}
                      >
                        <span className="hidden sm:inline">{evt.title}</span>
                        <span className="sm:hidden">{evt.title.split(" ")[0]}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedEvents !== null && (
        <Card className="mb-6" data-testid="selected-day-detail">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {new Date(selectedDate! + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events on this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((evt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${typeColors[evt.type].dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{evt.title}</span>
                        {evt.time && <span className="text-xs text-muted-foreground">{evt.time}</span>}
                      </div>
                      {evt.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{evt.description}</p>
                      )}
                      {evt.type === "birthday" && (
                        <Link href="/birthday-signup">
                          <Button variant="outline" size="sm" className="mt-1.5 h-7 text-xs" data-testid="button-birthday-signup">
                            <PartyPopper className="w-3 h-3 mr-1" /> Sign Up to Celebrate
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <section className="p-4 sm:p-6 bg-muted/50 rounded-md">
        <h2 className="text-lg font-semibold mb-3">Recurring Schedule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.birthday.dot} shrink-0`} />
            <span><strong>Birthday Night</strong> - 1st Friday, 6 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.speaker.dot} shrink-0`} />
            <span><strong>Speaker Meeting</strong> - Every other Friday, 6 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.conscience.dot} shrink-0`} />
            <span><strong>Group Conscience</strong> - Last Sunday, 1:30 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.gamenight.dot} shrink-0`} />
            <span><strong>Game Night</strong> - Last Saturday, 7 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.women.dot} shrink-0`} />
            <span><strong>Women's Meeting</strong> - Every Monday, 7:30 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${typeColors.event.dot} shrink-0`} />
            <span><strong>Group/Area Events</strong> - As scheduled</span>
          </div>
        </div>
      </section>
    </div>
  );
}
