import { useState } from "react";
import { usePrice } from "@/contexts/PriceContext";

interface PriceDisplayProps {
  basePrice: number;
  metalType?: string;
  weight?: number;
  premiumPct?: number;
  premiumAmt?: number;
}

export function PriceDisplay({ basePrice, metalType, weight, premiumPct, premiumAmt }: PriceDisplayProps) {
  const { spotPrices } = usePrice();
  const spotPrice = metalType ? spotPrices.find(p => p.metal === metalType.toLowerCase())?.price : undefined;
  
  let meltValue = undefined;
  if (spotPrice && weight) {
    meltValue = spotPrice * weight;
  }

  return (
    <div className="font-mono text-sm space-y-1 bg-card p-3 rounded border border-border" data-testid="price-display">
      {meltValue !== undefined && (
        <div className="flex justify-between text-muted-foreground">
          <span>Spot/Melt Value:</span>
          <span>${meltValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      )}
      {(premiumPct !== undefined || premiumAmt !== undefined) && (
        <div className="flex justify-between text-muted-foreground">
          <span>Premium:</span>
          <span>
            {premiumPct !== undefined ? `+${premiumPct.toFixed(1)}% ` : ''}
            {premiumAmt !== undefined ? `(+$${premiumAmt.toFixed(2)})` : ''}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center pt-1 border-t border-border mt-1">
        <span className="font-bold text-foreground">Our Price:</span>
        <span className="text-lg font-bold text-primary">${basePrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      </div>
    </div>
  );
}
