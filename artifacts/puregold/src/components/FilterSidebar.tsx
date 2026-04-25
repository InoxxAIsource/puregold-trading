import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
  metals: string[];
  categories: string[];
  inStock: boolean;
  ira: boolean;
  onSale: boolean;
  newArrivals: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  metals: [],
  categories: [],
  inStock: false,
  ira: false,
  onSale: false,
  newArrivals: false,
};

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  metalLock?: string;
}

const METALS = ["Gold", "Silver", "Platinum", "Palladium", "Copper"];
const CATEGORIES = ["Coins", "Bars", "Rounds", "Notes", "Junk Silver"];

export function FilterSidebar({ filters, onFiltersChange, metalLock }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.metals.length > 0 ||
    filters.categories.length > 0 ||
    filters.inStock ||
    filters.ira ||
    filters.onSale ||
    filters.newArrivals;

  const toggleMetal = (metal: string) => {
    const next = filters.metals.includes(metal)
      ? filters.metals.filter((m) => m !== metal)
      : [...filters.metals, metal];
    onFiltersChange({ ...filters, metals: next });
  };

  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: next });
  };

  const toggleFeature = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: !filters[key as keyof FilterState] });
  };

  const clearAll = () => onFiltersChange(DEFAULT_FILTERS);

  return (
    <div
      className="w-full bg-card border border-border rounded-lg p-6 space-y-8"
      data-testid="filter-sidebar"
    >
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Metal Type — hidden if page already locks a metal */}
      {!metalLock && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
            Metal Type
          </h3>
          <div className="space-y-2">
            {METALS.map((metal) => (
              <label
                key={metal}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.metals.includes(metal)}
                  onChange={() => toggleMetal(metal)}
                  className="w-4 h-4 rounded border-border accent-[#C9A84C] cursor-pointer"
                  data-testid={`filter-metal-${metal.toLowerCase()}`}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {metal}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Product Category */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
          Product Type
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-border accent-[#C9A84C] cursor-pointer"
                data-testid={`filter-cat-${cat.toLowerCase().replace(" ", "-")}`}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Feature Filters */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
          Features
        </h3>
        <div className="space-y-2">
          {[
            { key: "inStock" as const, label: "In Stock Only" },
            { key: "ira" as const, label: "IRA Eligible" },
            { key: "onSale" as const, label: "On Sale" },
            { key: "newArrivals" as const, label: "New Arrivals" },
          ].map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={!!filters[opt.key]}
                onChange={() => toggleFeature(opt.key)}
                className="w-4 h-4 rounded border-border accent-[#C9A84C] cursor-pointer"
                data-testid={`filter-feat-${opt.key}`}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border flex flex-wrap gap-2">
          {filters.metals.map((m) => (
            <button
              key={m}
              onClick={() => toggleMetal(m)}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              {m} <X className="h-3 w-3" />
            </button>
          ))}
          {filters.categories.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              {c} <X className="h-3 w-3" />
            </button>
          ))}
          {filters.inStock && (
            <button
              onClick={() => toggleFeature("inStock")}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              In Stock <X className="h-3 w-3" />
            </button>
          )}
          {filters.ira && (
            <button
              onClick={() => toggleFeature("ira")}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              IRA <X className="h-3 w-3" />
            </button>
          )}
          {filters.onSale && (
            <button
              onClick={() => toggleFeature("onSale")}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              On Sale <X className="h-3 w-3" />
            </button>
          )}
          {filters.newArrivals && (
            <button
              onClick={() => toggleFeature("newArrivals")}
              className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30"
            >
              New <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
