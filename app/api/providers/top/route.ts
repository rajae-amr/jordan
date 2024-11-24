import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Provider from "@/lib/models/Provider";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || 3;

    if (!category) {
      return NextResponse.json(
        { error: "يجب تحديد الفئة" },
        { status: 400 }
      );
    }

    await connectDB();

    const providers = await Provider.find({
      specialty: category,
      available: true,
      rating: { $gt: 0 } // فقط المزودين الذين لديهم تقييمات
    })
      .populate("userId", "name email")
      .sort({ rating: -1, "reviews.length": -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      providers: providers.map(provider => ({
        id: provider._id,
        name: provider.userId.name,
        specialty: provider.specialty,
        location: provider.location,
        experience: provider.experience,
        rating: provider.rating,
        reviews: provider.reviews.length,
        bio: provider.bio,
      })),
    });
  } catch (error) {
    console.error("Error fetching top providers:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب مقدمي الخدمات" },
      { status: 500 }
    );
  }
}