import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/testimonials - Get all testimonials
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const query: any = {};
    
    if (!includeInactive) {
      query.isActive = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();

    // Validate required fields
    const requiredFields = ["name", "rating", "content"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const testimonial = await Testimonial.create(body);

    return NextResponse.json(
      { success: true, data: testimonial, message: "Testimonial created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}