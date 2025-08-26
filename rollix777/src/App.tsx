import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AdminRoutes from "./admin";
import { useSelector } from "react-redux";
import { RootState } from "./store";
// Add new ReferralRedirect component
const ReferralRedirect: React.FC = () => {
  const location = useLocation();
  const referralCode = location.pathname.split('/refer/')[1];
  
  if (referralCode) {
    localStorage.setItem('pendingReferralCode', referralCode);
  }
  
  return <Navigate to="/" replace />;
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
        <Route path="/*" element={<AdminRoutes />} />

        {/* Main App Routes - Modified for responsive width */}
        <Route
          path="/*"
          element={
           <div>
            <h1>Welcome To Rollix Admin</h1>
           </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
