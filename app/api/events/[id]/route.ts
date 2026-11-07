import { NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/lib/db/service";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const event = await getEventById(params.id);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await updateEvent(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteEvent(params.id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}
