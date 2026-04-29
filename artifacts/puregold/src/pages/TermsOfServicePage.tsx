export default function TermsOfServicePage() {
  const updated = "April 29, 2026";

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">Client Agreement &amp; Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: <span className="text-foreground font-medium">{updated}</span>
        </p>
        <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-muted-foreground leading-relaxed">
          This Client Agreement and Terms of Service ("Agreement") is entered into between <strong className="text-foreground">GoldBuller LLC</strong>, a Texas limited liability company ("GoldBuller LLC," "we," "us," or "our"), and you, the customer ("Client," "you," or "your"). By accessing our website or placing an order, you agree to be bound by this Agreement in its entirety.
        </div>
      </div>

      <div className="space-y-10 text-muted-foreground leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">1. Agreement to Terms</h2>
          <p className="mb-3">By accessing or using the GoldBuller LLC website, placing an order, registering an account, or otherwise engaging with GoldBuller LLC's services, you acknowledge that you have read, understood, and agree to be bound by this Agreement and our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>, which is incorporated herein by reference.</p>
          <p>GoldBuller LLC reserves the right to modify this Agreement at any time. Material changes will be posted on our website with an updated effective date. Your continued use of our services following such changes constitutes your acceptance of the revised Agreement.</p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">2. Eligibility</h2>
          <p className="mb-3">To use GoldBuller LLC's services, you must:</p>
          <div className="space-y-2">
            {[
              "Be at least 18 years of age or the legal age of majority in your jurisdiction",
              "Have the legal capacity to enter into a binding contract",
              "Not be prohibited from purchasing precious metals under applicable law",
              "Provide accurate, current, and complete information during registration and transactions",
              "Comply with all applicable federal, state, and local laws and regulations",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">3. Purchasing and Pricing</h2>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">3.1 Price Lock and Order Confirmation</h3>
          <p className="mb-3">All precious metals prices are subject to market fluctuation and are quoted in real-time. When you place an order, GoldBuller LLC will lock in your price at the time of order confirmation. Prices displayed on the website are indicative only and are not binding until you receive a written order confirmation from GoldBuller LLC.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">3.2 Market Loss Policy</h3>
          <p className="mb-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm">
            <strong className="text-foreground">Important:</strong> When purchasing from GoldBuller LLC, you enter into a binding purchase contract at the locked price. If you cancel your order, fail to provide payment within the required settlement window, or otherwise default on your obligation, you are responsible for any market loss GoldBuller LLC incurs as a result of re-hedging or liquidating the position taken on your behalf.
          </p>
          <p>Market loss is calculated as the difference between the locked price at time of your order and the prevailing market price at the time GoldBuller LLC resells or hedges the position. GoldBuller LLC reserves the right to charge this market loss to any payment method on file or to pursue collection through all available legal means.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">3.3 Payment</h3>
          <p className="mb-3">GoldBuller LLC accepts the following payment methods:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {["Bank Wire Transfer", "Check / Money Order", "ACH Transfer", "Credit / Debit Card", "Bitcoin (BTC)", "Other Cryptocurrency"].map((m) => (
              <div key={m} className="text-sm p-2 rounded-lg bg-secondary/20 border border-border/50 text-center font-medium text-foreground">{m}</div>
            ))}
          </div>
          <p className="text-sm">Bank wire transfers and checks may be eligible for a cash discount of up to 4%. Credit card payments are subject to a processing fee. All payments must be received and cleared before GoldBuller LLC ships any products.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">3.4 Payment Settlement Window</h3>
          <p>Upon order confirmation, GoldBuller LLC will provide wire transfer instructions. Payment must be received within <strong className="text-foreground">4 business hours</strong> of order confirmation for wire transfers, or within <strong className="text-foreground">3 business days</strong> for check/money order payments. Failure to remit payment within the required window may result in order cancellation and market loss charges.</p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">4. KYC / Identity Verification</h2>
          <p className="mb-3">GoldBuller LLC is committed to full compliance with all applicable anti-money laundering (AML) and know-your-customer (KYC) regulations, including those promulgated by FinCEN under the Bank Secrecy Act.</p>
          <p className="mb-3">GoldBuller LLC reserves the right to require identity verification for any transaction. For transactions meeting or exceeding applicable reporting thresholds, or at GoldBuller LLC's sole discretion, you may be required to provide:</p>
          <div className="space-y-2">
            {[
              "Government-issued photo identification (driver's license, passport)",
              "Social Security Number or Tax Identification Number",
              "Proof of address (utility bill, bank statement)",
              "Source of funds documentation",
              "IRS Form W-9 (for U.S. persons) or W-8BEN (for non-U.S. persons)",
              "Additional documentation as required by applicable law",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-3">GoldBuller LLC reserves the right to refuse, cancel, or reverse any transaction if required verification documents are not provided or if GoldBuller LLC has reason to believe the transaction may involve fraud, money laundering, or other illegal activity.</p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">5. Shipping and Insurance</h2>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">5.1 Insured Shipping</h3>
          <p className="mb-3">All shipments from GoldBuller LLC are fully insured for the full value of the contents from the time of departure from our facility until the package is signed for or recorded as delivered at your address. Title and risk of loss transfer to you upon delivery.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">5.2 Discreet Packaging</h3>
          <p className="mb-3">GoldBuller LLC ships all orders in unmarked, discreet packaging with no external indication of the contents. Our company name does not appear on the exterior of any package.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">5.3 Signature Requirement</h3>
          <p className="mb-3">All shipments require an adult signature upon delivery. If delivery is attempted and no one is available to sign, the carrier will make up to two additional delivery attempts before holding the package at a local facility. GoldBuller LLC is not responsible for packages that are returned to sender due to failed delivery attempts.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">5.4 Shipping Times</h3>
          <p>GoldBuller LLC typically ships within 1–3 business days of payment clearance. Standard delivery is 3–5 business days; expedited options are available. Shipping timelines may vary based on carrier capacity, weather events, and other circumstances outside GoldBuller LLC's control.</p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">6. Returns and Buy-Back Policy</h2>
          <p className="mb-3">GoldBuller LLC offers a 7-day return policy for products that are returned in their original, unopened condition. Opened or handled products may not be returned unless they are found to be counterfeit or materially different from the product described. Return shipping costs are the responsibility of the Client.</p>
          <p className="mb-3">GoldBuller LLC maintains an active buy-back program for precious metals. Buy-back prices are based on current spot market prices and product condition at the time of repurchase. Contact our team at <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a> or call <strong className="text-foreground">1-800-GOLD-NOW</strong> to initiate a return or buy-back.</p>
          <p className="text-sm p-3 rounded-lg bg-secondary/20 border border-border">Note: GoldBuller LLC does not accept returns on custom or special-order products, numismatic items graded by NGC or PCGS, or products that show signs of handling, wear, or damage.</p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">7. Authenticity Guarantee</h2>
          <p className="mb-3">GoldBuller LLC guarantees the authenticity of all products sold on our platform. All products are sourced directly from authorized mints, authorized distributors, or are verified through industry-standard testing protocols prior to listing. We stand behind every product we sell.</p>
          <p>If you believe you have received a counterfeit product, contact GoldBuller LLC immediately. We will work with you to investigate and, if confirmed counterfeit, replace the product at no cost to you and assist in reporting the matter to appropriate authorities.</p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">8. Investment Risk Disclosure</h2>
          <div className="p-4 rounded-xl border border-yellow-600/30 bg-yellow-600/5 text-sm leading-relaxed">
            <p className="font-semibold text-foreground mb-2">⚠ Important Risk Disclosure</p>
            <p className="mb-2">Precious metals investing involves substantial risk of loss. The value of gold, silver, platinum, palladium, and other precious metals can fluctuate significantly and may decrease in value. Past performance is not indicative of future results.</p>
            <p className="mb-2">GoldBuller LLC does not provide investment advice. Nothing on our website, in our communications, or in this Agreement constitutes investment, tax, or legal advice. You should consult with qualified professionals before making any investment decisions.</p>
            <p>GoldBuller LLC is not a registered investment advisor, broker-dealer, or financial planner. We are a dealer in physical precious metals only.</p>
          </div>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">9. Limitation of Liability</h2>
          <p className="mb-3">To the maximum extent permitted by applicable law, GoldBuller LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, loss of data, or loss of goodwill, arising out of or in connection with this Agreement or your use of our services.</p>
          <p>GoldBuller LLC's total liability to you for any claim arising out of or related to this Agreement shall not exceed the total amount paid by you for the specific transaction giving rise to the claim in the twelve (12) months preceding the claim.</p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">10. Governing Law and Dispute Resolution</h2>
          <p className="mb-3">This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions. Any dispute arising out of or related to this Agreement shall be resolved by binding arbitration administered by the American Arbitration Association in Dallas, Texas, except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction.</p>
          <p>You agree to waive any right to a jury trial and to participate in any class action lawsuit or class-wide arbitration in connection with any dispute with GoldBuller LLC.</p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">11. Compliance — Taxes and Reporting</h2>
          <p className="mb-3">You are solely responsible for determining and fulfilling your tax obligations related to the purchase or sale of precious metals. GoldBuller LLC may be required by law to collect and report transaction information to the Internal Revenue Service (IRS) or other governmental authorities.</p>
          <p>Certain precious metals transactions may require GoldBuller LLC to file IRS Form 1099-B. Sales of specific quantities and types of precious metals by the Client to GoldBuller LLC may also trigger IRS Form 1099-B reporting. Consult a qualified tax advisor for specific guidance.</p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">12. Account Security</h2>
          <p className="mb-3">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. GoldBuller LLC will never ask for your password via email or phone. You agree to notify GoldBuller LLC immediately of any unauthorized use of your account or any other breach of security.</p>
          <p>GoldBuller LLC shall not be liable for any loss or damage arising from your failure to maintain adequate account security.</p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">13. Entire Agreement</h2>
          <p>This Agreement, together with the GoldBuller LLC Privacy Policy and any additional terms and conditions presented to you at the time of a specific transaction, constitutes the entire agreement between you and GoldBuller LLC with respect to its subject matter and supersedes all prior and contemporaneous agreements, proposals, or representations, written or oral.</p>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-2xl border border-border bg-secondary/10">
          <h2 className="text-xl font-serif font-bold text-foreground mb-3">Contact GoldBuller LLC</h2>
          <p className="mb-3 text-sm">For questions about this Agreement or any of our policies, please contact us:</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-foreground font-semibold">GoldBuller LLC</span></p>
            <p>3200 Commerce St, Suite 400, Dallas, TX 75226</p>
            <p>Email: <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a></p>
            <p>Phone: <strong className="text-foreground">1-800-GOLD-NOW</strong> (Mon–Fri, 9am–6pm ET)</p>
          </div>
        </section>

      </div>
    </div>
  );
}
