import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

interface Order {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: { firstName: string; lastName: string; address: string; city: string; state: string; zip: string };
  paymentMethod: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pg_last_order");
      if (stored) setOrder(JSON.parse(stored));
    } catch {}
  }, []);

  const orderId = order?.id || "PG-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const name = order?.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
          {name ? `Thank you, ${name.split(" ")[0]}!` : "Order Confirmed!"}
        </h1>
        <p className="text-muted-foreground text-lg">Your order has been received and is being processed.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Order Number</p>
            <p className="text-xl font-mono font-bold text-primary">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Order Total</p>
            <p className="text-xl font-mono font-bold text-foreground">
              ${order ? order.total.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"}
            </p>
          </div>
        </div>

        {order?.items && order.items.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Items Ordered
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                  <span className="font-mono text-foreground">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.shippingAddress && (
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-1">Ships to:</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
          </div>
        )}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-8 text-sm space-y-2">
        <p className="font-semibold text-amber-400">⚡ Wire Transfer Required Within 4 Hours</p>
        <p className="text-muted-foreground">
          Please send your wire immediately using the instructions provided. Your order is reserved for 4 hours — if the wire is not received, it will be cancelled and you'll need to re-order.
        </p>
        <p className="text-muted-foreground">
          Include order number <strong className="text-foreground">{orderId}</strong> in the wire memo field.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-8 text-sm text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground mb-1">What happens next?</p>
        <p>✅ Wire confirmed → order moves to processing (1–2 hours)</p>
        <p>📦 Securely packaged and shipped with full insurance within 2 business days</p>
        <p>📧 You'll receive tracking info by email once shipped</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/account/dashboard"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          View Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
