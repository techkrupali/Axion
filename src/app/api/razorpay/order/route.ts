import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const { amount, currency = "INR" } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_user_${req.auth.user?.id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
