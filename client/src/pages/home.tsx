import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, CalendarDays, Mail, ArrowRight, Heart, Shield, HandHeart } from "lucide-react";

const quickLinks = [
  {
    title: "Meeting Schedule",
    description: "Find a meeting that works for you. We offer meetings throughout the week.",
    icon: Clock,
    href: "/meetings",
    label: "View Schedule",
  },
  {
    title: "NA Literature",
    description: "Access recovery literature, readings, and informational pamphlets.",
    icon: BookOpen,
    href: "/literature",
    label: "Browse Literature",
  },
  {
    title: "Service Positions",
    description: "Learn about trusted servant roles and how you can serve the group.",
    icon: Users,
    href: "/service-positions",
    label: "View Positions",
  },
  {
    title: "Calendar",
    description: "Stay connected with group activities, meetings, and celebrations.",
    icon: CalendarDays,
    href: "/calendar",
    label: "View Calendar",
  },
];

const principles = [
  {
    icon: Heart,
    title: "Hope",
    text: "No matter what, recovery is possible. We have found a way to live without using.",
  },
  {
    icon: Shield,
    title: "Freedom",
    text: "Through working the steps, we find freedom from active addiction, one day at a time.",
  },
  {
    icon: HandHeart,
    title: "Service",
    text: "We can only keep what we have by giving it away. Service strengthens our recovery.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full">
      <section className="relative bg-primary px-4 sm:px-6 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4" data-testid="badge-welcome">
            Welcome to Recovery
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Another Chance Group
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-2">
            Narcotics Anonymous
          </p>
          <p className="text-base text-primary-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            A fellowship of men and women for whom drugs had become a major problem. We are recovering addicts who meet regularly to help each other stay clean. The only requirement for membership is a desire to stop using.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/meetings">
              <Button variant="secondary" size="lg" data-testid="button-find-meeting">
                <Clock className="w-4 h-4 mr-2" />
                Find a Meeting
              </Button>
            </Link>
            <Link href="/newsletter">
              <Button variant="outline" size="lg" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20" data-testid="button-stay-connected">
                <Mail className="w-4 h-4 mr-2" />
                Stay Connected
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-8 md:py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {principles.map((principle) => (
            <div key={principle.title} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4">
                <principle.icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{principle.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{principle.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-${link.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted shrink-0">
                    <link.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
                  <span className="text-sm font-medium inline-flex items-center gap-1">
                    {link.label}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-8 md:py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Now?</h2>
          <p className="text-muted-foreground mb-6">
            If you or someone you know is struggling with addiction, you are not alone. Help is available 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">NA Helpline</p>
              <p className="font-bold text-lg" data-testid="text-helpline">1-818-773-9999</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">NA Website</p>
              <a
                href="https://www.na.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-lg underline"
                data-testid="link-na-website"
              >
                www.na.org
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
