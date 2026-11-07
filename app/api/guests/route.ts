import { NextResponse } from "next/server";
import { getGuests, createGuest, updateGuest, deleteGuest } from "@/lib/db/service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;
    const guestList = await getGuests(eventId);
    return NextResponse.json({ success: true, data: guestList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.eventId) {
      return NextResponse.json({ success: false, error: "Missing name or eventId" }, { status: 400 });
    }
    const newGuest = await createGuest({
      eventId: body.eventId,
      userId: body.userId || "user_demo",
      name: body.name,
      email: body.email || "",
      phone: body.phone || "",
      rsvpStatus: body.rsvpStatus || "pending",
      mealPreference: body.mealPreference || "Standard",
      tableNumber: body.tableNumber || "Unassigned",
      notes: body.notes || "",
    });
    return NextResponse.json({ success: true, data: newGuest });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create guest" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing guest id" }, { status: 400 });
    }
    const updated = await updateGuest(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing guest id" }, { status: 400 });
    }
    const success = await deleteGuest(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete guest" }, { status: 500 });
  }
}
