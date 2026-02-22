import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import MeetingsPage from "@/pages/meetings";
import LiteraturePage from "@/pages/literature";
import ServicePositionsPage from "@/pages/service-positions";
import EventsPage from "@/pages/events";
import NewsletterPage from "@/pages/newsletter";
import AdminPage from "@/pages/admin";
import AreaMeetingsPage from "@/pages/area-meetings";
import GroupCalendarPage from "@/pages/group-calendar";
import BirthdaySignupPage from "@/pages/birthday-signup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/meetings" component={MeetingsPage} />
      <Route path="/area-meetings" component={AreaMeetingsPage} />
      <Route path="/literature" component={LiteraturePage} />
      <Route path="/service-positions" component={ServicePositionsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/group-calendar" component={GroupCalendarPage} />
      <Route path="/birthday-signup" component={BirthdaySignupPage} />
      <Route path="/newsletter" component={NewsletterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

const sidebarStyle = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <header className="flex items-center gap-2 p-2 border-b sticky top-0 z-50 bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <span className="text-sm font-medium text-muted-foreground">Another Chance Group of NA</span>
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
