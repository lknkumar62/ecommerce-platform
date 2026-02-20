import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog/[slug] - Get single blog post
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = params;

    const post = await BlogPost.findOne({ slug, status: "published" })
      .populate("author", "name image")
      .populate("category", "name slug")
      .lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Increment views
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Update blog post (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { slug } = params;
    const body = await req.json();

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("author", "name image")
      .populate("category", "name slug");

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: "Blog post updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Delete blog post (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { slug } = params;

    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Decrement category post count
    await BlogPost.db.model("BlogCategory").findByIdAndUpdate(post.category, {
      $inc: { postCount: -1 },
    });

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}