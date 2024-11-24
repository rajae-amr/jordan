import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";

export async function PUT(
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

    const { status } = await req.json();

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "حالة الحجز غير صحيحة" },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(params.id)
      .populate("providerId", "userId");

    if (!booking) {
      return NextResponse.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من صلاحية المستخدم لتحديث الحجز
    if (booking.providerId.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "غير مصرح لك بتحديث حالة الحجز" },
        { status: 403 }
      );
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الحجز" },
      { status: 500 }
    );
  }
}