"use client";

import { useEffect, useState } from "react";
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
import { Users, UserCheck, UserX, Clock, Search, Trash2, Mail, Phone, Utensils } from "lucide-react";
import { CreateGuestDialog } from "@/components/dashboard/create-guest-dialog";
import { GuestItem, EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [gRes, eRes] = await Promise.all([
        fetch("/api/guests").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
      ]);

      if (gRes.success) setGuests(gRes.data || []);
      if (eRes.success) setEvents(eRes.data || []);
    } catch (err) {
      console.error("Failed to load guests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRsvp = async (guestId: string, newRsvp: string) => {
    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: guestId, rsvpStatus: newRsvp }),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: "RSVP Updated", description: `Guest RSVP changed to ${newRsvp}.` });
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, rsvpStatus: newRsvp as any } : g))
        );
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update RSVP status.", variant: "destructive" });
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Delete guest "${name}"?`)) return;
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast({ title: "Guest Removed", description: `"${name}" has been removed.` });
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete guest.", variant: "destructive" });
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = eventFilter === "all" || g.eventId === eventFilter;
    const matchesRsvp = rsvpFilter === "all" || g.rsvpStatus === rsvpFilter;
    return matchesSearch && matchesEvent && matchesRsvp;
  });

  const attendingCount = guests.filter((g) => g.rsvpStatus === "attending").length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === "pending").length;
  const declinedCount = guests.filter((g) => g.rsvpStatus === "declined").length;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Guest Management"
        text="Track guest list RSVPs, meal requirements, and table arrangements."
      >
        <CreateGuestDialog eventsList={events} onSuccess={loadData} />
      </DashboardHeader>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4 flex items-center justify-between border-primary/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Registered</p>
            <p className="text-2xl font-bold mt-1">{guests.length}</p>
          </div>
          <Users className="h-8 w-8 text-primary/60" />
        </Card>
        <Card className="p-4 flex items-center justify-between border-emerald-500/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Attending</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{attendingCount}</p>
          </div>
          <UserCheck className="h-8 w-8 text-emerald-500/60" />
        </Card>
        <Card className="p-4 flex items-center justify-between border-amber-500/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Pending Response</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <Clock className="h-8 w-8 text-amber-500/60" />
        </Card>
        <Card className="p-4 flex items-center justify-between border-destructive/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Declined</p>
            <p className="text-2xl font-bold text-destructive mt-1">{declinedCount}</p>
          </div>
          <UserX className="h-8 w-8 text-destructive/60" />
        </Card>
      </div>

      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by guest name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={rsvpFilter} onValueChange={setRsvpFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="RSVP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guest Table / List */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-lg">No Guests Found</p>
                <p className="text-sm text-muted-foreground mb-4">No guest records match your search.</p>
                <CreateGuestDialog eventsList={events} onSuccess={loadData} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
                    <tr>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Assigned Event</th>
                      <th className="py-3 px-4">Meal & Table</th>
                      <th className="py-3 px-4">RSVP Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredGuests.map((guest) => {
                      const evtName = events.find((e) => e.id === guest.eventId)?.title || "General";
                      return (
                        <tr key={guest.id} className="hover:bg-accent/5">
                          <td className="py-3.5 px-4 font-medium">
                            <div>{guest.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                              {guest.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{guest.email}</span>}
                              {guest.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{guest.phone}</span>}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">{evtName}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Utensils className="h-3 w-3 mr-1 text-primary" /> {guest.mealPreference}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{guest.tableNumber}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <Select
                              value={guest.rsvpStatus}
                              onValueChange={(val) => handleUpdateRsvp(guest.id, val)}
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="attending">Attending</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
