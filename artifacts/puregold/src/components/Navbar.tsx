import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { usePrice } from "@/contexts/PriceContext";
import { useBTCPrice } from "@/lib/btcPrice";

const BTC_MENU = [
  { label: "Buy Bitcoin OTC", href: "/bitcoin-otc", desc: "Purchase 0.20–10 BTC privately" },
  { label: "Bitcoin Price Live", href: "/charts/bitcoin-price", desc: "Real-time BTC price chart" },
  { label: "How BTC OTC Works", href: "/bitcoin-otc/how-it-works", desc: "5-step purchase guide" },
  { label: "OTC vs Exchange", href: "/bitcoin-otc/otc-vs-exchange", desc: "Compare your options" },
  { label: "Bitcoin IRA", href: "/bitcoin-otc/bitcoin-ira", desc: "Buy BTC for retirement" },
  { label: "Apply to Buy", href: "/bitcoin-otc/apply", desc: "KYC required" },
  { label: "BTC FAQ", href: "/bitcoin-otc/faq", desc: "Common questions answered" },
];

export function Navbar() {
  const { totalItems } = useCartContext();
  const { spotPrices } = usePrice();
  const { price: btcPrice, change: btcChange, direction: btcDir } = useBTCPrice();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [btcMenuOpen, setBtcMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close BTC menu when clicking outside
  useEffect(() => {
    if (!btcMenuOpen) return;
    const handler = () => setBtcMenuOpen(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [btcMenuOpen]);

  const goldPrice = spotPrices.find(p => p.metal === "gold");
  const silverPrice = spotPrices.find(p => p.metal === "silver");

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-border' : 'bg-background'}`}>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-primary text-primary-foreground py-1.5 px-4 text-xs font-medium flex justify-between items-center relative z-10" data-testid="announcement-bar">
          <div className="w-full text-center hidden sm:block">
            🪙 Physical Gold | 🥈 Silver | ₿ Bitcoin OTC — 0.20 to 10 BTC | Insured Wire Settlement | KYC Required
          </div>
          <div className="w-full text-center sm:hidden">
            ₿ Bitcoin OTC — 0.20–10 BTC | FREE Shipping $499+
          </div>
          <button onClick={() => setShowAnnouncement(false)} className="absolute right-2" data-testid="button-close-announcement" aria-label="Close announcement">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu" aria-label="Open navigation menu">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-tight" data-testid="link-home-logo">
              GoldBuller.
            </Link>
          </div>

          {/* Ticker - Desktop Only */}
          <div className="hidden md:flex items-center gap-4 text-sm font-mono text-muted-foreground border border-border rounded-full px-4 py-1.5 bg-card/50">
            {goldPrice && (
              <span className="flex items-center gap-1">
                <span className="text-foreground">Gold:</span> ${goldPrice.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                <span className={goldPrice.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {goldPrice.direction === 'up' ? '▲' : '▼'}${Math.abs(goldPrice.change).toFixed(2)}
                </span>
              </span>
            )}
            {silverPrice && (
              <span className="flex items-center gap-1">
                <span className="text-foreground">Silver:</span> ${silverPrice.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                <span className={silverPrice.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {silverPrice.direction === 'up' ? '▲' : '▼'}${Math.abs(silverPrice.change).toFixed(2)}
                </span>
              </span>
            )}
            {btcPrice > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-orange-400 font-bold">₿</span>
                <span className="text-foreground">BTC:</span> ${btcPrice.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                <span className={btcDir === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {btcDir === 'up' ? '▲' : '▼'}${Math.abs(btcChange).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center relative group">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-48 xl:w-64 bg-card border border-border rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                data-testid="input-search"
              />
              <Search className="h-4 w-4 text-muted-foreground absolute right-3" />
            </div>
            
            <Link href="/account/login" className="text-foreground hover:text-primary transition-colors" data-testid="link-login" aria-label="Account login">
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
            
            <Link href="/cart" className="text-foreground hover:text-primary transition-colors relative" data-testid="link-cart" aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mega Menu Row - Desktop */}
        <nav className="hidden lg:flex items-center justify-between py-3 border-t border-border/50 text-sm font-medium">
          {['Gold', 'Silver', 'Platinum', 'Copper'].map(metal => (
            <Link key={metal} href={`/${metal.toLowerCase()}`} className="text-foreground hover:text-primary transition-colors" data-testid={`link-nav-${metal.toLowerCase()}`}>
              {metal}
            </Link>
          ))}

          {/* Bitcoin OTC mega-menu */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setBtcMenuOpen(v => !v)}
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors font-semibold"
            >
              <span className="text-base font-bold">₿</span> Bitcoin OTC
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${btcMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {btcMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-border bg-orange-400/5">
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider px-2 py-1">Bitcoin OTC Desk</p>
                </div>
                {BTC_MENU.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setBtcMenuOpen(false)}
                    className="flex flex-col px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/40 last:border-0"
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/rare-coins" className="text-foreground hover:text-primary transition-colors">Rare Coins</Link>
          <Link href="/on-sale" className="text-red-500 hover:text-red-400 transition-colors">On Sale</Link>
          <Link href="/featured" className="text-foreground hover:text-primary transition-colors">Featured</Link>
          <a href="/guides" className="text-foreground hover:text-primary transition-colors">Guides</a>
          <a href="/learn" className="text-foreground hover:text-primary transition-colors">Learn</a>
          <Link href="/new-arrivals" className="text-foreground hover:text-primary transition-colors">New Arrivals</Link>
          <Link href="/sell-to-us" className="text-foreground hover:text-primary transition-colors">Sell to Us</Link>
          <Link href="/charts" className="text-foreground hover:text-primary transition-colors">Charts</Link>
          <Link href="/ira" className="text-foreground hover:text-primary transition-colors">IRA</Link>
          <Link href="/investing-guide" className="text-foreground hover:text-primary transition-colors">Resources</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-xl py-4 px-4 flex flex-col gap-4 z-50">
          <input type="text" placeholder="Search..." className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <Link href="/gold" className="font-medium text-foreground py-1">Gold</Link>
            <Link href="/silver" className="font-medium text-foreground py-1">Silver</Link>
            <Link href="/platinum" className="font-medium text-foreground py-1">Platinum</Link>
            <Link href="/copper" className="font-medium text-foreground py-1">Copper</Link>
            <Link href="/bitcoin-otc" className="font-medium text-orange-400 py-1">₿ Bitcoin OTC</Link>
            <Link href="/on-sale" className="font-medium text-red-500 py-1">On Sale</Link>
            <Link href="/new-arrivals" className="font-medium text-foreground py-1">New Arrivals</Link>
            <Link href="/charts" className="font-medium text-foreground py-1">Charts</Link>
            <Link href="/sell-to-us" className="font-medium text-foreground py-1">Sell to Us</Link>
            <Link href="/account/kyc" className="font-medium text-foreground py-1">KYC</Link>
          </div>
        </div>
      )}
    </header>
  );
}
