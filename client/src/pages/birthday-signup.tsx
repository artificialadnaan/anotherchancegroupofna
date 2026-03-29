import { useQuery, useMutation } from "@tanstack/react-query";
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

function getFirstFriday(year: number, month: number): Date {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return d;
}

function getNextBirthdayNight(): Date {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  let firstFriday = getFirstFriday(year, month);
  if (firstFriday <= now) {
    month++;
    if (month > 11) { month = 0; year++; }
    firstFriday = getFirstFriday(year, month);
  }
  return firstFriday;
}

function getCelebrationMonthForBirthdayNight(birthdayNight: Date): string {
  let m = birthdayNight.getMonth() - 1;
  let y = birthdayNight.getFullYear();
  if (m < 0) { m = 11; y--; }
  return `${y}-${String(m + 1).padStart(2, "0")}`;
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
  const celebrationMonth = getCelebrationMonthForBirthdayNight(nextBirthday);

  const celebrationMonthLabel = new Date(
    parseInt(celebrationMonth.split("-")[0]),
    parseInt(celebrationMonth.split("-")[1]) - 1
  ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--md3-primary)]" data-testid="text-birthday-heading">
          Birthday Night Sign-Up
        </h1>
        <p className="text-[var(--md3-outline)]">
          Celebrating a recovery milestone? Sign up to be recognized at the next Birthday Night!
        </p>
      </div>

      <div className="bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--md3-secondary-container)]">
            <Cake className="w-5 h-5 text-[var(--md3-on-secondary-container)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--md3-primary)]">Next Birthday Night</h2>
            <p className="text-sm text-[var(--md3-outline)]" data-testid="text-next-birthday-date">
              {nextBirthday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at 6:00 PM
            </p>
          </div>
        </div>

        <div className="bg-[var(--md3-secondary-container)]/30 rounded-2xl p-3 mb-5 text-sm text-[var(--md3-outline)]">
          <p>
            This Birthday Night celebrates members whose clean time milestone falls in <strong className="text-[var(--md3-primary)]">{celebrationMonthLabel}</strong>. If your clean date anniversary is in {celebrationMonthLabel}, sign up below!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[var(--md3-primary)] font-medium">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              data-testid="input-birthday-name"
              className="mt-1 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="cleanDate" className="text-[var(--md3-primary)] font-medium">Clean Date</Label>
            <Input
              id="cleanDate"
              type="date"
              value={cleanDate}
              onChange={(e) => setCleanDate(e.target.value)}
              data-testid="input-clean-date"
              className="mt-1 rounded-xl"
            />
            <p className="text-xs text-[var(--md3-outline)] mt-1">
              Enter your clean date so we can celebrate your milestone!
            </p>
          </div>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !name || !cleanDate}
            className="w-full bg-[var(--md3-primary)] text-white rounded-xl"
            data-testid="button-submit-signup"
          >
            <PartyPopper className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Signing Up..." : "Sign Up to Celebrate"}
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-[var(--md3-primary)]" data-testid="text-celebrating-heading">
          Celebrating {celebrationMonthLabel} Milestones ({currentMonthSignups.length})
        </h2>
        {isLoading && <Skeleton className="h-32 rounded-2xl" />}
        {currentMonthSignups.length === 0 && !isLoading && (
          <div className="p-10 text-center bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10">
            <Cake className="w-12 h-12 mx-auto mb-4 text-[var(--md3-outline)]" />
            <h3 className="font-semibold mb-2 text-[var(--md3-primary)]">No Sign-Ups Yet</h3>
            <p className="text-sm text-[var(--md3-outline)]">
              Be the first to sign up for this Birthday Night celebration!
            </p>
          </div>
        )}
        <div className="space-y-2">
          {currentMonthSignups.map((signup) => (
            <div
              key={signup.id}
              data-testid={`card-signup-${signup.id}`}
              className="bg-[var(--md3-surface-container-lowest)] rounded-2xl border border-[var(--md3-outline-variant)]/10 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--md3-secondary-container)]">
                    <PartyPopper className="w-4 h-4 text-[var(--md3-on-secondary-container)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[var(--md3-primary)]" data-testid={`text-signup-name-${signup.id}`}>{signup.name}</p>
                    <p className="text-xs text-[var(--md3-outline)]">
                      Clean date: {new Date(signup.cleanDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs rounded-xl" data-testid={`badge-cleantime-${signup.id}`}>
                  {getCleanTimeDisplay(signup.cleanDate)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-12 p-6 bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10">
        <h2 className="text-xl font-semibold mb-3 text-[var(--md3-primary)]">About Birthday Night</h2>
        <p className="text-sm text-[var(--md3-outline)] leading-relaxed">
          Birthday Night is held on the first Friday of every month at 6:00 PM. Members who celebrated a clean time
          milestone during the previous month are recognized and celebrated. For example, if your clean date anniversary
          falls in February, you would celebrate at the first Friday of March Birthday Night. Sign up above so we can
          prepare for your celebration!
        </p>
      </section>
    </div>
  );
}
