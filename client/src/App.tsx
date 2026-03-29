import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import MeetingsPage from "@/pages/meetings";
import LiteraturePage from "@/pages/literature";
import ServicePositionsPage from "@/pages/service-positions";
import GroupCalendarPage from "@/pages/group-calendar";
import BirthdaySignupPage from "@/pages/birthday-signup";
import DailyReadingsPage from "@/pages/daily-readings";
import NewsletterPage from "@/pages/newsletter";
import AdminPage from "@/pages/admin";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/meetings" component={MeetingsPage} />
      <Route path="/literature" component={LiteraturePage} />
      <Route path="/service-positions" component={ServicePositionsPage} />
      <Route path="/calendar" component={GroupCalendarPage} />
      <Route path="/birthday-signup" component={BirthdaySignupPage} />
      <Route path="/daily-readings" component={DailyReadingsPage} />
      <Route path="/newsletter" component={NewsletterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Meetings", href: "/meetings", icon: "location_on" },
  { label: "Library", href: "/literature", icon: "library_books" },
  { label: "Calendar", href: "/calendar", icon: "calendar_month" },
];

const drawerLinks = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Meetings", href: "/meetings", icon: "location_on" },
  { label: "Calendar", href: "/calendar", icon: "calendar_month" },
  { label: "Literature", href: "/literature", icon: "library_books" },
  { label: "Daily Readings", href: "/daily-readings", icon: "auto_stories" },
  { label: "Service Positions", href: "/service-positions", icon: "groups" },
  { label: "Birthday Sign-Up", href: "/birthday-signup", icon: "cake" },
  { label: "Newsletter", href: "/newsletter", icon: "mail" },
  { label: "Admin Dashboard", href: "/admin", icon: "settings" },
];

function TopHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 py-3 w-full h-16 bg-[var(--md3-surface)]/95 backdrop-blur-md border-b border-[var(--md3-outline-variant)]/20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--md3-surface-container-high)] transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[var(--md3-primary)]">menu</span>
        </button>
        <Link href="/">
          <h1 className="text-[var(--md3-primary)] font-extrabold tracking-tight text-lg sm:text-xl cursor-pointer">
            Another Chance Group of NA
          </h1>
        </Link>
      </div>
    </header>
  );
}

function DrawerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />
      <nav className="fixed top-0 left-0 bottom-0 w-72 bg-[var(--md3-surface-container-lowest)] z-[70] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div className="p-6 border-b border-[var(--md3-outline-variant)]/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--md3-primary)]">
              <span className="text-white font-bold text-lg">AC</span>
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-[var(--md3-primary)]">Another Chance</h2>
              <p className="text-xs text-[var(--md3-outline)] leading-tight">Group of NA</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {drawerLinks.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <div
                  className={`flex items-center gap-4 px-6 py-3.5 mx-3 rounded-2xl transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--md3-secondary-container)] text-[var(--md3-on-secondary-container)]"
                      : "text-[var(--md3-outline)] hover:bg-[var(--md3-surface-container-high)]"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="p-6 border-t border-[var(--md3-outline-variant)]/20">
          <p className="text-xs text-[var(--md3-outline)] text-center italic leading-relaxed">
            "We keep what we have only with vigilance."
          </p>
        </div>
      </nav>
    </>
  );
}

function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-white/80 dark:bg-[#191c1d]/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_20px_rgba(25,28,29,0.06)] md:hidden">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-90 duration-150 cursor-pointer ${
                isActive
                  ? "bg-[var(--md3-secondary-container)] text-[var(--md3-on-secondary-container)]"
                  : "text-[var(--md3-outline)] hover:bg-[var(--md3-surface-container-high)]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-[100dvh] w-full">
          <TopHeader onMenuToggle={() => setDrawerOpen(true)} />
          <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <main className="flex-1 pb-20 md:pb-0">
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
