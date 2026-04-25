import { useState } from "react";
import { useRoute } from "wouter";
import { Heart, ShoppingCart, ShieldCheck, Truck, Clock } from "lucide-react";
import { useGetProduct, useGetRelatedProducts } from "@workspace/api-client-react";
import { useCartContext } from "@/contexts/CartContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PriceDisplay } from "@/components/PriceDisplay";
import { PriceLockTimer } from "@/components/PriceLockTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: product, isLoading } = useGetProduct(slug, { query: { enabled: !!slug, queryKey: ['/api/products', slug] } });
  const { data: relatedProducts } = useGetRelatedProducts(slug, { query: { enabled: !!slug, queryKey: ['/api/products', slug, 'related'] } });
  
  const { addItem } = useCartContext();
  const { hasItem, addItem: addToWatchlist, removeItem: removeFromWatchlist } = useWatchlist();
  
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'crypto' | 'cc'>('wire');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');
  const [imgError, setImgError] = useState(false);

  const isWatched = product ? hasItem(product.id) : false;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;
  }

  const toggleWatchlist = () => {
    if (isWatched) removeFromWatchlist(product.id);
    else addToWatchlist(product.id);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price, // in real app, would adjust based on volume/payment
      quantity: qty,
      image: product.images[0],
      metalType: product.metalType
    });
  };

  const getPriceMultiplier = (method: string) => {
    if (method === 'cc') return 1.04; // 4% fee
    if (method === 'crypto') return 1.01; // 1% fee
    return 1; // wire is base
  };

  const currentPrice = product.price * getPriceMultiplier(paymentMethod);

  return (
    <div className="container mx-auto px-4 py-8" data-testid={`page-product-detail-${product.id}`}>
      <Breadcrumbs items={[
        { label: product.metalType.charAt(0).toUpperCase() + product.metalType.slice(1), href: `/${product.metalType}` },
        { label: product.name }
      ]} />

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mt-6">
        {/* Images */}
        <div className="space-y-4">
          <div className="bg-[#111] rounded-lg border border-border overflow-hidden flex items-center justify-center relative" style={{ height: "420px" }}>
            {product.images[0] && !imgError ? (
              <img
                src={product.images[0]}
                alt={`${product.name} - Physical Bullion`}
                className="max-h-[380px] max-w-full object-contain transition-transform duration-500 hover:scale-105"
                style={{ filter: "drop-shadow(0 8px 32px rgba(201,168,76,0.2))" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <CoinPlaceholder metal={product.metalType} name={product.name} size={260} />
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isOnSale && <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded uppercase">Sale</span>}
              {product.isIRAEligible && <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase">IRA Approved</span>}
            </div>
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="bg-[#111] rounded border border-border cursor-pointer hover:border-primary transition-colors p-2 flex items-center justify-center" style={{ height: "80px" }}>
                  <img src={img} alt="" className="max-h-full max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-border pb-6">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {product.mint && <span>Mint: <span className="text-foreground font-medium">{product.mint}</span></span>}
              {product.year && <span>Year: <span className="text-foreground font-medium">{product.year}</span></span>}
              {product.purity && <span>Purity: <span className="text-foreground font-medium">{product.purity}</span></span>}
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center bg-secondary/20 p-4 rounded-lg border border-border">
            <PriceLockTimer minutes={10} />
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {product.inStock ? 'In Stock & Ready to Ship' : 'Out of Stock'}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-4 p-1 bg-background rounded-lg border border-border">
              <button 
                onClick={() => setPaymentMethod('wire')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${paymentMethod === 'wire' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Wire/Check
              </button>
              <button 
                onClick={() => setPaymentMethod('crypto')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${paymentMethod === 'crypto' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Crypto
              </button>
              <button 
                onClick={() => setPaymentMethod('cc')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${paymentMethod === 'cc' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Credit Card
              </button>
            </div>

            <PriceDisplay 
              basePrice={currentPrice} 
              metalType={product.metalType} 
              weight={product.weight} 
              premiumPct={product.premiumPct} 
              premiumAmt={product.premiumAmt} 
            />
          </div>

          {/* Volume Pricing */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3">Volume Pricing (Wire/Check)</h3>
            <div className="grid grid-cols-4 gap-2 text-sm text-center">
              <div className="border border-border rounded p-2 bg-card">
                <div className="text-muted-foreground mb-1">1-19</div>
                <div className="font-mono font-bold">${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="border border-border rounded p-2 bg-card">
                <div className="text-muted-foreground mb-1">20-99</div>
                <div className="font-mono font-bold">${(product.price * 0.995).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="border border-border rounded p-2 bg-card">
                <div className="text-muted-foreground mb-1">100-499</div>
                <div className="font-mono font-bold">${(product.price * 0.99).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="border border-border rounded p-2 bg-card">
                <div className="text-muted-foreground mb-1">500+</div>
                <div className="font-bold text-primary text-xs flex items-center justify-center h-5">CALL</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="w-32 flex items-center border border-border rounded-md bg-background">
              <button className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <input 
                type="number" 
                value={qty} 
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} 
                className="w-full bg-transparent text-center font-mono font-bold focus:outline-none" 
                min="1"
              />
              <button className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            
            <Button 
              size="lg" 
              className="flex-1 h-auto text-lg font-bold tracking-wider uppercase rounded-md" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-testid="btn-add-to-cart"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            <Button 
              size="icon" 
              variant="outline" 
              className="h-auto w-14 shrink-0 rounded-md border-border hover:border-primary hover:text-red-500 transition-colors"
              onClick={toggleWatchlist}
            >
              <Heart className="h-5 w-5" fill={isWatched ? "currentColor" : "none"} color={isWatched ? "#ef4444" : "currentColor"} />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 gap-4 mt-auto border-t border-border pt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Authenticity Guaranteed</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Discreet, Insured Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20 pt-10 border-t border-border">
        <div className="flex border-b border-border gap-8 mb-8">
          <button 
            className={`pb-4 text-lg font-serif font-bold transition-colors relative ${activeTab === 'desc' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('desc')}
          >
            Description
            {activeTab === 'desc' && <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t" />}
          </button>
          <button 
            className={`pb-4 text-lg font-serif font-bold transition-colors relative ${activeTab === 'specs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
            {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t" />}
          </button>
          <button 
            className={`pb-4 text-lg font-serif font-bold transition-colors relative ${activeTab === 'shipping' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
            {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t" />}
          </button>
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'desc' && (
            <div className="prose prose-invert max-w-4xl text-muted-foreground">
              <p>{product.description || product.shortDescription || "No description available."}</p>
            </div>
          )}
          
          {activeTab === 'specs' && (
            <div className="max-w-2xl bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground font-medium w-1/3">Metal</td>
                    <td className="py-3 px-4 text-foreground capitalize">{product.metalType}</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-background/50">
                    <td className="py-3 px-4 text-muted-foreground font-medium">Weight</td>
                    <td className="py-3 px-4 text-foreground">{product.weight} {product.weightUnit}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground font-medium">Purity</td>
                    <td className="py-3 px-4 text-foreground">{product.purity || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-background/50">
                    <td className="py-3 px-4 text-muted-foreground font-medium">Mint</td>
                    <td className="py-3 px-4 text-foreground">{product.mint || 'N/A'}</td>
                  </tr>
                  {product.specifications && Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr key={key} className={`border-b border-border/50 ${idx % 2 === 0 ? '' : 'bg-background/50'}`}>
                      <td className="py-3 px-4 text-muted-foreground font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="py-3 px-4 text-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'shipping' && (
            <div className="prose prose-invert max-w-4xl text-muted-foreground">
              <p>All orders are shipped discreetly and are fully insured while in transit. We use FedEx, UPS, and USPS depending on the order size and destination.</p>
              <ul>
                <li>Orders over $499 ship FREE.</li>
                <li>Orders under $499 have a flat $9.95 shipping fee.</li>
                <li>Most orders ship within 1-3 business days of cleared payment.</li>
                <li>Wire transfers and cryptocurrencies clear immediately. Checks may take up to 5 business days to clear.</li>
              </ul>
              <p className="mt-4"><strong>Returns:</strong> PureGold offers a 3-day return policy on all products. If you are not satisfied, contact us within 3 days of receipt for an RMA number. All returns are subject to market loss policy and a 5% restocking fee.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
