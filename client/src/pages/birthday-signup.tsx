import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Cake, PartyPopper, CalendarDays } from "lucide-react";
import { useState } from "react";
import type { BirthdaySignup } from "@shared/schema";

function getNextBirthdayNight(): Date {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  const getFirstFriday = (y: number, m: number) => {
    const d = new Date(y, m, 1);
    while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
    return d;
  };

  let firstFriday = getFirstFriday(year, month);
  if (firstFriday <= now) {
    month++;
    if (month > 11) { month = 0; year++; }
    firstFriday = getFirstFriday(year, month);
  }
  return firstFriday;
}

function getCleanTimeDisplay(cleanDateStr: string): string {
  const cleanDate = new Date(cleanDateStr);
  const now = new Date();
  const diffMs = now.getTime() - cleanDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (totalDays < 0) return "Future date";
  if (totalDays < 30) return `${totalDays} day${totalDays !== 1 ? "s" : ""}`;
  if (totalDays < 365) {
    const months = Math.floor(totalDays / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
  const years = Math.floor(totalDays / 365);
  const remainingMonths = Math.floor((totalDays % 365) / 30);
  if (remainingMonths === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
}

export default function BirthdaySignupPage() {
  const { toast } = useToast();
  const nextBirthday = getNextBirthdayNight();
  const celebrationMonth = `${nextBirthday.getFullYear()}-${String(nextBirthday.getMonth() + 1).padStart(2, "0")}`;

  const [name, setName] = useState("");
  const [cleanDate, setCleanDate] = useState("");

  const { data: signups, isLoading } = useQuery<BirthdaySignup[]>({
    queryKey: ["/api/birthday-signups"],
  });

  const currentMonthSignups = signups?.filter((s) => s.celebrationMonth === celebrationMonth) ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/birthday-signups", {
        name,
        cleanDate,
        celebrationMonth,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/birthday-signups"] });
      setName("");
      setCleanDate("");
      toast({ title: "You're signed up!", description: "We look forward to celebrating with you!" });
    },
    onError: () => toast({ title: "Error signing up", description: "Please try again.", variant: "destructive" }),
  });

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-birthday-heading">Birthday Night Sign-Up</h1>
        <p className="text-muted-foreground">
          Celebrating a recovery milestone? Sign up to be recognized at the next Birthday Night!
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-pink-100 dark:bg-pink-900/30">
              <Cake className="w-5 h-5 text-pink-600 dark:text-pink-300" />
            </div>
            <div>
              <CardTitle className="text-lg">Next Birthday Night</CardTitle>
              <p className="text-sm text-muted-foreground" data-testid="text-next-birthday-date">
                {nextBirthday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at 6:00 PM
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                data-testid="input-birthday-name"
              />
            </div>
            <div>
              <Label htmlFor="cleanDate">Clean Date</Label>
              <Input
                id="cleanDate"
                type="date"
                value={cleanDate}
                onChange={(e) => setCleanDate(e.target.value)}
                data-testid="input-clean-date"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your clean date so we can celebrate your milestone!
              </p>
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !name || !cleanDate}
              className="w-full"
              data-testid="button-submit-signup"
            >
              <PartyPopper className="w-4 h-4 mr-2" />
              {createMutation.isPending ? "Signing Up..." : "Sign Up to Celebrate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4" data-testid="text-celebrating-heading">
          Celebrating This Month ({currentMonthSignups.length})
        </h2>
        {isLoading && <Skeleton className="h-32" />}
        {currentMonthSignups.length === 0 && !isLoading && (
          <Card className="p-8 text-center">
            <Cake className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Sign-Ups Yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to sign up for this month's Birthday Night celebration!
            </p>
          </Card>
        )}
        <div className="space-y-2">
          {currentMonthSignups.map((signup) => (
            <Card key={signup.id} data-testid={`card-signup-${signup.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30">
                      <PartyPopper className="w-4 h-4 text-pink-600 dark:text-pink-300" />
                    </div>
                    <div>
                      <p className="font-medium text-sm" data-testid={`text-signup-name-${signup.id}`}>{signup.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Clean date: {new Date(signup.cleanDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs" data-testid={`badge-cleantime-${signup.id}`}>
                    {getCleanTimeDisplay(signup.cleanDate)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-12 p-6 bg-muted/50 rounded-md">
        <h2 className="text-xl font-semibold mb-3">About Birthday Night</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Birthday Night is held on the first Friday of every month at 6:00 PM. It's a special time when we come
          together to celebrate members' recovery milestones. Whether you're celebrating 30 days or 30 years,
          your clean time matters and we want to celebrate with you! Sign up above so we can prepare for your celebration.
        </p>
      </section>
    </div>
  );
}
