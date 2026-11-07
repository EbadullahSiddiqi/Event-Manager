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
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Clock, CalendarDays, User, Trash2, Search, CheckCircle2, ArrowRight } from "lucide-react";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskItem, EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [tRes, eRes] = await Promise.all([
        fetch("/api/tasks").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
      ]);

      if (tRes.success) setTasks(tRes.data || []);
      if (eRes.success) setEvents(eRes.data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if ((await res.json()).success) {
        toast({ title: "Task Updated", description: `Task moved to ${newStatus.replace("_", " ")}.` });
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
        );
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!confirm(`Delete task "${title}"?`)) return;
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast({ title: "Task Deleted", description: `"${title}" removed.` });
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = eventFilter === "all" || t.eventId === eventFilter;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchesSearch && matchesEvent && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const renderTaskColumn = (columnTitle: string, columnTasks: TaskItem[], targetStatus: string, headerColor: string) => (
    <div className="flex flex-col space-y-4 rounded-xl border bg-muted/20 p-4 min-h-[500px]">
      <div className="flex items-center justify-between font-semibold border-b pb-3">
        <span className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${headerColor}`} />
          {columnTitle}
        </span>
        <Badge variant="secondary" className="rounded-full px-2">
          {columnTasks.length}
        </Badge>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {columnTasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground border border-dashed rounded-lg">
            No tasks in {columnTitle.toLowerCase()}
          </div>
        ) : (
          columnTasks.map((task) => {
            const eventTitle = events.find((e) => e.id === task.eventId)?.title || "General Event";
            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow bg-card">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold text-sm leading-snug ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                    <Badge
                      className={
                        task.priority === "high"
                          ? "bg-destructive/10 text-destructive border-destructive/20 text-[10px]"
                          : task.priority === "medium"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                          : "bg-muted text-muted-foreground text-[10px]"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t">
                    <span className="flex items-center"><CalendarDays className="h-3 w-3 mr-1" />{eventTitle}</span>
                    {task.dueDate && <span className="flex items-center font-medium text-amber-600"><Clock className="h-3 w-3 mr-1" />{task.dueDate}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <Select
                      value={task.status}
                      onValueChange={(val) => handleUpdateStatus(task.id, val)}
                    >
                      <SelectTrigger className="h-7 w-[110px] text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Task Board"
        text="Organize to-dos into columns, track priorities, and assign responsibilities."
      >
        <CreateTaskDialog eventsList={events} onSuccess={loadData} />
      </DashboardHeader>

      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
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

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board Columns */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {renderTaskColumn("To Do", todoTasks, "todo", "bg-amber-500")}
            {renderTaskColumn("In Progress", inProgressTasks, "in_progress", "bg-blue-500")}
            {renderTaskColumn("Completed", completedTasks, "completed", "bg-emerald-500")}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
