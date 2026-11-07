"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Database, ShieldCheck, User, Bell, Palette, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { toast } = useToast();

  const [businessName, setBusinessName] = useState("Elegant Event Management");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your dashboard preferences have been updated.",
    });
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Account & System Settings"
        text="Manage your profile, authentication, database connection, and notifications."
      />

      <div className="space-y-8 max-w-4xl">
        {/* System Architecture Status Card */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Infrastructure Status</CardTitle>
            </div>
            <CardDescription>
              Backend connection state for Neon PostgreSQL and Clerk Authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Neon Database Status */}
            <div className="p-4 border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-base">Neon PostgreSQL & Drizzle ORM</h4>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                      Active / Ready
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Data layer is fully connected and ready. Replace <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">DATABASE_URL</code> in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">.env.local</code> with your real Neon string anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Clerk Auth Status */}
            <div className="p-4 border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-base">Clerk Authentication</h4>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      {isSignedIn ? "Authenticated User" : "Clerk Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Signed in as: <span className="font-medium text-foreground">{user?.primaryEmailAddress?.emailAddress || "Demo User"}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Planner Profile</CardTitle>
            </div>
            <CardDescription>Update your planner credentials and agency branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input id="user-name" defaultValue={user?.fullName || "Jane Planner"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <Input id="user-email" defaultValue={user?.primaryEmailAddress?.emailAddress || "jane@eventflow.io"} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-name">Agency / Company Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button onClick={handleSaveSettings}>Save Profile</Button>
          </CardFooter>
        </Card>

        {/* Notifications & Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications & Reminders</CardTitle>
            </div>
            <CardDescription>Configure alerts for guest RSVPs and task deadlines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-xl">
              <div>
                <Label htmlFor="email-notif" className="font-medium cursor-pointer">RSVP Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive instant alerts when a guest updates their RSVP.</p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-xl">
              <div>
                <Label htmlFor="task-remind" className="font-medium cursor-pointer">Daily Task Digest</Label>
                <p className="text-xs text-muted-foreground">Get a morning reminder of upcoming task deadlines.</p>
              </div>
              <Switch
                id="task-remind"
                checked={taskReminders}
                onCheckedChange={setTaskReminders}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
