import { Link } from "wouter";
import { BookOpen, TrendingUp, Shield, HelpCircle } from "lucide-react";

export default function InvestingGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Precious Metals Investing Guide</h1>
        <p className="text-xl text-muted-foreground">Everything you need to know about buying, storing, and selling physical gold, silver, platinum, and palladium.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Link href="/blog" className="block group">
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors h-full">
            <BookOpen className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Beginner's Guide</h2>
            <p className="text-muted-foreground mb-4">Learn the basics of precious metals investing. Spot vs. Premium, Coins vs. Bars, and how to allocate your portfolio.</p>
            <span className="text-primary font-bold uppercase text-xs tracking-wider">Read Guide →</span>
          </div>
        </Link>

        <Link href="/ira" className="block group">
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors h-full">
            <Shield className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Gold IRA Guide</h2>
            <p className="text-muted-foreground mb-4">How to protect your retirement savings by rolling over your 401(k) into physical precious metals.</p>
            <span className="text-primary font-bold uppercase text-xs tracking-wider">Read Guide →</span>
          </div>
        </Link>
        
        <Link href="/faq" className="block group">
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors h-full">
            <HelpCircle className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-4">Get answers to the most common questions about shipping, payment methods, returns, and taxes.</p>
            <span className="text-primary font-bold uppercase text-xs tracking-wider">Read FAQs →</span>
          </div>
        </Link>

        <Link href="/charts" className="block group">
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors h-full">
            <TrendingUp className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Market Analysis</h2>
            <p className="text-muted-foreground mb-4">Deep dives into historical price charts, the gold/silver ratio, and macroeconomic factors affecting metals.</p>
            <span className="text-primary font-bold uppercase text-xs tracking-wider">View Charts →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
