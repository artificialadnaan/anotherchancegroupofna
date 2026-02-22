import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Newsletter</h1>
        <p className="text-muted-foreground">
          Stay connected with Another Chance Group. Subscribe to receive updates about meetings, events, and service opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {subscribed ? (
            <Card className="text-center p-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold mb-2">You're Subscribed</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for subscribing to the Another Chance Group newsletter. You'll receive updates about meetings, events, and more.
              </p>
              <Button
                variant="outline"
                onClick={() => setSubscribed(false)}
                data-testid="button-subscribe-another"
              >
                Subscribe Another Email
              </Button>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Subscribe to Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={subscribeMutation.isPending || !email.trim()}
                    data-testid="button-subscribe"
                  >
                    {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Your email will only be used for group updates. You can unsubscribe at any time.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">What You'll Receive</h2>
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
                <benefit.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
