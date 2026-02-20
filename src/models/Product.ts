import mongoose, { Schema, model, models } from "mongoose";
import { IProduct } from "@/types";
import slugify from "slugify";

const ProductImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String },
  isDefault: { type: Boolean, default: false },
});

const InventorySchema = new Schema({
  quantity: { type: Number, required: true, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  trackInventory: { type: Boolean, default: true },
  allowBackorders: { type: Boolean, default: false },
});

const ProductAttributeSchema = new Schema({
  name: { type: String, required: true },
  values: [{ type: String }],
});

const ProductVariantSchema = new Schema({
  sku: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 },
  inventory: { type: Number, required: true, default: 0, min: 0 },
  attributes: [{ name: String, value: String }],
  image: { type: String },
});

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const SEOSchema = new Schema({
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImage: { type: String },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
    },
    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },
    images: [ProductImageSchema],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategory: {
      type: String,
    },
    tags: [{ type: String }],
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
    },
    barcode: {
      type: String,
    },
    inventory: {
      type: InventorySchema,
      default: () => ({}),
    },
    attributes: [ProductAttributeSchema],
    variants: [ProductVariantSchema],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [ReviewSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seo: SEOSchema,
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ "ratings.average": -1 });
ProductSchema.index({ createdAt: -1 });

// Virtual for discount percentage
ProductSchema.virtual("discountPercentage").get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status
ProductSchema.virtual("stockStatus").get(function () {
  if (!this.inventory.trackInventory) return "in_stock";
  if (this.inventory.quantity <= 0) {
    return this.inventory.allowBackorders ? "backorder" : "out_of_stock";
  }
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) {
    return "low_stock";
  }
  return "in_stock";
});

// Pre-save middleware to generate slug
ProductSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Method to update ratings
ProductSchema.methods.updateRatings = async function () {
  const reviews = this.reviews.filter((r: any) => r.isApproved !== false);
  if (reviews.length > 0) {
    const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    this.ratings.average = Math.round((total / reviews.length) * 10) / 10;
    this.ratings.count = reviews.length;
  } else {
    this.ratings.average = 0;
    this.ratings.count = 0;
  }
  await this.save();
};

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;