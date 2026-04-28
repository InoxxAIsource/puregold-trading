import { useEffect } from "react";
import { Link } from "wouter";
import { INSIGHT_POSTS } from "../../seo/funnelData";

export default function InsightsIndexPage() {
  useEffect(() => {
    document.title = "Precious Metals Insights — Gold, Silver & Bitcoin Research | GoldBuller";
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <span>Insights</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Precious Metals Insights
      </h1>
      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
        Original research and practical guides on buying gold and silver with bank wire, Bitcoin, and the best strategies for US investors.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {INSIGHT_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/insights/${post.slug}`}
            className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold px-2 py-0.5 bg-background border border-border rounded-full text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.metaDesc}</p>
            <div className="text-xs text-muted-foreground flex gap-3">
              <span>{post.readTime}</span>
              <span>{new Date(post.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Ready to Buy?</h2>
        <p className="text-muted-foreground mb-6">
          Shop gold and silver with bank wire or Bitcoin. Transparent pricing, fully insured shipping.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gold" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90">Shop Gold →</Link>
          <Link href="/guides" className="inline-block border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10">Buying Guides →</Link>
        </div>
      </div>
    </div>
  );
}
