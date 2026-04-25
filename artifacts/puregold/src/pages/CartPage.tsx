import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { PriceLockTimer } from "@/components/PriceLockTimer";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";

function CartItemImage({ src, name, metal }: { src?: string; name: string; metal?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <CoinPlaceholder metal={metal || "gold"} name={name} size={68} />;
  return (
    <img
      src={src}
      alt={name}
      className="max-w-full max-h-full object-contain"
      onError={() => setErr(true)}
    />
  );
}

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCartContext();
  const [, setLocation] = useLocation();

  const shipping = subtotal > 499 ? 0 : 9.95;
  const insurance = subtotal * 0.005; // 0.5% insurance
  const total = subtotal + shipping + insurance;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-3xl text-center" data-testid="page-cart-empty">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-6">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">You haven't added any precious metals to your cart yet.</p>
        <Button size="lg" asChild className="uppercase tracking-wider font-bold">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" data-testid="page-cart">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground">Shopping Cart</h1>
        <PriceLockTimer minutes={10} />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-semibold text-muted-foreground uppercase tracking-wider hidden md:grid">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {/* Items */}
            <div className="divide-y divide-border">
              {items.map(item => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-[#111] rounded border border-border p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <CartItemImage src={item.image} name={item.name} metal={item.metalType} />
                    </div>
                    <div>
                      <Link href={`/product/${item.slug || item.productId}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-destructive hover:underline mt-2 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-left md:text-center font-mono text-sm">
                    <span className="md:hidden text-muted-foreground mr-2">Price:</span>
                    ${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-border rounded bg-background h-8">
                      <button className="px-2 text-muted-foreground hover:text-foreground" onClick={() => updateQty(item.productId, Math.max(1, item.quantity - 1))}>-</button>
                      <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                      <button className="px-2 text-muted-foreground hover:text-foreground" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-left md:text-right font-mono font-bold text-primary">
                    <span className="md:hidden text-muted-foreground mr-2">Total:</span>
                    ${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary block mb-1">Authenticity & Quality Guaranteed</strong>
              Every item is inspected and verified by our expert numismatists. Shipped fully insured in discreet packaging.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-foreground mb-6 pb-4 border-b border-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({totalItems}):</span>
                <span className="font-mono">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping:</span>
                <span className="font-mono">
                  {shipping === 0 ? <span className="text-green-500 font-bold uppercase text-xs tracking-wider">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Insurance (0.5%):</span>
                <span className="font-mono">${insurance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total:</span>
                <span className="text-2xl font-mono font-bold text-primary">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
            
            <Button 
              className="w-full h-14 text-lg font-bold uppercase tracking-wider" 
              onClick={() => setLocation('/checkout')}
              data-testid="btn-checkout"
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
              <p>By proceeding, you agree to our Terms of Sale and Market Loss Policy.</p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="opacity-50">VISA</span>
                <span className="opacity-50">MC</span>
                <span className="opacity-50">AMEX</span>
                <span className="opacity-50">WIRE</span>
                <span className="opacity-50">CRYPTO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
