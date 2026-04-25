import { useState } from "react";
import { Link } from "wouter";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-serif font-bold mb-4">Checkout</h1>
      <p className="text-muted-foreground mb-8">Checkout flow implementation pending.</p>
      <Link href="/order-confirmation" className="text-primary hover:underline">Complete Order (Demo)</Link>
    </div>
  );
}
