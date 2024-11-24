import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Provider from "@/lib/models/Provider";
import Booking from "@/lib/models/Booking";

export async function GET() {
  try {
    await connectDB();

    // Get total members (users with client account type)
    const membersCount = await User.countDocuments({ accountType: 'client' });
    
    // Get total providers
    const providersCount = await Provider.countDocuments();

    // Get average rating of all providers
    const providers = await Provider.find();
    let totalRating = 0;
    let providersWithRatings = 0;
    
    providers.forEach(provider => {
      if (provider.rating > 0) {
        totalRating += provider.rating;
        providersWithRatings++;
      }
    });

    const averageRating = providersWithRatings > 0 
      ? Number((totalRating / providersWithRatings).toFixed(1))
      : 0;

    // Get completed services count
    const completedServices = await Booking.countDocuments({ status: 'completed' });

    return NextResponse.json({
      success: true,
      statistics: {
        members: membersCount,
        providers: providersCount,
        averageRating,
        completedServices,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإحصائيات" },
      { status: 500 }
    );
  }
}