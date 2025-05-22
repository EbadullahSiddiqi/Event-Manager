"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarDays, 
  Home, 
  Users, 
  Building2, 
  ClipboardList, 
  FileText, 
  Settings, 
  PanelLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: <CalendarDays className="h-4 w-4 mr-2" />,
  },
  {
    title: "Guests",
    href: "/dashboard/guests",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    title: "Vendors",
    href: "/dashboard/vendors",
    icon: <Building2 className="h-4 w-4 mr-2" />,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: <ClipboardList className="h-4 w-4 mr-2" />,
  },
  {
    title: "Notes & Docs",
    href: "/dashboard/notes",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    title: "Client Portal",
    href: "/dashboard/client-portal",
    icon: <PanelLeft className="h-4 w-4 mr-2" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 text-sm">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : "hover:bg-transparent hover:text-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  );
}