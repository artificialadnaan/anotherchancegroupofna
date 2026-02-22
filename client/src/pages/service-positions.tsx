import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Clock, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { ServicePosition } from "@shared/schema";

function PositionCard({ position }: { position: ServicePosition }) {
  return (
    <AccordionItem value={`position-${position.id}`} className="border rounded-md px-4 mb-3">
      <AccordionTrigger className="py-3" data-testid={`accordion-position-${position.id}`}>
        <div className="flex items-center gap-3 text-left flex-1 mr-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{position.title}</span>
              {position.isFilled ? (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Filled
                </Badge>
              ) : (
                <Badge className="text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Open
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {position.cleanTimeRequirement} clean time
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {position.commitmentLength}
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pb-3 space-y-4">
          {position.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{position.description}</p>
          )}
          <div>
            <h4 className="text-sm font-medium mb-2">Requirements</h4>
            <ul className="space-y-1">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Must claim Another Chance as home group
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Must be actively working the 12 Steps and learning the 12 Traditions and 12 Concepts
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Must have the willingness, time, and resources to fulfill the commitment
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Must attend the entire Group Conscience Meeting (GCM) each month
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Minimum clean time: {position.cleanTimeRequirement}
              </li>
            </ul>
          </div>
          {position.responsibilities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
              <ul className="space-y-1">
                {position.responsibilities.map((resp, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {position.additionalNotes && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">{position.additionalNotes}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PositionsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}

export default function ServicePositionsPage() {
  const { data: positions, isLoading, error } = useQuery<ServicePosition[]>({
    queryKey: ["/api/service-positions"],
  });

  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(null);

  const committees = positions
    ? Array.from(new Set(positions.map((p) => p.committee))).sort()
    : [];

  const filteredPositions = selectedCommittee
    ? positions?.filter((p) => p.committee === selectedCommittee)
    : positions;

  const openCount = positions?.filter((p) => !p.isFilled).length ?? 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Service Positions</h1>
        <p className="text-muted-foreground mb-4">
          Service is a fundamental part of recovery in Narcotics Anonymous. Trusted servants fulfill essential roles that keep our group running. Explore available positions and learn about the requirements for each.
        </p>
        {!isLoading && positions && (
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" data-testid="badge-total-positions">
              {positions.length} Total Positions
            </Badge>
            <Badge data-testid="badge-open-positions">
              {openCount} Open Position{openCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </div>

      <section className="mb-8 p-4 bg-muted/50 rounded-md">
        <h2 className="font-semibold mb-2">General Requirements (All Positions)</h2>
        <ul className="space-y-1">
          {[
            "Must claim Another Chance as home group",
            "Must be actively working the 12 Steps and learning the 12 Traditions and 12 Concepts",
            "Must have the willingness, time, and resources to fulfill the commitment",
            "Must attend the entire Group Conscience Meeting (GCM) each month and answer to both roll calls",
            "Must resign from other elected trusted servant positions if elected",
            "Must actively participate in regularly scheduled meetings each week",
          ].map((req, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/70" />
              {req}
            </li>
          ))}
        </ul>
      </section>

      {!isLoading && committees.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
          <Button
            variant={selectedCommittee === null ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => setSelectedCommittee(null)}
            data-testid="button-filter-all-committees"
          >
            All Committees
          </Button>
          {committees.map((committee) => (
            <Button
              key={committee}
              variant={selectedCommittee === committee ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedCommittee(committee)}
              data-testid={`button-filter-${committee.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {committee}
            </Button>
          ))}
        </div>
      )}

      {isLoading && <PositionsSkeleton />}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load service positions. Please try again later.</p>
        </Card>
      )}

      {filteredPositions && filteredPositions.length > 0 && (
        <Accordion type="multiple" className="space-y-0">
          {filteredPositions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </Accordion>
      )}

      {!isLoading && !error && filteredPositions?.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Positions Found</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCommittee
              ? `No positions in the "${selectedCommittee}" committee.`
              : "Service positions are being updated. Check back soon."}
          </p>
        </Card>
      )}
    </div>
  );
}
