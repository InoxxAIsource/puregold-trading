import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

function getRedirectUrl() {
  return new URLSearchParams(window.location.search).get("redirect") || "/account/dashboard";
}

export default function AccountLoginPage() {
  const { login } = useAuth();
  const { addItem } = useCartContext();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectUrl = getRedirectUrl();
  const isCartRedirect = redirectUrl.includes("/cart") || redirectUrl.includes("/checkout");

  const restorePendingCart = () => {
    try {
      const pending = localStorage.getItem("pg_pending_cart");
      if (pending) {
        addItem(JSON.parse(pending));
        localStorage.removeItem("pg_pending_cart");
      }
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }
      login(data.user);
      restorePendingCart();
      setLocation(redirectUrl);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestCheckout = () => {
    restorePendingCart();
    setLocation("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        {isCartRedirect && (
          <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <ShoppingBag className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">Sign in to complete your purchase</p>
              <p className="text-xs text-muted-foreground">Your item has been saved. Sign in or continue as a guest.</p>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-center mb-2">Sign In</h1>
          <p className="text-center text-muted-foreground text-sm mb-8">Access your GoldBuller account</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/account/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-border pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 uppercase font-bold tracking-wider" disabled={submitting}>
              <LogIn className="h-4 w-4 mr-2" />
              {submitting ? "Signing In…" : "Sign In"}
            </Button>
          </form>

          {isCartRedirect && (
            <div className="mt-4">
              <div className="relative flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 border-t border-border" />
              </div>
              <button
                onClick={handleGuestCheckout}
                className="w-full h-12 rounded-lg border border-border text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                data-testid="btn-guest-checkout"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue as Guest
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-2">No account required — checkout as a guest</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">Don't have an account?</p>
            <Button variant="outline" className="w-full h-12 uppercase font-bold tracking-wider" asChild>
              <Link href="/account/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
