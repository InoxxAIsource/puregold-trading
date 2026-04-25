import { Link } from "wouter";
import { ShieldCheck, Banknote, Briefcase, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IRAPage() {
  return (
    <div className="w-full" data-testid="page-ira">
      <div className="bg-gradient-to-b from-[#1a1500] to-background border-b border-border py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-primary mb-6">Secure Your Retirement with a Gold IRA</h1>
          <p className="text-xl text-muted-foreground mb-10">Protect your savings from inflation and market volatility by rolling over your existing 401(k) or IRA into physical precious metals.</p>
          <Button size="lg" className="h-14 px-10 text-lg uppercase font-bold tracking-widest">
            Request Free IRA Guide
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">How a Gold IRA Works</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-primary flex items-center justify-center mx-auto mb-4 text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">1. Open Account</h3>
              <p className="text-sm text-muted-foreground">Setup your new Self-Directed IRA with our trusted custodial partners.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-primary flex items-center justify-center mx-auto mb-4 text-primary">
                <Banknote className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">2. Fund Account</h3>
              <p className="text-sm text-muted-foreground">Roll over funds from your existing 401(k), IRA, or other retirement plan tax-free.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-primary flex items-center justify-center mx-auto mb-4 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">3. Select Metals</h3>
              <p className="text-sm text-muted-foreground">Work with our specialists to select IRS-approved gold, silver, platinum, or palladium.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-primary flex items-center justify-center mx-auto mb-4 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">4. Secure Storage</h3>
              <p className="text-sm text-muted-foreground">Your metals are shipped directly to a secure, fully insured IRS-approved depository.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">IRS-Approved Metals</h2>
          <p className="text-muted-foreground mb-6">Not all precious metals can be held in an IRA. The IRS requires specific minimum fineness levels:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span><strong>Gold:</strong> .995 minimum fineness (e.g., Gold Eagles, Buffaloes, standard bars)</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span><strong>Silver:</strong> .999 minimum fineness (e.g., Silver Eagles, standard bars)</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
              <span><strong>Platinum:</strong> .9995 minimum fineness</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
              <span><strong>Palladium:</strong> .9995 minimum fineness</span>
            </li>
          </ul>
          
          <div className="mt-8 text-center">
            <Button variant="outline" asChild className="uppercase tracking-wider">
              <Link href="/gold?ira=true">Shop IRA Eligible Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
