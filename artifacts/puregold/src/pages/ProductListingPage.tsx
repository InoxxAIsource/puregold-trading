import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar, FilterState, DEFAULT_FILTERS } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ListProductsMetal } from "@workspace/api-client-react";

const PAGE_LABELS: Record<string, string> = {
  platinum: "Platinum Bullion",
  palladium: "Palladium Bullion",
  copper: "Copper Bullion",
  "rare-coins": "Rare & Collectible Coins",
  "on-sale": "Products On Sale",
  "new-arrivals": "New Arrivals",
  featured: "Featured Products",
  "best-sellers": "Best Sellers",
};

export default function ProductListingPage() {
  const [location] = useLocation();
  const pathParts = location.split("/").filter(Boolean);
  const category = pathParts[0] || "all";

  const metalParam = ["gold", "silver", "platinum", "palladium", "copper"].includes(
    category.toLowerCase()
  )
    ? (category.toLowerCase() as ListProductsMetal)
    : undefined;

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<string>("best_selling");

  const { data, isLoading } = useListProducts({
    metal: metalParam,
    limit: 200,
  });

  const allProducts = data?.products ?? [];

  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Metal filter (only applies when no metalLock)
    if (filters.metals.length > 0) {
      result = result.filter((p) =>
        filters.metals.map((m) => m.toLowerCase()).includes(p.metalType)
      );
    }

    // Category / product type filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return filters.categories.some((c) => cat.includes(c.toLowerCase()));
      });
    }

    // Feature filters
    if (filters.inStock) result = result.filter((p) => p.inStock);
    if (filters.ira) result = result.filter((p) => p.isIRAEligible);
    if (filters.onSale) result = result.filter((p) => p.isOnSale);
    if (filters.newArrivals) result = result.filter((p) => p.isNew);

    // Sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "premium_asc":
        result.sort(
          (a, b) => Number(a.premiumPct ?? 999) - Number(b.premiumPct ?? 999)
        );
        break;
      case "newest":
        result.sort((a) => (a.isNew ? -1 : 1));
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, filters, sortBy]);

  const heading =
    PAGE_LABELS[category] ||
    `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-product-listing">
      <Breadcrumbs items={[{ label: heading }]} />

      <h1 className="text-3xl font-serif font-bold text-foreground mt-4 mb-2">
        {heading}
      </h1>
      <p className="text-muted-foreground mb-8">
        Browse our curated selection of premium precious metals bullion.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            metalLock={metalParam}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <ProductGrid
            products={filtered}
            isLoading={isLoading}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </main>
      </div>
    </div>
  );
}
