import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Provider from "@/lib/models/Provider";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

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

    const { date, time, notes } = await req.json();

    // Validate required fields
    if (!date || !time) {
      return NextResponse.json(
        { error: "التاريخ والوقت مطلوبان" },
        { status: 400 }
      );
    }

    // Validate date
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { error: "لا يمكن الحجز في تاريخ سابق" },
        { status: 400 }
      );
    }

    // Check if date is weekend (Friday or Saturday in Jordan)
    if (bookingDate.getDay() === 5 || bookingDate.getDay() === 6) {
      return NextResponse.json(
        { error: "لا يمكن الحجز في عطلة نهاية الأسبوع" },
        { status: 400 }
      );
    }

    // Validate time slot
    if (!TIME_SLOTS.includes(time)) {
      return NextResponse.json(
        { error: "وقت الحجز غير صحيح" },
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

    // Check if slot is available
    const existingBooking = await Booking.findOne({
      providerId: params.id,
      date: bookingDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "هذا الموعد محجوز مسبقاً" },
        { status: 400 }
      );
    }

    // Check if user has another booking at the same time
    const userBooking = await Booking.findOne({
      userId: session.user.id,
      date: bookingDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (userBooking) {
      return NextResponse.json(
        { error: "لديك حجز آخر في نفس الوقت" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      userId: session.user.id,
      providerId: params.id,
      date: bookingDate,
      time,
      notes,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
      },
    });
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حجز الموعد" },
      { status: 500 }
    );
  }
}