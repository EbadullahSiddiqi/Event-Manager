"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CalendarClock, MapPin, Users, DollarSign, Search, Trash2, Eye, Plus } from "lucide-react";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import { EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const result = await res.json();
      if (result.success) {
        setEvents(result.data || []);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Event Deleted", description: `"${title}" has been removed.` });
        fetchEvents();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" });
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Events Portfolio"
        text="Plan, track, and manage all your upcoming and past events."
      >
        <CreateEventDialog onSuccess={fetchEvents} />
      </DashboardHeader>

      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search event title or venue..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                <SelectItem value="Birthday">Birthday</SelectItem>
                <SelectItem value="Gala">Gala</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-16 border-dashed">
            <CardContent className="space-y-4">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">No Events Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  No events match your filter criteria or you haven't created any yet.
                </p>
              </div>
              <CreateEventDialog onSuccess={fetchEvents} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <Card
                key={evt.id}
                className="flex flex-col justify-between hover:shadow-lg transition-all border-muted/80 overflow-hidden"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge
                        variant={evt.status === "completed" ? "outline" : "default"}
                        className={
                          evt.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : ""
                        }
                      >
                        {evt.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {evt.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{evt.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {evt.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2.5 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarClock className="mr-2 h-4 w-4 text-primary shrink-0" />
                      <span>{evt.date} {evt.time ? `@ ${evt.time}` : ""}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground pt-2 border-t">
                      <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        <span>{evt.guestCapacity} Capacity</span>
                      </div>
                      <div className="flex items-center font-medium text-foreground">
                        <DollarSign className="mr-0.5 h-4 w-4 text-emerald-600" />
                        <span>{evt.budget ? evt.budget.toLocaleString() : "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/events/${evt.id}`}>
                      <Eye className="mr-1.5 h-4 w-4" /> Open Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(evt.id, evt.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
