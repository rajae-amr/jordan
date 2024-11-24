import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Provider from "@/lib/models/Provider";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, password, accountType, specialty, location, experience, bio } = await req.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password || !accountType) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "صيغة البريد الإلكتروني غير صحيحة" },
        { status: 400 }
      );
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType,
    });

    // إذا كان مزود خدمة، قم بإنشاء سجل في جدول Providers
    if (accountType === "provider") {
      if (!specialty || !location || !experience) {
        return NextResponse.json(
          { error: "جميع بيانات مزود الخدمة مطلوبة" },
          { status: 400 }
        );
      }

      await Provider.create({
        userId: user._id,
        specialty,
        location,
        experience,
        bio,
        rating: 0,
        reviews: [],
        available: true,
      });
    }

    // إرجاع النتيجة
    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}