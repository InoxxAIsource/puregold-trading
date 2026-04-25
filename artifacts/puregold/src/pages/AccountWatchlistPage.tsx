import { useWatchlist } from "@/contexts/WatchlistContext";
import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function AccountWatchlistPage() {
  const { items } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-foreground">Your Watchlist</h1>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-muted-foreground">
            <p>Your watchlist is empty.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">Browse Products</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-muted-foreground text-sm">Products in watchlist: {items.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
