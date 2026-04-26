import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useKYC } from "@/lib/kycContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, IdCard, FileText, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const { isApproved, kycStatus } = useKYC();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/account/login?redirect=/checkout");
    }
  }, [user, setLocation]);

  if (!user) return null;

  if (!isApproved) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card border border-amber-500/30 rounded-2xl overflow-hidden">
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-6">
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
              <h1 className="text-xl font-bold text-foreground">Identity Verification Required</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              All precious metals purchases require KYC verification per US regulatory requirements (Bank Secrecy Act / FinCEN).
            </p>
          </div>

          <div className="px-8 py-8 space-y-6">
            <p className="text-foreground font-medium">You'll need to provide:</p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
                <div className="text-3xl">🪪</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Government-Issued ID Card</h3>
                  <p className="text-sm text-muted-foreground">Driver's license, passport, or state ID. Front + back photo required. Must not be expired.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
                <div className="text-3xl">📋</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Utility Bill or Proof of Address</h3>
                  <p className="text-sm text-muted-foreground">Bank statement, utility bill, or government letter dated within the last 90 days. Must show your name and address.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground text-base mb-2">⏱ Takes about 5 minutes</p>
              <p>✅ Review within 1–2 business days</p>
              <p>✅ One-time verification — shop freely after approval</p>
              <p>✅ Unlocks all metals: Gold, Silver, Platinum, Copper</p>
              <p>✅ Also unlocks Bitcoin OTC purchases</p>
            </div>

            {kycStatus === "pending_review" ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-center">
                <p className="text-blue-400 font-semibold mb-1">🕐 Application Under Review</p>
                <p className="text-sm text-muted-foreground">Your KYC is being reviewed. You'll receive an email when approved — typically within 1–2 business days.</p>
              </div>
            ) : (
              <Link
                href="/account/kyc"
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
              >
                <ShieldCheck className="h-5 w-5" />
                Start Identity Verification
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}

            <div className="text-center">
              <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-serif font-bold mb-4">Checkout</h1>
      <p className="text-muted-foreground mb-8">Checkout flow implementation pending.</p>
      <Link href="/order-confirmation" className="text-primary hover:underline">Complete Order (Demo)</Link>
    </div>
  );
}
