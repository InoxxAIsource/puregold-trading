import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PriceProvider } from "@/contexts/PriceContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { KYCProvider } from "@/lib/kycContext";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Eagerly load the most-visited pages
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import GoldLandingPage from "@/pages/GoldLandingPage";
import SilverLandingPage from "@/pages/SilverLandingPage";

// Lazy-load everything else to reduce initial bundle size
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@/pages/OrderConfirmationPage"));
const OnSalePage = lazy(() => import("@/pages/OnSalePage"));
const NewArrivalsPage = lazy(() => import("@/pages/NewArrivalsPage"));
const BestSellersPage = lazy(() => import("@/pages/BestSellersPage"));
const FeaturedPage = lazy(() => import("@/pages/FeaturedPage"));
const ChartsPage = lazy(() => import("@/pages/ChartsPage"));
const MetalChartPage = lazy(() => import("@/pages/MetalChartPage"));
const GoldSilverRatioPage = lazy(() => import("@/pages/GoldSilverRatioPage"));
const FearGreedIndexPage = lazy(() => import("@/pages/FearGreedIndexPage"));
const JunkSilverPage = lazy(() => import("@/pages/JunkSilverPage"));
const AutoBuyPage = lazy(() => import("@/pages/AutoBuyPage"));
const SellToUsPage = lazy(() => import("@/pages/SellToUsPage"));
const IRAPage = lazy(() => import("@/pages/IRAPage"));
const TaxPage = lazy(() => import("@/pages/TaxPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const InvestingGuidePage = lazy(() => import("@/pages/InvestingGuidePage"));
const AccountLoginPage = lazy(() => import("@/pages/AccountLoginPage"));
const AccountRegisterPage = lazy(() => import("@/pages/AccountRegisterPage"));
const AccountDashboardPage = lazy(() => import("@/pages/AccountDashboardPage"));
const AccountOrdersPage = lazy(() => import("@/pages/AccountOrdersPage"));
const AccountWatchlistPage = lazy(() => import("@/pages/AccountWatchlistPage"));
const AccountPriceAlertsPage = lazy(() => import("@/pages/AccountPriceAlertsPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const ShippingPage = lazy(() => import("@/pages/ShippingPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const NotFound = lazy(() => import("@/pages/not-found"));

const BitcoinOTCPage = lazy(() => import("@/pages/BitcoinOTCPage"));
const BitcoinOTCApplyPage = lazy(() => import("@/pages/BitcoinOTCApplyPage"));
const BitcoinOTCHowItWorksPage = lazy(() => import("@/pages/BitcoinOTCHowItWorksPage"));
const BitcoinOTCVsExchangePage = lazy(() => import("@/pages/BitcoinOTCVsExchangePage"));
const BitcoinIRAPage = lazy(() => import("@/pages/BitcoinIRAPage"));
const BitcoinOTCFAQPage = lazy(() => import("@/pages/BitcoinOTCFAQPage"));
const KYCPage = lazy(() => import("@/pages/KYCPage"));
const KYCReviewPage = lazy(() => import("@/pages/KYCReviewPage"));
const OTCOrdersPage = lazy(() => import("@/pages/OTCOrdersPage"));
const BTCChartPage = lazy(() => import("@/pages/BTCChartPage"));
const GlossaryIndexPage = lazy(() => import("@/pages/GlossaryIndexPage"));
const GlossaryTermPage = lazy(() => import("@/pages/GlossaryTermPage"));
const GuidesIndexPage = lazy(() => import("@/pages/GuidesIndexPage"));
const GuideDetailPage = lazy(() => import("@/pages/GuideDetailPage"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={HomePage} />

        {/* Core flows */}
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/order-confirmation" component={OrderConfirmationPage} />

        {/* Products */}
        <Route path="/product/:slug" component={ProductDetailPage} />
        <Route path="/gold" component={GoldLandingPage} />
        <Route path="/silver" component={SilverLandingPage} />
        <Route path="/platinum" component={ProductListingPage} />
        <Route path="/palladium" component={ProductListingPage} />
        <Route path="/copper" component={ProductListingPage} />
        <Route path="/rare-coins" component={ProductListingPage} />
        <Route path="/silver/junk-silver" component={JunkSilverPage} />

        {/* Lists */}
        <Route path="/on-sale" component={OnSalePage} />
        <Route path="/new-arrivals" component={NewArrivalsPage} />
        <Route path="/best-sellers" component={BestSellersPage} />
        <Route path="/featured" component={FeaturedPage} />

        {/* Services/Info */}
        <Route path="/charts" component={ChartsPage} />
        <Route path="/charts/gold-silver-ratio" component={GoldSilverRatioPage} />
        <Route path="/charts/bitcoin-price" component={BTCChartPage} />
        <Route path="/charts/:metal" component={MetalChartPage} />
        <Route path="/fear-greed-index" component={FearGreedIndexPage} />
        <Route path="/autobuy" component={AutoBuyPage} />
        <Route path="/sell-to-us" component={SellToUsPage} />
        <Route path="/ira" component={IRAPage} />
        <Route path="/tax" component={TaxPage} />

        {/* Blog & Resources */}
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/investing-guide" component={InvestingGuidePage} />

        {/* SEO — Glossary & Guides */}
        <Route path="/learn" component={GlossaryIndexPage} />
        <Route path="/learn/:slug" component={GlossaryTermPage} />
        <Route path="/guides" component={GuidesIndexPage} />
        <Route path="/guides/:slug" component={GuideDetailPage} />

        {/* Bitcoin OTC */}
        <Route path="/bitcoin-otc" component={BitcoinOTCPage} />
        <Route path="/bitcoin-otc/apply" component={BitcoinOTCApplyPage} />
        <Route path="/bitcoin-otc/how-it-works" component={BitcoinOTCHowItWorksPage} />
        <Route path="/bitcoin-otc/otc-vs-exchange" component={BitcoinOTCVsExchangePage} />
        <Route path="/bitcoin-otc/bitcoin-ira" component={BitcoinIRAPage} />
        <Route path="/bitcoin-otc/faq" component={BitcoinOTCFAQPage} />

        {/* Account */}
        <Route path="/account/login" component={AccountLoginPage} />
        <Route path="/account/register" component={AccountRegisterPage} />
        <Route path="/account/dashboard" component={AccountDashboardPage} />
        <Route path="/account/orders" component={AccountOrdersPage} />
        <Route path="/account/watchlist" component={AccountWatchlistPage} />
        <Route path="/account/price-alerts" component={AccountPriceAlertsPage} />
        <Route path="/account/kyc" component={KYCPage} />
        <Route path="/kyc/review" component={KYCReviewPage} />
        <Route path="/account/otc-orders/:id" component={OTCOrdersPage} />
        <Route path="/account/otc-orders" component={OTCOrdersPage} />

        {/* About & Policies */}
        <Route path="/about" component={AboutPage} />
        <Route path="/about/shipping" component={ShippingPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms-of-service" component={TermsOfServicePage} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <KYCProvider>
          <PriceProvider>
            <CartProvider>
              <WatchlistProvider>
                <TooltipProvider>
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <div className="flex flex-col min-h-[100dvh]">
                      <Navbar />
                      <main className="flex-1">
                        <Router />
                      </main>
                      <Footer />
                    </div>
                    <Toaster />
                  </WouterRouter>
                </TooltipProvider>
              </WatchlistProvider>
            </CartProvider>
          </PriceProvider>
        </KYCProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
