export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-6">About PureGold</h1>
      <p className="text-xl text-muted-foreground mb-12">Building trust through transparency and competitive pricing since 2018.</p>
      
      <div className="prose prose-invert mx-auto text-left">
        <p>PureGold Trading was founded in Dallas, Texas with a simple mission: to provide investors with a secure, transparent, and highly competitive way to acquire physical precious metals.</p>
        <p>Over the years, we have grown from a small local dealer to one of the nation's premier precious metals firms, facilitating over $8 Billion in transactions for more than 200,000 satisfied customers.</p>
        <p>Our direct relationships with sovereign and private mints around the globe allow us to source high-quality bullion at the lowest possible premiums, passing those savings directly to you.</p>
        
        <h3 className="font-serif mt-12 text-2xl font-bold">Why Investors Choose Us</h3>
        <ul>
          <li><strong>Real-Time Pricing:</strong> Our systems are tied directly to global spot markets, ensuring you always pay a fair and accurate price.</li>
          <li><strong>Deep Inventory:</strong> We stock millions of dollars in inventory, meaning the vast majority of our orders ship within 48 hours.</li>
          <li><strong>Discreet & Insured Shipping:</strong> Every package is shipped in unmarked, nondescript packaging and is fully insured while in transit.</li>
          <li><strong>Expert Guidance:</strong> Our non-commissioned sales team is here to educate and assist, never to pressure.</li>
        </ul>
      </div>
    </div>
  );
}
