"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelLeft, ExternalLink, Copy, Check, Users, Calendar, CheckCircle2 } from "lucide-react";
import { EventItem, GuestItem, VendorItem, TaskItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";

export default function ClientPortalPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [event, setEvent] = useState<EventItem | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [portalActive, setPortalActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/events");
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        setEvents(result.data);
        setSelectedEventId(result.data[0].id);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    async function loadDetails() {
      const [eRes, gRes, vRes, tRes] = await Promise.all([
        fetch(`/api/events/${selectedEventId}`).then((r) => r.json()),
        fetch(`/api/guests?eventId=${selectedEventId}`).then((r) => r.json()),
        fetch(`/api/vendors?eventId=${selectedEventId}`).then((r) => r.json()),
        fetch(`/api/tasks?eventId=${selectedEventId}`).then((r) => r.json()),
      ]);

      if (eRes.success) setEvent(eRes.data);
      if (gRes.success) setGuests(gRes.data || []);
      if (vRes.success) setVendors(vRes.data || []);
      if (tRes.success) setTasks(tRes.data || []);
    }
    loadDetails();
  }, [selectedEventId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/events/${selectedEventId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Shareable client portal link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const attendingCount = guests.filter((g) => g.rsvpStatus === "attending").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Client Portal Settings & Preview"
        text="Give your clients access to live event status, timeline, and guest counts."
      />

      <div className="space-y-6">
        {/* Selector & Share Bar */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="select-event" className="text-sm font-semibold">Select Event for Portal Preview</Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger id="select-event" className="w-full md:w-[320px]">
                  <SelectValue placeholder="Choose Event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4 border-l pl-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="portal-active"
                  checked={portalActive}
                  onCheckedChange={setPortalActive}
                />
                <Label htmlFor="portal-active" className="text-sm cursor-pointer">
                  Portal Link {portalActive ? "Active" : "Disabled"}
                </Label>
              </div>

              <Button onClick={handleCopyLink} disabled={!portalActive}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy Client Link"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Client View Mockup */}
        {event && (
          <div className="border rounded-2xl p-8 bg-gradient-to-b from-card to-muted/30 shadow-md space-y-8">
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
                  Client Portal View
                </Badge>
                <h2 className="text-3xl font-bold">{event.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{event.location} • {event.date}</p>
              </div>
              <Badge className="bg-emerald-500 text-white">Live Status: On Track</Badge>
            </div>

            {/* Key Summary Cards for Client */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-background/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Milestone Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{progressPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{completedTasks} of {tasks.length} tasks completed</p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 text-primary mr-2" /> Confirmed RSVPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{attendingGuests}</p>
                  <p className="text-xs text-muted-foreground mt-1">Out of {event.guestCapacity} invited capacity</p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 text-blue-500 mr-2" /> Booked Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{vendors.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Catering, Venue & Media locked</p>
                </CardContent>
              </Card>
            </div>

            {/* Approved Vendors Summary for Client */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Confirmed Vendor Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map((v) => (
                  <div key={v.id} className="p-4 border rounded-xl bg-background flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600">
                      Confirmed
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
