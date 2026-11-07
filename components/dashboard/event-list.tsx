"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarClock, Users, MoreHorizontal, Trash2, Eye, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CreateEventDialog } from "./create-event-dialog";
import { EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function EventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const result = await res.json();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
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
        toast({
          title: "Event Deleted",
          description: `"${title}" has been deleted.`,
        });
        fetchEvents();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const upcomingEvents = events.filter((e) => e.status !== "completed" && e.status !== "cancelled");
  const pastEvents = events.filter((e) => e.status === "completed" || e.status === "cancelled");

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">Events</CardTitle>
          <CardDescription>Manage your active and completed event portfolios.</CardDescription>
        </div>
        <CreateEventDialog onSuccess={fetchEvents} />
      </CardHeader>
      <CardContent className="pt-2">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past & Completed ({pastEvents.length})</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="font-medium text-muted-foreground">No upcoming events found.</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Click below to start planning a new event.</p>
                    <CreateEventDialog onSuccess={fetchEvents} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border bg-card hover:bg-accent/5 transition-all shadow-sm"
                      >
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base">{event.title}</h3>
                              <Badge variant="outline" className="text-xs capitalize bg-primary/5">
                                {event.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 gap-y-1 mt-1.5">
                              <div className="flex items-center">
                                <CalendarClock className="mr-1 h-3.5 w-3.5" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {event.location}
                              </div>
                              <div className="flex items-center">
                                <Users className="mr-1 h-3.5 w-3.5" />
                                {event.guestCapacity || 0} guests max
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                          <Badge variant="secondary" className="px-3 py-1 font-medium text-xs">
                            Active Planning
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/events/${event.id}`}>
                              <Eye className="h-4 w-4 mr-1.5" />
                              View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Event Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/guests?eventId=${event.id}`}>Manage Guests</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/tasks?eventId=${event.id}`}>View Tasks</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(event.id, event.title)}
                                className="text-destructive font-medium"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastEvents.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">No past or completed events.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border bg-card hover:bg-accent/5 transition-all opacity-85"
                      >
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{event.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground gap-4 mt-1">
                              <span className="flex items-center">
                                <CalendarClock className="mr-1 h-3.5 w-3.5" />
                                {formatDate(event.date)}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            Completed
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/events/${event.id}`}>View Archive</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}