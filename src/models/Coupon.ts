import mongoose, { Schema, model, models } from "mongoose";
import { ICoupon } from "@/types";

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchase: {
      type: Number,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ startDate: 1, endDate: 1 });

// Method to check if coupon is valid
CouponSchema.methods.isValid = function (subtotal: number): {
  valid: boolean;
  message?: string;
} {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, message: "Coupon is not active" };
  }

  if (now < this.startDate) {
    return { valid: false, message: "Coupon is not yet valid" };
  }

  if (now > this.endDate) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  if (this.minPurchase && subtotal < this.minPurchase) {
    return {
      valid: false,
      message: `Minimum purchase of ${this.minPurchase} required`,
    };
  }

  return { valid: true };
};

// Method to calculate discount
CouponSchema.methods.calculateDiscount = function (subtotal: number): number {
  let discount = 0;

  if (this.discountType === "percentage") {
    discount = (subtotal * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }

  if (this.maxDiscount && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }

  return Math.min(discount, subtotal);
};

const Coupon = models.Coupon || model<ICoupon>("Coupon", CouponSchema);

export default Coupon;