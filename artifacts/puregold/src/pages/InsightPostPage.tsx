import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { INSIGHT_POSTS } from "../../seo/funnelData";
import "@/styles/seo-content.css";

export default function InsightPostPage() {
  const params = useParams<{ slug: string }>();
  const post = INSIGHT_POSTS.find((p) => p.slug === params.slug);
  const related = post ? INSIGHT_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3) : [];

  useEffect(() => {
    if (post) document.title = `${post.title} | GoldBuller`;
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
        <Link href="/insights" className="text-primary hover:underline">← Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/insights" className="text-primary hover:underline">Insights</Link>
        <span>›</span>
        <span className="line-clamp-1">{post.title}</span>
      </nav>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs font-semibold px-2 py-0.5 bg-card border border-border rounded-full text-primary">{tag}</span>
        ))}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
        {post.title}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {post.readTime} &bull; {new Date(post.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} &bull; GoldBuller Research
      </p>

      <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic border-l-2 border-primary pl-4">
        {post.intro}
      </p>

      <div className="seo-body" dangerouslySetInnerHTML={{ __html: post.body }} />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">More Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/insights/${r.slug}`} className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 group transition-colors">
                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1 leading-snug">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.readTime}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
