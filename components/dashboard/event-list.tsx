"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, CalendarClock, Users, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock data
const upcomingEvents = [
  {
    id: "1",
    title: "Johnson Wedding",
    date: "2025-07-15",
    location: "Grand Hotel, New York",
    status: "active",
    guests: 175,
    progress: 65,
  },
  {
    id: "2",
    title: "TechCorp Annual Conference",
    date: "2025-05-10",
    location: "Convention Center, San Francisco",
    status: "active",
    guests: 450,
    progress: 40,
  },
  {
    id: "3",
    title: "Smith 50th Birthday",
    date: "2025-04-22",
    location: "Riverside Gardens, Chicago",
    status: "active",
    guests: 85,
    progress: 80,
  },
];

const pastEvents = [
  {
    id: "4",
    title: "Garcia Wedding",
    date: "2025-02-28",
    location: "Beachside Resort, Miami",
    status: "completed",
    guests: 120,
    progress: 100,
  },
  {
    id: "5",
    title: "Wilson Charity Gala",
    date: "2025-01-15",
    location: "Art Museum, Boston",
    status: "completed",
    guests: 200,
    progress: 100,
  },
];

export function EventList() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage your upcoming and past events.</CardDescription>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start space-x-6 mb-4 md:mb-0">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2 sm:gap-4">
                        <div className="flex items-center">
                          <CalendarClock className="mr-1.5 h-4 w-4" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1.5 h-4 w-4" />
                          {event.guests} guests
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        {event.progress}% Complete
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        View
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit event</DropdownMenuItem>
                        <DropdownMenuItem>View timeline</DropdownMenuItem>
                        <DropdownMenuItem>Manage guests</DropdownMenuItem>
                        <DropdownMenuItem>Export details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Cancel event</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="space-y-6">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start space-x-6 mb-4 md:mb-0">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2 sm:gap-4">
                        <div className="flex items-center">
                          <CalendarClock className="mr-1.5 h-4 w-4" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1.5 h-4 w-4" />
                          {event.guests} guests
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial">
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-muted/20 px-3 py-1">
                        Completed
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        View
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Export summary</DropdownMenuItem>
                        <DropdownMenuItem>View financials</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate event</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button variant="outline" size="sm" disabled={activeTab === "upcoming"}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={activeTab === "past"}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}