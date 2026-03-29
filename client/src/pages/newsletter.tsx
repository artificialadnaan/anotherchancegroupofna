import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle2, Bell, CalendarDays, Users } from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/newsletter/subscribe", { email, name: name || undefined });
      return res.json();
    },
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      setName("");
      toast({
        title: "Subscribed",
        description: "You've been successfully subscribed to our newsletter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message.includes("409")
          ? "This email is already subscribed."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate();
  };

  const benefits = [
    {
      icon: Bell,
      title: "Meeting Updates",
      description: "Get notified about schedule changes, new meetings, and special announcements.",
    },
    {
      icon: CalendarDays,
      title: "Event Announcements",
      description: "Be the first to know about upcoming events, workshops, and celebrations.",
    },
    {
      icon: Users,
      title: "Service Opportunities",
      description: "Learn about open service positions and ways to get involved in the group.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--md3-primary)]">Newsletter</h1>
        <p className="text-[var(--md3-outline)]">
          Stay connected with Another Chance Group. Subscribe to receive updates about meetings, events, and service opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {subscribed ? (
            <div className="text-center p-10 bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold mb-2 text-[var(--md3-primary)]">You're Subscribed</h2>
              <p className="text-[var(--md3-outline)] mb-6">
                Thank you for subscribing to the Another Chance Group newsletter. You'll receive updates about meetings, events, and more.
              </p>
              <button
                onClick={() => setSubscribed(false)}
                data-testid="button-subscribe-another"
                className="bg-[var(--md3-secondary-container)] text-[var(--md3-on-secondary-container)] rounded-xl px-5 py-2.5 text-sm font-medium"
              >
                Subscribe Another Email
              </button>
            </div>
          ) : (
            <div className="bg-[var(--md3-surface-container-lowest)] rounded-3xl border border-[var(--md3-outline-variant)]/10 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--md3-primary)] mb-5">
                <Mail className="w-5 h-5" />
                Subscribe to Updates
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[var(--md3-primary)] font-medium">Name (optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-name"
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[var(--md3-primary)] font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                    className="mt-1 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[var(--md3-primary)] text-white rounded-xl"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  data-testid="button-subscribe"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
                <p className="text-xs text-[var(--md3-outline)] text-center">
                  Your email will only be used for group updates. You can unsubscribe at any time.
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg text-[var(--md3-primary)]">What You'll Receive</h2>
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--md3-surface-container-lowest)] border border-[var(--md3-outline-variant)]/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--md3-secondary-container)] shrink-0">
                <benefit.icon className="w-4 h-4 text-[var(--md3-on-secondary-container)]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--md3-primary)]">{benefit.title}</h3>
                <p className="text-xs text-[var(--md3-outline)] mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
