import { List, Grid, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export function ProductGrid({ products, isLoading, sortBy = "best_selling", onSortChange }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3 mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="w-full text-center py-20 bg-card border border-border rounded-lg" data-testid="product-grid-empty">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Try adjusting your filters or search criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="product-grid">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground font-bold">{products.length}</span> products
        </div>

        <div className="flex items-center gap-3">
          {onSortChange && (
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
              data-testid="select-sort"
            >
              <option value="best_selling">Best Selling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="premium_asc">Premium: Lowest</option>
              <option value="newest">New Arrivals</option>
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
