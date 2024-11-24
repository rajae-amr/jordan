import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Provider from "@/lib/models/Provider";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get("specialty");
    const location = searchParams.get("location");
    const query = searchParams.get("query");
    const limit = Number(searchParams.get("limit")) || undefined;

    let filter: any = { available: true };

    if (specialty && specialty !== "all") {
      filter.specialty = specialty;
    }

    if (location && location !== "all") {
      filter.location = location;
    }

    if (query) {
      filter.$or = [
        { specialty: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ];
    }

    const providers = await Provider.find(filter)
      .populate("userId", "name email")
      .sort({ rating: -1 })
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
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب مقدمي الخدمات" },
      { status: 500 }
    );
  }
}