import { MeltValueCalculator } from "@/components/MeltValueCalculator";

export default function JunkSilverPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">90% "Junk" Silver</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-3xl">Pre-1965 US Dimes, Quarters, and Half Dollars contain 90% pure silver. They are highly recognizable, fractional, and carry low premiums.</p>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">Why buy 90% Silver?</h2>
          <div className="space-y-6 text-muted-foreground">
            <p>The term "junk silver" is a misnomer. These coins are anything but junk—they are official US currency minted before 1965 when dimes, quarters, and half dollars were made of 90% silver and 10% copper.</p>
            <p>They derive their value entirely from their silver content, not their numismatic (collectible) value.</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground">
              <li><strong>Highly Liquid:</strong> Instantly recognizable anywhere in the world.</li>
              <li><strong>Fractional:</strong> A pre-1965 dime contains about 0.0715 oz of silver, making it perfect for small transactions.</li>
              <li><strong>Low Premium:</strong> Often sold closer to the spot price of silver than newly minted coins.</li>
              <li><strong>Historical:</strong> You are holding a piece of American monetary history.</li>
            </ul>
            <div className="bg-primary/10 border border-primary/20 rounded p-4 text-primary text-sm">
              <strong className="block mb-1">Rule of Thumb:</strong>
              $1.00 Face Value (e.g., 10 dimes, or 4 quarters) contains approximately 0.715 troy ounces of pure silver.
            </div>
          </div>
        </div>
        
        <div>
          <MeltValueCalculator />
        </div>
      </div>
    </div>
  );
}
