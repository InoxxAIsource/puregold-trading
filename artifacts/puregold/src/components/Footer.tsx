import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-20" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-tight mb-4 inline-block">
              GoldBuller.
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Premium precious metals dealer since 2018. Fully insured, discreet shipping on all orders.
            </p>
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">1-800-GOLD-NOW</p>
              <p className="text-muted-foreground">Dallas, TX</p>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Gold Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/gold" className="hover:text-primary transition-colors">All Gold</Link></li>
              <li><Link href="/gold?category=coins" className="hover:text-primary transition-colors">Gold Coins</Link></li>
              <li><Link href="/gold?category=bars" className="hover:text-primary transition-colors">Gold Bars</Link></li>
              <li><Link href="/gold?mint=us" className="hover:text-primary transition-colors">American Eagles</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Silver Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/silver" className="hover:text-primary transition-colors">All Silver</Link></li>
              <li><Link href="/silver?category=coins" className="hover:text-primary transition-colors">Silver Coins</Link></li>
              <li><Link href="/silver?category=bars" className="hover:text-primary transition-colors">Silver Bars</Link></li>
              <li><Link href="/silver/junk-silver" className="hover:text-primary transition-colors">Junk Silver</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Account & Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/account/dashboard" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/about/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/charts" className="hover:text-primary transition-colors">Live Charts</Link></li>
              <li><Link href="/ira" className="hover:text-primary transition-colors">Gold IRA</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Market News</Link></li>
              <li><Link href="/tax" className="hover:text-primary transition-colors">Local Taxes</Link></li>
              <li><Link href="/sell-to-us" className="hover:text-primary transition-colors">Sell To Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <span className="text-xs font-semibold px-2 py-1 bg-card border border-border rounded text-foreground">A+ BBB Rated</span>
            <span className="text-xs font-semibold px-2 py-1 bg-card border border-border rounded text-foreground">SSL Secured</span>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            &copy; 2018-{new Date().getFullYear()} GoldBuller LLC. All rights reserved.
          </div>

          <div className="flex gap-2 items-center text-muted-foreground text-sm font-semibold">
            VISA | MC | AMEX | DISCOVER | BTC
          </div>
        </div>
      </div>
    </footer>
  );
}
