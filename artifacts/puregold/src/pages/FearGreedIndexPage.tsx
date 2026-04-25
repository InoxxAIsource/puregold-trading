export default function FearGreedIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Precious Metals Fear & Greed Index</h1>
      <p className="text-muted-foreground mb-12">Measures market sentiment for precious metals based on volatility, momentum, and safe-haven demand.</p>
      
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-10">
        <div className="text-8xl font-mono font-bold text-green-500 mb-4">72</div>
        <div className="text-2xl font-bold uppercase tracking-widest text-green-500 mb-8">Greed</div>
        
        <div className="w-full h-4 bg-secondary rounded-full overflow-hidden flex">
          <div className="h-full bg-red-500" style={{width: '25%'}}></div>
          <div className="h-full bg-yellow-500" style={{width: '30%'}}></div>
          <div className="h-full bg-green-500" style={{width: '45%'}}></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 uppercase font-bold">
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}
