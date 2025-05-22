import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EventList } from "@/components/dashboard/event-list";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";

export const metadata: Metadata = {
  title: "Dashboard | EventFlow",
  description: "Manage your events and tasks",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your events and tasks."
      />
      
      <div className="space-y-8">
        <StatsCards />
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
          <div className="col-span-1 md:col-span-6 lg:col-span-8">
            <EventList />
          </div>
          <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-8">
            <UpcomingTasks />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}