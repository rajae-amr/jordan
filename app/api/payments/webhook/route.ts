import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import Booking from "@/lib/models/Booking";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;

    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    // التحقق من صحة الإشعار
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    await connectDB();

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      // تحديث حالة الدفع
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (payment) {
        payment.status = "completed";
        await payment.save();

        // تحديث حالة الحجز
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "pending", // في انتظار موافقة مقدم الخدمة
        });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (payment) {
        payment.status = "failed";
        await payment.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}