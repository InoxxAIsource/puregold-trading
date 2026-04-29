export default function PrivacyPolicyPage() {
  const updated = "April 29, 2026";

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: <span className="text-foreground font-medium">{updated}</span>
        </p>
        <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-muted-foreground leading-relaxed">
          This Privacy Policy is provided by <strong className="text-foreground">GoldBuller LLC</strong>, a Texas limited liability company ("GoldBuller LLC," "we," "us," or "our"). It describes how we collect, use, and share your personal information when you interact with our website, services, and team.
        </div>
      </div>

      <div className="space-y-10 text-muted-foreground leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Scope of This Privacy Policy</h2>
          <p className="mb-4">This Privacy Policy applies to our interactions with you across various platforms, including:</p>
          <div className="space-y-4">
            {[
              {
                title: "Websites and Mobile Applications",
                body: "This includes any interaction you have with our main website and any associated mobile applications (collectively, the \"Website\"). We collect data through forms, account registration, and browsing activities.",
              },
              {
                title: "Events",
                body: "When you attend events such as coin shows where GoldBuller LLC participates, we may collect personal information from you, including your name, contact details, and transaction history.",
              },
              {
                title: "Phone, Text, and Email Communications",
                body: "Personal information may be collected when you communicate with us via phone, text, or email, such as call logs, email addresses, and the content of the communications.",
              },
              {
                title: "In-Person Visits",
                body: "If you visit one of our facilities, we collect CCTV footage for security and fraud prevention purposes.",
              },
              {
                title: "Social Media",
                body: "We collect likes, comments, and direct messages through interactions on our social media pages and other third-party social media sites such as Facebook, YouTube, LinkedIn, Instagram, and X (Twitter).",
              },
              {
                title: "Online Advertisements and Emails",
                body: "If you view our online ads or emails, we may collect information about your interaction with these communications, such as click-through rates and preferences.",
              },
              {
                title: "Authorized Service Providers",
                body: "We may also collect information through third-party service providers who are authorized to act on our behalf, including marketing firms and payment processors.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="pl-4 border-l-2 border-primary/30">
                <p className="font-semibold text-foreground mb-1">{title}.</p>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Collection of Personal Information</h2>
          <p className="mb-4">As further described below, GoldBuller LLC collects personal information directly from you, automatically through your use of the Website, and from other third-party sources. To the extent permitted by applicable law, we may combine information we collect from publicly available or third-party sources.</p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Information You Provide Directly</h3>
          <div className="space-y-3">
            {[
              { label: "Contact Information", text: "When you contact us, we collect your name, email address, phone number, the nature of your inquiry, and any other information you choose to provide." },
              { label: "Account Information", text: "When you register for an account with GoldBuller LLC, we collect your name, date of birth, email address, password, and any other information used in connection with accessing your account." },
              { label: "Purchases and Payments", text: "If you make a purchase, we collect payment information such as name, payment details including ACH, routing and account numbers, and credit card information, and billing and shipping address. You may be required to provide financial and banking information before making a purchase." },
              { label: "Communications and Interactions", text: "When you send email, text messages, call, or otherwise communicate with us and with members of our team, we collect and maintain a record of your contact details, communications, and our responses." },
              { label: "Responses and Feedback", text: "If you participate in our surveys or questionnaires, we collect your responses and feedback, such as user satisfaction or other information related to your use of the Website." },
              { label: "Marketing and Promotions", text: "If you agree to receive marketing communications from us, we collect your email, name, phone number, and preferences. If you participate in promotions, we collect your name and other information related to the activities available through the Website." },
              { label: "Inferences", text: "We may generate inferences about you based on other personal information we collect, such as your preferences, behaviors, contact information, and demographic information." },
              { label: "Audio, Electronic, and Video Information", text: "If you call us or visit one of our facilities, we collect information such as call recordings, CCTV footage, and photographs." },
            ].map(({ label, text }) => (
              <div key={label} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p><span className="font-medium text-foreground">{label}. </span>{text}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Identity Verification Information</h3>
          <p className="mb-3">When you elect to make a purchase of certain high-value products or services, GoldBuller LLC may collect and process your personal information for identity verification and fraud prevention purposes. This may include:</p>
          <p className="mb-3">Name, postal address, email address, social security number, telephone number, signature, bank account number or credit card number, education, employment history, race, religion, gender, age, and disability status.</p>
          <p className="p-3 rounded-lg bg-secondary/30 border border-border text-sm">Some of the information described above may be considered <strong className="text-foreground">Sensitive Personal Information</strong> under applicable privacy laws, including government identifiers, financial account information, or information revealing racial or ethnic origin, religious beliefs, or union membership. GoldBuller LLC only collects and processes Sensitive Personal Information for the specific purposes disclosed at the time of collection or as otherwise permitted by law.</p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Information Collected Automatically</h3>
          <div className="space-y-3">
            {[
              { label: "Device and Browsing Information", text: "When you visit the Website, we may collect IP address, browser type, domain names, access times, date/time stamps, operating system, language, device type, unique ID, Internet service provider, referring and exiting URLs, clickstream data, and similar information." },
              { label: "Activities and Usage", text: "We collect activity information related to your use of the Website, such as information about the links clicked, searches, features used, items viewed, time spent within the Website, your interactions with us within the Website, and other activity and usage information." },
              { label: "Location Information", text: "We may collect or derive location information about you, such as through your IP address. If you choose to enable location-based sharing through your device settings, we may collect precise location information to provide more relevant content. You may turn off location data sharing through your device settings." },
            ].map(({ label, text }) => (
              <div key={label} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p><span className="font-medium text-foreground">{label}. </span>{text}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Information from Third Parties</h3>
          <p>In addition, we may collect and receive personal information from third parties, such as business partners, data analytics providers, Internet service providers, operating systems and platforms, public databases, and service providers. We may combine this information with personal information we collect directly from you.</p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Use of Personal Information</h2>
          <p className="mb-4">GoldBuller LLC uses your personal information for the following purposes:</p>
          <div className="space-y-3">
            {[
              { label: "Providing Information, Products, or Services", text: "To fulfill your requests for information, products, or services, such as processing orders and providing customer support." },
              { label: "Transaction Management", text: "To manage transactions, including processing payments, shipping products, and managing returns." },
              { label: "Website and Support", text: "To allow you to maintain your account with us, provide and operate the Website, communicate with you about your use of the Website, respond to your inquiries, and to otherwise run our day-to-day operations." },
              { label: "Analytics and Improvement", text: "To better understand how users access and use the Website, and for other research and analytical purposes, to develop the Website and its features, and for internal quality control and training purposes." },
              { label: "Communications", text: "To respond to your inquiries, send you requested materials and newsletters, as well as information and materials regarding the Website and offerings, and to communicate with you through text regarding your shipment." },
              { label: "Marketing and Promotions", text: "To send you information about the Website, such as newsletters and other marketing content that you sign up to receive." },
              { label: "Research, Development, and Surveys", text: "To administer surveys and questionnaires, such as for market research or user satisfaction purposes, and to develop new products and services." },
              { label: "Security and Protection of Rights", text: "To protect the Website and GoldBuller LLC's business operations; to prevent and detect fraud, unauthorized activities and access, and other misuse; where we believe necessary to investigate, prevent, or act regarding illegal activities or suspected fraud." },
              { label: "Compliance and Legal Process", text: "To comply with applicable legal or regulatory obligations, including as part of a judicial proceeding; to respond to a subpoena, warrant, court order, or other legal process; or as part of an investigation or request from law enforcement or a governmental authority." },
              { label: "Auditing and Reporting", text: "To conduct financial, tax, and accounting audits; audits and assessments of our operations, privacy, security and financial controls, risk, and compliance with legal obligations; and our general business, accounting, record keeping and legal functions." },
              { label: "General Business and Operational Support", text: "To assess and implement mergers, acquisitions, reorganizations, and other business transactions, and to administer our business, accounting, auditing, compliance, recordkeeping, and legal functions." },
            ].map(({ label, text }) => (
              <div key={label} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p><span className="font-medium text-foreground">{label}. </span>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Use of Cookies and Other Technologies</h2>
          <p className="mb-4">GoldBuller LLC and our third-party service providers use cookies, web beacons, pixel tags, and other tracking technologies to collect information about your browsing activities on the Website. These technologies help us:</p>
          <div className="space-y-2">
            {[
              "Remember your preferences and account settings",
              "Understand how visitors use our Website",
              "Improve Website performance and user experience",
              "Deliver targeted advertising and marketing campaigns",
              "Measure the effectiveness of our communications",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">You may control cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of the Website.</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Sharing of Personal Information</h2>
          <p className="mb-4">GoldBuller LLC does not sell your personal information. We may share your information with:</p>
          <div className="space-y-3">
            {[
              { label: "Service Providers", text: "Third-party vendors and service providers that perform services on our behalf, such as payment processing, shipping, data analytics, email delivery, and customer support." },
              { label: "Business Partners", text: "Trusted business partners with whom we collaborate to offer co-branded services or products." },
              { label: "Legal and Regulatory Authorities", text: "When required by law, regulation, or legal process, or when we believe disclosure is necessary to protect the rights and safety of GoldBuller LLC, our customers, or others." },
              { label: "Business Transfers", text: "In connection with a merger, acquisition, reorganization, sale of assets, or similar business transaction, your information may be transferred to the relevant acquiring entity." },
            ].map(({ label, text }) => (
              <div key={label} className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <p><span className="font-medium text-foreground">{label}. </span>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Your Rights and Choices</h2>
          <p className="mb-4">Depending on your jurisdiction, you may have the following rights with respect to your personal information:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Right to access your personal information",
              "Right to correct inaccurate information",
              "Right to delete your personal information",
              "Right to opt out of the sale or sharing of personal information",
              "Right to limit use of Sensitive Personal Information",
              "Right to data portability",
              "Right to opt out of targeted advertising",
              "Right to non-discrimination for exercising your rights",
            ].map((right) => (
              <div key={right} className="flex gap-2 p-3 rounded-lg bg-secondary/20 border border-border/50">
                <span className="text-primary shrink-0">✓</span>
                <p className="text-sm">{right}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">To exercise any of these rights, please contact us at <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a> or by calling <strong className="text-foreground">1-800-GOLD-NOW</strong>.</p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Data Security and Retention</h2>
          <p className="mb-4">GoldBuller LLC implements commercially reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These include SSL/TLS encryption, access controls, and secure data storage practices.</p>
          <p>We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, comply with our legal obligations, resolve disputes, and enforce our agreements. When your personal information is no longer needed, we will securely delete or anonymize it.</p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Children's Privacy</h2>
          <p>The Website is not intended for children under the age of 18. GoldBuller LLC does not knowingly collect personal information from children. If you believe we have collected personal information from a child under 18, please contact us immediately at <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a>.</p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 pb-2 border-b border-border">Changes to This Policy</h2>
          <p>GoldBuller LLC reserves the right to update this Privacy Policy at any time. We will notify you of material changes by posting the updated policy on our Website with a new effective date. Your continued use of the Website following such changes constitutes your acceptance of the revised policy.</p>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-2xl border border-border bg-secondary/10">
          <h2 className="text-xl font-serif font-bold text-foreground mb-3">Contact GoldBuller LLC</h2>
          <p className="mb-3">If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-foreground font-medium">GoldBuller LLC</span></p>
            <p>3200 Commerce St, Suite 400, Dallas, TX 75226</p>
            <p>Email: <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a></p>
            <p>Phone: <strong className="text-foreground">1-800-GOLD-NOW</strong></p>
          </div>
        </section>

      </div>
    </div>
  );
}
