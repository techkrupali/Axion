import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { auth } from "@/auth";

export const PATCH = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = req.nextUrl.pathname.split('/').pop();
    const data = await req.json();
    await dbConnect();
    const plan = await SubscriptionPlan.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(plan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = req.nextUrl.pathname.split('/').pop();
    await dbConnect();
    await SubscriptionPlan.findByIdAndDelete(id);
    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
