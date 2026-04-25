import { Bell } from "lucide-react";

export default function AccountPriceAlertsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-foreground">Price Alerts</h1>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create New Alert</h2>
        <form className="flex gap-4" onSubmit={e => e.preventDefault()}>
          <select className="bg-background border border-border rounded-md px-4 py-2 flex-1">
            <option>Gold</option>
            <option>Silver</option>
            <option>Platinum</option>
          </select>
          <select className="bg-background border border-border rounded-md px-4 py-2 w-32">
            <option>Drops Below</option>
            <option>Rises Above</option>
          </select>
          <input type="number" placeholder="Price $" className="bg-background border border-border rounded-md px-4 py-2 w-32" />
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-bold uppercase tracking-wider">Add</button>
        </form>
      </div>

      <div className="mt-8 bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>You have no active price alerts.</p>
        </div>
      </div>
    </div>
  );
}
