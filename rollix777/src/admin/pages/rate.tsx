import React, { useState, useEffect } from 'react';
import { DollarSign, IndianRupeeIcon, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface RateData {
  rate: number;
  last_updated: string;
}

function Rate() {
  const [rate, setRate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentRate, setCurrentRate] = useState<RateData | null>(null);

  useEffect(() => {
    fetchCurrentRate();
  }, []);

  const fetchCurrentRate = async () => {
    try {
      const response = await axios.get('https://api.rollix777.com/api/rates/conversion-rate/INR_USDT');
      const rateNumber = parseFloat(response.data.rate);
      setCurrentRate({
        rate: rateNumber,
        last_updated: new Date().toISOString()
      });
    } catch (error) {
      toast.error('Failed to fetch current rate');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rateNumber = parseFloat(rate);
    if (!rate || isNaN(rateNumber) || rateNumber <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }

    setLoading(true);
    try {
      await axios.put('https://api.rollix777.com/api/rates/conversion-rate/INR_USDT', {
        rate: rateNumber
      });
      toast.success('Rate updated successfully');
      fetchCurrentRate();
      setRate(''); // Clear the input after successful update
    } catch (error) {
      toast.error('Failed to update rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">INR to USDT Conversion Rate</h1>
        <p className="text-gray-400 mt-1">Set the conversion rate for INR to USDT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Rate Card */}
        <div className="bg-[#1A1A2E] rounded-lg border border-purple-500/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Current Rate</h2>
            <div className="flex items-center gap-2">
              <IndianRupeeIcon className="text-purple-400" size={20} />
              <DollarSign className="text-green-400" size={20} />
            </div>
          </div>
          
          {currentRate ? (
            <>
              <div className="text-3xl font-bold text-white mb-2">
                1 USDT = ₹{Number(currentRate.rate).toFixed(2)}
              </div>
              <p className="text-sm text-gray-400">
                Last updated: {new Date(currentRate.last_updated).toLocaleString()}
              </p>
            </>
          ) : (
            <div className="text-gray-400">Loading current rate...</div>
          )}
        </div>

        {/* Update Rate Form */}
        <div className="bg-[#1A1A2E] rounded-lg border border-purple-500/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Update Rate</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rate" className="block text-sm font-medium text-gray-400 mb-2">
                New Rate (INR per USDT)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupeeIcon className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2A2A3C] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter new rate"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Rate
                </>
              )}
            </button>
          </form>

          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-yellow-400 mt-0.5" size={20} />
              <p className="text-sm text-yellow-400">
                Please ensure the rate is accurate as it will affect all future transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rate;