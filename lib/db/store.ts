export interface EventItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "active" | "completed" | "cancelled";
  type: string;
  budget: number;
  guestCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface GuestItem {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: "attending" | "declined" | "pending";
  mealPreference: string;
  tableNumber: string;
  notes: string;
  createdAt: string;
}

export interface VendorItem {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "contacted" | "booked" | "confirmed" | "paid";
  cost: number;
  notes: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  eventId: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  assignedTo: string;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  eventId: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  isDocument: boolean;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const initialEvents: EventItem[] = [
  {
    id: "evt-1",
    userId: "user_demo",
    title: "Johnson & Smith Wedding",
    description: "Full wedding ceremony and reception with 175 guests.",
    date: "2025-07-15",
    time: "16:00",
    location: "Grand Hotel & Gardens, New York",
    status: "active",
    type: "Wedding",
    budget: 45000,
    guestCapacity: 175,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-2",
    userId: "user_demo",
    title: "TechCorp Annual Leadership Summit",
    description: "Keynote presentations, breakout sessions, and evening gala.",
    date: "2025-05-10",
    time: "09:00",
    location: "Moscone Convention Center, San Francisco",
    status: "active",
    type: "Corporate",
    budget: 85000,
    guestCapacity: 450,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-3",
    userId: "user_demo",
    title: "Robert Smith 50th Birthday Bash",
    description: "Exclusive dinner party with live jazz orchestra.",
    date: "2025-04-22",
    time: "19:00",
    location: "Riverside Club, Chicago",
    status: "active",
    type: "Birthday",
    budget: 18000,
    guestCapacity: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-4",
    userId: "user_demo",
    title: "Garcia Family Gala",
    description: "Charity fundraiser for youth education.",
    date: "2025-02-28",
    time: "18:30",
    location: "Beachside Resort, Miami",
    status: "completed",
    type: "Gala",
    budget: 32000,
    guestCapacity: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialGuests: GuestItem[] = [
  {
    id: "gst-1",
    eventId: "evt-1",
    userId: "user_demo",
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 234-5678",
    rsvpStatus: "attending",
    mealPreference: "Standard",
    tableNumber: "Table 1",
    notes: "Maid of Honor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gst-2",
    eventId: "evt-1",
    userId: "user_demo",
    name: "Marcus Brody",
    email: "m.brody@example.com",
    phone: "+1 (555) 876-5432",
    rsvpStatus: "attending",
    mealPreference: "Vegetarian",
    tableNumber: "Table 2",
    notes: "Allergic to peanuts",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gst-3",
    eventId: "evt-1",
    userId: "user_demo",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 (555) 345-6789",
    rsvpStatus: "pending",
    mealPreference: "Gluten-Free",
    tableNumber: "Unassigned",
    notes: "Awaiting response for +1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gst-4",
    eventId: "evt-2",
    userId: "user_demo",
    name: "David Kim",
    email: "dkim@techcorp.com",
    phone: "+1 (555) 456-7890",
    rsvpStatus: "attending",
    mealPreference: "Vegan",
    tableNumber: "VIP Table",
    notes: "Keynote speaker",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gst-5",
    eventId: "evt-3",
    userId: "user_demo",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 567-8901",
    rsvpStatus: "declined",
    mealPreference: "Standard",
    tableNumber: "Unassigned",
    notes: "Out of town",
    createdAt: new Date().toISOString(),
  },
];

export const initialVendors: VendorItem[] = [
  {
    id: "vnd-1",
    eventId: "evt-1",
    userId: "user_demo",
    name: "Gourmet Catering Co.",
    category: "Catering",
    contactPerson: "Chef Jean-Luc",
    email: "info@gourmetcatering.com",
    phone: "+1 (555) 111-2233",
    status: "confirmed",
    cost: 12500,
    notes: "3-course menu agreed with vegan option.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "vnd-2",
    eventId: "evt-1",
    userId: "user_demo",
    name: "Lumina Photography Studios",
    category: "Photography",
    contactPerson: "Elena Rostova",
    email: "elena@lumina-photo.com",
    phone: "+1 (555) 222-3344",
    status: "booked",
    cost: 4800,
    notes: "Includes 8 hours coverage + engagement session.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "vnd-3",
    eventId: "evt-2",
    userId: "user_demo",
    name: "Apex Sound & Lighting",
    category: "AV & Tech",
    contactPerson: "Tom Bradley",
    email: "tom@apexsound.com",
    phone: "+1 (555) 333-4455",
    status: "paid",
    cost: 18500,
    notes: "Stage lighting, 4 wireless mics, LED wall.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "vnd-4",
    eventId: "evt-3",
    userId: "user_demo",
    name: "Velvet Lounge Quartet",
    category: "Music",
    contactPerson: "Miles Davis Jr.",
    email: "booking@velvetlounge.com",
    phone: "+1 (555) 444-5566",
    status: "contacted",
    cost: 3200,
    notes: "3 sets of classic jazz standards.",
    createdAt: new Date().toISOString(),
  },
];

export const initialTasks: TaskItem[] = [
  {
    id: "tsk-1",
    eventId: "evt-1",
    userId: "user_demo",
    title: "Finalize menu tasting with Gourmet Catering",
    description: "Sample top 3 main courses and dessert options with couple.",
    dueDate: "2025-04-10",
    priority: "high",
    status: "in_progress",
    assignedTo: "Lisa Peterson",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk-2",
    eventId: "evt-1",
    userId: "user_demo",
    title: "Confirm floral arrangement layout with venue",
    description: "Verify arch size and centerpiece table numbers.",
    dueDate: "2025-05-01",
    priority: "medium",
    status: "todo",
    assignedTo: "Sarah W.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk-3",
    eventId: "evt-2",
    userId: "user_demo",
    title: "Send speaker invitations & travel forms",
    description: "Collect bio, headshot, and AV requirements.",
    dueDate: "2025-03-20",
    priority: "high",
    status: "completed",
    assignedTo: "Mark Johnson",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk-4",
    eventId: "evt-3",
    userId: "user_demo",
    title: "Reserve private dining room & sound check",
    description: "Ensure acoustic dampening and acoustic piano tuning.",
    dueDate: "2025-04-05",
    priority: "low",
    status: "todo",
    assignedTo: "David Chen",
    createdAt: new Date().toISOString(),
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: "nte-1",
    eventId: "evt-1",
    userId: "user_demo",
    title: "Johnson Wedding Design Brief",
    content: "Color palette: Navy blue, blush pink, and brushed gold accents. Floral choices focus on white roses and eucalyptus.",
    category: "Inspiration",
    isDocument: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nte-2",
    eventId: "evt-1",
    userId: "user_demo",
    title: "Grand Hotel Venue Contract & Guidelines",
    content: "Curfew: 23:30. Sound ceiling: 95dB. Security required for guest count over 150.",
    category: "Contract",
    isDocument: true,
    fileUrl: "https://example.com/docs/grand-hotel-contract.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nte-3",
    eventId: "evt-2",
    userId: "user_demo",
    title: "TechCorp Run of Show & Stage Cue Sheet",
    content: "09:00 Opening Video -> 09:05 CEO Introduction -> 09:30 Keynote presentation.",
    category: "Meeting",
    isDocument: true,
    fileUrl: "https://example.com/docs/techcorp-ros.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
