import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./components/Home";
import BigSmall from "./components/BigSmall";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GameCarousel from "./components/GameCarousel";
import Features from "./components/Features";
import TrendingGames from "./components/TrendingGames";
import HotGames from "./components/HotGames";
import ColorGame from "./components/ColorGame";
import Promotions from "./components/Promotions";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import AdminRoutes from "./admin";
import BetHistory from "./components/BetHistory";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Profile from "./components/profile/Profile";
import PaymentMethods from "./components/profile/PaymentMethods";
import Referrals from "./components/profile/Referrals";
import Settings from "./components/profile/Settings";
import Security from "./components/profile/Security";
import AllGames from './components/games/AllGames';
import MyAccount from './components/account/MyAccount';
import Wallet from './components/wallet/Wallet';
import AgentProgram from './components/promotions/AgentProgram';
import TeamReport from './components/promotions/TeamReport';
import { HelpCenter } from "./components/HelpCenter";
import CommissionDetails from "./components/promotions/CommissionDetails";
import LatestGames from "./components/LatestGames";
import Coupon from "./components/coupon/Coupon";
import KYCVerification from "./pages/KYCVerification";
import ErrorPage from "./components/ErrorPage";
// Add new ReferralRedirect component
const ReferralRedirect: React.FC = () => {
  const location = useLocation();
  const referralCode = location.pathname.split('/refer/')[1];
  
  if (referralCode) {
    localStorage.setItem('pendingReferralCode', referralCode);
  }
  
  return <Navigate to="/" replace />;
};

// Add this new component for conditional routing
const ConditionalHome: React.FC = () => {
  const userId = localStorage.getItem('userId');
  return userId ? <Dashboard /> : <Home />;
};

function App() {
  const authenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Add the referral route before other routes */}
        <Route path="/refer/:referralCode" element={<ReferralRedirect />} />

        {/* Admin Routes - Full width */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Main App Routes - Modified for responsive width */}
        <Route
          path="/*"
          element={
            <div className="fixed inset-0 bg-[#0F0F19] overflow-y-auto hide-scrollbar">
              {/* Container with responsive padding and width */}
              <div className="mx-auto w-full relative bg-gradient-to-b from-[#0F0F19] to-[#1A1A2E] min-h-screen">
                <div className="w-full md:px-6 lg:px-0 " >
                  <Header />
                  <main className="min-h-screen">
                    <Routes>
                      {/* Public Routes - Always accessible */}
                      <Route path="/" element={<ConditionalHome />} />
                      <Route path="/games" element={<AllGames />} />
                      {/* <Route path="/featured=games" element={< />} /> */}
                     

                      {/* Protected Routes - Only accessible when authenticated */}
                      {authenticated ? (
                        <> 
                         <Route path="/featured-games" element={<GameCarousel title="Featured Games" type="featured" />} />
                      <Route path="/trending-games" element={<TrendingGames title="Trending Games" type="trending" />} />
                      <Route path="/hot-games" element={<HotGames title="Hot Games" type="hot" />} />
                      <Route path="/color-game" element={<ColorGame />} />
                      <Route path="/bigsmall" element={<BigSmall />} />
                      <Route path="/support" element={<HelpCenter />} />
                      <Route path="/rewards" element={<Promotions />} />
                      <Route path="/coupon" element={<Coupon />} />
                      <Route path="/kyc-verification" element={<KYCVerification />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/account" element={<MyAccount />} />
                          <Route path="/wallet" element={<Wallet />} />
                          <Route path="/bet-history" element={<BetHistory />} />
                          
                          {/* Profile Related Routes */}
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/payment-methods" element={<PaymentMethods />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/security" element={<Security />} />
                          
                          
                          {/* Promotion & Referral Routes */}
                          <Route path="/referrals" element={<Referrals />} />
                          <Route path="/agent-program" element={<AgentProgram />} />
                          <Route path="/team-report" element={<TeamReport />} />
                          <Route path="/promotions" element={<AgentProgram />} />
                          <Route path="/promotions/team-report" element={<TeamReport />} />
                          <Route path="/promotions/commission-details" element={<CommissionDetails />} />
                        </>
                      ) : (
                        <>
                          {/* Landing Page Components - Only shown when not authenticated */}
                          <Route path="/hero" element={<Hero />} />
                          <Route path="/features" element={<Features />} />
                          {/* Show error page for protected routes when not authenticated */}
                          <Route path="/*" element={
                            <ErrorPage 
                              title="Authentication Required" 
                              message="Please login to access this page."
                              showLoginButton={true}
                            />
                          } />
                        </>
                      )}

                      {/* Catch all route for undefined routes */}
                      <Route path="*" element={
                        <ErrorPage 
                          title="Page Not Found" 
                          message="The page you're looking for doesn't exist."
                        />
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
