import React, { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../lib/config/server';
import axios from 'axios';
import toast from 'react-hot-toast';

const KYCVerification: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState({
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    panCard: null as File | null
  });
  const [previews, setPreviews] = useState({
    aadharFront: '',
    aadharBack: '',
    panCard: ''
  });

  const handleFileUpload = (type: keyof typeof documents) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [type]: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          [type]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        navigate('/login');
        return;
      }

      // Create FormData
      const formData = new FormData();
      
      // Append files
      if (documents.aadharFront) {
        formData.append('aadharFront', documents.aadharFront);
      }
      if (documents.aadharBack) {
        formData.append('aadharBack', documents.aadharBack);
      }
      if (documents.panCard) {
        formData.append('panImage', documents.panCard);
      }
      
      // Append KYC status
      formData.append('kycstatus', '0');

      const response = await axios.put(
        `${baseUrl}/api/user/${userId}/kyc`,
        formData,
      
      );

      if (response.data) {
        toast.success('KYC documents submitted successfully!');
        navigate('/account');
      }
    } catch (error: any) {
      console.error('KYC submission error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit KYC documents. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setDocuments({
      aadharFront: null,
      aadharBack: null,
      panCard: null
    });
    setPreviews({
      aadharFront: '',
      aadharBack: '',
      panCard: ''
    });
  };

  const hasAnyDocument = documents.aadharFront || documents.aadharBack || documents.panCard;

  return (
    <div className="bg-[#0F0F19] min-h-screen w-full px-4 lg:mt-24 my-24">
      <div className="max-w-7xl mx-auto pt-16">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/account" 
            className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 transform"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
            <p className="text-sm text-purple-300/60 mt-1">Complete your identity verification</p>
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Aadhar Front */}
            <div className="bg-[#1A1A2E] rounded-xl p-3">
              <h3 className="text-base font-semibold text-white mb-2">Aadhar Front</h3>
              <div className={`border-2 border-dashed border-purple-500/30 rounded-lg p-2 text-center ${previews.aadharFront ? 'h-[120px]' : 'h-[90px]'} flex items-center justify-center`}>
                <input
                  type="file"
                  id="aadharFront"
                  accept="image/*"
                  onChange={handleFileUpload('aadharFront')}
                  className="hidden"
                />
                <label
                  htmlFor="aadharFront"
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                >
                  {previews.aadharFront ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previews.aadharFront} 
                        alt="Aadhar Front Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white bg-purple-500/80 px-3 py-1.5 rounded-lg text-sm">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-gray-400 text-sm">Upload front side</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Aadhar Back */}
            <div className="bg-[#1A1A2E] rounded-xl p-3">
              <h3 className="text-base font-semibold text-white mb-2">Aadhar Back</h3>
              <div className={`border-2 border-dashed border-purple-500/30 rounded-lg p-2 text-center ${previews.aadharBack ? 'h-[120px]' : 'h-[90px]'} flex items-center justify-center`}>
                <input
                  type="file"
                  id="aadharBack"
                  accept="image/*"
                  onChange={handleFileUpload('aadharBack')}
                  className="hidden"
                />
                <label
                  htmlFor="aadharBack"
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                >
                  {previews.aadharBack ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previews.aadharBack} 
                        alt="Aadhar Back Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white bg-purple-500/80 px-3 py-1.5 rounded-lg text-sm">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-gray-400 text-sm">Upload back side</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* PAN Card */}
            <div className="bg-[#1A1A2E] rounded-xl p-3">
              <h3 className="text-base font-semibold text-white mb-2">PAN Card</h3>
              <div className={`border-2 border-dashed border-purple-500/30 rounded-lg p-2 text-center ${previews.panCard ? 'h-[120px]' : 'h-[90px]'} flex items-center justify-center`}>
                <input
                  type="file"
                  id="panCard"
                  accept="image/*"
                  onChange={handleFileUpload('panCard')}
                  className="hidden"
                />
                <label
                  htmlFor="panCard"
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                >
                  {previews.panCard ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previews.panCard} 
                        alt="PAN Card Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white bg-purple-500/80 px-3 py-1.5 rounded-lg text-sm">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-gray-400 text-sm">Upload PAN card</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-3 mt-4 lg:mt-10">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={!hasAnyDocument || isLoading}
              className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-semibold hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-2 md:order-1"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={!documents.aadharFront || !documents.aadharBack || !documents.panCard || isLoading}
              className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors order-1 md:order-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Documents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification; 