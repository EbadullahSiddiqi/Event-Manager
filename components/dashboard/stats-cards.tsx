"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Building2, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const [stats, setStats] = useState({
    eventsCount: 0,
    guestsCount: 0,
    vendorsCount: 0,
    pendingTasksCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [evtRes, gstRes, vndRes, tskRes] = await Promise.all([
          fetch("/api/events").then((r) => r.json()),
          fetch("/api/guests").then((r) => r.json()),
          fetch("/api/vendors").then((r) => r.json()),
          fetch("/api/tasks").then((r) => r.json()),
        ]);

        const events = evtRes.data || [];
        const guests = gstRes.data || [];
        const vendors = vndRes.data || [];
        const tasks = tskRes.data || [];

        const pendingTasks = tasks.filter((t: any) => t.status !== "completed").length;

        setStats({
          eventsCount: events.length,
          guestsCount: guests.length,
          vendorsCount: vendors.length,
          pendingTasksCount: pendingTasks,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.eventsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Active & upcoming projects</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-emerald-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Guest Registrations</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.guestsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Managed guest RSVPs</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contracted Vendors</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.vendorsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Catering, AV, Floral & photography</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-amber-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <ClipboardList className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.pendingTasksCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Action items awaiting completion</p>
        </CardContent>
      </Card>
    </div>
  );
}