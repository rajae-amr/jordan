import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";
import Booking from "@/lib/models/Booking";
import Provider from "@/lib/models/Provider";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const reviews = await Review.find({ providerId: params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        userName: review.userId.name,
        createdAt: review.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التقييمات" },
      { status: 500 }
    );
  }
}

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

    const { rating, comment, bookingId } = await req.json();

    if (!rating || !bookingId) {
      return NextResponse.json(
        { error: "التقييم ورقم الحجز مطلوبان" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم يجب أن يكون بين 1 و 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من وجود الحجز وأنه مكتمل
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "completed") {
      return NextResponse.json(
        { error: "لا يمكن التقييم إلا بعد اكتمال الخدمة" },
        { status: 400 }
      );
    }

    // التحقق من ملكية الحجز
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "غير مصرح لك بالتقييم" },
        { status: 403 }
      );
    }

    // التحقق من عدم وجود تقييم سابق لنفس الحجز
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json(
        { error: "تم التقييم مسبقاً" },
        { status: 400 }
      );
    }

    // إنشاء التقييم
    const review = await Review.create({
      userId: session.user.id,
      providerId: params.id,
      bookingId,
      rating,
      comment,
    });

    // تحديث متوسط تقييم مقدم الخدمة
    const provider = await Provider.findById(params.id);
    if (provider) {
      const reviews = await Review.find({ providerId: params.id });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      provider.rating = Number((totalRating / reviews.length).toFixed(1));
      await provider.save();
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة التقييم" },
      { status: 500 }
    );
  }
}