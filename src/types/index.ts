import { Session } from "next-auth";

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  emailVerified?: Date;
  isActive: boolean;
  addresses: IAddress[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  images: IProductImage[];
  category: ICategory;
  subcategory?: string;
  tags: string[];
  sku: string;
  barcode?: string;
  inventory: IInventory;
  attributes: IProductAttribute[];
  variants: IProductVariant[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: IReview[];
  isActive: boolean;
  isFeatured: boolean;
  seo: ISEO;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  url: string;
  alt?: string;
  isDefault: boolean;
}

export interface IInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorders: boolean;
}

export interface IProductAttribute {
  name: string;
  values: string[];
}

export interface IProductVariant {
  _id: string;
  sku: string;
  title: string;
  price: number;
  comparePrice?: number;
  inventory: number;
  attributes: { name: string; value: string }[];
  image?: string;
}

export interface IReview {
  _id: string;
  user: IUser;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: Date;
}

// Category Types
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  children: string[];
  isActive: boolean;
  sortOrder: number;
  seo: ISEO;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  payment: IPayment;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  _id: string;
  product: IProduct;
  variant?: IProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "confirmed" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "refunded";

export type FulfillmentStatus = 
  | "unfulfilled" 
  | "partial" 
  | "fulfilled";

export interface IPayment {
  method: "stripe" | "razorpay" | "cod";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: Date;
  amount: number;
}

// Cart Types
export interface ICartItem {
  product: IProduct;
  variant?: IProductVariant;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  coupon?: ICoupon;
}

// Coupon Types
export interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Blog Types
export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: IUser;
  category: IBlogCategory;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  views: number;
  likes: number;
  comments: IBlogComment[];
  seo: ISEO;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogComment {
  _id: string;
  user: IUser;
  content: string;
  isApproved: boolean;
  createdAt: Date;
}

// Testimonial Types
export interface ITestimonial {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  rating: number;
  title?: string;
  content: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Types
export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// SEO Types
export interface ISEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// Site Settings Types
export interface ISiteSettings {
  _id: string;
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
    twitter?: string;
  };
  seo: ISEO;
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface IAnalytics {
  sales: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  revenue: {
    daily: { date: string; amount: number }[];
    monthly: { month: string; amount: number }[];
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface AuthSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "user" | "admin";
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular" | "rating";
  search?: string;
  tags?: string[];
  inStock?: boolean;
}

// Notification Types
export interface INotification {
  _id: string;
  user: string;
  type: "order" | "payment" | "shipment" | "promotion" | "system";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}