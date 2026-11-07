"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventItem } from "@/lib/db/store";

interface CreateGuestDialogProps {
  eventsList: EventItem[];
  defaultEventId?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateGuestDialog({
  eventsList,
  defaultEventId,
  onSuccess,
  trigger,
}: CreateGuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    eventId: defaultEventId || (eventsList[0]?.id || ""),
    name: "",
    email: "",
    phone: "",
    rsvpStatus: "pending",
    mealPreference: "Standard",
    tableNumber: "Unassigned",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.eventId) {
      toast({
        title: "Validation Error",
        description: "Guest name and event selection are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: "Guest Added",
          description: `"${formData.name}" added to the guest list.`,
        });
        setOpen(false);
        setFormData({
          eventId: defaultEventId || (eventsList[0]?.id || ""),
          name: "",
          email: "",
          phone: "",
          rsvpStatus: "pending",
          mealPreference: "Standard",
          tableNumber: "Unassigned",
          notes: "",
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add guest.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Guest</DialogTitle>
          <DialogDescription>
            Record RSVP status, contact info, and meal choices.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="eventId">Select Event *</Label>
            <Select
              value={formData.eventId}
              onValueChange={(val) => setFormData({ ...formData, eventId: val })}
            >
              <SelectTrigger id="eventId">
                <SelectValue placeholder="Choose event" />
              </SelectTrigger>
              <SelectContent>
                {eventsList.map((evt) => (
                  <SelectItem key={evt.id} value={evt.id}>
                    {evt.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g. John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rsvpStatus">RSVP Status</Label>
              <Select
                value={formData.rsvpStatus}
                onValueChange={(val) => setFormData({ ...formData, rsvpStatus: val })}
              >
                <SelectTrigger id="rsvpStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attending">Attending</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mealPreference">Meal Preference</Label>
              <Select
                value={formData.mealPreference}
                onValueChange={(val) => setFormData({ ...formData, mealPreference: val })}
              >
                <SelectTrigger id="mealPreference">
                  <SelectValue placeholder="Select meal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                  <SelectItem value="Halal">Halal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table / Seating Assignment</Label>
            <Input
              id="tableNumber"
              placeholder="e.g. Table 4 or VIP"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Allergies</Label>
            <Textarea
              id="notes"
              placeholder="Dietary requirements or +1 details..."
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Guest
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
