import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { GUIDES } from "../../seo/guides";
import "@/styles/seo-content.css";
import { useCanonical } from "@/hooks/use-canonical";

export default function GuideDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const guide = GUIDES.find((g) => g.slug === slug);
  const related = guide ? GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3) : [];

  useCanonical(slug ? `/guides/${slug}` : "/guides");
  useEffect(() => {
    if (guide) {
      document.title = `${guide.title} | GoldBuller`;
    }
  }, [guide]);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Guide Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find a guide for "{slug}".
        </p>
        <Link href="/guides" className="text-primary hover:underline">
          ← Back to Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/guides" className="text-primary hover:underline">Guides</Link>
        <span>›</span>
        <span className="line-clamp-1">{guide.title}</span>
      </nav>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {guide.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold px-2 py-0.5 bg-card border border-border rounded-full text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
        {guide.title}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {guide.readTime} &bull; GoldBuller Research
      </p>

      <div
        className="seo-body"
        dangerouslySetInnerHTML={{ __html: guide.body }}
      />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            More Buying Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/guides/${r.slug}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
              >
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 leading-snug">
                  {r.title}
                </div>
                <p className="text-xs text-muted-foreground">{r.readTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
