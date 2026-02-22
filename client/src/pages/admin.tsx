import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Clock,
  CalendarDays,
  BookOpen,
  Mail,
  Plus,
  Send,
  Users,
  Trash2,
  LogIn,
  LogOut,
  Lock,
} from "lucide-react";
import type { Meeting, Event, Literature, Newsletter, NewsletterSubscriber } from "@shared/schema";

function AdminMeetings() {
  const { data: meetings, isLoading } = useQuery<Meeting[]>({ queryKey: ["/api/meetings"] });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dayOfWeek: "Monday",
    startTime: "7:00 PM",
    endTime: "8:00 PM",
    meetingType: "Open",
    format: "",
    location: "Another Chance Group",
    description: "",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meetings", { ...form, isActive: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      setOpen(false);
      setForm({ name: "", dayOfWeek: "Monday", startTime: "7:00 PM", endTime: "8:00 PM", meetingType: "Open", format: "", location: "Another Chance Group", description: "" });
      toast({ title: "Meeting created" });
    },
    onError: () => toast({ title: "Error creating meeting", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/meetings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      toast({ title: "Meeting removed" });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold">Meetings ({meetings?.length ?? 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-add-meeting">
              <Plus className="w-4 h-4 mr-1" /> Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Meeting Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-meeting-name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Day</Label>
                  <Select value={form.dayOfWeek} onValueChange={(v) => setForm({ ...form, dayOfWeek: v })}>
                    <SelectTrigger data-testid="select-day"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.meetingType} onValueChange={(v) => setForm({ ...form, meetingType: v })}>
                    <SelectTrigger data-testid="select-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Speaker">Speaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Time</Label>
                  <Input value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} data-testid="input-start-time" />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} data-testid="input-end-time" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="input-location" />
              </div>
              <div>
                <Label>Format (optional)</Label>
                <Input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} placeholder="e.g., Step Study, Topic Discussion" data-testid="input-format" />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-description" />
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name} className="w-full" data-testid="button-submit-meeting">
                {createMutation.isPending ? "Creating..." : "Create Meeting"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Skeleton className="h-32" />}
      <div className="space-y-2">
        {meetings?.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-2 p-3 border rounded-md" data-testid={`admin-meeting-${m.id}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.dayOfWeek} {m.startTime} - {m.endTime} | {m.meetingType}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(m.id)} data-testid={`button-delete-meeting-${m.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEvents() {
  const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    endTime: "",
    location: "Another Chance Group",
    eventType: "workshop",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/events", { ...form, isActive: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setOpen(false);
      setForm({ title: "", description: "", eventDate: "", eventTime: "", endTime: "", location: "Another Chance Group", eventType: "workshop" });
      toast({ title: "Event created" });
    },
    onError: () => toast({ title: "Error creating event", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event removed" });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold">Events ({events?.length ?? 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-add-event">
              <Plus className="w-4 h-4 mr-1" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-event-title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-event-description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} data-testid="input-event-date" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                    <SelectTrigger data-testid="select-event-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                      <SelectItem value="fundraiser">Fundraiser</SelectItem>
                      <SelectItem value="area">Area Event</SelectItem>
                      <SelectItem value="service">Service Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Time</Label>
                  <Input value={form.eventTime} onChange={(e) => setForm({ ...form, eventTime: e.target.value })} placeholder="6:00 PM" data-testid="input-event-time" />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} placeholder="9:00 PM" data-testid="input-event-end-time" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="input-event-location" />
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.eventDate || !form.description} className="w-full" data-testid="button-submit-event">
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Skeleton className="h-32" />}
      <div className="space-y-2">
        {events?.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-2 p-3 border rounded-md" data-testid={`admin-event-${e.id}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e.eventDate} | {e.eventType}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(e.id)} data-testid={`button-delete-event-${e.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLiterature() {
  const { data: items, isLoading } = useQuery<Literature[]>({ queryKey: ["/api/literature"] });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Books",
    externalUrl: "",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/literature", { ...form, externalUrl: form.externalUrl || null, isActive: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/literature"] });
      setOpen(false);
      setForm({ title: "", description: "", category: "Books", externalUrl: "" });
      toast({ title: "Literature added" });
    },
    onError: () => toast({ title: "Error adding literature", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/literature/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/literature"] });
      toast({ title: "Literature removed" });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold">Literature ({items?.length ?? 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-add-literature">
              <Plus className="w-4 h-4 mr-1" /> Add Literature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Literature</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-lit-title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-lit-description" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger data-testid="select-lit-category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Informational Pamphlets">Informational Pamphlets</SelectItem>
                    <SelectItem value="Booklets">Booklets</SelectItem>
                    <SelectItem value="Key Tags & Medallions">Key Tags & Medallions</SelectItem>
                    <SelectItem value="Service Material">Service Material</SelectItem>
                    <SelectItem value="Daily Readings">Daily Readings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>External URL (optional)</Label>
                <Input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://..." data-testid="input-lit-url" />
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.description} className="w-full" data-testid="button-submit-literature">
                {createMutation.isPending ? "Adding..." : "Add Literature"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Skeleton className="h-32" />}
      <div className="space-y-2">
        {items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 p-3 border rounded-md" data-testid={`admin-literature-${item.id}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-literature-${item.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminNewsletter() {
  const { data: subscribers, isLoading: subLoading } = useQuery<NewsletterSubscriber[]>({ queryKey: ["/api/newsletter/subscribers"] });
  const { data: newsletters, isLoading: nlLoading } = useQuery<Newsletter[]>({ queryKey: ["/api/newsletters"] });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", content: "" });

  const sendMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/newsletters/send", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletters"] });
      setOpen(false);
      setForm({ subject: "", content: "" });
      toast({ title: "Newsletter sent successfully" });
    },
    onError: () => toast({ title: "Error sending newsletter", variant: "destructive" }),
  });

  const activeSubscribers = subscribers?.filter((s) => s.isActive).length ?? 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-subscriber-count">{activeSubscribers}</p>
                <p className="text-xs text-muted-foreground">Active Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-newsletter-count">{newsletters?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Newsletters Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold">Compose Newsletter</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-compose-newsletter">
              <Send className="w-4 h-4 mr-1" /> Compose & Send
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Newsletter</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This will be sent to {activeSubscribers} active subscriber{activeSubscribers !== 1 ? "s" : ""}.
              </p>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Newsletter subject line" data-testid="input-newsletter-subject" />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your newsletter content here..."
                  className="min-h-[200px]"
                  data-testid="input-newsletter-content"
                />
              </div>
              <Button onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending || !form.subject || !form.content} className="w-full" data-testid="button-send-newsletter">
                {sendMutation.isPending ? "Sending..." : `Send to ${activeSubscribers} Subscribers`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Subscribers</h3>
          {subLoading && <Skeleton className="h-20" />}
          <div className="space-y-1">
            {subscribers?.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between gap-2 p-2 border rounded-md text-sm" data-testid={`admin-subscriber-${sub.id}`}>
                <div className="min-w-0">
                  <span className="font-medium">{sub.email}</span>
                  {sub.name && <span className="text-muted-foreground ml-2">({sub.name})</span>}
                </div>
                <Badge variant={sub.isActive ? "default" : "secondary"}>
                  {sub.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Sent Newsletters</h3>
          {nlLoading && <Skeleton className="h-20" />}
          <div className="space-y-1">
            {newsletters?.map((nl) => (
              <div key={nl.id} className="p-2 border rounded-md text-sm" data-testid={`admin-newsletter-${nl.id}`}>
                <p className="font-medium">{nl.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {nl.sentAt ? new Date(nl.sentAt).toLocaleDateString() : "Draft"} | {nl.recipientCount} recipients | {nl.status}
                </p>
              </div>
            ))}
            {!nlLoading && newsletters?.length === 0 && (
              <p className="text-sm text-muted-foreground">No newsletters sent yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/login", { username, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      onSuccess();
    },
    onError: () => setError("Invalid username or password"),
  });

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              loginMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-admin-username"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-admin-password"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || !username || !password}
              data-testid="button-admin-login"
            >
              {loginMutation.isPending ? "Signing in..." : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const { data: auth, isLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/me"],
  });
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      toast({ title: "Logged out" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!auth?.isAdmin) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <AdminLogin onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] })} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage meetings, events, literature, and newsletter communications.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} data-testid="button-admin-logout">
          <LogOut className="w-4 h-4 mr-1" /> Log Out
        </Button>
      </div>

      <Tabs defaultValue="meetings">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0" data-testid="admin-tabs">
            <TabsTrigger value="meetings" data-testid="tab-meetings">
              <Clock className="w-4 h-4 mr-1" /> Meetings
            </TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">
              <CalendarDays className="w-4 h-4 mr-1" /> Events
            </TabsTrigger>
            <TabsTrigger value="literature" data-testid="tab-literature">
              <BookOpen className="w-4 h-4 mr-1" /> Literature
            </TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">
              <Mail className="w-4 h-4 mr-1" /> Newsletter
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="meetings">
          <AdminMeetings />
        </TabsContent>
        <TabsContent value="events">
          <AdminEvents />
        </TabsContent>
        <TabsContent value="literature">
          <AdminLiterature />
        </TabsContent>
        <TabsContent value="newsletter">
          <AdminNewsletter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
