import mongoose, { Schema, model, models } from "mongoose";
import { ICategory } from "@/types";
import slugify from "slugify";

const SEOSchema = new Schema({
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImage: { type: String },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
});

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seo: SEOSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug
CategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Post-save middleware to update parent's children array
CategorySchema.post("save", async function (doc) {
  if (doc.parent) {
    await mongoose.model("Category").findByIdAndUpdate(doc.parent, {
      $addToSet: { children: doc._id },
    });
  }
});

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;