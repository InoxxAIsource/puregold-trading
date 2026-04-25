import { useState } from "react";
import { usePrice } from "@/contexts/PriceContext";
import { Button } from "@/components/ui/button";

export default function SellToUsPage() {
  const { spotPrices } = usePrice();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4 text-center">Sell Your Precious Metals to Us</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center">Industry-leading buyback prices. Secure shipping. Fast payment.</p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
            <h3 className="font-bold mb-2">Get a Quote</h3>
            <p className="text-sm text-muted-foreground">Lock in your price instantly online or by calling our purchasing team.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
            <h3 className="font-bold mb-2">Ship Securely</h3>
            <p className="text-sm text-muted-foreground">We provide prepaid, fully insured shipping labels for your items.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
            <h3 className="font-bold mb-2">Get Paid Fast</h3>
            <p className="text-sm text-muted-foreground">Receive payment via check or bank wire within 24-48 hours of verification.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-serif font-bold mb-6">Current Buyback Prices</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-12">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Metal Type</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Payout (% of Spot)</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Est. Price/oz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {spotPrices.map(price => (
                <tr key={price.metal}>
                  <td className="p-4 font-medium capitalize text-foreground">{price.metal} Coins & Bars</td>
                  <td className="p-4 text-right text-muted-foreground">97% - 99%</td>
                  <td className="p-4 text-right font-mono text-primary">${(price.price * 0.98).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Request a Custom Quote</h2>
          <p className="text-muted-foreground mb-8">Have a large collection or rare numismatic items? Let our experts appraise your metals.</p>
          <Button size="lg" className="font-bold uppercase tracking-wider h-14 px-8">
            Start Selling Process
          </Button>
        </div>
      </div>
    </div>
  );
}
