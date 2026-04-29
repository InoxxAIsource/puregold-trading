import { Link } from "wouter";
import { ShieldCheck, Award, BadgeCheck } from "lucide-react";

const COLS = [
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Order Status", href: "/account/orders" },
      { label: "Shipping & Returns", href: "/about/shipping" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-of-service" },
      { label: "Client Agreement", href: "/terms-of-service" },
      { label: "Accessibility", href: "/contact" },
      { label: "Cookie Preferences", href: "/privacy-policy" },
    ],
  },
  {
    heading: "Buy & Sell",
    links: [
      { label: "My Account", href: "/account/dashboard" },
      { label: "What Should I Buy?", href: "/guides" },
      { label: "Shipping / FAQ", href: "/faq" },
      { label: "Sell To Us", href: "/sell-to-us" },
      { label: "Buy Back Guarantee", href: "/sell-to-us" },
      { label: "Returns Policy", href: "/about/shipping" },
      { label: "Bitcoin OTC Desk", href: "/bitcoin-otc" },
      { label: "Bulk & Wholesale", href: "/contact" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Gold Coins & Bars", href: "/gold" },
      { label: "Silver Coins & Bars", href: "/silver" },
      { label: "Platinum Bullion", href: "/platinum" },
      { label: "Palladium", href: "/palladium" },
      { label: "Rare & Numismatic Coins", href: "/rare-coins" },
      { label: "IRA-Eligible Metals", href: "/ira" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "On Sale", href: "/on-sale" },
    ],
  },
  {
    heading: "Our Company",
    links: [
      { label: "About GoldBuller", href: "/about" },
      { label: "Media & Press", href: "/contact" },
      { label: "Secure Storage", href: "/guides/how-to-store-gold-and-silver-at-home" },
      { label: "Free Investor Guide", href: "/guides" },
      { label: "Live Price Charts", href: "/charts" },
      { label: "Market Insights", href: "/blog" },
      { label: "Gold IRA Guide", href: "/ira" },
      { label: "Affiliate Program", href: "/contact" },
    ],
  },
];

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    label: "FULLY INSURED",
    sub: "All shipments 100% insured",
  },
  {
    icon: Award,
    label: "A+ BBB RATED",
    sub: "Better Business Bureau",
  },
  {
    icon: BadgeCheck,
    label: "NGC AUTHORIZED",
    sub: "Numismatic Guaranty Company",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20" style={{ background: "#0a0a0a" }} data-testid="footer">

      {/* ── Trust bar ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-5 flex flex-wrap justify-center md:justify-between gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #1a1200, #2a1f00)", border: "1px solid #b8973a44" }}
              >
                <Icon className="h-5 w-5" style={{ color: "#b8973a" }} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-white uppercase">{label}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            </div>
          ))}

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap">
            {["VISA", "MC", "AMEX", "DISC", "BTC", "WIRE"].map((m) => (
              <span
                key={m}
                className="text-[10px] font-bold px-2 py-1 rounded"
                style={{ background: "#1a1a1a", border: "1px solid #333", color: "#888" }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer grid ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold tracking-tight" style={{ color: "#f0d060" }}>
                GoldBuller.
              </span>
            </Link>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "#666" }}>
              Premium precious metals dealer serving investors since 2018. Insured, discreet shipping on every order.
            </p>

            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold text-white text-sm">1-800-GOLD-NOW</p>
                <p style={{ color: "#555" }} className="text-xs">Mon–Fri 9am–6pm ET</p>
              </div>
              <div>
                <p className="text-white text-sm font-medium">support@goldbuller.com</p>
              </div>
              <div>
                <p style={{ color: "#555" }} className="text-xs leading-relaxed">
                  3200 Commerce St, Suite 400<br />Dallas, TX 75226
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {[
                { label: "X", href: "https://x.com" },
                { label: "in", href: "https://linkedin.com" },
                { label: "YT", href: "https://youtube.com" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors hover:text-black"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#b8973a"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <h3
                className="text-xs font-bold tracking-widest uppercase mb-5"
                style={{ color: "#b8973a" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: "#666" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#b8973a"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#666"; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#444" }}>
            &copy; 2018–{new Date().getFullYear()} GoldBuller LLC. All rights reserved. Precious metals prices may fluctuate. Past performance does not guarantee future results.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "#444" }}>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
