import mongoose, { Schema, model, models } from "mongoose";
import { ISiteSettings } from "@/types";

const SEOSchema = new Schema({
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImage: { type: String },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
});

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: "E-Commerce Store",
    },
    siteDescription: {
      type: String,
      default: "Your one-stop shop for all your needs",
    },
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
      default: "support@example.com",
    },
    contactPhone: {
      type: String,
    },
    address: {
      type: String,
    },
    socialLinks: {
      youtube: { type: String },
      instagram: { type: String },
      facebook: { type: String },
      telegram: { type: String },
      twitter: { type: String },
    },
    seo: SEOSchema,
    analytics: {
      googleAnalyticsId: { type: String },
      facebookPixelId: { type: String },
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
SiteSettingsSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("SiteSettings").countDocuments();
    if (count > 0) {
      throw new Error("Only one site settings document is allowed");
    }
  }
  next();
});

const SiteSettings =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;