import { Link } from "wouter";
import { useGetFeaturedProducts, useGetBestSellers, useGetSiteSummary, useListBlogPosts } from "@workspace/api-client-react";
import { HeroBanner } from "@/components/HeroBanner";
import { TrustBar } from "@/components/TrustBar";
import { PriceTicker } from "@/components/PriceTicker";
import { ProductCard } from "@/components/ProductCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrice } from "@/contexts/PriceContext";

export default function HomePage() {
  const { data: featuredProducts, isLoading: featuredLoading } = useGetFeaturedProducts();
  const { data: goldBestSellers, isLoading: goldLoading } = useGetBestSellers({ metal: 'gold', limit: 8 });
  const { data: silverBestSellers, isLoading: silverLoading } = useGetBestSellers({ metal: 'silver', limit: 8 });
  const { data: blogPosts } = useListBlogPosts({ limit: 3 });
  const { spotPrices } = usePrice();

  return (
    <div className="w-full flex flex-col" data-testid="page-home">
      <PriceTicker />
      <HeroBanner />
      
      {/* Live Price Cards Row */}
      <section className="bg-background py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spotPrices.map((price) => (
              <div key={price.metal} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground uppercase text-xs font-semibold tracking-widest mb-1">{price.metal}</span>
                <span className="text-2xl font-mono font-bold text-foreground mb-1">${price.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                <span className={`text-sm flex items-center font-mono ${price.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {price.direction === 'up' ? '▲' : '▼'}${Math.abs(price.change).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Shop By Category */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-10 text-foreground">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Gold', href: '/gold', bg: 'from-amber-500/20 to-amber-700/20', color: 'text-amber-500', image: '/images/products/gold-eagle.png' },
            { name: 'Silver', href: '/silver', bg: 'from-slate-400/20 to-slate-600/20', color: 'text-slate-300', image: '/images/products/silver-eagle.png' },
            { name: 'Platinum', href: '/platinum', bg: 'from-zinc-300/20 to-zinc-500/20', color: 'text-zinc-300', image: '/images/products/platinum-bar.png' },
            { name: 'Copper', href: '/copper', bg: 'from-orange-600/20 to-orange-800/20', color: 'text-orange-500', image: '/images/products/copper-round.png' },
            { name: 'New Arrivals', href: '/new-arrivals', bg: 'from-primary/20 to-primary/10', color: 'text-primary', image: '/images/products/gold-maple.png' },
            { name: 'On Sale', href: '/on-sale', bg: 'from-destructive/20 to-destructive/10', color: 'text-destructive', image: '/images/products/silver-bar-100oz.png' }
          ].map(cat => (
            <Link key={cat.name} href={cat.href} className={`block aspect-square relative rounded-lg border border-border overflow-hidden group transition-transform hover:scale-105`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg}`} />
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-contain p-4 opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <span className={`font-serif font-bold text-base md:text-lg drop-shadow ${cat.color}`}>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Selling Gold */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground">Best Selling Gold</h2>
            <Link href="/gold" className="text-primary hover:underline text-sm font-semibold uppercase tracking-wider">View All →</Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x">
            {goldLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="min-w-[280px] h-[400px] shrink-0 rounded-lg" />)
            ) : goldBestSellers?.map(product => (
              <div key={product.id} className="min-w-[280px] w-[280px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Silver */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground">Best Selling Silver</h2>
          <Link href="/silver" className="text-primary hover:underline text-sm font-semibold uppercase tracking-wider">View All →</Link>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x">
          {silverLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="min-w-[280px] h-[400px] shrink-0 rounded-lg" />)
          ) : silverBestSellers?.map(product => (
            <div key={product.id} className="min-w-[280px] w-[280px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* AutoBuy Promo Band */}
      <section className="py-20 bg-gradient-to-r from-[#1a1500] to-[#332a00] border-y border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Set It and Forget It</h2>
            <p className="text-lg text-primary-foreground/80 mb-6">Build your wealth automatically with AutoBuy. Schedule weekly or monthly purchases of gold and silver at industry-leading premiums.</p>
            <Button size="lg" className="px-8 rounded-none font-bold uppercase tracking-widest" asChild>
              <Link href="/autobuy">Setup AutoBuy</Link>
            </Button>
          </div>
          <div className="hidden md:block w-1/3">
            {/* Decorative element */}
            <div className="aspect-square rounded-full border-4 border-primary/20 flex items-center justify-center p-8">
              <div className="aspect-square rounded-full border-4 border-primary/40 flex items-center justify-center p-8 w-full">
                <div className="aspect-square rounded-full bg-primary/20 w-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      {/* Market News */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-serif font-bold text-foreground">Market Insights</h2>
          <Link href="/blog" className="text-primary hover:underline text-sm font-semibold uppercase tracking-wider">Read All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(Array.isArray(blogPosts) ? blogPosts : [])?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(201,168,76,0.15)]">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{post.category || 'News'}</div>
                  <h3 className="font-serif font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-auto pt-4 border-t border-border">
                    {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime} min read
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-card border-t border-border text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Stay Ahead of the Market</h2>
          <p className="text-muted-foreground mb-8">Join 200,000+ investors receiving our daily spot price alerts, exclusive deals, and market analysis.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary"
              required
            />
            <Button type="submit" className="h-auto py-3 px-8 uppercase font-bold tracking-wider">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
