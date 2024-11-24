import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Provider from "@/lib/models/Provider";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    if (session.user.accountType !== "provider") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول لهذه البيانات" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get provider ID
    const provider = await Provider.findOne({ userId: session.user.id });
    if (!provider) {
      return NextResponse.json(
        { error: "لم يتم العثور على مقدم الخدمة" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query: any = { providerId: provider._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .sort({ date: 1, time: 1 });

    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        user: booking.userId,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        notes: booking.notes,
      })),
    });
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحجوزات" },
      { status: 500 }
    );
  }
}