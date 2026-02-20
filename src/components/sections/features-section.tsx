"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Headphones, Package, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over ₹500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment methods",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round the clock customer service",
  },
  {
    icon: Package,
    title: "Quality Products",
    description: "Handpicked quality items only",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive prices guaranteed",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}