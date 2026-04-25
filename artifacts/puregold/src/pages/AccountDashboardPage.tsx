import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";
import { getOTCOrders } from "@/lib/otcOrders";
import { LogOut, Package, Heart, Bell, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KYCStatusBadge } from "@/components/kyc/KYCStatusBadge";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation("/account/login");
  }, [user, setLocation]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border bg-secondary/20">
              <h2 className="font-serif font-bold text-xl">{user?.name || 'Account'}</h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <nav className="flex flex-col p-2">
              <Link href="/account/dashboard" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground">Dashboard</Link>
              <Link href="/account/orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Orders <Package className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/otc-orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-orange-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bitcoin className="h-4 w-4" /> Bitcoin OTC Orders
                </span>
              </Link>
              <Link href="/account/watchlist" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Watchlist <Heart className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/price-alerts" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Price Alerts <Bell className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/kyc" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                <span>KYC Status</span>
                <span className="h-2 w-2 rounded-full bg-orange-400" />
              </Link>
              <button onClick={handleLogout} className="px-4 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive rounded transition-colors text-left flex items-center justify-between mt-4">
                Sign Out <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  const { kycStatus, isApproved } = useKYC();
  const otcOrders = getOTCOrders();
  const pendingOTC = otcOrders.filter(o => o.status === "wire_awaited" || o.status === "submitted" || o.status === "wire_received").length;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Portfolio Dashboard</h1>
      
      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Est. Portfolio Value</h3>
          <div className="text-2xl font-mono font-bold text-foreground">$14,250.00</div>
          <div className="text-sm text-green-500 mt-1 font-mono">+$845.50 (6.3%)</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Gold (oz)</h3>
          <div className="text-2xl font-mono font-bold text-primary">2.50</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Silver (oz)</h3>
          <div className="text-2xl font-mono font-bold text-slate-300">105.00</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active OTC Orders</h3>
          <div className="text-2xl font-mono font-bold text-orange-400">{pendingOTC}</div>
          <div className="text-xs text-muted-foreground mt-1">pending</div>
        </div>
      </div>

      {/* KYC Status Card */}
      <div className="mb-8">
        {isApproved ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <h3 className="font-semibold text-green-400">KYC Verified — Bitcoin OTC Unlocked</h3>
              </div>
              <p className="text-sm text-muted-foreground">You can purchase 0.20–10 BTC through our OTC desk.</p>
            </div>
            <Link href="/bitcoin-otc/apply" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
              ₿ Apply to Buy Bitcoin →
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🔐</span>
                <h3 className="font-semibold text-foreground">Unlock Bitcoin OTC</h3>
              </div>
              <p className="text-sm text-muted-foreground">Complete KYC verification to buy 0.20–10 BTC. Takes ~5 minutes. Approval in 1-2 business days.</p>
              <div className="mt-2">
                <KYCStatusBadge compact={true} />
              </div>
            </div>
            <Link href="/account/kyc" className="bg-orange-400 text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-300 transition-colors whitespace-nowrap">
              Complete KYC Now →
            </Link>
          </div>
        )}
      </div>

      {/* Recent OTC orders preview */}
      {otcOrders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="text-orange-400">₿</span> Recent OTC Orders
            </h2>
            <Link href="/account/otc-orders" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/20 border-b border-border">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Order</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">BTC</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Total</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {otcOrders.slice(0, 3).map(order => (
                  <tr key={order.id} className="border-b border-border/40">
                    <td className="py-2.5 px-4 font-mono text-xs text-primary">{order.id}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-foreground">{order.btcAmount.toFixed(2)} BTC</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-foreground">${order.usdTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                    <td className="py-2.5 px-4 text-xs text-yellow-400 capitalize">{order.status.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          You haven't placed any orders yet.
          <div className="mt-4">
            <Button asChild><Link href="/">Start Shopping</Link></Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
