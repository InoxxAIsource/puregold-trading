import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoldLandingPage() {
  const { data, isLoading } = useListProducts({ metal: 'gold', limit: 12 });
  const { data: featuredData, isLoading: featuredLoading } = useListProducts({ metal: 'gold', isFeatured: true, limit: 4 });

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#332a00] to-black border-b border-border py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-primary mb-6">Invest in Gold</h1>
          <p className="text-xl text-muted-foreground mb-10">The ultimate safe haven asset. Browse our extensive collection of gold coins, bars, and rounds from the world's most trusted mints.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Link href="/gold?category=coins" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <h3 className="font-bold">Gold Coins</h3>
          </Link>
          <Link href="/gold?category=bars" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <h3 className="font-bold">Gold Bars</h3>
          </Link>
          <Link href="/gold?mint=us" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <h3 className="font-bold">US Mint Gold</h3>
          </Link>
          <Link href="/gold?ira=true" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <h3 className="font-bold">IRA Eligible</h3>
          </Link>
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-8">Featured Gold</h2>
        <div className="mb-16">
          <ProductGrid products={featuredData?.products || []} isLoading={featuredLoading} />
        </div>
        
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold">All Gold Products</h2>
          <Link href="/gold?all=true" className="text-primary font-bold uppercase text-sm">View All Filtered</Link>
        </div>
        <ProductGrid products={data?.products || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
