import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountRegisterPage() {
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          
          <Button type="submit" className="w-full h-12 uppercase font-bold tracking-wider">
            Create Account
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/account/login" className="text-primary hover:underline font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
