import { Home, Clock, BookOpen, Users, CalendarDays, Mail, Settings, MapPin, CalendarHeart, Cake } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const publicItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Meetings", url: "/meetings", icon: Clock },
  { title: "Area Meetings", url: "/area-meetings", icon: MapPin },
  { title: "Literature", url: "/literature", icon: BookOpen },
  { title: "Service Positions", url: "/service-positions", icon: Users },
  { title: "Events", url: "/events", icon: CalendarDays },
  { title: "Group Calendar", url: "/group-calendar", icon: CalendarHeart },
  { title: "Birthday Sign-Up", url: "/birthday-signup", icon: Cake },
  { title: "Newsletter", url: "/newsletter", icon: Mail },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" data-testid="link-home-logo" onClick={handleNavClick}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
              <span className="text-primary-foreground font-bold text-lg">AC</span>
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Another Chance</h2>
              <p className="text-xs text-muted-foreground leading-tight">Group of NA</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.startsWith(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          "We keep what we have only with vigilance."
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
