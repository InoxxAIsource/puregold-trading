import { Link } from "wouter";

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
      <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Thank You for Your Order</h1>
      <p className="text-lg text-muted-foreground mb-8">Your order #PG-10492 has been received and is being processed.</p>
      
      <div className="bg-card border border-border rounded-lg p-6 text-left mb-8">
        <h3 className="font-semibold text-foreground mb-4">Order Details</h3>
        <p className="text-muted-foreground text-sm">You will receive an email confirmation shortly. Once your payment clears, your items will be securely packaged and shipped.</p>
      </div>
      
      <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded uppercase font-bold tracking-wider hover:bg-primary/90 transition-colors">
        Return to Home
      </Link>
    </div>
  );
}
