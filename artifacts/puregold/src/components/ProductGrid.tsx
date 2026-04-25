import { useState } from "react";
import { Search, List, Grid } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('best_selling');

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
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Try adjusting your filters or search criteria to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="product-grid">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground">{products.length}</span> products
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-background rounded border border-border p-1">
            <button 
              onClick={() => setView('grid')} 
              className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="btn-view-grid"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="btn-view-list"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            data-testid="select-sort"
          >
            <option value="best_selling">Best Selling</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="premium_asc">Premium: Lowest</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      <div className={view === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col gap-4"
      }>
        {products.map(product => (
          <div key={product.id} className={view === 'list' ? "w-full" : ""}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
