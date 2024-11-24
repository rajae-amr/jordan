import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    
    // Test connection by counting users
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: "تم الاتصال بقاعدة البيانات بنجاح",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}