import { db, isDbConnected } from "./index";
import { events, guests, vendors, tasks, notes } from "./schema";
import { eq, desc } from "drizzle-orm";
import {
  EventItem,
  GuestItem,
  VendorItem,
  TaskItem,
  NoteItem,
  initialEvents,
  initialGuests,
  initialVendors,
  initialTasks,
  initialNotes,
} from "./store";

// Global memory cache for fallback mode
const memoryStore = {
  events: [...initialEvents],
  guests: [...initialGuests],
  vendors: [...initialVendors],
  tasks: [...initialTasks],
  notes: [...initialNotes],
};

// --- EVENTS SERVICES ---

export async function getEvents(): Promise<EventItem[]> {
  if (isDbConnected && db) {
    try {
      const records = await db.select().from(events).orderBy(desc(events.createdAt));
      return records.map((r) => ({
        id: r.id,
        userId: r.userId,
        title: r.title,
        description: r.description || "",
        date: r.date,
        time: r.time || "",
        location: r.location,
        status: r.status as EventItem["status"],
        type: r.type,
        budget: r.budget,
        guestCapacity: r.guestCapacity,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("DB query failed, fallback to memory store:", e);
    }
  }
  return memoryStore.events;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const allEvents = await getEvents();
  return allEvents.find((e) => e.id === id) || null;
}

export async function createEvent(data: Omit<EventItem, "id" | "createdAt" | "updatedAt">): Promise<EventItem> {
  const newId = `evt-${Date.now()}`;
  const now = new Date().toISOString();
  const newEvent: EventItem = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  if (isDbConnected && db) {
    try {
      await db.insert(events).values({
        id: newEvent.id,
        userId: newEvent.userId,
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        status: newEvent.status,
        type: newEvent.type,
        budget: newEvent.budget,
        guestCapacity: newEvent.guestCapacity,
      });
      return newEvent;
    } catch (e) {
      console.warn("DB insert failed, using fallback:", e);
    }
  }

  memoryStore.events.unshift(newEvent);
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
  const now = new Date().toISOString();

  if (isDbConnected && db) {
    try {
      await db
        .update(events)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id));
    } catch (e) {
      console.warn("DB update failed, using fallback:", e);
    }
  }

  const idx = memoryStore.events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    memoryStore.events[idx] = {
      ...memoryStore.events[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryStore.events[idx];
  }
  return null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (isDbConnected && db) {
    try {
      await db.delete(events).where(eq(events.id, id));
    } catch (e) {
      console.warn("DB delete failed, using fallback:", e);
    }
  }

  const initialLength = memoryStore.events.length;
  memoryStore.events = memoryStore.events.filter((e) => e.id !== id);
  // Also clean related items
  memoryStore.guests = memoryStore.guests.filter((g) => g.eventId !== id);
  memoryStore.vendors = memoryStore.vendors.filter((v) => v.eventId !== id);
  memoryStore.tasks = memoryStore.tasks.filter((t) => t.eventId !== id);
  memoryStore.notes = memoryStore.notes.filter((n) => n.eventId !== id);
  return memoryStore.events.length < initialLength;
}

// --- GUESTS SERVICES ---

export async function getGuests(eventId?: string): Promise<GuestItem[]> {
  if (isDbConnected && db) {
    try {
      let query = db.select().from(guests).orderBy(desc(guests.createdAt));
      const records = eventId ? await db.select().from(guests).where(eq(guests.eventId, eventId)) : await query;
      return records.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        userId: r.userId,
        name: r.name,
        email: r.email || "",
        phone: r.phone || "",
        rsvpStatus: r.rsvpStatus as GuestItem["rsvpStatus"],
        mealPreference: r.mealPreference,
        tableNumber: r.tableNumber || "Unassigned",
        notes: r.notes || "",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("DB guests query failed:", e);
    }
  }
  if (eventId) {
    return memoryStore.guests.filter((g) => g.eventId === eventId);
  }
  return memoryStore.guests;
}

export async function createGuest(data: Omit<GuestItem, "id" | "createdAt">): Promise<GuestItem> {
  const newId = `gst-${Date.now()}`;
  const now = new Date().toISOString();
  const newGuest: GuestItem = {
    ...data,
    id: newId,
    createdAt: now,
  };

  if (isDbConnected && db) {
    try {
      await db.insert(guests).values(newGuest);
      return newGuest;
    } catch (e) {
      console.warn("DB guest insert failed:", e);
    }
  }

  memoryStore.guests.unshift(newGuest);
  return newGuest;
}

export async function updateGuest(id: string, updates: Partial<GuestItem>): Promise<GuestItem | null> {
  if (isDbConnected && db) {
    try {
      await db.update(guests).set(updates).where(eq(guests.id, id));
    } catch (e) {
      console.warn("DB guest update failed:", e);
    }
  }

  const idx = memoryStore.guests.findIndex((g) => g.id === id);
  if (idx !== -1) {
    memoryStore.guests[idx] = { ...memoryStore.guests[idx], ...updates };
    return memoryStore.guests[idx];
  }
  return null;
}

export async function deleteGuest(id: string): Promise<boolean> {
  if (isDbConnected && db) {
    try {
      await db.delete(guests).where(eq(guests.id, id));
    } catch (e) {
      console.warn("DB guest delete failed:", e);
    }
  }
  const initialLen = memoryStore.guests.length;
  memoryStore.guests = memoryStore.guests.filter((g) => g.id !== id);
  return memoryStore.guests.length < initialLen;
}

// --- VENDORS SERVICES ---

export async function getVendors(eventId?: string): Promise<VendorItem[]> {
  if (isDbConnected && db) {
    try {
      const records = eventId
        ? await db.select().from(vendors).where(eq(vendors.eventId, eventId))
        : await db.select().from(vendors).orderBy(desc(vendors.createdAt));
      return records.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        userId: r.userId,
        name: r.name,
        category: r.category,
        contactPerson: r.contactPerson || "",
        email: r.email || "",
        phone: r.phone || "",
        status: r.status as VendorItem["status"],
        cost: r.cost,
        notes: r.notes || "",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("DB vendors query failed:", e);
    }
  }
  if (eventId) {
    return memoryStore.vendors.filter((v) => v.eventId === eventId);
  }
  return memoryStore.vendors;
}

export async function createVendor(data: Omit<VendorItem, "id" | "createdAt">): Promise<VendorItem> {
  const newId = `vnd-${Date.now()}`;
  const now = new Date().toISOString();
  const newVendor: VendorItem = { ...data, id: newId, createdAt: now };

  if (isDbConnected && db) {
    try {
      await db.insert(vendors).values(newVendor);
      return newVendor;
    } catch (e) {
      console.warn("DB vendor insert failed:", e);
    }
  }

  memoryStore.vendors.unshift(newVendor);
  return newVendor;
}

export async function updateVendor(id: string, updates: Partial<VendorItem>): Promise<VendorItem | null> {
  if (isDbConnected && db) {
    try {
      await db.update(vendors).set(updates).where(eq(vendors.id, id));
    } catch (e) {
      console.warn("DB vendor update failed:", e);
    }
  }

  const idx = memoryStore.vendors.findIndex((v) => v.id === id);
  if (idx !== -1) {
    memoryStore.vendors[idx] = { ...memoryStore.vendors[idx], ...updates };
    return memoryStore.vendors[idx];
  }
  return null;
}

export async function deleteVendor(id: string): Promise<boolean> {
  if (isDbConnected && db) {
    try {
      await db.delete(vendors).where(eq(vendors.id, id));
    } catch (e) {
      console.warn("DB vendor delete failed:", e);
    }
  }
  const initialLen = memoryStore.vendors.length;
  memoryStore.vendors = memoryStore.vendors.filter((v) => v.id !== id);
  return memoryStore.vendors.length < initialLen;
}

// --- TASKS SERVICES ---

export async function getTasks(eventId?: string): Promise<TaskItem[]> {
  if (isDbConnected && db) {
    try {
      const records = eventId
        ? await db.select().from(tasks).where(eq(tasks.eventId, eventId))
        : await db.select().from(tasks).orderBy(desc(tasks.createdAt));
      return records.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        userId: r.userId,
        title: r.title,
        description: r.description || "",
        dueDate: r.dueDate || "",
        priority: r.priority as TaskItem["priority"],
        status: r.status as TaskItem["status"],
        assignedTo: r.assignedTo || "Unassigned",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("DB tasks query failed:", e);
    }
  }
  if (eventId) {
    return memoryStore.tasks.filter((t) => t.eventId === eventId);
  }
  return memoryStore.tasks;
}

export async function createTask(data: Omit<TaskItem, "id" | "createdAt">): Promise<TaskItem> {
  const newId = `tsk-${Date.now()}`;
  const now = new Date().toISOString();
  const newTask: TaskItem = { ...data, id: newId, createdAt: now };

  if (isDbConnected && db) {
    try {
      await db.insert(tasks).values(newTask);
      return newTask;
    } catch (e) {
      console.warn("DB task insert failed:", e);
    }
  }

  memoryStore.tasks.unshift(newTask);
  return newTask;
}

export async function updateTask(id: string, updates: Partial<TaskItem>): Promise<TaskItem | null> {
  if (isDbConnected && db) {
    try {
      await db.update(tasks).set(updates).where(eq(tasks.id, id));
    } catch (e) {
      console.warn("DB task update failed:", e);
    }
  }

  const idx = memoryStore.tasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryStore.tasks[idx] = { ...memoryStore.tasks[idx], ...updates };
    return memoryStore.tasks[idx];
  }
  return null;
}

export async function deleteTask(id: string): Promise<boolean> {
  if (isDbConnected && db) {
    try {
      await db.delete(tasks).where(eq(tasks.id, id));
    } catch (e) {
      console.warn("DB task delete failed:", e);
    }
  }
  const initialLen = memoryStore.tasks.length;
  memoryStore.tasks = memoryStore.tasks.filter((t) => t.id !== id);
  return memoryStore.tasks.length < initialLen;
}

// --- NOTES & DOCS SERVICES ---

export async function getNotes(eventId?: string): Promise<NoteItem[]> {
  if (isDbConnected && db) {
    try {
      const records = eventId
        ? await db.select().from(notes).where(eq(notes.eventId, eventId))
        : await db.select().from(notes).orderBy(desc(notes.createdAt));
      return records.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        userId: r.userId,
        title: r.title,
        content: r.content,
        category: r.category,
        isDocument: r.isDocument,
        fileUrl: r.fileUrl || undefined,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("DB notes query failed:", e);
    }
  }
  if (eventId) {
    return memoryStore.notes.filter((n) => n.eventId === eventId);
  }
  return memoryStore.notes;
}

export async function createNote(data: Omit<NoteItem, "id" | "createdAt" | "updatedAt">): Promise<NoteItem> {
  const newId = `nte-${Date.now()}`;
  const now = new Date().toISOString();
  const newNote: NoteItem = { ...data, id: newId, createdAt: now, updatedAt: now };

  if (isDbConnected && db) {
    try {
      await db.insert(notes).values(newNote);
      return newNote;
    } catch (e) {
      console.warn("DB note insert failed:", e);
    }
  }

  memoryStore.notes.unshift(newNote);
  return newNote;
}

export async function updateNote(id: string, updates: Partial<NoteItem>): Promise<NoteItem | null> {
  const now = new Date().toISOString();

  if (isDbConnected && db) {
    try {
      await db
        .update(notes)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(notes.id, id));
    } catch (e) {
      console.warn("DB note update failed:", e);
    }
  }

  const idx = memoryStore.notes.findIndex((n) => n.id === id);
  if (idx !== -1) {
    memoryStore.notes[idx] = { ...memoryStore.notes[idx], ...updates, updatedAt: now };
    return memoryStore.notes[idx];
  }
  return null;
}

export async function deleteNote(id: string): Promise<boolean> {
  if (isDbConnected && db) {
    try {
      await db.delete(notes).where(eq(notes.id, id));
    } catch (e) {
      console.warn("DB note delete failed:", e);
    }
  }
  const initialLen = memoryStore.notes.length;
  memoryStore.notes = memoryStore.notes.filter((n) => n.id !== id);
  return memoryStore.notes.length < initialLen;
}
