import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PriceProvider } from "@/contexts/PriceContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Pages
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import GoldLandingPage from "@/pages/GoldLandingPage";
import SilverLandingPage from "@/pages/SilverLandingPage";
import OnSalePage from "@/pages/OnSalePage";
import NewArrivalsPage from "@/pages/NewArrivalsPage";
import BestSellersPage from "@/pages/BestSellersPage";
import FeaturedPage from "@/pages/FeaturedPage";
import ChartsPage from "@/pages/ChartsPage";
import MetalChartPage from "@/pages/MetalChartPage";
import GoldSilverRatioPage from "@/pages/GoldSilverRatioPage";
import FearGreedIndexPage from "@/pages/FearGreedIndexPage";
import JunkSilverPage from "@/pages/JunkSilverPage";
import AutoBuyPage from "@/pages/AutoBuyPage";
import SellToUsPage from "@/pages/SellToUsPage";
import IRAPage from "@/pages/IRAPage";
import TaxPage from "@/pages/TaxPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import InvestingGuidePage from "@/pages/InvestingGuidePage";
import AccountLoginPage from "@/pages/AccountLoginPage";
import AccountRegisterPage from "@/pages/AccountRegisterPage";
import AccountDashboardPage from "@/pages/AccountDashboardPage";
import AccountOrdersPage from "@/pages/AccountOrdersPage";
import AccountWatchlistPage from "@/pages/AccountWatchlistPage";
import AccountPriceAlertsPage from "@/pages/AccountPriceAlertsPage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import ShippingPage from "@/pages/ShippingPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
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
      
      {/* Account */}
      <Route path="/account/login" component={AccountLoginPage} />
      <Route path="/account/register" component={AccountRegisterPage} />
      <Route path="/account/dashboard" component={AccountDashboardPage} />
      <Route path="/account/orders" component={AccountOrdersPage} />
      <Route path="/account/watchlist" component={AccountWatchlistPage} />
      <Route path="/account/price-alerts" component={AccountPriceAlertsPage} />
      
      {/* About & Policies */}
      <Route path="/about" component={AboutPage} />
      <Route path="/about/shipping" component={ShippingPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
