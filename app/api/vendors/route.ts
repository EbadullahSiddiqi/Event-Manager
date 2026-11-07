import { NextResponse } from "next/server";
import { getVendors, createVendor, updateVendor, deleteVendor } from "@/lib/db/service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;
    const vendorList = await getVendors(eventId);
    return NextResponse.json({ success: true, data: vendorList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.eventId || !body.category) {
      return NextResponse.json({ success: false, error: "Missing required vendor fields" }, { status: 400 });
    }
    const newVendor = await createVendor({
      eventId: body.eventId,
      userId: body.userId || "user_demo",
      name: body.name,
      category: body.category,
      contactPerson: body.contactPerson || "",
      email: body.email || "",
      phone: body.phone || "",
      status: body.status || "contacted",
      cost: Number(body.cost) || 0,
      notes: body.notes || "",
    });
    return NextResponse.json({ success: true, data: newVendor });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create vendor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing vendor id" }, { status: 400 });
    }
    const updated = await updateVendor(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing vendor id" }, { status: 400 });
    }
    const success = await deleteVendor(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete vendor" }, { status: 500 });
  }
}
