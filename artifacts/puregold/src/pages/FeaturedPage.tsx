import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function FeaturedPage() {
  const { data, isLoading } = useGetFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Featured Products</h1>
      <p className="text-muted-foreground mb-8">Hand-picked premium selections from our numismatists.</p>
      <ProductGrid products={data || []} isLoading={isLoading} />
    </div>
  );
}
