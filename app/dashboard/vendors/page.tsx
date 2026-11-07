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
import { Building2, DollarSign, Mail, Phone, Search, Trash2, CheckCircle, Clock } from "lucide-react";
import { CreateVendorDialog } from "@/components/dashboard/create-vendor-dialog";
import { VendorItem, EventItem } from "@/lib/db/store";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [vRes, eRes] = await Promise.all([
        fetch("/api/vendors").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
      ]);

      if (vRes.success) setVendors(vRes.data || []);
      if (eRes.success) setEvents(eRes.data || []);
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (vendorId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vendorId, status: newStatus }),
      });
      if ((await res.json()).success) {
        toast({ title: "Status Updated", description: `Vendor status set to ${newStatus}.` });
        setVendors((prev) =>
          prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus as any } : v))
        );
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!confirm(`Delete vendor "${name}"?`)) return;
    try {
      const res = await fetch(`/api/vendors?id=${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast({ title: "Vendor Deleted", description: `"${name}" removed.` });
        setVendors((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || v.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCost = vendors.reduce((acc, v) => acc + (v.cost || 0), 0);
  const confirmedCount = vendors.filter((v) => v.status === "confirmed" || v.status === "paid").length;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Vendor Coordination"
        text="Manage supplier contracts, category contacts, and financial commitments."
      >
        <CreateVendorDialog eventsList={events} onSuccess={loadData} />
      </DashboardHeader>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-4 flex items-center justify-between border-primary/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Vendors</p>
            <p className="text-2xl font-bold mt-1">{vendors.length}</p>
          </div>
          <Building2 className="h-8 w-8 text-primary/60" />
        </Card>
        <Card className="p-4 flex items-center justify-between border-emerald-500/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Confirmed / Paid</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{confirmedCount}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500/60" />
        </Card>
        <Card className="p-4 flex items-center justify-between border-blue-500/20">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Committed Cost</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">${totalCost.toLocaleString()}</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-500/60" />
        </Card>
      </div>

      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendor name or category..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Venue">Venue</SelectItem>
                <SelectItem value="Music">Music & DJ</SelectItem>
                <SelectItem value="AV & Tech">AV & Tech</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <Card className="text-center py-12 border-dashed">
            <CardContent>
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-lg">No Vendors Found</p>
              <p className="text-sm text-muted-foreground mb-4">No vendors match your search.</p>
              <CreateVendorDialog eventsList={events} onSuccess={loadData} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => {
              const eventTitle = events.find((e) => e.id === vendor.eventId)?.title || "General Event";
              return (
                <Card key={vendor.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="secondary">{vendor.category}</Badge>
                      <Select
                        value={vendor.status}
                        onValueChange={(val) => handleUpdateStatus(vendor.id, val)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <CardTitle className="text-xl">{vendor.name}</CardTitle>
                    <CardDescription className="text-xs">Event: {eventTitle}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm">
                    {vendor.contactPerson && (
                      <p className="text-xs font-medium text-muted-foreground">
                        Contact: <span className="text-foreground">{vendor.contactPerson}</span>
                      </p>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground space-x-3">
                      {vendor.email && <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{vendor.email}</span>}
                      {vendor.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{vendor.phone}</span>}
                    </div>
                    {vendor.notes && <p className="text-xs text-muted-foreground italic line-clamp-2">{vendor.notes}</p>}
                    <div className="pt-2 border-t flex justify-between items-center font-semibold text-emerald-600">
                      <span>Contract Cost:</span>
                      <span>${vendor.cost ? vendor.cost.toLocaleString() : "0"}</span>
                    </div>
                  </CardContent>

                  <div className="p-3 bg-muted/30 border-t flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
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
