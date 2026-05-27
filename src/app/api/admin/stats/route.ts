import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const [totalUsers, activeSubscribers, totalSubscribers] = await Promise.all([
      User.countDocuments(),
      Subscriber.countDocuments({ status: "active" }),
      Subscriber.countDocuments(),
    ]);

    return NextResponse.json({ totalUsers, activeSubscribers, totalSubscribers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
