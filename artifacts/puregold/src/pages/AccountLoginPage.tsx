import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountLoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, name: "Demo User" });
    setLocation("/account/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">
        <h1 className="text-3xl font-serif font-bold text-center mb-6">Account Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              className="bg-background border-border"
            />
          </div>
          
          <Button type="submit" className="w-full h-12 uppercase font-bold tracking-wider">
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <Button variant="outline" className="w-full h-12 uppercase font-bold tracking-wider" asChild>
            <Link href="/account/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
