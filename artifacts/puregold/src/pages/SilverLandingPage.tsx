import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function SilverLandingPage() {
  const { data, isLoading } = useListProducts({ metal: 'silver', limit: 12 });
  const { data: featuredData, isLoading: featuredLoading } = useListProducts({ metal: 'silver', isFeatured: true, limit: 4 });

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-slate-800 to-black border-b border-border py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-slate-300 mb-6">Invest in Silver</h1>
          <p className="text-xl text-muted-foreground mb-10">Affordable, industrial, and monetary. Browse our extensive collection of silver coins, bars, and rounds.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif font-bold mb-8 text-foreground">Featured Silver</h2>
        <div className="mb-16">
          <ProductGrid products={featuredData?.products || []} isLoading={featuredLoading} />
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-8 text-foreground">All Silver Products</h2>
        <ProductGrid products={data?.products || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
