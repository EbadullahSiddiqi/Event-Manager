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
import { Building2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventItem } from "@/lib/db/store";

interface CreateVendorDialogProps {
  eventsList: EventItem[];
  defaultEventId?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateVendorDialog({
  eventsList,
  defaultEventId,
  onSuccess,
  trigger,
}: CreateVendorDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    eventId: defaultEventId || (eventsList[0]?.id || ""),
    name: "",
    category: "Catering",
    contactPerson: "",
    email: "",
    phone: "",
    status: "contacted",
    cost: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.eventId || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Vendor name, category, and event are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: "Vendor Added",
          description: `"${formData.name}" added to vendor directory.`,
        });
        setOpen(false);
        setFormData({
          eventId: defaultEventId || (eventsList[0]?.id || ""),
          name: "",
          category: "Catering",
          contactPerson: "",
          email: "",
          phone: "",
          status: "contacted",
          cost: "",
          notes: "",
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add vendor.",
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
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Vendor</DialogTitle>
          <DialogDescription>
            Register supplier contracts, cost estimates, and contact info.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="eventId">Assigned Event *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor / Company Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Apex Sound & Tech"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Catering">Catering</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Venue">Venue</SelectItem>
                  <SelectItem value="Music">Music & DJ</SelectItem>
                  <SelectItem value="Decoration">Decoration & Floral</SelectItem>
                  <SelectItem value="AV & Tech">AV & Lighting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="e.g. John Doe"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Booking Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="paid">Paid in Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vendor@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Estimated Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="5000"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Deliverables & Agreement Notes</Label>
            <Textarea
              id="notes"
              placeholder="Contract terms, hours, inclusions..."
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
              Save Vendor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
