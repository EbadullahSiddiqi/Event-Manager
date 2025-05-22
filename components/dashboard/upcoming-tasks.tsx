"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Clock, CalendarDays, AlertCircle } from "lucide-react";

// Mock data
const tasks = [
  {
    id: "task1",
    title: "Confirm final guest count with Johnson wedding",
    completed: false,
    dueDate: "2025-04-10",
    event: "Johnson Wedding",
    priority: "high",
  },
  {
    id: "task2",
    title: "Send vendor payment reminders",
    completed: false,
    dueDate: "2025-04-05",
    event: "TechCorp Annual Conference",
    priority: "medium",
  },
  {
    id: "task3",
    title: "Review seating chart draft",
    completed: false,
    dueDate: "2025-04-02",
    event: "Smith 50th Birthday",
    priority: "medium",
  },
  {
    id: "task4",
    title: "Book transportation for speakers",
    completed: false,
    dueDate: "2025-04-01",
    event: "TechCorp Annual Conference",
    priority: "high",
  },
  {
    id: "task5",
    title: "Order birthday cake",
    completed: true,
    dueDate: "2025-03-30",
    event: "Smith 50th Birthday",
    priority: "medium",
  },
];

export function UpcomingTasks() {
  const [userTasks, setUserTasks] = useState(tasks);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className={`h-3 w-3 ${getPriorityColor(priority)}`} />;
      case "medium":
        return <Clock className={`h-3 w-3 ${getPriorityColor(priority)}`} />;
      case "low":
        return <CheckCircle2 className={`h-3 w-3 ${getPriorityColor(priority)}`} />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setUserTasks(
      userTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Tasks that require your attention soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className={`flex items-start space-x-3 p-3 rounded-md border ${
                task.completed ? "bg-muted/50" : "bg-card"
              }`}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={task.id}
                  className={`font-medium block ${
                    task.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {task.title}
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {task.event}
                  </Badge>
                  <Badge variant="outline" className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-4 w-full">
          View All Tasks
        </Button>
      </CardContent>
    </Card>
  );
}