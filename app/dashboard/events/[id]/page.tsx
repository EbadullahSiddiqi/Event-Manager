"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarClock,
  MapPin,
  Users,
  Building2,
  ClipboardList,
  FileText,
  DollarSign,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { EventItem, GuestItem, VendorItem, TaskItem, NoteItem } from "@/lib/db/store";
import { CreateGuestDialog } from "@/components/dashboard/create-guest-dialog";
import { CreateVendorDialog } from "@/components/dashboard/create-vendor-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { CreateNoteDialog } from "@/components/dashboard/create-note-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function SingleEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { toast } = useToast();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evtRes, gstRes, vndRes, tskRes, nteRes] = await Promise.all([
        fetch(`/api/events/${eventId}`).then((r) => r.json()),
        fetch(`/api/guests?eventId=${eventId}`).then((r) => r.json()),
        fetch(`/api/vendors?eventId=${eventId}`).then((r) => r.json()),
        fetch(`/api/tasks?eventId=${eventId}`).then((r) => r.json()),
        fetch(`/api/notes?eventId=${eventId}`).then((r) => r.json()),
      ]);

      if (evtRes.success) setEvent(evtRes.data);
      if (gstRes.success) setGuests(gstRes.data || []);
      if (vndRes.success) setVendors(vndRes.data || []);
      if (tskRes.success) setTasks(tskRes.data || []);
      if (nteRes.success) setNotes(nteRes.data || []);
    } catch (err) {
      console.error("Failed to load event details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) loadData();
  }, [eventId]);

  const handleToggleTask = async (task: TaskItem) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      if ((await res.json()).success) {
        toast({ title: "Task Updated" });
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </DashboardShell>
    );
  }

  if (!event) {
    return (
      <DashboardShell>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-2xl font-bold">Event Not Found</h2>
          <p className="text-muted-foreground">The requested event could not be retrieved.</p>
          <Button onClick={() => router.push("/dashboard/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </DashboardShell>
    );
  }

  const attendingGuests = guests.filter((g) => g.rsvpStatus === "attending").length;
  const totalVendorCost = vendors.reduce((sum, v) => sum + (v.cost || 0), 0);
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <DashboardShell>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <Badge variant="outline" className="text-xs capitalize bg-primary/10 text-primary border-primary/20">
                {event.status}
              </Badge>
              <Badge variant="secondary">{event.type}</Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">{event.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/client-portal?eventId=${event.id}`}>Client Portal Preview</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Date & Time</span>
            <span className="font-semibold flex items-center mt-1">
              <CalendarClock className="h-4 w-4 mr-1.5 text-primary" />
              {event.date} {event.time}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Location</span>
            <span className="font-semibold flex items-center mt-1 truncate">
              <MapPin className="h-4 w-4 mr-1.5 text-primary shrink-0" />
              {event.location}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Budget Committed</span>
            <span className="font-semibold flex items-center mt-1 text-emerald-600">
              <DollarSign className="h-4 w-4" />
              {totalVendorCost.toLocaleString()} / ${event.budget.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Attending Guests</span>
            <span className="font-semibold flex items-center mt-1">
              <Users className="h-4 w-4 mr-1.5 text-primary" />
              {attendingGuests} / {event.guestCapacity} confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="overview">Overview & Timeline</TabsTrigger>
          <TabsTrigger value="guests">Guests ({guests.length})</TabsTrigger>
          <TabsTrigger value="vendors">Vendors ({vendors.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes & Docs ({notes.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Planning Timeline & Milestones</CardTitle>
                <CardDescription>Key milestone sequence for event execution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/30 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    <h4 className="font-semibold text-base">Venue & Initial Deposits</h4>
                    <p className="text-sm text-muted-foreground">Contract signed at {event.location}. Deposit cleared.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    <h4 className="font-semibold text-base">Vendor Contracts & Tastings</h4>
                    <p className="text-sm text-muted-foreground">{vendors.length} vendors attached. Catering menu tasting scheduled.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-muted-foreground/40 ring-4 ring-background" />
                    <h4 className="font-semibold text-base">Guest Invitations & RSVPs</h4>
                    <p className="text-sm text-muted-foreground">{attendingGuests} attending so far out of {event.guestCapacity} target.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-muted-foreground/40 ring-4 ring-background" />
                    <h4 className="font-semibold text-base">Main Event Execution</h4>
                    <p className="text-sm text-muted-foreground">{event.date} @ {event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>Tasks Completion</span>
                      <span>{taskProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${taskProgress}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 text-xs space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Tasks:</span>
                      <span className="font-medium text-foreground">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Tasks:</span>
                      <span className="font-medium text-emerald-600">{completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contracted Vendors:</span>
                      <span className="font-medium text-foreground">{vendors.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Guests Tab */}
        <TabsContent value="guests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Guest List</h3>
            <CreateGuestDialog
              eventsList={[event]}
              defaultEventId={event.id}
              onSuccess={loadData}
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              {guests.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground text-sm">No guests added to this event yet.</p>
              ) : (
                <div className="divide-y text-sm">
                  {guests.map((g) => (
                    <div key={g.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.email || "No email"} • {g.phone || "No phone"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{g.mealPreference}</Badge>
                        <Badge
                          className={
                            g.rsvpStatus === "attending"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : g.rsvpStatus === "declined"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-amber-500/10 text-amber-600"
                          }
                        >
                          {g.rsvpStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Contracted Vendors</h3>
            <CreateVendorDialog
              eventsList={[event]}
              defaultEventId={event.id}
              onSuccess={loadData}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {vendors.length === 0 ? (
              <p className="col-span-2 text-center py-8 text-muted-foreground text-sm">No vendors added yet.</p>
            ) : (
              vendors.map((v) => (
                <Card key={v.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="secondary">{v.category}</Badge>
                      <Badge variant="outline" className="capitalize">{v.status}</Badge>
                    </div>
                    <CardTitle className="text-lg">{v.name}</CardTitle>
                    <CardDescription>{v.contactPerson || "Contact Person N/A"}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="text-xs text-muted-foreground">{v.email} {v.phone ? `• ${v.phone}` : ""}</p>
                    <p className="font-semibold text-emerald-600 pt-1">${v.cost?.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Event Tasks</h3>
            <CreateTaskDialog
              eventsList={[event]}
              defaultEventId={event.id}
              onSuccess={loadData}
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              {tasks.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground text-sm">No tasks created for this event yet.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={t.status === "completed"}
                          onChange={() => handleToggleTask(t)}
                          className="h-4 w-4 rounded accent-primary cursor-pointer"
                        />
                        <div>
                          <p className={`font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
                          <p className="text-xs text-muted-foreground">Assigned to: {t.assignedTo || "Unassigned"}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{t.priority} priority</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notes & Attachments</h3>
            <CreateNoteDialog
              eventsList={[event]}
              defaultEventId={event.id}
              onSuccess={loadData}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {notes.length === 0 ? (
              <p className="col-span-2 text-center py-8 text-muted-foreground text-sm">No notes attached.</p>
            ) : (
              notes.map((n) => (
                <Card key={n.id}>
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit mb-1">{n.category}</Badge>
                    <CardTitle className="text-lg">{n.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">{n.content}</p>
                    {n.fileUrl && (
                      <a href={n.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-2 block flex items-center">
                        View Attached Document <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
