import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar, FilterState, DEFAULT_FILTERS } from "@/components/FilterSidebar";

export default function GoldLandingPage() {
  const { data, isLoading } = useListProducts({ metal: "gold", limit: 200 });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<string>("best_selling");

  const allGold = data?.products ?? [];

  const filtered = useMemo(() => {
    let result = [...allGold];

    if (filters.categories.length > 0) {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return filters.categories.some((c) => cat.includes(c.toLowerCase()));
      });
    }
    if (filters.inStock) result = result.filter((p) => p.inStock);
    if (filters.ira) result = result.filter((p) => p.isIRAEligible);
    if (filters.onSale) result = result.filter((p) => p.isOnSale);
    if (filters.newArrivals) result = result.filter((p) => p.isNew);

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "premium_asc":
        result.sort((a, b) => Number(a.premiumPct ?? 999) - Number(b.premiumPct ?? 999));
        break;
      case "newest":
        result.sort((a) => (a.isNew ? -1 : 1));
        break;
    }
    return result;
  }, [allGold, filters, sortBy]);

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#332a00] to-black border-b border-border py-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4">
            Invest in Gold
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The ultimate safe haven asset. Browse our extensive collection of gold coins,
            bars, and rounds from the world's most trusted mints.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { label: "Gold Coins", cat: "Coins" },
              { label: "Gold Bars", cat: "Bars" },
              { label: "Gold Rounds", cat: "Rounds" },
              { label: "IRA Eligible", feature: "ira" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.cat) {
                    const next = filters.categories.includes(item.cat)
                      ? filters.categories.filter((c) => c !== item.cat)
                      : [...filters.categories, item.cat];
                    setFilters({ ...filters, categories: next });
                  } else if (item.feature === "ira") {
                    setFilters({ ...filters, ira: !filters.ira });
                  }
                }}
                className={`rounded-lg p-3 text-sm font-bold border transition-colors text-center ${
                  (item.cat && filters.categories.includes(item.cat)) ||
                  (item.feature === "ira" && filters.ira)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 border-border hover:border-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products + Sidebar */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              metalLock="gold"
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
    </div>
  );
}
