import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { BUY_PAGES } from "../../seo/funnelData";
import "@/styles/seo-content.css";

export default function BuyLandingPage() {
  const params = useParams<{ slug: string }>();
  const page = BUY_PAGES.find((p) => p.slug === params.slug);

  useEffect(() => {
    if (page) document.title = page.metaTitle;
  }, [page]);

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
        <Link href="/gold" className="text-primary hover:underline">← Browse Gold Products</Link>
      </div>
    );
  }

  const metalColor =
    page.metal === "gold" ? "text-yellow-400"
      : page.metal === "silver" ? "text-slate-300"
      : page.metal === "platinum" ? "text-sky-300"
      : page.metal === "btc" ? "text-orange-400"
      : "text-primary";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/buy" className="text-primary hover:underline">Buy</Link>
        <span>›</span>
        <span className="line-clamp-1">{page.h1}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
        {page.h1}
      </h1>
      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{page.hero}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Minimum Order (Wire)</div>
          <div className={`text-xl font-bold ${metalColor}`}>{page.minWire}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Wire Advantage</div>
          <div className="text-sm text-foreground font-medium">{page.wireBonus}</div>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-foreground mb-5">How It Works</h2>
      <div className="space-y-4 mb-10">
        {page.steps.map((step, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Payment Method Comparison</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#1f1f23]">
              <th className="text-left px-4 py-3 text-primary font-semibold uppercase text-xs tracking-wider">Method</th>
              <th className="text-left px-4 py-3 text-primary font-semibold uppercase text-xs tracking-wider">Fee</th>
              <th className="text-left px-4 py-3 text-primary font-semibold uppercase text-xs tracking-wider">Speed</th>
              <th className="text-left px-4 py-3 text-primary font-semibold uppercase text-xs tracking-wider">Privacy</th>
              <th className="text-left px-4 py-3 text-primary font-semibold uppercase text-xs tracking-wider">Best For</th>
            </tr>
          </thead>
          <tbody>
            {page.comparisonRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-background"}>
                <td className="px-4 py-3 font-semibold text-foreground border-b border-border">{row.method}</td>
                <td className="px-4 py-3 text-muted-foreground border-b border-border">{row.fee}</td>
                <td className="px-4 py-3 text-muted-foreground border-b border-border">{row.speed}</td>
                <td className="px-4 py-3 text-muted-foreground border-b border-border">{row.privacy}</td>
                <td className="px-4 py-3 text-muted-foreground border-b border-border">{row.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Frequently Asked Questions</h2>
      <div className="space-y-4 mb-10">
        {page.faqs.map((faq, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Start Buying Now</h2>
        <p className="text-muted-foreground mb-6">Complete KYC verification once — then buy with bank wire or Bitcoin any time, at the lowest premiums.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href={page.cta.href} className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            {page.cta.label}
          </Link>
          <Link href="/kyc" className="inline-block border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
            Complete KYC →
          </Link>
        </div>
      </div>
    </div>
  );
}
