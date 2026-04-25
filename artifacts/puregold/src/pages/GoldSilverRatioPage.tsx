import { useGetSpotPrices } from "@workspace/api-client-react";

export default function GoldSilverRatioPage() {
  const { data } = useGetSpotPrices();
  const goldPrice = data?.prices.find(p => p.metal === "gold")?.price || 0;
  const silverPrice = data?.prices.find(p => p.metal === "silver")?.price || 0;
  
  const ratio = silverPrice > 0 ? (goldPrice / silverPrice).toFixed(2) : "0.00";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Gold/Silver Ratio</h1>
      
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-lg p-8 text-center h-full flex flex-col justify-center">
            <h2 className="text-muted-foreground uppercase tracking-widest text-sm font-bold mb-4">Current Ratio</h2>
            <div className="text-6xl font-mono font-bold text-primary mb-2">{ratio}</div>
            <p className="text-sm text-muted-foreground">Ounces of silver needed to buy one ounce of gold.</p>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">What does this mean?</h2>
          <div className="prose prose-invert text-muted-foreground">
            <p>The gold/silver ratio is the oldest continuously tracked exchange rate in history. Historically, the ratio was fixed by governments (the Roman Empire set it at 12:1, and the US originally set it at 15:1).</p>
            <p>In modern times, it floats freely based on market forces. Many investors use the ratio as a timing indicator:</p>
            <ul>
              <li><strong>High Ratio (e.g., &gt; 80):</strong> Silver is considered undervalued relative to gold. Investors often trade gold for silver.</li>
              <li><strong>Low Ratio (e.g., &lt; 50):</strong> Silver is considered overvalued relative to gold. Investors often trade silver for gold.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
