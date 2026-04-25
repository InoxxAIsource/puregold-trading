import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useBTCPrice, getSpread, calcTotal, BTC_SPREAD_TIERS } from "@/lib/btcPrice";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";

export function BTCCalculator() {
  const [btcAmount, setBtcAmount] = useState(1.0);
  const { price, isLoading } = useBTCPrice();
  const { kycStatus } = useKYC();
  const [, setLocation] = useLocation();

  const clamp = (v: number) => Math.min(10, Math.max(0.2, v));

  const spread = getSpread(btcAmount);
  const pricePerBtc = price * (1 + spread);
  const total = calcTotal(btcAmount, price);
  const spreadUSD = price * spread;

  const activeTierIdx = BTC_SPREAD_TIERS.findIndex(
    t => btcAmount >= t.minBtc && btcAmount <= t.maxBtc
  );
  const nextTier = BTC_SPREAD_TIERS[activeTierIdx + 1];

  const handleApply = () => {
    if (kycStatus !== KYC_STATUS.APPROVED) {
      setLocation("/account/kyc");
    } else {
      setLocation(`/bitcoin-otc/apply?btc=${btcAmount.toFixed(2)}`);
    }
  };

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center gap-2 bg-secondary/20">
        <span className="text-xl font-bold text-orange-400">₿</span>
        <h3 className="font-semibold text-foreground">Bitcoin OTC Calculator</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            I want to buy:
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min={0.2}
                max={10}
                step={0.01}
                value={btcAmount}
                onChange={e => setBtcAmount(clamp(parseFloat(e.target.value) || 0.2))}
                className="w-full bg-background border border-border rounded-lg py-3 px-4 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">BTC</span>
            </div>
          </div>
          <div className="mt-3">
            <input
              type="range"
              min={0.2}
              max={10}
              step={0.01}
              value={btcAmount}
              onChange={e => setBtcAmount(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.20 BTC</span>
              <span>10 BTC</span>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm font-mono">
          <div className="flex justify-between text-muted-foreground">
            <span>Spot Price:</span>
            <span className="text-foreground">${fmt(price)} / BTC</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Desk Spread:</span>
            <span className="text-foreground">+{(spread * 100).toFixed(2)}% (${fmt(spreadUSD)})</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Your Price Per BTC:</span>
            <span className="text-foreground">${fmt(pricePerBtc)}</span>
          </div>
          <div className="border-t border-border/50 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-bold text-foreground text-base">TOTAL COST:</span>
              <span className="font-bold text-primary text-base">${fmt(total)} USD</span>
            </div>
          </div>
        </div>

        {/* Settlement info */}
        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-secondary/20 rounded-lg p-2.5">
            <div className="text-muted-foreground mb-0.5">Settlement</div>
            <div className="font-semibold text-foreground">Bank Wire</div>
          </div>
          <div className="bg-secondary/20 rounded-lg p-2.5">
            <div className="text-muted-foreground mb-0.5">Delivery</div>
            <div className="font-semibold text-foreground">Your wallet</div>
          </div>
          <div className="bg-secondary/20 rounded-lg p-2.5">
            <div className="text-muted-foreground mb-0.5">Est. Time</div>
            <div className="font-semibold text-foreground">24 hours</div>
          </div>
        </div>

        {/* Next tier hint */}
        {nextTier && (
          <p className="text-xs text-muted-foreground text-center">
            Enter {nextTier.minBtc}+ BTC for {(nextTier.spread * 100).toFixed(2)}% spread
            {" "}(save ${fmt((spread - nextTier.spread) * price * btcAmount)})
          </p>
        )}

        <button
          onClick={handleApply}
          className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Apply to Buy {btcAmount.toFixed(2)} BTC — ${fmt(total)} USD
        </button>
      </div>
    </div>
  );
}
