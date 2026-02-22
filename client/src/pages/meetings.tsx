import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Info } from "lucide-react";
import type { Meeting } from "@shared/schema";

const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const typeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "open": return "default" as const;
      case "closed": return "secondary" as const;
      case "speaker": return "outline" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-meeting-${meeting.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{meeting.name}</CardTitle>
          <Badge variant={typeColor(meeting.meetingType)} data-testid={`badge-type-${meeting.id}`}>
            {meeting.meetingType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{meeting.startTime} - {meeting.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{meeting.location}</span>
          </div>
          {meeting.format && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 shrink-0" />
              <span>{meeting.format}</span>
            </div>
          )}
          {meeting.description && (
            <p className="text-sm text-muted-foreground pt-1">{meeting.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MeetingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MeetingsPage() {
  const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const groupedMeetings = meetings?.reduce((acc, meeting) => {
    const day = meeting.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  const sortedDays = groupedMeetings
    ? dayOrder.filter((day) => groupedMeetings[day]?.length > 0)
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meeting Schedule</h1>
        <p className="text-muted-foreground">
          Find a meeting that fits your schedule. All meetings are held at Another Chance Group unless otherwise noted.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Badge>Open</Badge>
          <span className="text-xs text-muted-foreground">Anyone welcome</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Closed</Badge>
          <span className="text-xs text-muted-foreground">Addicts only</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Speaker</Badge>
          <span className="text-xs text-muted-foreground">Speaker meeting</span>
        </div>
      </div>

      {isLoading && <MeetingsSkeleton />}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load meetings. Please try again later.</p>
        </Card>
      )}

      {sortedDays.length > 0 && (
        <div className="space-y-8">
          {sortedDays.map((day) => (
            <div key={day}>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" data-testid={`heading-${day.toLowerCase()}`}>
                {day}
                <Badge variant="secondary" className="text-xs">
                  {groupedMeetings![day].length} meeting{groupedMeetings![day].length > 1 ? "s" : ""}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupedMeetings![day].map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && sortedDays.length === 0 && (
        <Card className="p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Meetings Scheduled</h3>
          <p className="text-sm text-muted-foreground">
            Meeting schedule is being updated. Please check back soon.
          </p>
        </Card>
      )}
    </div>
  );
}
