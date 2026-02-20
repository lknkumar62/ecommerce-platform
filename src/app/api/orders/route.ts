import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, Product, Coupon } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const query: any = { user: session.user.id };
    
    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("items.product", "name images slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: orders,
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
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      notes,
    } = body;

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { success: false, error: `Product is not available: ${product.name}` },
          { status: 400 }
        );
      }

      // Check inventory
      if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for: ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.price;
      const total = price * item.quantity;
      subtotal += total;

      orderItems.push({
        product: product._id,
        variant: item.variantId || null,
        quantity: item.quantity,
        price,
        total,
      });

      // Update inventory
      if (product.inventory.trackInventory) {
        product.inventory.quantity -= item.quantity;
        await product.save();
      }
    }

    // Calculate discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(subtotal);
        if (validation.valid) {
          discount = coupon.calculateDiscount(subtotal);
          coupon.usageCount += 1;
          await coupon.save();
        }
      }
    }

    // Calculate shipping and tax
    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending",
        amount: total,
      },
      status: "pending",
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      couponCode: couponCode || undefined,
      notes,
    });

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name images slug")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedOrder,
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}