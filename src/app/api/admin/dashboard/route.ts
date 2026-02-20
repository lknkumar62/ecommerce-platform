import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Order, Product, BlogPost } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/dashboard - Get dashboard analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const thisYearStart = new Date(today.getFullYear(), 0, 1);

    // Sales analytics
    const [totalSales, todaySales, weekSales, monthSales, yearSales] = await Promise.all([
      Order.aggregate([{ $match: { "payment.status": "completed" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: today }, "payment.status": "completed" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: thisWeekStart }, "payment.status": "completed" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: thisMonthStart }, "payment.status": "completed" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: thisYearStart }, "payment.status": "completed" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);

    // Order counts
    const [totalOrders, todayOrders, pendingOrders, processingOrders, completedOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
    ]);

    // User analytics
    const [totalUsers, newUsersToday, newUsersThisWeek, newUsersThisMonth] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: thisWeekStart } }),
      User.countDocuments({ createdAt: { $gte: thisMonthStart } }),
    ]);

    // Product analytics
    const [totalProducts, activeProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({
        isActive: true,
        "inventory.trackInventory": true,
        "inventory.quantity": { $gt: 0, $lte: 5 },
      }),
      Product.countDocuments({
        isActive: true,
        "inventory.trackInventory": true,
        "inventory.quantity": 0,
      }),
    ]);

    // Daily revenue for chart (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          "payment.status": "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly revenue for chart (last 12 months)
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          "payment.status": "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          amount: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent users
    const recentUsers = await User.find({ role: "user" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Low stock products
    const lowStockProductsList = await Product.find({
      isActive: true,
      "inventory.trackInventory": true,
      "inventory.quantity": { $gt: 0, $lte: 5 },
    })
      .select("name sku inventory.quantity")
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        sales: {
          total: totalSales[0]?.total || 0,
          today: todaySales[0]?.total || 0,
          thisWeek: weekSales[0]?.total || 0,
          thisMonth: monthSales[0]?.total || 0,
          thisYear: yearSales[0]?.total || 0,
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        revenue: {
          daily: dailyRevenue.map((d) => ({ date: d._id, amount: d.amount })),
          monthly: monthlyRevenue.map((m) => ({ month: m._id, amount: m.amount })),
        },
        recentOrders,
        recentUsers,
        lowStockProducts: lowStockProductsList,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}