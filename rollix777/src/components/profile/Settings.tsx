import React, { useState } from 'react';
import { ArrowLeft, Bell, Lock, Moon, Globe, Shield, X, EyeOff, Eye, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updatePassword } from "../../lib/services/securityService.js";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    promotions: false,
    security: true
  });

  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [PasswordPopup, setPasswordPopup] = useState(false);
  const [TwoFactorPopup, setTwoFactorPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await updatePassword(userId, { currentPassword, newPassword });
      console.log("Password updated successfully:", response);
      setSuccess('Password updated successfully!');

      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        setPasswordPopup(false);
        setSuccess('');
      }, 1500);
    } catch (error: any) {
      console.error("Error updating password:", error);
      setError(error.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen  bg-[#1A1A2E]">
      {/* Header Section */}
      <div className="bg-[#252547] mt-16  border-b border-purple-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/account"
                className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
              >
                <ArrowLeft size={22} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-gray-400 text-sm mt-0.5">Manage your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Notifications Card */}
          <div className="bg-[#1f1f3a] rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-purple-500/10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Notifications</h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Control your notification preferences</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:gap-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#252547] rounded-lg sm:rounded-xl hover:bg-[#2a2a5a] transition-all"
                  >
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-medium capitalize">{key.replace('_', ' ')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Receive {key.replace('_', ' ')} notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 sm:w-14 h-6 sm:h-7 bg-[#1A1A2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Appearance Card */}
            <div className="bg-[#1f1f3a] rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-purple-500/10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl">
                    <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Appearance</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Customize your interface</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="p-3 sm:p-4 bg-[#252547] rounded-lg sm:rounded-xl hover:bg-[#2a2a5a] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-medium">Dark Mode</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Toggle dark mode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 sm:w-14 h-6 sm:h-7 bg-[#1A1A2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Card */}
            <div className="bg-[#1f1f3a] rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-purple-500/10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Language</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Select your language</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="p-3 sm:p-4 bg-[#252547] rounded-lg sm:rounded-xl hover:bg-[#2a2a5a] transition-all">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base appearance-none cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-[#1f1f3a] rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-purple-500/10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Security</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage security</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => setPasswordPopup(true)}
                    className="w-full p-3 sm:p-4 bg-[#252547] rounded-lg sm:rounded-xl hover:bg-[#2a2a5a] transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl group-hover:bg-purple-500/20 transition-colors">
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm sm:text-base font-medium">Password</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Change password</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTwoFactorPopup(true)}
                    className="w-full p-3 sm:p-4 bg-[#252547] rounded-lg sm:rounded-xl hover:bg-[#2a2a5a] transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl group-hover:bg-purple-500/20 transition-colors">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm sm:text-base font-medium">Two-Factor</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Enable 2FA</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center">
            <span className="text-gray-500 text-xs sm:text-sm bg-[#252547] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">Version 1.0.0</span>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {PasswordPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f3a] rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-purple-500/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-400" />
                Change Password
              </h2>
              <button
                onClick={() => {
                  setPasswordPopup(false);
                  setError('');
                  setSuccess('');
                }}
                className="p-2 rounded-xl hover:bg-[#252547] text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                  {success}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-gray-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full py-3 px-4 bg-[#252547] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-300">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-3 px-4 bg-[#252547] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Two Factor Authentication Modal */}
      {TwoFactorPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f3a] rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-purple-500/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                Two-Factor Authentication
              </h2>
              <button
                onClick={() => {
                  setTwoFactorPopup(false);
                  setError('');
                  setSuccess('');
                }}
                className="p-2 rounded-xl hover:bg-[#252547] text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                  {success}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 bg-[#252547] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 bg-[#252547] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
              >
                Enable 2FA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;