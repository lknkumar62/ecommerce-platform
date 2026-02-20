"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/types";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercentage = product.comparePrice
    ? calculateDiscountPercentage(product.comparePrice, product.price)
    : 0;

  const defaultImage = product.images.find((img) => img.isDefault)?.url || product.images[0]?.url;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        className="group relative bg-card rounded-xl border overflow-hidden product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={defaultImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="font-semibold">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary" className="font-semibold">
                Featured
              </Badge>
            )}
            {product.stockStatus === "out_of_stock" && (
              <Badge variant="outline" className="bg-background/80">
                Out of Stock
              </Badge>
            )}
            {product.stockStatus === "low_stock" && (
              <Badge variant="outline" className="bg-yellow-500/80 text-white border-0">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 right-3 flex gap-2"
            >
              <Button
                size="sm"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stockStatus === "out_of_stock"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground mb-1">
            {typeof product.category === "object" ? product.category.name : "Category"}
          </p>

          {/* Name */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(product.ratings.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.ratings.count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}