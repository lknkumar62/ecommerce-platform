import { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CategoriesSection } from "@/components/sections/categories-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { BlogPreview } from "@/components/sections/blog-preview";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover amazing products at unbeatable prices. Shop now for the best deals on electronics, fashion, home goods, and more.",
  openGraph: {
    title: "ShopHub - Your One-Stop Shop",
    description: "Discover amazing products at unbeatable prices. Shop now for the best deals!",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <BlogPreview />
      <NewsletterSection />
    </div>
  );
}