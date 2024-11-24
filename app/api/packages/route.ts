import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";

export async function GET() {
  try {
    await connectDB();

    const packages = await Package.find({ isActive: true })
      .sort({ price: 1 });

    return NextResponse.json({
      success: true,
      packages: packages.map(pkg => ({
        id: pkg._id,
        name: pkg.name,
        description: pkg.description,
        features: pkg.features,
        price: pkg.price,
        duration: pkg.duration,
        maxBookings: pkg.maxBookings,
        isPopular: pkg.isPopular,
      })),
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الباقات" },
      { status: 500 }
    );
  }
}