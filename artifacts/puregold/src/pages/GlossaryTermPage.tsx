import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { GLOSSARY_TERMS } from "../../seo/glossary";
import "@/styles/seo-content.css";
import { useCanonical } from "@/hooks/use-canonical";

export default function GlossaryTermPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
  const related = term
    ? GLOSSARY_TERMS.filter((t) => term.related.includes(t.slug))
    : [];

  useCanonical(slug ? `/learn/${slug}` : "/learn");
  useEffect(() => {
    if (term) {
      document.title = `${term.term} — Precious Metals Definition | GoldBuller Glossary`;
    }
  }, [term]);

  if (!term) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Term Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find a glossary entry for "{slug}".
        </p>
        <Link href="/learn" className="text-primary hover:underline">
          ← Back to Glossary
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/learn" className="text-primary hover:underline">Glossary</Link>
        <span>›</span>
        <span>{term.term}</span>
      </nav>

      <span className="inline-block bg-card border border-border text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
        {term.category}
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-8">
        {term.term}
      </h1>

      <div
        className="seo-body"
        dangerouslySetInnerHTML={{ __html: term.body }}
      />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Related Terms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/learn/${r.slug}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
              >
                <div className="font-semibold text-primary group-hover:underline mb-1">
                  {r.term}
                </div>
                <p className="text-sm text-muted-foreground">{r.shortDef}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Ready to Start Buying?
        </h2>
        <p className="text-muted-foreground mb-6">
          GoldBuller offers gold, silver, and platinum bullion with transparent pricing and fast, insured shipping.
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
