import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";
import ProviderSubscription from "@/lib/models/ProviderSubscription";
import Provider from "@/lib/models/Provider";
import stripe from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { packageId } = await req.json();

    if (!packageId) {
      return NextResponse.json(
        { error: "معرف الباقة مطلوب" },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من وجود الباقة
    const pkg = await Package.findById(packageId);
    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { error: "الباقة غير موجودة أو غير متاحة" },
        { status: 404 }
      );
    }

    // التحقق من وجود مزود الخدمة
    const provider = await Provider.findOne({ userId: session.user.id });
    if (!provider) {
      return NextResponse.json(
        { error: "يجب التسجيل كمزود خدمة أولاً" },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود اشتراك فعال
    const activeSubscription = await ProviderSubscription.findOne({
      providerId: provider._id,
      status: 'active',
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: "لديك اشتراك فعال بالفعل" },
        { status: 400 }
      );
    }

    // إنشاء جلسة دفع في Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jod',
            product_data: {
              name: pkg.name,
              description: pkg.description,
            },
            unit_amount: pkg.price * 1000, // تحويل إلى القروش
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/packages/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/packages`,
      metadata: {
        packageId: pkg._id.toString(),
        providerId: provider._id.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("Error subscribing to package:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء الاشتراك في الباقة" },
      { status: 500 }
    );
  }
}