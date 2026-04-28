import { useEffect } from "react";
import { Link } from "wouter";
import { GLOSSARY_TERMS } from "../../seo/glossary";

export default function GlossaryIndexPage() {
  useEffect(() => {
    document.title = "Precious Metals Glossary — Gold, Silver & Platinum Terms | GoldBuller";
  }, []);

  const byCategory: Record<string, typeof GLOSSARY_TERMS> = {};
  for (const term of GLOSSARY_TERMS) {
    if (!byCategory[term.category]) byCategory[term.category] = [];
    byCategory[term.category].push(term);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <span>Glossary</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Precious Metals Glossary
      </h1>
      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
        Every term you need to buy, sell, and store gold, silver, and platinum — defined clearly, without the jargon.
      </p>

      {Object.entries(byCategory).map(([category, terms]) => (
        <section key={category} className="mb-10">
          <h2 className="text-lg font-semibold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {terms.map((term) => (
              <Link
                key={term.slug}
                href={`/learn/${term.slug}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
              >
                <div className="font-semibold text-primary group-hover:underline mb-1">
                  {term.term}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{term.shortDef}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Put Your Knowledge to Work
        </h2>
        <p className="text-muted-foreground mb-6">
          Browse GoldBuller's full selection of gold, silver, and platinum bullion — priced transparently above spot.
        </p>
        <Link
          href="/gold"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Shop Bullion →
        </Link>
      </div>
    </div>
  );
}
