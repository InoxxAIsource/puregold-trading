import { useEffect } from "react";
import { Link } from "wouter";
import { GUIDES } from "../../seo/guides";

export default function GuidesIndexPage() {
  useEffect(() => {
    document.title = "Precious Metals Buying Guides — Gold, Silver & IRA | GoldBuller";
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <span>Buying Guides</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Precious Metals Buying Guides
      </h1>
      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
        Practical, research-backed guides on every aspect of buying, storing, and investing in gold and silver — written for real buyers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2 py-0.5 bg-background border border-border rounded-full text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
              {guide.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {guide.metaDescription}
            </p>
            <span className="text-xs text-muted-foreground">{guide.readTime}</span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Ready to Buy?
        </h2>
        <p className="text-muted-foreground mb-6">
          Browse GoldBuller's full inventory of gold and silver bullion with transparent, spot-based pricing.
        </p>
        <Link
          href="/gold"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Shop Gold Bullion →
        </Link>
      </div>
    </div>
  );
}
