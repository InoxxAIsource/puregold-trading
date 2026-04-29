import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Package, Heart, Bell, Bitcoin, UserCircle, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StoredUser = { firstName: string; lastName: string; email: string; password: string };

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem("pg_users") || "[]"); } catch { return []; }
}

function updateUser(email: string, updates: Partial<StoredUser>) {
  const users = getUsers();
  const updated = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...updates } : u);
  localStorage.setItem("pg_users", JSON.stringify(updated));
}

const TABS = [
  { id: "dashboard", label: "Dashboard", href: "/account/dashboard" },
  { id: "profile", label: "My Profile", href: "/account/profile" },
  { id: "orders", label: "Orders", href: "/account/orders" },
];

function AccountNav({ user, logout }: { user: any; logout: () => void }) {
  const [, setLocation] = useLocation();
  const handleLogout = () => { logout(); setLocation("/"); };

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
        <div className="p-6 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {(user?.name || user?.email || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base truncate">{user?.name || "Account"}</h2>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col p-2">
          <Link href="/account/dashboard" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground">Dashboard</Link>
          <Link href="/account/profile" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-primary bg-primary/5 border-l-2 border-primary">My Profile</Link>
          <Link href="/account/orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
            Orders <Package className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link href="/account/otc-orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-orange-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Bitcoin className="h-4 w-4" /> BTC OTC Orders</span>
          </Link>
          <Link href="/account/watchlist" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
            Watchlist <Heart className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link href="/account/price-alerts" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
            Price Alerts <Bell className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link href="/account/kyc" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground">KYC Status</Link>
          <button onClick={handleLogout} className="px-4 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive rounded transition-colors text-left flex items-center justify-between mt-4">
            Sign Out <LogOut className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default function AccountProfilePage() {
  const { user, login, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/account/profile");
  }, [user, setLocation]);

  // Load stored profile info
  const stored = getUsers().find(u => u.email.toLowerCase() === (user?.email || "").toLowerCase());

  const [firstName, setFirstName] = useState(stored?.firstName || user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(stored?.lastName || user?.name?.split(" ").slice(1).join(" ") || "");
  const [phone, setPhone] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    updateUser(user.email, { firstName: firstName.trim(), lastName: lastName.trim() });
    login({ ...user, name });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");

    // If user is in the registered users list, validate current password
    if (stored) {
      if (currentPw !== stored.password) { setPwError("Current password is incorrect."); return; }
    }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }

    updateUser(user.email, { password: newPw });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountNav user={user} logout={logout} />

        <main className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-foreground">My Profile</h1>
          </div>

          {/* Account tabs */}
          <div className="flex gap-1 border-b border-border mb-6">
            {TABS.map(tab => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
                  tab.id === "profile"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Personal Info */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-5">Personal Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-background border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-background border-border" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user.email} disabled className="bg-background border-border opacity-60 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" type="tel" className="bg-background border-border" />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                {profileSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" /> Profile updated
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Change Password */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-5">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {stored && (
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" className="bg-background border-border" required />
                </div>
              )}
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" className="bg-background border-border" required />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter new password" className="bg-background border-border" required />
              </div>
              {pwError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive">{pwError}</div>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" variant="outline">Update Password</Button>
                {pwSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" /> Password changed
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Account Actions */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">Account Actions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">KYC Verification</p>
                  <p className="text-xs text-muted-foreground">Required to purchase metals and Bitcoin OTC</p>
                </div>
                <Link href="/account/kyc" className="text-sm text-primary hover:underline font-semibold">View Status →</Link>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-destructive">Sign Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your GoldBuller account</p>
                </div>
                <button
                  onClick={() => { logout(); setLocation("/"); }}
                  className="flex items-center gap-1.5 text-sm text-destructive border border-destructive/30 hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
