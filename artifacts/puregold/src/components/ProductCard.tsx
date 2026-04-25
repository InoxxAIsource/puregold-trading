import { Link } from "wouter";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCartContext } from "@/contexts/CartContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartContext();
  const { hasItem, addItem: addToWatchlist, removeItem: removeFromWatchlist } = useWatchlist();
  const isWatched = hasItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      metalType: product.metalType
    });
  };

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWatched) removeFromWatchlist(product.id);
    else addToWatchlist(product.id);
  };

  return (
    <Link href={`/product/${product.slug}`} className="block group product-card" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square bg-[#0f0f0f] rounded-t-lg overflow-hidden p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isOnSale && <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">Sale</span>}
          {product.isNew && <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>}
          {product.isIRAEligible && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">IRA</span>}
          {product.inStock && (product.stockQty ?? 0) < 10 && (product.stockQty ?? 0) > 0 && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Low Stock</span>}
        </div>

        <button 
          onClick={toggleWatchlist} 
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/50 hover:bg-background backdrop-blur-sm transition-colors text-muted-foreground hover:text-red-500"
          data-testid={`btn-watchlist-${product.id}`}
        >
          <Heart className="h-4 w-4" fill={isWatched ? "currentColor" : "none"} color={isWatched ? "#ef4444" : "currentColor"} />
        </button>

        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-screen transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <span className="text-muted-foreground text-xs">No Image</span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full h-9 text-xs" variant="secondary" data-testid={`btn-quickadd-${product.id}`}>
            <ShoppingCart className="h-3 w-3 mr-2" />
            {product.inStock ? "Quick Add" : "Out of Stock"}
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase flex items-center justify-between">
            <span>{product.mint || product.category}</span>
            <span>{product.year}</span>
          </div>
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-2">
          <div className="flex items-end gap-2">
            <span className="text-lg font-mono font-bold text-primary">
              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span>
            {product.msrp && product.msrp > product.price && (
              <span className="text-xs text-muted-foreground line-through font-mono mb-1">
                ${product.msrp.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            )}
          </div>
          {product.premiumPct && (
            <div className="text-xs text-muted-foreground mt-1">
              +{product.premiumPct.toFixed(1)}% over spot
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
