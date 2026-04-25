import { useState } from "react";
import { usePrice } from "@/contexts/PriceContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MeltValueCalculator() {
  const { spotPrices } = usePrice();
  const [metal, setMetal] = useState("gold");
  const [purity, setPurity] = useState(0.999);
  const [weight, setWeight] = useState(1);
  const [unit, setUnit] = useState("oz");
  const [qty, setQty] = useState(1);

  const spotPrice = spotPrices.find(p => p.metal === metal)?.price || 0;
  
  // Convert to troy oz
  let weightInOz = weight;
  if (unit === "g") weightInOz = weight / 31.1035;
  if (unit === "kg") weightInOz = weight * 32.1507;
  
  const meltValue = weightInOz * purity * spotPrice * qty;
  const buybackValue = meltValue * 0.97; // 97% of melt

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6" data-testid="melt-calculator">
      <h3 className="text-xl font-serif font-bold text-foreground border-b border-border pb-3">Melt Value Calculator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Metal</Label>
          <select 
            value={metal} 
            onChange={(e) => setMetal(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="palladium">Palladium</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Purity</Label>
          <select 
            value={purity} 
            onChange={(e) => setPurity(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="0.999">.999 Pure (24k)</option>
            <option value="0.9167">.9167 (22k)</option>
            <option value="0.900">.900 (Coin)</option>
            <option value="0.750">.750 (18k)</option>
            <option value="0.5833">.583 (14k)</option>
            <option value="0.925">.925 (Sterling)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Weight (per item)</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="flex-1"
              min="0.01"
              step="0.01"
            />
            <select 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              className="w-24 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="oz">Troy Oz</option>
              <option value="g">Grams</option>
              <option value="kg">Kilos</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input 
            type="number" 
            value={qty} 
            onChange={(e) => setQty(Number(e.target.value))}
            min="1"
            step="1"
          />
        </div>
      </div>
      
      <div className="bg-background border border-border rounded-lg p-4 space-y-2 font-mono text-sm mt-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Current Spot ({metal}):</span>
          <span>${spotPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}/oz</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Total Pure Weight:</span>
          <span>{(weightInOz * purity * qty).toFixed(4)} oz</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border mt-2">
          <span className="font-bold text-foreground">Total Melt Value:</span>
          <span className="font-bold text-foreground">${meltValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border border-dashed mt-2">
          <span className="font-bold text-primary">If you sold to us:</span>
          <span className="font-bold text-primary">${buybackValue.toLocaleString(undefined, {minimumFractionDigits: 2})} (at 97%)</span>
        </div>
      </div>
    </div>
  );
}
