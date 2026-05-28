import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { auth } from "@/auth";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId,
      billingCycle 
    } = await req.json();

    await dbConnect();
    
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Bypass signature check for Free plan
    if (plan.monthlyPrice !== 0) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const email = req.auth.user?.email;
    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Calculate period end
    const now = new Date();
    const periodEnd = new Date();
    if (billingCycle === 'annual') {
      periodEnd.setFullYear(now.getFullYear() + 1);
    } else {
      periodEnd.setMonth(now.getMonth() + 1);
    }

    // Update or create subscriber
    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      {
        status: 'active',
        planTier: plan.tier,
        billingCycle: billingCycle,
        subscriptionId: razorpay_order_id,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        usage: [
          { metric: 'entities', current: 0, limit: plan.quotas.entities },
          { metric: 'assessments', current: 0, limit: plan.quotas.assessmentsPerMonth },
          { metric: 'pdf_reports', current: 0, limit: plan.quotas.pdfReportsPerMonth },
        ]
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Subscription activated successfully",
      subscriber 
    });

  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
