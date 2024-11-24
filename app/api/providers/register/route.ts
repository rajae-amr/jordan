import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Provider from "@/lib/models/Provider";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { specialty, location, experience, bio } = await req.json();

    if (!specialty || !location || !experience) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    await connectDB();

    // التحقق من عدم وجود حساب مقدم خدمة مسبق
    const existingProvider = await Provider.findOne({ userId: session.user.id });
    if (existingProvider) {
      return NextResponse.json(
        { error: "لديك حساب مقدم خدمة بالفعل" },
        { status: 400 }
      );
    }

    const provider = await Provider.create({
      userId: session.user.id,
      specialty,
      location,
      experience,
      bio,
    });

    return NextResponse.json({
      success: true,
      provider: {
        id: provider._id,
        specialty: provider.specialty,
        location: provider.location,
        experience: provider.experience,
        bio: provider.bio,
      },
    });
  } catch (error) {
    console.error("Error registering provider:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل مقدم الخدمة" },
      { status: 500 }
    );
  }
}