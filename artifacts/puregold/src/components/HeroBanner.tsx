import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=2000&q=75&fm=webp";
const HERO_IMG_SM =
  "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=70&fm=webp";

export function HeroBanner() {
  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black"
      data-testid="hero-banner"
    >
      {/* Hero image — explicit img so browser discovers it immediately (LCP) */}
      <img
        src={HERO_IMG}
        srcSet={`${HERO_IMG_SM} 800w, ${HERO_IMG} 2000w`}
        sizes="100vw"
        alt="Gold bullion bars background"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        width={2000}
        height={700}
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-grain z-0" />

      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            New Arrival
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            2026 American <br />
            <span className="text-gold-shimmer">Gold Eagle</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
            Secure your wealth with the world's most trusted gold coin. Now
            available for immediate secure shipping.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              size="lg"
              className="text-base h-14 px-8 rounded-none uppercase tracking-wider"
              asChild
              data-testid="btn-hero-cta"
            >
              <Link href="/gold?mint=us">Shop Gold Eagles →</Link>
            </Button>
            <div className="text-white font-mono bg-black/50 backdrop-blur-md px-6 py-4 border border-white/10 flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Starting from</span>
              <span className="text-xl font-bold text-primary">$2,485.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
