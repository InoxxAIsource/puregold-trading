import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface StoredUser { email: string; password: string; firstName: string; lastName: string; }

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem("pg_users") || "[]"); } catch { return []; }
}

function emailTaken(email: string): boolean {
  return getUsers().some((u) => u.email === email);
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function storeResetCode(email: string, code: string) {
  const key = "gb_reset_codes";
  const existing = JSON.parse(localStorage.getItem(key) || "[]") as Array<{
    email: string;
    code: string;
    expires: number;
  }>;
  const filtered = existing.filter(
    (r) => r.email !== email && r.expires > Date.now()
  );
  filtered.push({ email, code, expires: Date.now() + 15 * 60 * 1000 });
  localStorage.setItem(key, JSON.stringify(filtered));
}

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalised = email.trim().toLowerCase();

    if (!normalised) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailTaken(normalised)) {
      setError("No account found with that email address.");
      return;
    }

    setSubmitting(true);
    try {
      const code = generateCode();
      storeResetCode(normalised, code);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalised, code }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to send reset email. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-lg bg-card border border-border rounded-lg p-8 text-center">
          <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Check Your Email</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We've sent a 6-digit reset code to <strong className="text-foreground">{email.trim().toLowerCase()}</strong>.
            The code expires in 15 minutes.
          </p>
          <Button
            className="w-full h-12 uppercase font-bold tracking-wider mb-4"
            onClick={() =>
              setLocation(
                `/account/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`
              )
            }
          >
            Enter Reset Code →
          </Button>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Didn't get it? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg p-8">
        <Link
          href="/account/login"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Forgot Password</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Enter the email address on your account and we'll send you a 6-digit reset code.
        </p>

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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="bg-background border-border h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 uppercase font-bold tracking-wider"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send Reset Code"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered it?{" "}
          <Link href="/account/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
