import { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { Search } from "@/components/dashboard/search";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "Dashboard | EventFlow",
  description: "Dashboard for event planners",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg hidden md:block">EventFlow</span>
            <Search />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 px-6 py-8">
        <aside className="hidden md:block">
          <DashboardNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}