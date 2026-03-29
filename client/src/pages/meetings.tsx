import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Info, Search, Phone, Globe, Accessibility } from "lucide-react";
import { useState } from "react";
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

function OurMeetings() {
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
    <div>
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

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
type Day = (typeof days)[number];

interface MeetingSlot {
  time: string;
  tags: string[];
  closed?: boolean;
}

interface AreaGroup {
  name: string;
  address: string;
  handicapAccessible: boolean;
  note?: string;
  isHomeGroup?: boolean;
  schedule: Record<Day, MeetingSlot[]>;
}

const tagLabels: Record<string, string> = {
  "ALT LGT": "Alternative Light",
  "ASK": "Ask-It Basket",
  "EAT": "Eating Meeting",
  "LIT": "Literature Study",
  "MEN": "Men's Meeting",
  "NEW": "Newcomer Topics",
  "SPA": "Spanish",
  "SPK": "Speaker",
  "WOM": "Women's Meeting",
};

function slot(time: string, tags: string[] = [], closed = false): MeetingSlot {
  return { time, tags, closed };
}

const areaGroups: AreaGroup[] = [
  {
    name: "Another Chance",
    address: "732 Brown Trail, Hurst, TX 76053",
    handicapAccessible: true,
    isHomeGroup: true,
    schedule: {
      Sunday: [slot("10:00 AM"), slot("6:00 PM")],
      Monday: [slot("12:00 PM"), slot("6:00 PM"), slot("7:30 PM", ["WOM", "LIT"])],
      Tuesday: [slot("12:00 PM"), slot("6:00 PM")],
      Wednesday: [slot("12:00 PM", ["LIT"]), slot("6:00 PM"), slot("8:00 PM", ["LIT"])],
      Thursday: [slot("12:00 PM"), slot("6:00 PM"), slot("7:30 PM", ["MEN"])],
      Friday: [slot("12:00 PM"), slot("6:00 PM")],
      Saturday: [slot("10:00 AM"), slot("12:00 PM"), slot("6:00 PM")],
    },
  },
  {
    name: "Arlington Group",
    address: "1863 West Division Street, Arlington, TX 76102",
    handicapAccessible: true,
    schedule: {
      Sunday: [slot("12:00 PM"), slot("6:00 PM"), slot("8:00 PM", ["LIT"])],
      Monday: [slot("12:00 PM"), slot("6:00 PM"), slot("8:00 PM")],
      Tuesday: [slot("12:00 PM"), slot("6:00 PM"), slot("8:00 PM")],
      Wednesday: [slot("12:00 PM"), slot("6:00 PM", ["SPK"]), slot("8:00 PM")],
      Thursday: [slot("12:00 PM"), slot("6:00 PM", ["ASK"]), slot("8:00 PM"), slot("8:00 PM", ["ALT LGT"])],
      Friday: [slot("6:00 PM", ["LIT"])],
      Saturday: [slot("12:00 PM", ["LIT"]), slot("6:00 PM"), slot("8:00 PM")],
    },
  },
  {
    name: "Azle Group",
    address: "117 Church Street, Azle, TX 76020",
    handicapAccessible: false,
    note: "Multi-use building on left",
    schedule: {
      Sunday: [], Monday: [],
      Tuesday: [slot("7:00 PM")], Wednesday: [],
      Thursday: [slot("7:00 PM")],
      Friday: [slot("7:00 PM")],
      Saturday: [slot("6:00 PM")],
    },
  },
  {
    name: "Back to Basics",
    address: "4720 Wichita Street, Fort Worth, TX 76119",
    handicapAccessible: true,
    schedule: {
      Sunday: [slot("8:00 PM", ["ALT LGT"], true)],
      Monday: [slot("12:00 PM", [], true), slot("8:00 PM", ["NEW"], true)],
      Tuesday: [slot("12:00 PM", ["LIT"]), slot("8:00 PM", ["LIT"])],
      Wednesday: [slot("12:00 PM", [], true), slot("8:00 PM", [], true)],
      Thursday: [slot("12:00 PM", ["LIT"]), slot("8:00 PM", ["LIT"])],
      Friday: [slot("12:00 PM", [], true), slot("8:00 PM", ["SPK"])],
      Saturday: [slot("12:00 PM", [], true), slot("8:00 PM", [], true)],
    },
  },
  {
    name: "Broadway",
    address: "5340 Davis Boulevard, Fort Worth, TX 76180",
    handicapAccessible: true,
    schedule: {
      Sunday: [slot("12:00 PM"), slot("7:00 PM", ["NEW"])],
      Monday: [slot("12:00 PM"), slot("7:00 PM")],
      Tuesday: [slot("12:00 PM"), slot("7:00 PM", ["ASK"])],
      Wednesday: [slot("12:00 PM", ["LIT"]), slot("7:00 PM", ["SPK"])],
      Thursday: [slot("12:00 PM"), slot("7:00 PM", [], true)],
      Friday: [slot("12:00 PM"), slot("7:00 PM", ["Meditation"])],
      Saturday: [slot("10:00 AM", ["WOM"]), slot("12:00 PM"), slot("7:00 PM"), slot("12:00 AM", ["ALT LGT"])],
    },
  },
  {
    name: "Expect A Miracle",
    address: "215 West Eldred Street, Burleson, TX 76028",
    handicapAccessible: false,
    schedule: {
      Sunday: [slot("7:00 AM"), slot("7:00 PM", ["LIT"])],
      Monday: [slot("12:00 PM"), slot("7:00 PM", ["NEW"])],
      Tuesday: [slot("7:00 PM", ["SPK"])],
      Wednesday: [slot("7:00 PM", ["ALT LGT"])],
      Thursday: [slot("7:00 PM", [], true)],
      Friday: [slot("7:00 PM")],
      Saturday: [slot("7:00 PM", ["ALT LGT"])],
    },
  },
  {
    name: "FW Northside",
    address: "1500 Circle Park Boulevard, Fort Worth, TX 76164",
    handicapAccessible: false,
    note: "Side entrance",
    schedule: {
      Sunday: [slot("7:00 PM", ["LIT", "EAT"])],
      Monday: [], Tuesday: [slot("7:00 PM", ["LIT"])],
      Wednesday: [], Thursday: [slot("7:00 PM", ["ALT LGT"])],
      Friday: [], Saturday: [],
    },
  },
  {
    name: "Freestyle Group",
    address: "502 Southeast Sixth Ave, Mineral Wells, TX 76067",
    handicapAccessible: false,
    schedule: {
      Sunday: [slot("6:00 PM")], Monday: [slot("6:00 PM")],
      Tuesday: [slot("6:00 PM")], Wednesday: [slot("6:00 PM")],
      Thursday: [slot("6:00 PM")], Friday: [slot("6:00 PM")],
      Saturday: [slot("6:00 PM")],
    },
  },
  {
    name: "Haslet NA",
    address: "220 Main Street, Haslet, TX 76052",
    handicapAccessible: true,
    schedule: {
      Sunday: [], Monday: [],
      Tuesday: [slot("7:00 PM")],
      Wednesday: [], Thursday: [], Friday: [], Saturday: [],
    },
  },
  {
    name: "Highway 4 Group",
    address: "3470 Lipan Hwy, Granbury, TX 76048",
    handicapAccessible: false,
    note: "Right of main entrance",
    schedule: {
      Sunday: [],
      Monday: [slot("6:00 PM")], Tuesday: [], Wednesday: [],
      Thursday: [slot("6:00 PM")],
      Friday: [slot("6:00 PM")], Saturday: [],
    },
  },
  {
    name: "NA East",
    address: "6465 East Rosedale St, Fort Worth, TX 76112",
    handicapAccessible: true,
    schedule: {
      Sunday: [slot("12:00 PM"), slot("7:00 PM")],
      Monday: [slot("12:00 PM"), slot("1:30 PM"), slot("7:00 PM"), slot("10:00 PM")],
      Tuesday: [slot("12:00 PM"), slot("1:30 PM"), slot("7:00 PM"), slot("10:00 PM", ["ALT LGT"])],
      Wednesday: [slot("12:00 PM"), slot("1:30 PM"), slot("7:00 PM", ["LIT"]), slot("10:00 PM", ["ALT LGT"])],
      Thursday: [slot("12:00 PM"), slot("1:30 PM"), slot("7:00 PM"), slot("10:00 PM", ["ALT LGT"])],
      Friday: [slot("12:00 PM"), slot("1:30 PM"), slot("7:00 PM"), slot("10:00 PM", ["ALT LGT"])],
      Saturday: [slot("12:00 PM"), slot("5:30 PM", ["WOM"]), slot("7:00 PM"), slot("10:00 PM", ["ALT LGT"])],
    },
  },
  {
    name: "New Way to Live",
    address: "4500 East Berry, Fort Worth, TX 76105",
    handicapAccessible: false,
    note: "Fellowship Hall",
    schedule: {
      Sunday: [], Monday: [], Tuesday: [],
      Wednesday: [slot("7:00 PM")],
      Thursday: [], Friday: [], Saturday: [],
    },
  },
  {
    name: "No Name Group",
    address: "5401 Woodway, Fort Worth, TX 76112",
    handicapAccessible: true,
    note: "Wellness Bldg Rm C",
    schedule: {
      Sunday: [],
      Monday: [slot("7:00 PM")], Tuesday: [slot("7:00 PM")],
      Wednesday: [slot("7:00 PM")],
      Thursday: [slot("7:00 PM", ["LIT"], true)],
      Friday: [slot("7:00 PM")], Saturday: [],
    },
  },
  {
    name: "Proven Plan Lit Study",
    address: "301 Bailey Ranch Road, Aledo, TX 76008",
    handicapAccessible: false,
    schedule: {
      Sunday: [], Monday: [], Tuesday: [], Wednesday: [],
      Thursday: [slot("6:30 PM", ["LIT"], true)],
      Friday: [], Saturday: [],
    },
  },
  {
    name: "Recovery Zone",
    address: "103 Vesey Street Bldg C, Decatur, TX 76234",
    handicapAccessible: false,
    schedule: {
      Sunday: [slot("7:00 PM")], Monday: [slot("7:00 PM")],
      Tuesday: [slot("7:00 PM")], Wednesday: [slot("7:00 PM")],
      Thursday: [slot("7:00 PM")], Friday: [slot("7:00 PM")],
      Saturday: [slot("7:00 PM")],
    },
  },
  {
    name: "Restored 2 Sanity",
    address: "5236 Carver Drive, Fort Worth, TX 76107",
    handicapAccessible: true,
    schedule: {
      Sunday: [],
      Monday: [slot("6:00 PM")], Tuesday: [slot("6:00 PM")],
      Wednesday: [slot("6:00 PM", ["ASK"])],
      Thursday: [slot("6:00 PM", ["LIT"])],
      Friday: [slot("6:00 PM")], Saturday: [slot("6:00 PM")],
    },
  },
  {
    name: "Sisters on Steps",
    address: "1140 Morrison Ave, Fort Worth, TX 76120",
    handicapAccessible: true,
    schedule: {
      Sunday: [], Monday: [],
      Tuesday: [slot("7:00 PM", ["LIT"])],
      Wednesday: [], Thursday: [], Friday: [], Saturday: [],
    },
  },
  {
    name: "Spring Forward NA",
    address: "109 W 3rd Street, Springtown, TX 76082",
    handicapAccessible: true,
    note: "Back entrance",
    schedule: {
      Sunday: [slot("2:00 PM")], Monday: [], Tuesday: [],
      Wednesday: [], Thursday: [slot("7:00 PM")],
      Friday: [], Saturday: [],
    },
  },
  {
    name: "Step One",
    address: "4213 Highway 377, Fort Worth, TX 76116",
    handicapAccessible: false,
    schedule: {
      Sunday: [slot("6:00 PM", [], true)],
      Monday: [slot("12:00 PM"), slot("8:00 PM", [], true)],
      Tuesday: [slot("6:00 PM", [], true), slot("12:00 PM"), slot("8:00 PM", ["SPK"], true)],
      Wednesday: [slot("6:00 PM", [], true), slot("12:00 PM"), slot("8:00 PM", [], true)],
      Thursday: [slot("6:00 PM", [], true), slot("12:00 PM"), slot("8:00 PM", ["NEW"], true)],
      Friday: [slot("6:00 PM", [], true), slot("8:00 PM", [], true)],
      Saturday: [slot("6:00 PM", [], true), slot("8:00 PM", ["SPK"])],
    },
  },
  {
    name: "Stephenville Outback",
    address: "1140 West Tarleton Street, Stephenville, TX 76401",
    handicapAccessible: false,
    schedule: {
      Sunday: [], Monday: [slot("7:00 PM")], Tuesday: [],
      Wednesday: [slot("7:00 PM")],
      Thursday: [], Friday: [], Saturday: [],
    },
  },
  {
    name: "Sun Solutions",
    address: "812 South Crowley Road Ste B, Crowley, TX 76036",
    handicapAccessible: true,
    note: "Fountains Fellowship, back door",
    schedule: {
      Sunday: [slot("6:00 PM")], Monday: [], Tuesday: [],
      Wednesday: [], Thursday: [], Friday: [], Saturday: [],
    },
  },
  {
    name: "Time to Live",
    address: "305 North Field Street, Cleburne, TX 76036",
    handicapAccessible: false,
    schedule: {
      Sunday: [slot("12:00 PM", ["LIT"]), slot("7:00 PM", ["LIT"])],
      Monday: [slot("12:00 PM"), slot("7:00 PM")],
      Tuesday: [],
      Wednesday: [slot("12:00 PM"), slot("7:00 PM")],
      Thursday: [slot("7:00 PM", [], true)],
      Friday: [slot("12:00 PM", ["NEW"]), slot("7:00 PM", ["NEW"])],
      Saturday: [slot("12:00 PM"), slot("7:00 PM")],
    },
  },
  {
    name: "Tin Top",
    address: "1704 Santa Fe Ste 200, Weatherford, TX 76087",
    handicapAccessible: false,
    schedule: {
      Sunday: [], Monday: [],
      Tuesday: [slot("6:00 PM")], Wednesday: [],
      Thursday: [slot("6:00 PM")],
      Friday: [], Saturday: [],
    },
  },
];

function MeetingBadge({ tag }: { tag: string }) {
  const label = tagLabels[tag] || tag;
  return (
    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
      {label}
    </Badge>
  );
}

function DayColumn({ slots }: { slots: MeetingSlot[] }) {
  if (slots.length === 0) {
    return (
      <td className="p-2 text-center text-xs text-muted-foreground border-r last:border-r-0">
        —
      </td>
    );
  }

  return (
    <td className="p-2 border-r last:border-r-0 align-top">
      <div className="space-y-1">
        {slots.map((s, i) => (
          <div key={i} className="text-xs">
            <span className={`font-medium ${s.closed ? "text-muted-foreground" : ""}`}>
              {s.time}
            </span>
            {s.closed && <span className="text-[10px] text-muted-foreground ml-1">(C)</span>}
            {s.tags.length > 0 && (
              <div className="flex flex-wrap gap-0.5 mt-0.5">
                {s.tags.map((t) => (
                  <MeetingBadge key={t} tag={t} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </td>
  );
}

function GroupCard({ group }: { group: AreaGroup }) {
  const totalMeetings = days.reduce((sum, day) => sum + group.schedule[day].length, 0);

  return (
    <Card
      className={`overflow-hidden ${group.isHomeGroup ? "ring-2 ring-primary border-primary bg-primary/5" : ""}`}
      data-testid={`area-group-${group.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              {group.name}
              {group.isHomeGroup && (
                <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                  Home Group
                </Badge>
              )}
              {group.handicapAccessible && (
                <Accessibility className="w-4 h-4 text-muted-foreground" />
              )}
            </CardTitle>
            <div className="flex items-start gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(group.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {group.address}
              </a>
            </div>
            {group.note && (
              <p className="text-xs text-muted-foreground mt-1 italic">{group.note}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 w-fit">
            {totalMeetings} meeting{totalMeetings !== 1 ? "s" : ""}/week
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm border-t">
            <thead>
              <tr className="bg-muted/50">
                {days.map((day) => (
                  <th key={day} className="p-2 text-xs font-medium text-center border-r last:border-r-0 whitespace-nowrap">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map((day) => (
                  <DayColumn key={day} slots={group.schedule[day]} />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AreaMeetings() {
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  const filteredGroups = areaGroups
    .filter((group) => {
      const matchesSearch =
        !search ||
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.address.toLowerCase().includes(search.toLowerCase());
      const matchesDay =
        !selectedDay || group.schedule[selectedDay].length > 0;
      return matchesSearch && matchesDay;
    })
    .sort((a, b) => (a.isHomeGroup ? -1 : b.isHomeGroup ? 1 : 0));

  const totalMeetings = filteredGroups.reduce(
    (sum, g) => sum + days.reduce((ds, day) => ds + g.schedule[day].length, 0), 0
  );

  return (
    <div>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
        <Badge variant="secondary" data-testid="badge-group-count">
          {filteredGroups.length} Groups
        </Badge>
        <Badge variant="secondary" data-testid="badge-meeting-count">
          {totalMeetings} Meetings/Week
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by group name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-area"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        <Button
          variant={selectedDay === null ? "default" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={() => setSelectedDay(null)}
          data-testid="button-filter-all-days"
        >
          All Days
        </Button>
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => setSelectedDay(day)}
            data-testid={`button-filter-${day.toLowerCase()}`}
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="mb-4 p-3 sm:p-4 bg-muted/50 rounded-md">
        <h3 className="text-sm font-medium mb-2">Meeting Legend</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span><strong>(C)</strong> = Closed (Addicts Only)</span>
          {Object.entries(tagLabels).map(([key, label]) => (
            <span key={key}><strong>{key}</strong> = {label}</span>
          ))}
          <span><Accessibility className="w-3 h-3 inline" /> = Handicap Accessible</span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <GroupCard key={group.name} group={group} />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Groups Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or day filter.
          </p>
        </Card>
      )}

      <section className="mt-8 p-4 sm:p-6 bg-muted/50 rounded-md">
        <h2 className="text-lg font-semibold mb-3">Fort Worth Area Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">NA Helpline</p>
              <p className="text-sm text-muted-foreground">888-629-6757 (888-NA-WORKS)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Spanish Helpline</p>
              <p className="text-sm text-muted-foreground">888-600-6229</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">FW Area Website</p>
              <a href="https://www.fwana.org" target="_blank" rel="noopener noreferrer" className="text-sm underline" data-testid="link-fwana">
                www.fwana.org
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Area Service Office</p>
              <p className="text-sm text-muted-foreground">6816 Camp Bowie Blvd. West, Ste 124, Fort Worth, TX 76116</p>
              <p className="text-xs text-muted-foreground mt-1">Mon & Thu 6-8 PM | 817-335-6360</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-[2.75rem] font-extrabold leading-tight text-[var(--md3-primary)] mb-2 tracking-tight">Find Connection.</h1>
        <p className="text-[var(--md3-outline)] text-lg">
          Find NA meetings at Another Chance and across the Fort Worth area.
        </p>
      </div>

      <Tabs defaultValue="our-meetings">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0" data-testid="meetings-tabs">
            <TabsTrigger value="our-meetings" data-testid="tab-our-meetings">
              <Clock className="w-4 h-4 mr-1" /> Our Meetings
            </TabsTrigger>
            <TabsTrigger value="area-meetings" data-testid="tab-area-meetings">
              <MapPin className="w-4 h-4 mr-1" /> Area Meetings
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="our-meetings">
          <OurMeetings />
        </TabsContent>
        <TabsContent value="area-meetings">
          <AreaMeetings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
