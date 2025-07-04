import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import BankAccounts from "./pages/BankAccounts";
import Withdrawals from "./pages/Withdrawals";
import Reports from "./pages/Reports";
import Sliders from "./pages/Sliders";
import Games from "./pages/Games";
import KYCRequest from "./pages/KYCRequest";
import Userdetail from "./pages/Userdetail";
import Rates from "./pages/rate";
import QueryManagement from "./pages/QueryManagement";
import Coupon from "./pages/Coupon";
import Recharge from "./pages/Recharge";
import UserActivity from "./components/UserActivity";

// import Settings from './pages/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="bank-accounts" element={<BankAccounts />} />
        <Route path="rate" element={<Rates />} />
        <Route path="user-detail/:userId" element={<Userdetail />} />

        <Route path="coupon" element={<Coupon />} />
        <Route path="recharge" element={<Recharge />} />
        <Route path="query" element={<QueryManagement />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="sliders" element={<Sliders />} />
        <Route path="games" element={<Games />} />
        <Route path="kyc-requests" element={<KYCRequest />} />
        <Route path="user-activity" element={<UserActivity />} />
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
