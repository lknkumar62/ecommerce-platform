import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// POST /api/payment/stripe - Create Stripe payment intent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: session.user.id,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "inr",
      metadata: {
        orderId: orderId.toString(),
        userId: session.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating Stripe payment intent:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

// PUT /api/payment/stripe - Confirm Stripe payment
export async function PUT(req: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await req.json();

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Payment intent ID and order ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update order payment status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            "payment.status": "completed",
            "payment.transactionId": paymentIntent.id,
            "payment.paidAt": new Date(),
            status: "confirmed",
          },
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        data: order,
        message: "Payment completed successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error confirming Stripe payment:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to confirm payment" },
      { status: 500 }
    );
  }
}