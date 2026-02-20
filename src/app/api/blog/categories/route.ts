import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { BlogCategory } from "@/models";

// GET /api/blog/categories - Get all blog categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await BlogCategory.find()
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}