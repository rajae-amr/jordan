import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import stripe from "@/lib/stripe";
import Payment from "@/lib/models/Payment";
import Booking from "@/lib/models/Booking";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { bookingId, amount } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "جميع البيانات مطلوبة" },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من وجود الحجز
    const booking = await Booking.findById(bookingId)
      .populate("providerId");

    if (!booking) {
      return NextResponse.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من ملكية الحجز
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "غير مصرح لك بالدفع لهذا الحجز" },
        { status: 403 }
      );
    }

    // التحقق من عدم وجود دفع سابق
    const existingPayment = await Payment.findOne({
      bookingId,
      status: { $in: ['completed', 'pending'] }
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "تم الدفع مسبقاً لهذا الحجز" },
        { status: 400 }
      );
    }

    // إنشاء PaymentIntent في Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 1000), // تحويل إلى القروش
      currency: "jod",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingId,
        userId: session.user.id,
        providerId: booking.providerId._id.toString(),
      },
    });

    // تسجيل عملية الدفع في قاعدة البيانات
    await Payment.create({
      bookingId,
      userId: session.user.id,
      providerId: booking.providerId._id,
      amount,
      stripePaymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء عملية الدفع" },
      { status: 500 }
    );
  }
}