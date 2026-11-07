import { NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/db/service";

export async function GET() {
  try {
    const eventsList = await getEvents();
    return NextResponse.json({ success: true, data: eventsList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newEvent = await createEvent({
      userId: body.userId || "user_demo",
      title: body.title,
      description: body.description || "",
      date: body.date,
      time: body.time || "12:00",
      location: body.location,
      status: body.status || "active",
      type: body.type || "Wedding",
      budget: Number(body.budget) || 0,
      guestCapacity: Number(body.guestCapacity) || 0,
    });

    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
