import { Link } from "wouter";
import { RefreshCw, Clock } from "lucide-react";
import { useBTCPrice, getSpread } from "@/lib/btcPrice";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";

interface LiveBTCPriceProps {
  showCTA?: boolean;
  className?: string;
}

export function LiveBTCPrice({ showCTA = true, className = "" }: LiveBTCPriceProps) {
  const { price, change, changePercent, direction, lastUpdated, isLoading } = useBTCPrice();
  const { kycStatus } = useKYC();
  const spread = getSpread(1);
  const deskPrice = price * (1 + spread);
  const isPositive = direction === "up";

  const applyHref = kycStatus === KYC_STATUS.APPROVED ? "/bitcoin-otc/apply" : "/account/kyc";

  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-orange-400">₿</span>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Bitcoin — Live OTC Desk Price
        </h3>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div className="text-4xl font-bold font-mono text-foreground">
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </div>
        {!isLoading && (
          <div className={`flex items-center gap-1 text-sm font-mono mb-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            <span>{isPositive ? "▲" : "▼"}</span>
            <span>
              ${Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {" "}(+{Math.abs(changePercent).toFixed(2)}%) today
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-muted-foreground mb-6 border-t border-border pt-4">
        <div className="flex justify-between">
          <span>Our Desk Spread (1 BTC):</span>
          <span className="text-foreground font-mono">+{(spread * 100).toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Your Price (1 BTC):</span>
          <span className="text-primary font-mono font-semibold">
            ${deskPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {showCTA && (
        <Link
          href={applyHref}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="text-lg">₿</span> Apply to Buy Bitcoin Now
        </Link>
      )}

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Price refreshes every 30 seconds
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} EDT
        </span>
      </div>
    </div>
  );
}
