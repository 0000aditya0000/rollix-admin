import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  title = "Page Not Found", 
  message = "The page you're looking for doesn't exist or you don't have permission to access it.",
  showLoginButton = false 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-20"></div>
          <div className="relative bg-[#1A1A2E] p-6 rounded-full border border-orange-500/20">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#252547] text-white rounded-lg font-medium hover:bg-[#2d2d5a] transition-colors"
          >
            Go Back
          </button>
          {showLoginButton && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Login to Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 