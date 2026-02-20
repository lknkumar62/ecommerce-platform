import mongoose, { Schema, model, models } from "mongoose";
import { ITestimonial } from "@/types";

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TestimonialSchema.index({ isActive: 1 });
TestimonialSchema.index({ sortOrder: 1 });
TestimonialSchema.index({ rating: -1 });

const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;