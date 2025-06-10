import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import BankAccounts from './pages/BankAccounts';
import Withdrawals from './pages/Withdrawals';
import Reports from './pages/Reports';
import Sliders from './pages/Sliders';
import Games from './pages/Games';
import KYCRequest from './pages/KYCRequest';
import Userdetail from './pages/Userdetail';


import Coupon from './pages/Coupon';
import Recharge from './pages/Recharge';

// import Settings from './pages/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="bank-accounts" element={<BankAccounts />} />

        <Route path="user-detail/:userId" element={<Userdetail />} />

        <Route path="coupon" element={<Coupon/>} />
        <Route path="recharge" element={<Recharge/>} />

        <Route path="withdrawals" element={<Withdrawals/>} />
        <Route path="reports" element={<Reports />} />
        <Route path="sliders" element={<Sliders />} />
        <Route path="games" element={<Games />} />
        <Route path="kyc-requests" element={<KYCRequest />} />
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;