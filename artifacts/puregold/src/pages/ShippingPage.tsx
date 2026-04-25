export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Shipping & Returns Policy</h1>
      
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <h2>Free Shipping on Orders Over $499</h2>
        <p>All orders over $499 ship for free within the contiguous United States. Orders under $499 are subject to a flat $9.95 shipping and insurance fee.</p>

        <h2>Fully Insured</h2>
        <p>Every package we ship is fully insured for its full value while in transit. In the extremely rare event that a package is lost or damaged in transit, you are fully covered.</p>

        <h2>Discreet Packaging</h2>
        <p>Security is our top priority. All packages are shipped in completely nondescript packaging without any mention of "gold", "silver", "bullion", or our company name on the exterior.</p>

        <h2>Return Policy</h2>
        <p>We offer a 3-day return policy. You must contact us within 3 days of receiving your order to request a Return Merchandise Authorization (RMA) number. All returns are subject to our Market Loss Policy and a 5% restocking fee.</p>
      </div>
    </div>
  );
}
