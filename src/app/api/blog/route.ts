import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { BlogPost, BlogCategory } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog - Get all blog posts
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status") || "published";

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      const categoryDoc = await BlogCategory.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Execute query
    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate("author", "name image")
        .populate("category", "name slug")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create new blog post (Admin only)
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
    const requiredFields = ["title", "content", "category"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set author to current user
    body.author = session.user.id;

    const post = await BlogPost.create(body);

    // Update category post count
    await BlogCategory.findByIdAndUpdate(body.category, {
      $inc: { postCount: 1 },
    });

    const populatedPost = await BlogPost.findById(post._id)
      .populate("author", "name image")
      .populate("category", "name slug");

    return NextResponse.json(
      { success: true, data: populatedPost, message: "Blog post created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}