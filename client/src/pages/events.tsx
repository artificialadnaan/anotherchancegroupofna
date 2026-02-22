import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import type { Event } from "@shared/schema";

function EventCard({ event }: { event: Event }) {
  let formattedDate = event.eventDate;
  try {
    formattedDate = format(parseISO(event.eventDate), "EEEE, MMMM d, yyyy");
  } catch {}

  const eventPast = (() => {
    try {
      return isPast(parseISO(event.eventDate));
    } catch {
      return false;
    }
  })();

  const typeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "workshop": return "Workshop";
      case "celebration": return "Celebration";
      case "fundraiser": return "Fundraiser";
      case "area": return "Area Event";
      case "service": return "Service Event";
      default: return type;
    }
  };

  return (
    <Card className={`hover-elevate ${eventPast ? "opacity-60" : ""}`} data-testid={`card-event-${event.id}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <CardTitle className="text-base">{event.title}</CardTitle>
          <div className="flex gap-1 shrink-0">
            <Badge variant="outline">{typeLabel(event.eventType)}</Badge>
            {eventPast && <Badge variant="secondary">Past</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {event.eventTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                {event.eventTime}
                {event.endTime ? ` - ${event.endTime}` : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-52" />
      ))}
    </div>
  );
}

export default function EventsPage() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const upcomingEvents = events?.filter((e) => {
    try {
      return !isPast(parseISO(e.eventDate));
    } catch {
      return true;
    }
  }) ?? [];

  const pastEvents = events?.filter((e) => {
    try {
      return isPast(parseISO(e.eventDate));
    } catch {
      return false;
    }
  }) ?? [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground">
          Stay connected with upcoming group activities, area events, workshops, and celebrations. Recovery is more fun together.
        </p>
      </div>

      {isLoading && <EventsSkeleton />}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          {upcomingEvents.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-upcoming">
                Upcoming Events
                <Badge>{upcomingEvents.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-past">
                Past Events
                <Badge variant="secondary">{pastEvents.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {events?.length === 0 && (
            <Card className="p-8 text-center">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Events Scheduled</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for upcoming events and activities.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
