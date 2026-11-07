import { NextResponse } from "next/server";
import { getNotes, createNote, updateNote, deleteNote } from "@/lib/db/service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;
    const noteList = await getNotes(eventId);
    return NextResponse.json({ success: true, data: noteList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.eventId || !body.content) {
      return NextResponse.json({ success: false, error: "Missing required note fields" }, { status: 400 });
    }
    const newNote = await createNote({
      eventId: body.eventId,
      userId: body.userId || "user_demo",
      title: body.title,
      content: body.content,
      category: body.category || "General",
      isDocument: Boolean(body.isDocument),
      fileUrl: body.fileUrl || undefined,
    });
    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create note" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing note id" }, { status: 400 });
    }
    const updated = await updateNote(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing note id" }, { status: 400 });
    }
    const success = await deleteNote(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete note" }, { status: 500 });
  }
}
