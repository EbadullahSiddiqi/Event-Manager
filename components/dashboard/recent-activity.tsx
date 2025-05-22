import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, CalendarPlus, ClipboardEdit, FileEdit } from "lucide-react";

// Mock data
const activities = [
  {
    id: "act1",
    type: "comment",
    content: "Sarah left a comment on Johnson Wedding",
    time: "2 hours ago",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "act2",
    type: "guest",
    content: "5 new guests RSVPed for Smith 50th Birthday",
    time: "5 hours ago",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: "act3",
    type: "event",
    content: "New event created: Corporate Team Building",
    time: "Yesterday",
    icon: <CalendarPlus className="h-4 w-4" />,
  },
  {
    id: "act4",
    type: "task",
    content: "Task completed: Order flowers for Johnson Wedding",
    time: "Yesterday",
    icon: <ClipboardEdit className="h-4 w-4" />,
  },
  {
    id: "act5",
    type: "note",
    content: "Contract uploaded for TechCorp Annual Conference",
    time: "2 days ago",
    icon: <FileEdit className="h-4 w-4" />,
  },
];

export function RecentActivity() {
  const getActivityColor = (type: string) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "guest":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "event":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "task":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "note":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Stay updated on your events and team actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute top-0 bottom-0 left-[21px] w-px bg-muted"></div>
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}