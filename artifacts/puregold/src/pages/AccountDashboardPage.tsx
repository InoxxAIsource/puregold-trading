import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Package, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/account/login");
    return null;
  }

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
              <Link href="/account/watchlist" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Watchlist <Heart className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/price-alerts" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Price Alerts <Bell className="h-4 w-4 text-muted-foreground" />
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
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Est. Portfolio Value</h3>
          <div className="text-3xl font-mono font-bold text-foreground">$14,250.00</div>
          <div className="text-sm text-green-500 mt-2 font-mono">+$845.50 (6.3%)</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Gold (oz)</h3>
          <div className="text-3xl font-mono font-bold text-primary">2.50</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Silver (oz)</h3>
          <div className="text-3xl font-mono font-bold text-slate-300">105.00</div>
        </div>
      </div>
      
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
