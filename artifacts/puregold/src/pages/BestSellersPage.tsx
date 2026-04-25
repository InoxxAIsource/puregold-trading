import { useGetBestSellers } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function BestSellersPage() {
  const { data, isLoading } = useGetBestSellers();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Best Sellers</h1>
      <p className="text-muted-foreground mb-8">Our most popular precious metals based on customer purchases.</p>
      <ProductGrid products={data || []} isLoading={isLoading} />
    </div>
  );
}
