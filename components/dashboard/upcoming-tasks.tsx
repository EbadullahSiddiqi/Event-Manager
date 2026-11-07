"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { TaskItem, EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTaskDialog } from "./create-task-dialog";

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.error("Failed to load upcoming tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTask = async (task: TaskItem) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast({
          title: newStatus === "completed" ? "Task Completed" : "Task Reopened",
          description: `"${task.title}" updated.`,
        });
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20">Med</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0">Low</Badge>;
    }
  };

  const upcomingList = tasks.filter((t) => t.status !== "completed").slice(0, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
          <CardDescription>To-dos requiring immediate attention.</CardDescription>
        </div>
        <CreateTaskDialog eventsList={events} onSuccess={loadData} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : upcomingList.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-lg">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground">No pending tasks found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingList.map((task) => {
              const eventTitle = events.find((e) => e.id === task.eventId)?.title || "General Event";
              return (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleTask(task)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium leading-none ${
                          task.status === "completed" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground space-x-3">
                      <span className="flex items-center">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {eventTitle}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center text-amber-600 font-medium">
                          <Clock className="mr-1 h-3 w-3" />
                          Due {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}