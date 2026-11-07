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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventItem } from "@/lib/db/store";

interface CreateNoteDialogProps {
  eventsList: EventItem[];
  defaultEventId?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateNoteDialog({
  eventsList,
  defaultEventId,
  onSuccess,
  trigger,
}: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    eventId: defaultEventId || (eventsList[0]?.id || ""),
    title: "",
    category: "General",
    content: "",
    isDocument: false,
    fileUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.eventId) {
      toast({
        title: "Validation Error",
        description: "Title, event, and content are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: formData.isDocument ? "Document Saved" : "Note Created",
          description: `"${formData.title}" added to notes archive.`,
        });
        setOpen(false);
        setFormData({
          eventId: defaultEventId || (eventsList[0]?.id || ""),
          title: "",
          category: "General",
          content: "",
          isDocument: false,
          fileUrl: "",
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create note.",
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
            <FilePlus className="h-4 w-4 mr-2" />
            Add Note / Doc
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note or Document</DialogTitle>
          <DialogDescription>
            Store design specs, meeting notes, contracts, or file links.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="eventId">Associated Event *</Label>
            <Select
              value={formData.eventId}
              onValueChange={(val) => setFormData({ ...formData, eventId: val })}
            >
              <SelectTrigger id="eventId">
                <SelectValue placeholder="Select event" />
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Venue Acoustic Restrictions"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Inspiration">Inspiration</SelectItem>
                  <SelectItem value="Budget">Budget</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 py-2 border rounded-lg p-3 bg-muted/30">
            <Switch
              id="isDocument"
              checked={formData.isDocument}
              onCheckedChange={(checked) => setFormData({ ...formData, isDocument: checked })}
            />
            <Label htmlFor="isDocument" className="cursor-pointer text-sm font-medium">
              This entry includes an external document / contract link
            </Label>
          </div>

          {formData.isDocument && (
            <div className="space-y-2">
              <Label htmlFor="fileUrl">Document File URL</Label>
              <Input
                id="fileUrl"
                placeholder="https://drive.google.com/... or contract.pdf"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Content / Summary *</Label>
            <Textarea
              id="content"
              placeholder="Enter note contents or document summary..."
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
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
              Save Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
