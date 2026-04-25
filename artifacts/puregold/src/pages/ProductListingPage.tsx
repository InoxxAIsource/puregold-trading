import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ListProductsMetal } from "@workspace/api-client-react";

export default function ProductListingPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Extract path to determine category
  const pathParts = location.split('/').filter(Boolean);
  const category = pathParts[0] || 'all'; // gold, silver, etc.
  
  const metalParam = ['gold', 'silver', 'platinum', 'palladium', 'copper'].includes(category.toLowerCase()) 
    ? category.toLowerCase() as ListProductsMetal 
    : undefined;

  const [sortBy, setSortBy] = useState<any>("best_selling");
  
  const { data, isLoading } = useListProducts({
    metal: metalParam,
    category: searchParams.get("category") || undefined,
    mint: searchParams.get("mint") || undefined,
    sortBy,
    limit: 24
  });

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-product-listing">
      <Breadcrumbs items={[
        { label: category.charAt(0).toUpperCase() + category.slice(1) }
      ]} />
      
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </aside>
        
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-serif font-bold text-foreground capitalize mb-2">
              {category === 'on-sale' ? 'On Sale' : 
               category === 'new-arrivals' ? 'New Arrivals' : 
               `${category} Products`}
            </h1>
            <p className="text-muted-foreground">
              Browse our selection of premium {category} bullion and coins.
            </p>
          </div>
          
          <ProductGrid 
            products={data?.products || []} 
            isLoading={isLoading} 
          />
        </main>
      </div>
    </div>
  );
}
