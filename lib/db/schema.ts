import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location").notNull(),
  status: text("status").default("active").notNull(), // 'active', 'completed', 'cancelled'
  type: text("type").default("Wedding").notNull(), // 'Wedding', 'Corporate', 'Birthday', 'Gala', 'Other'
  budget: integer("budget").default(0).notNull(),
  guestCapacity: integer("guest_capacity").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const guests = pgTable("guests", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  rsvpStatus: text("rsvp_status").default("pending").notNull(), // 'attending', 'declined', 'pending'
  mealPreference: text("meal_preference").default("Standard").notNull(), // 'Standard', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'
  tableNumber: text("table_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'Catering', 'Photography', 'Venue', 'Music', 'Decoration', 'Floral', 'Other'
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  status: text("status").default("contacted").notNull(), // 'contacted', 'booked', 'confirmed', 'paid'
  cost: integer("cost").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date"),
  priority: text("priority").default("medium").notNull(), // 'low', 'medium', 'high'
  status: text("status").default("todo").notNull(), // 'todo', 'in_progress', 'completed'
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").default("General").notNull(), // 'General', 'Contract', 'Inspiration', 'Budget', 'Meeting'
  isDocument: boolean("is_document").default(false).notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
