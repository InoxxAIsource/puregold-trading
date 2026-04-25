import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function PalladiumLandingPage() {
  const { data, isLoading } = useListProducts({ metal: 'palladium', limit: 12 });
  const { data: featuredData, isLoading: featuredLoading } = useListProducts({ metal: 'palladium', isFeatured: true, limit: 4 });

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-neutral-800 to-black border-b border-border py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-neutral-300 mb-6">Invest in Palladium</h1>
          <p className="text-xl text-muted-foreground mb-10">An essential industrial metal with growing investment demand. Browse our palladium collection.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif font-bold mb-8 text-foreground">Featured Palladium</h2>
        <div className="mb-16">
          <ProductGrid products={featuredData?.products || []} isLoading={featuredLoading} />
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-8 text-foreground">All Palladium Products</h2>
        <ProductGrid products={data?.products || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
