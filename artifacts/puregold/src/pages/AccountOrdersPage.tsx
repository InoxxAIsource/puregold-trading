import { Link } from "wouter";
import { Package, ExternalLink } from "lucide-react";
import DashboardLayout from "./AccountDashboardPage"; // I'll just inline the layout here since it's already there or recreate it if needed. Actually it's better to just duplicate the layout for simplicity or refactor. I'll just use a simplified version since it's a demo.

// We will recreate a simple layout for these pages or just put them in a container
export default function AccountOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-foreground">Order History</h1>
      </div>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>You haven't placed any orders yet.</p>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">Start Shopping</Link>
        </div>
      </div>
    </div>
  );
}
