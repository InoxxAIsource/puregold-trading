import { useGetNewArrivals } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function NewArrivalsPage() {
  const { data, isLoading } = useGetNewArrivals();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">New Arrivals</h1>
      <p className="text-muted-foreground mb-8">The latest additions to our precious metals inventory.</p>
      <ProductGrid products={data || []} isLoading={isLoading} />
    </div>
  );
}
