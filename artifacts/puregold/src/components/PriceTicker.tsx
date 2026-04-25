import { usePrice } from "@/contexts/PriceContext";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceTicker() {
  const { spotPrices, isLoading } = usePrice();

  if (isLoading || !spotPrices.length) {
    return (
      <div className="w-full bg-card border-b border-border py-2 overflow-hidden flex" data-testid="price-ticker-loading">
        <Skeleton className="h-5 w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  // Duplicate for continuous scrolling
  const items = [...spotPrices, ...spotPrices, ...spotPrices, ...spotPrices];

  return (
    <div className="w-full bg-card border-b border-border py-2 overflow-hidden relative group" data-testid="price-ticker">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
        {items.map((price, idx) => (
          <div key={`${price.metal}-${idx}`} className="flex items-center gap-2 mx-8 font-mono text-sm">
            <span className="font-semibold text-foreground capitalize">{price.metal}</span>
            <span className="text-muted-foreground">${price.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            <span className={`flex items-center ${price.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {price.direction === 'up' ? '▲' : '▼'}${Math.abs(price.change).toFixed(2)} ({price.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}} />
    </div>
  );
}
