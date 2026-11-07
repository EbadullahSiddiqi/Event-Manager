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
import { FileText, File, ExternalLink, Search, Trash2, CalendarDays } from "lucide-react";
import { CreateNoteDialog } from "@/components/dashboard/create-note-dialog";
import { NoteItem, EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [nRes, eRes] = await Promise.all([
        fetch("/api/notes").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
      ]);

      if (nRes.success) setNotes(nRes.data || []);
      if (eRes.success) setEvents(eRes.data || []);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteNote = async (id: string, title: string) => {
    if (!confirm(`Delete note "${title}"?`)) return;
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast({ title: "Entry Deleted", description: `"${title}" removed.` });
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || n.category === categoryFilter;
    const matchesEvent = eventFilter === "all" || n.eventId === eventFilter;
    return matchesSearch && matchesCategory && matchesEvent;
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Notes & Documents"
        text="Store contracts, inspiration briefs, meeting minutes, and document links."
      >
        <CreateNoteDialog eventsList={events} onSuccess={loadData} />
      </DashboardHeader>

      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes or contracts..."
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

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Inspiration">Inspiration</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="text-center py-12 border-dashed">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-lg">No Notes Found</p>
              <p className="text-sm text-muted-foreground mb-4">No entries match your search criteria.</p>
              <CreateNoteDialog eventsList={events} onSuccess={loadData} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => {
              const eventTitle = events.find((e) => e.id === note.eventId)?.title || "General Event";
              return (
                <Card key={note.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      {note.isDocument && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                          <File className="h-3 w-3 mr-1" /> Document
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                    <CardDescription className="text-xs flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" /> {eventTitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm flex-1">
                    <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {note.content}
                    </p>

                    {note.fileUrl && (
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-primary font-medium hover:underline pt-2 border-t w-full"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open Attached Contract / Document
                      </a>
                    )}
                  </CardContent>

                  <div className="p-3 bg-muted/30 border-t flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteNote(note.id, note.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
