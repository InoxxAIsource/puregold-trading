import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountRegisterPage() {
  const [, setLocation] = useLocation();
  const [btcInterest, setBtcInterest] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (btcInterest) {
      localStorage.setItem("btc_otc_interest", "true");
    }
    setLocation("/account/login");
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg p-8">
        <h1 className="text-3xl font-serif font-bold text-center mb-6">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input required className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input required className="bg-background border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" required className="bg-background border-border" />
          </div>
          
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" required className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" required className="bg-background border-border" />
          </div>

          {/* Bitcoin OTC interest checkbox */}
          <div className="bg-orange-400/5 border border-orange-400/20 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={btcInterest}
                onChange={e => setBtcInterest(e.target.checked)}
                className="mt-0.5 accent-orange-400"
              />
              <div>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <span className="text-orange-400 font-bold">₿</span>
                  I am interested in Bitcoin OTC purchases
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We'll send you OTC onboarding information and KYC instructions to unlock Bitcoin purchasing.
                </p>
              </div>
            </label>
          </div>
          
          <Button type="submit" className="w-full h-12 uppercase font-bold tracking-wider">
            Create Account
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/account/login" className="text-primary hover:underline font-bold">Sign In</Link>
          </p>
        </div>

        {btcInterest && (
          <div className="mt-4 bg-orange-400/10 border border-orange-400/20 rounded-lg p-3 text-xs text-orange-300 text-center">
            ✅ Great! After creating your account, complete KYC verification to unlock Bitcoin OTC.
          </div>
        )}
      </div>
    </div>
  );
}
