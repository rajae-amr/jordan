import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Provider from "@/lib/models/Provider";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const provider = await Provider.findById(params.id)
      .populate("userId", "name email")
      .populate("reviews.userId", "name");

    if (!provider) {
      return NextResponse.json(
        { error: "مقدم الخدمة غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: {
        id: provider._id,
        name: provider.userId.name,
        specialty: provider.specialty,
        location: provider.location,
        experience: provider.experience,
        rating: provider.rating,
        bio: provider.bio,
        reviews: provider.reviews.map(review => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          userName: review.userId.name,
          createdAt: review.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات مقدم الخدمة" },
      { status: 500 }
    );
  }
}