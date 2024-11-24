import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Provider from "@/lib/models/Provider";
import Booking from "@/lib/models/Booking";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم يجب أن يكون بين 1 و 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if provider exists
    const provider = await Provider.findById(params.id);
    if (!provider) {
      return NextResponse.json(
        { error: "مقدم الخدمة غير موجود" },
        { status: 404 }
      );
    }

    // Check if user has a completed booking with this provider
    const hasCompletedBooking = await Booking.findOne({
      userId: session.user.id,
      providerId: params.id,
      status: 'completed'
    });

    if (!hasCompletedBooking) {
      return NextResponse.json(
        { error: "يمكنك تقييم مقدم الخدمة فقط بعد اكتمال الخدمة" },
        { status: 400 }
      );
    }

    // Add review
    provider.reviews.push({
      userId: session.user.id,
      rating,
      comment,
    });

    await provider.save();

    return NextResponse.json({
      success: true,
      message: "تم إضافة التقييم بنجاح",
    });
  } catch (error: any) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة التقييم" },
      { status: 500 }
    );
  }
}