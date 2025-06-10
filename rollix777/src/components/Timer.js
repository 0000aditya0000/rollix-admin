


import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [timers, setTimers] = useState({
    '1min': 0,
    '3min': 0,
    '5min': 0,
    '10min': 0
  });

  const [activeTab, setActiveTab] = useState('1min');
  const intervalRefs = useRef({});
  const isFetchingRef = useRef({}); // Track if API call is in progress

  // Function to fetch timer data for a specific duration
  const fetchTimerData = async (duration) => {
    // Prevent multiple API calls for the same duration
    if (isFetchingRef.current[duration]) {
      return;
    }

    try {
      isFetchingRef.current[duration] = true;
      const response = await axios.post('http://localhost:5000/api/color/timer', { duration });
      const data = response.data;
      
      // Handle different response formats
      let remainingSeconds;
      if (duration === '1min') {
        remainingSeconds = data.remainingTimeSeconds;
      } else {
        // For 3min, 5min, and 10min timers
        remainingSeconds = (data.remainingTimeMinutes * 60) + data.remainingTimeSeconds;
      }

      if (typeof remainingSeconds === 'number' && !isNaN(remainingSeconds)) {
        startLocalCountdown(duration, remainingSeconds);
      } else {
        console.error(`Invalid timer data received for ${duration}:`, data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${duration} timer:`, err);
    } finally {
      isFetchingRef.current[duration] = false;
    }
  };

  useEffect(() => {
    // Initial fetch for all timers
    ['1min', '3min', '5min', '10min'].forEach(duration => {
      fetchTimerData(duration);
    });

    return () => {
      // Cleanup intervals
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  const startLocalCountdown = (duration, initialTime) => {
    // Validate initialTime
    if (typeof initialTime !== 'number' || isNaN(initialTime)) {
      console.error(`Invalid initial time for ${duration}:`, initialTime);
      return;
    }

    // Clear existing interval for this duration
    if (intervalRefs.current[duration]) {
      clearInterval(intervalRefs.current[duration]);
    }

    // Set initial time
    setTimers(prev => ({
      ...prev,
      [duration]: Math.floor(initialTime)
    }));

    let hasShownAlert = false; // Track if alert has been shown for this countdown

    // Start local countdown
    intervalRefs.current[duration] = setInterval(() => {
      setTimers(current => {
        const currentTime = current[duration];
        if (currentTime <= 1) {
          // Only show alert and fetch new data if we haven't shown it yet for this countdown
          if (!hasShownAlert) {
            hasShownAlert = true;
            alert(`${duration} timer has ended!`);
            fetchTimerData(duration);
          }
          return { ...current, [duration]: 0 };
        }
        return { ...current, [duration]: currentTime - 1 };
      });
    }, 1000);
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '00:00';
    }
    
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Color Prediction Timers</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['1min', '3min', '5min', '10min'].map((duration) => (
          <button
            key={duration}
            onClick={() => setActiveTab(duration)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === duration
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {duration}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <div className="text-6xl font-bold text-gray-800 mb-2">
          {formatTime(timers[activeTab])}
        </div>
        <div className="text-gray-600">
          {activeTab} Timer
        </div>
      </div>

      {/* All Timers Status */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(timers).map(([duration, time]) => (
          <div 
            key={duration}
            className={`p-4 rounded-lg ${
              activeTab === duration 
                ? 'bg-purple-100 border-2 border-purple-600' 
                : 'bg-gray-100'
            }`}
          >
            <div className="text-sm text-gray-600">{duration}</div>
            <div className="text-lg font-semibold">{formatTime(time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
