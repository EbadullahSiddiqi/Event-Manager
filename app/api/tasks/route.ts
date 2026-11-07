import { NextResponse } from "next/server";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/db/service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;
    const taskList = await getTasks(eventId);
    return NextResponse.json({ success: true, data: taskList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.eventId) {
      return NextResponse.json({ success: false, error: "Missing required task fields" }, { status: 400 });
    }
    const newTask = await createTask({
      eventId: body.eventId,
      userId: body.userId || "user_demo",
      title: body.title,
      description: body.description || "",
      dueDate: body.dueDate || "",
      priority: body.priority || "medium",
      status: body.status || "todo",
      assignedTo: body.assignedTo || "Unassigned",
    });
    return NextResponse.json({ success: true, data: newTask });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing task id" }, { status: 400 });
    }
    const updated = await updateTask(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing task id" }, { status: 400 });
    }
    const success = await deleteTask(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 });
  }
}
