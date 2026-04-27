import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCartContext } from "@/contexts/CartContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartContext();
  const { hasItem, addItem: addToWatchlist, removeItem: removeFromWatchlist } = useWatchlist();
  const { isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  const isWatched = hasItem(product.id);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      metalType: product.metalType,
    };

    if (!isLoggedIn) {
      // Save pending cart item so it can be restored after login
      localStorage.setItem("pg_pending_cart", JSON.stringify(item));
      setLocation(`/account/login?redirect=/cart`);
      return;
    }

    addItem(item);
  };

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWatched) removeFromWatchlist(product.id);
    else addToWatchlist(product.id);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block group product-card"
      data-testid={`card-product-${product.id}`}
    >
      <div className="bg-card border border-[#C9A84C]/25 rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-[1.012]">
        {/* Image container */}
        <div
          className="relative bg-[#111] flex items-center justify-center overflow-hidden"
          style={{ height: "220px" }}
        >
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isOnSale && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Sale
              </span>
            )}
            {product.isNew && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                New
              </span>
            )}
            {product.isIRAEligible && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                IRA
              </span>
            )}
            {product.inStock &&
              (product.stockQty ?? 0) < 10 &&
              (product.stockQty ?? 0) > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Low Stock
                </span>
              )}
          </div>

          {/* Watchlist */}
          <button
            onClick={toggleWatchlist}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/60 hover:bg-background backdrop-blur-sm transition-colors text-muted-foreground hover:text-red-500"
            data-testid={`btn-watchlist-${product.id}`}
            aria-label={isWatched ? `Remove ${product.name} from watchlist` : `Add ${product.name} to watchlist`}
          >
            <Heart
              className="h-4 w-4"
              fill={isWatched ? "currentColor" : "none"}
              color={isWatched ? "#ef4444" : "currentColor"}
              aria-hidden="true"
            />
          </button>

          {/* Product image or coin placeholder */}
          <div className="flex items-center justify-center w-full h-full p-5">
            {product.images[0] && !imgError ? (
              <img
                src={product.images[0]}
                alt={`${product.name} - Physical Bullion`}
                width={180}
                height={180}
                loading="lazy"
                decoding="async"
                className="max-h-[180px] max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "drop-shadow(0 4px 16px rgba(201,168,76,0.25))" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="transition-transform duration-500 group-hover:scale-105">
                <CoinPlaceholder metal={product.metalType} name={product.name} />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1 font-semibold tracking-wider uppercase flex items-center justify-between">
              <span>{product.mint || product.category}</span>
              <span>{product.year}</span>
            </div>
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          <div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-lg font-mono font-bold text-primary">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {product.msrp && product.msrp > product.price && (
                <span className="text-xs text-muted-foreground line-through font-mono mb-0.5">
                  ${product.msrp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
            {product.premiumPct != null && (
              <div className="text-[11px] text-muted-foreground mb-3">
                +{Number(product.premiumPct).toFixed(1)}% over spot
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-9 text-xs font-semibold"
              variant="default"
              data-testid={`btn-addtocart-${product.id}`}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              {product.inStock
                ? isLoggedIn
                  ? "Add to Cart"
                  : "Sign In to Buy"
                : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
