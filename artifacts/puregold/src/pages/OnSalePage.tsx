import { useGetOnSaleProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function OnSalePage() {
  const { data, isLoading } = useGetOnSaleProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">On Sale</h1>
      <p className="text-muted-foreground mb-8">Special deals and discounts on premium precious metals.</p>
      <ProductGrid products={data || []} isLoading={isLoading} />
    </div>
  );
}
