import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const STATES = [
  { name: "Alabama", gold: "Taxed", silver: "Taxed", notes: "No exemptions for precious metals." },
  { name: "Alaska", gold: "Exempt", silver: "Exempt", notes: "No state sales tax." },
  { name: "Arizona", gold: "Exempt", silver: "Exempt", notes: "Fully exempt." },
  { name: "California", gold: "Partial", silver: "Partial", notes: "Exempt on single transactions over $1,500." },
  { name: "Delaware", gold: "No Tax", silver: "No Tax", notes: "No state sales tax." },
  { name: "Florida", gold: "Partial", silver: "Partial", notes: "Exempt on single transactions over $500 US face value." },
  { name: "Texas", gold: "Exempt", silver: "Exempt", notes: "Fully exempt for gold, silver, platinum." },
  // Truncated for demo purposes
];

export default function TaxPage() {
  const [search, setSearch] = useState("");
  
  const filtered = STATES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Local Sales Tax Guide</h1>
        <p className="text-muted-foreground mb-8">
          Sales tax regulations for precious metals vary significantly by state. Enter your state below to see how your purchase might be taxed.
        </p>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your state..." 
            className="pl-12 h-12 bg-card border-border"
          />
        </div>
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">State</th>
                <th className="p-4 font-semibold text-muted-foreground">Gold/Silver Bullion</th>
                <th className="p-4 font-semibold text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(state => (
                <tr key={state.name} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-medium text-foreground">{state.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      state.gold === 'Exempt' || state.gold === 'No Tax' ? 'bg-green-500/10 text-green-500' :
                      state.gold === 'Partial' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {state.gold}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">{state.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
