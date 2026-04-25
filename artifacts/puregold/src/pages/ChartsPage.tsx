import { Link } from "wouter";

export default function ChartsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Live Metal Charts</h1>
      <p className="text-muted-foreground mb-8">Track real-time spot prices and historical data for precious metals.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Gold', 'Silver', 'Platinum', 'Palladium', 'Copper', 'Bitcoin'].map(metal => (
          <Link key={metal} href={`/charts/${metal.toLowerCase()}`} className="block group">
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="font-serif font-bold text-xl">{metal.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{metal} Price Chart</h3>
              <p className="text-muted-foreground text-sm">View live and historical {metal.toLowerCase()} spot prices.</p>
            </div>
          </Link>
        ))}
        
        <Link href="/charts/gold-silver-ratio" className="block group">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-xl">G/S</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Gold/Silver Ratio</h3>
            <p className="text-muted-foreground text-sm">Track the historical relationship between gold and silver.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
