import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AutoBuyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4 text-center">AutoBuy Setup</h1>
        <p className="text-muted-foreground mb-12 text-center">Dollar-cost average into precious metals automatically. Cancel anytime.</p>
        
        <div className="bg-card border border-border rounded-lg p-8">
          <form className="space-y-8" onSubmit={e => e.preventDefault()}>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">1. Select Product</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['1 oz Gold Eagle', '1 oz Gold Bar', '1 oz Silver Eagle', '10 oz Silver Bar'].map(item => (
                  <div key={item} className="border border-border rounded p-4 text-center cursor-pointer hover:border-primary transition-colors">
                    <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">{item}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">2. Frequency</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="freq" className="accent-primary" defaultChecked />
                  <span>Weekly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="freq" className="accent-primary" />
                  <span>Bi-Weekly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="freq" className="accent-primary" />
                  <span>Monthly</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">3. Payment Method</h3>
              <select className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:border-primary focus:outline-none">
                <option>Bank Account (ACH) - Recommended</option>
                <option>Credit Card (4% Fee)</option>
              </select>
            </div>
            
            <Button size="lg" className="w-full font-bold uppercase tracking-wider h-14">
              Review Schedule
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
