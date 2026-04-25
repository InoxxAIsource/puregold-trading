import { useRoute } from "wouter";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">Market Analysis</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6 leading-tight">
          How Global Inflation Impacts Precious Metal Demand in 2026
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-8">
          <span>By PureGold Research Team</span>
          <span>•</span>
          <span>March 15, 2026</span>
          <span>•</span>
          <span>5 min read</span>
        </div>
      </div>
      
      <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
        <p>Precious metals have long been considered a safe haven asset during times of economic uncertainty and high inflation. As we navigate the complex macroeconomic environment of 2026, understanding this relationship is more critical than ever for investors.</p>
        
        <h2 className="text-foreground font-serif">The Inflation Hedge Argument</h2>
        <p>Unlike fiat currencies, which can be printed in unlimited quantities by central banks, the supply of physical gold and silver is strictly limited by nature and the difficulty of extraction.</p>
        <p>When the purchasing power of paper money declines (inflation), the nominal price of real assets like precious metals typically rises to compensate. Historically, an ounce of gold has maintained roughly the same purchasing power for centuries.</p>
        
        <h2 className="text-foreground font-serif">Current Market Dynamics</h2>
        <p>Looking at the data from the past quarter, we've seen a strong correlation between CPI surprises and institutional inflows into physical gold ETFs and sovereign mint products.</p>
        
        <div className="bg-card border border-primary/30 rounded-lg p-6 my-8">
          <h4 className="text-primary font-bold mb-2">Key Takeaway</h4>
          <p className="mb-0">While short-term volatility is driven by interest rate expectations, long-term price action remains firmly tethered to broad money supply growth and global debt levels.</p>
        </div>
      </div>
    </div>
  );
}
