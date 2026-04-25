export function FilterSidebar() {
  return (
    <div className="w-full bg-card border border-border rounded-lg p-6 space-y-8" data-testid="filter-sidebar">
      <div>
        <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">Metal Type</h3>
        <div className="space-y-2">
          {['Gold', 'Silver', 'Platinum', 'Palladium', 'Copper'].map(metal => (
            <label key={metal} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background accent-primary" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{metal}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">Category</h3>
        <div className="space-y-2">
          {['Coins', 'Bars', 'Rounds', 'Notes'].map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background accent-primary" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">Features</h3>
        <div className="space-y-2">
          {[
            { id: 'in_stock', label: 'In Stock Only' },
            { id: 'ira', label: 'IRA Eligible' },
            { id: 'sale', label: 'On Sale' },
            { id: 'new', label: 'New Arrivals' }
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background accent-primary" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
