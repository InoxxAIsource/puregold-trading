import { BTC_SPREAD_TIERS } from "@/lib/btcPrice";

interface TierTableProps {
  btcSpot: number;
  highlightAmount?: number;
}

export function TierTable({ btcSpot, highlightAmount }: TierTableProps) {
  const activeIndex = highlightAmount !== undefined
    ? BTC_SPREAD_TIERS.findIndex(t => highlightAmount >= t.minBtc && highlightAmount <= t.maxBtc)
    : -1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium">BTC Amount</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Desk Spread</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium">Est. Price / BTC</th>
          </tr>
        </thead>
        <tbody>
          {BTC_SPREAD_TIERS.map((tier, i) => {
            const estPrice = btcSpot * (1 + tier.spread);
            const isActive = i === activeIndex;
            return (
              <tr
                key={tier.label}
                className={`border-b border-border/40 transition-colors ${
                  isActive ? "bg-primary/10 border-primary/30" : "hover:bg-secondary/20"
                }`}
              >
                <td className={`py-3 px-4 font-mono ${isActive ? "text-primary font-semibold" : "text-foreground"}`}>
                  {tier.label} BTC
                  {isActive && <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Your tier</span>}
                </td>
                <td className={`py-3 px-4 font-mono ${isActive ? "text-primary font-semibold" : "text-foreground"}`}>
                  +{(tier.spread * 100).toFixed(2)}%
                </td>
                <td className={`py-3 px-4 text-right font-mono ${isActive ? "text-primary font-semibold" : "text-foreground"}`}>
                  ${estPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-2 px-4 pb-2">
        Prices shown are indicative. Final price locked at quote when wire is received.
      </p>
    </div>
  );
}
