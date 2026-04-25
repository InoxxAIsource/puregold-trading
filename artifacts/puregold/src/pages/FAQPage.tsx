export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-4">Ordering & Payment</h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold mb-2">Is there a minimum order amount?</h3>
              <p className="text-muted-foreground text-sm">There is no strict minimum order amount, however, orders under $499 incur a flat $9.95 shipping fee. Orders over $499 ship for free.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">We accept Bank Wire, Check, Credit/Debit Cards, PayPal, and major Cryptocurrencies (Bitcoin, Ethereum, USDC). Bank wires and checks receive a 4% cash discount.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-4">Shipping & Insurance</h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold mb-2">Is my package insured?</h3>
              <p className="text-muted-foreground text-sm">Yes, every single package we ship is fully insured until the moment it is signed for or recorded as delivered at your address.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold mb-2">What does the packaging look like?</h3>
              <p className="text-muted-foreground text-sm">We use incredibly discreet, heavy-duty packaging. There are no indications of "gold", "silver", or our company name on the exterior of the box for security purposes.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
