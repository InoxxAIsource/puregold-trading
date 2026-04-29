import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

interface StoredUser { email: string; password: string; firstName: string; lastName: string; }

function updatePassword(email: string, newPassword: string) {
  const users: StoredUser[] = JSON.parse(localStorage.getItem("pg_users") || "[]");
  const updated = users.map((u) => u.email === email ? { ...u, password: newPassword } : u);
  localStorage.setItem("pg_users", JSON.stringify(updated));
}

interface ResetCode {
  email: string;
  code: string;
  expires: number;
}

function getStoredCode(email: string): ResetCode | null {
  try {
    const list = JSON.parse(localStorage.getItem("gb_reset_codes") || "[]") as ResetCode[];
    return list.find((r) => r.email === email && r.expires > Date.now()) ?? null;
  } catch {
    return null;
  }
}

function clearStoredCode(email: string) {
  try {
    const list = JSON.parse(localStorage.getItem("gb_reset_codes") || "[]") as ResetCode[];
    localStorage.setItem(
      "gb_reset_codes",
      JSON.stringify(list.filter((r) => r.email !== email))
    );
  } catch {}
}

export default function ResetPasswordPage() {
  const search = useSearch();
  const [, setLocation] = useLocation();

  const params = new URLSearchParams(search);
  const emailParam = params.get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!emailParam) setLocation("/account/forgot-password");
  }, [emailParam, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    if (trimmedCode.length !== 6 || !/^\d{6}$/.test(trimmedCode)) {
      setError("Please enter the 6-digit code from your email.");
      return;
    }
    if (password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const stored = getStoredCode(emailParam);
    if (!stored) {
      setError("Reset code not found or has expired. Please request a new one.");
      return;
    }
    if (stored.code !== trimmedCode) {
      setError("Incorrect code. Please check your email and try again.");
      return;
    }

    setSubmitting(true);
    try {
      updatePassword(emailParam, password);
      clearStoredCode(emailParam);
      setDone(true);
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-lg bg-card border border-border rounded-lg p-8 text-center">
          <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Password Updated</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <Button
            className="w-full h-12 uppercase font-bold tracking-wider"
            onClick={() => setLocation("/account/login")}
          >
            Sign In Now →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg p-8">
        <Link
          href="/account/forgot-password"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Reset Password</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Enter the 6-digit code sent to{" "}
          <span className="text-foreground font-medium">{emailParam}</span>, then choose a new password.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          Code expires in 15 minutes.{" "}
          <Link href="/account/forgot-password" className="text-primary hover:underline">
            Resend code
          </Link>
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="code">6-Digit Reset Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="_ _ _ _ _ _"
              autoFocus
              className="bg-background border-border h-12 text-center text-2xl font-mono tracking-[0.5em]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="bg-background border-border h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="bg-background border-border h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 uppercase font-bold tracking-wider"
            disabled={submitting || code.length !== 6}
          >
            {submitting ? "Updating…" : "Set New Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
