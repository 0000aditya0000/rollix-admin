import React, { useEffect, useState,useRef } from "react";
import { X, ArrowLeft, Clock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { deposit, withdraw } from "../slices/walletSlice";
import { fetchResults, generateResult, getBetHistory, checkValidBet, placeBet } from "../lib/services/BigSmallServices";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

type Record = {
  id: number;
  period_number: number;
  result_number: string;
  result_color: string;
  result_size: string;
};

type Bet = {
  period: number;
  number?: number | null;
  color?: string;
  big_small?: string;
  amount: number;
};

type BetHistory = {
  periodNumber: number;
  status: string;
  amount: number;
  amountReceived: number;
};





const BigSmall = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<"big" | "small" | "">("");
  const [contractMoney, setContractMoney] = useState<number>(0);
  const [agreed, setAgreed] = useState(false);
  const [selected, setSelected] = useState(1);
  const [records, setRecords] = useState<Record[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<number>();
  const [bets, setBets] = useState<Bet[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [winner, setWinner] = useState(false);
  const [popup, setpopup] = useState('');
  const [result, setResult] = useState<Record | null>(null);
  const [betHistory, setbetHistory] = useState<BetHistory | null>(null);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('1min');
  const intervalRefs = useRef({});
  const isFetchingRef = useRef({});
  const [error, setError] = useState<string | null>(null);
  const [timers, setTimers] = useState({
    '1min': 0,
    '3min': 0,
    '5min': 0,
    '10min': 0
  });

  // Add a state to track periods for different timers
  const [periods, setPeriods] = useState({
    '1min': 0,
    '3min': 0,
    '5min': 0,
    '10min': 0
  });

  // Add a new state to track which timers have already triggered their API calls
  const [triggeredTimers, setTriggeredTimers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initial fetch for all timers
    ['1min', '3min', '5min', '10min'].forEach(duration => {
      fetchTimerData(duration);
    });

    // Cleanup intervals when component unmounts
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []); // Empty dependency array means this runs once on mount

  const fetchTimerData = async (duration) => {
    if (isFetchingRef.current[duration]) {
      return;
    }

    try {
      isFetchingRef.current[duration] = true;
      const response = await axios.post('https://api.rollix777.com/api/color/timer', { duration });
      const data = response.data;
      
      let remainingSeconds;
      if (duration === '1min') {
        remainingSeconds = data.remainingTimeSeconds;
      } else {
        remainingSeconds = (data.remainingTimeMinutes * 60) + data.remainingTimeSeconds;
      }

      if (typeof remainingSeconds === 'number' && !isNaN(remainingSeconds)) {
        startLocalCountdown(duration, remainingSeconds);
      } else {
        console.error(`Invalid timer data received for ${duration}:`, data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${duration} timer:`, err);
      // Set a default value if the API call fails
      startLocalCountdown(duration, duration === '1min' ? 60 : 
        duration === '3min' ? 180 : 
        duration === '5min' ? 300 : 600);
    } finally {
      isFetchingRef.current[duration] = false;
    }
  };

  const startLocalCountdown = (duration, initialTime) => {
    if (typeof initialTime !== 'number' || isNaN(initialTime)) {
      console.error(`Invalid initial time for ${duration}:`, initialTime);
      return;
    }

    // Clear existing interval for this duration
    if (intervalRefs.current[duration]) {
      clearInterval(intervalRefs.current[duration]);
    }

    // Reset the triggered state for this timer when starting a new countdown
    setTriggeredTimers(prev => {
      const newSet = new Set(prev);
      newSet.delete(duration);
      return newSet;
    });

    // Set initial time
    setTimers(prev => ({
      ...prev,
      [duration]: Math.floor(initialTime)
    }));

    // Start local countdown
    intervalRefs.current[duration] = setInterval(() => {
      setTimers(current => {
        const currentTime = current[duration];
        if (currentTime <= 1) {
          // Check if this timer has already triggered its API calls
          if (!triggeredTimers.has(duration)) {
            console.log(`Timer ended for ${duration}, making API calls`); // Debug log
            
            // Mark this timer as triggered immediately to prevent duplicate calls
            setTriggeredTimers(prev => new Set(prev).add(duration));
            
            // Get the current period for this duration
            const currentPeriodForTimer = periods[duration];
            console.log(`Current period for ${duration}:`, currentPeriodForTimer); // Debug log

            if (!currentPeriodForTimer || isNaN(currentPeriodForTimer)) {
              console.error(`Invalid period number for ${duration}:`, currentPeriodForTimer);
              setError(`Invalid period number for ${duration}`);
              return { ...current, [duration]: 0 };
            }

            // Call getResult with the current period and duration
            getResult(duration, currentPeriodForTimer).then(() => {
              console.log(`API calls completed for ${duration}, fetching new timer data`); // Debug log
              // After getResult completes, fetch new timer data
              fetchTimerData(duration);
            }).catch(error => {
              console.error(`Error in getResult for ${duration}:`, error);
              // Remove from triggered timers if there was an error
              setTriggeredTimers(prev => {
                const newSet = new Set(prev);
                newSet.delete(duration);
                return newSet;
              });
            });
          }
          return { ...current, [duration]: 0 };
        }
        return { ...current, [duration]: currentTime - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '00:00';
    }
    
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (activeTab) {
      fetchTableData();
    }
  }, [activeTab]);

  const fetchTableData = async () => {
    try {
      console.log('Fetching results for duration:', activeTab); // Debug log
      const response = await fetchResults(activeTab);
      
      // Update the period for the current active timer
      const newPeriod = response.results[0].period_number + 1;
      setPeriods(prev => ({
        ...prev,
        [activeTab]: newPeriod
      }));
      
      // Set the current period based on active timer
      setCurrentPeriod(newPeriod);
      setRecords(response.results);
      setError(null);
    } catch (error) {
      setError("Failed to fetch results. Please try again later.");
      console.error("Error fetching results:", error);
    }
  };

  const getResult = async (duration: string, periodNumber: number) => {
    try {
      console.log('getResult called with duration:', duration, 'period:', periodNumber); // Debug log
      
      if (!periodNumber || isNaN(periodNumber)) {
        console.error('Invalid period number:', periodNumber);
        setError("Invalid period number");
        return;
      }

      console.log('Generating result for period:', periodNumber, 'and duration:', duration); // Debug log
      const data = await generateResult(periodNumber, duration);
      
      if (!data) {
        console.error('No data received from generateResult');
        setError("Failed to generate result. Please try again.");
        return;
      }

      console.log('Result generated:', data); // Debug log
      setResult(data);
      setRecords((prev) => [data, ...prev]);
      
      // Get the new period number from the API response
      const newPeriodNumber = data.period_number + 1;
      
      // Update the period for this timer
      setPeriods(prev => ({
        ...prev,
        [duration]: newPeriodNumber
      }));
      
      // If this is the active timer, update currentPeriod
      if (duration === activeTab) {
        setCurrentPeriod(newPeriodNumber);
      }
      
      // Only fetch table data if this is the active tab
      if (duration === activeTab) {
        await fetchTableData();
      }
      
      await checkWinLose(data);
      setBets([]);
      setError(null);
    } catch (error) {
      console.error('Error in getResult:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate result. Please try again later.";
      setError(errorMessage);
      throw error; // Re-throw the error to be caught by the caller
    }
  };

  const checkWinLose = async (result: any) => {
    try {
      const response = await getBetHistory(userId);
      const latestBetHistory = response.betHistory[0] as BetHistory;
      setbetHistory(latestBetHistory);

      const periodForTimer = periods[activeTab];
      if (latestBetHistory.periodNumber === periodForTimer) {
        if (latestBetHistory.status === "won") {
          dispatch(
            deposit({
              cryptoname: "INR",
              amount: latestBetHistory.amountReceived,
            })
          );
          setWinner(true);
          setpopup("won");
        } else {
          setWinner(true);
          setpopup("lost");
        }
      }
      setError(null);
    } catch (error) {
      setError("Failed to check bet results. Please try again later.");
      console.error("Error checking win/lose:", error);
    }
  };

  const handleBet = async () => {
    try {
      const checkResponse = await checkValidBet(userId, activeTab);

      if (checkResponse.pendingBets > 0) {
        toast.error("You have already placed a bet", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: 'red',
            color: 'white',
          },
        });
        return;
      }

      let betType: string;
      let betValue: string | number;

      if (selectedNumber !== null) {
        betType = "number";
        betValue = selectedNumber;
      } else if (selectedColor) {
        betType = "color";
        betValue = selectedColor;
      } else if (selectedSize) {
        betType = "size";
        betValue = selectedSize;
      } else {
        setError("Please select a valid bet type.");
        return;
      }

      const periodForTimer = periods[activeTab];
      const payload = {
        userId,
        betType,
        betValue,
        amount: contractMoney,
        periodNumber: periodForTimer,
        duration: activeTab
      };

      console.log('Placing bet with payload:', payload); // Debug log

      const response = await placeBet(payload);
      console.log('Bet placement response:', response); // Debug log

      // Check if response exists and has success message
      if (response) {
        const bet: Bet = {
          period: periodForTimer,
          number: selectedNumber !== null ? selectedNumber : null,
          color: selectedColor || undefined,
          big_small: selectedSize || undefined,
          amount: contractMoney,
        };
        
        // Update UI and state
        dispatch(withdraw({ cryptoname: "INR", amount: contractMoney }));
        setBets((prev) => [...prev, bet]);
        setSelectedNumber(null);
        setSelectedColor("");
        setSelectedSize("");
        setContractMoney(0);
        setAgreed(false);
        
        // Show success message in green toast
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#4CAF50',
            color: 'white',
          },
        });
        
        // Close the bet popup if it exists
        setSelectedNumber(null);
        setSelectedColor("");
        setSelectedSize("");
      } else {
        console.error('Invalid response from placeBet:', response);
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#4CAF50',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      setError("Failed to place bet. Please try again later.");
    }
  };

  



  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className=" px-2 pt-20 pb-24 bg-[#0F0F19]">
      <div className="w-full  bg-gradient-to-b from-[#252547] to-[#1A1A2E] text-white p-4 space-y-4 rounded-lg">
        {/* Header with back button */}
        <div className="flex items-center mb-4">
          <Link
            to="/"
            className="p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-white ml-4">Wingo</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Left Column - Game Controls */}
          <div className="lg:col-span-2 space-y-8 ">
            {/* Time Buttons */}
            <div className="grid grid-cols-4 gap-8">
              {['1min', '3min', '5min', '10min'].map((duration) => (
                <button
                  key={duration}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === duration
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-[#252547] border border-purple-500/20 text-gray-300 hover:bg-[#2f2f5a]"
                  }`}
                  onClick={() => {
                    setActiveTab(duration);
                  }}
                >
                  {duration}
                  <div className="text-sm mt-1">
                    {formatTime(timers[duration])}
                  </div>
                </button>
              ))}
            </div>

            {/* Period Display and Timer */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-4 py-3 rounded-lg border border-purple-500/20">
                <span className="mr-2">🏆</span>
                <span className="font-bold">Period</span>
                <span className="ml-auto">{currentPeriod}</span>
              </div>
              <div
                className={`flex items-center justify-center gap-2 bg-[#252547] border border-purple-500/20 text-center py-3 px-4 rounded-lg ${
                  timers[activeTab] < 10 ? "bg-red-500/20 border-red-500/30" : ""
                }`}
              >
                <Clock
                  className={`w-5 h-5 ${
                    timers[activeTab] < 10 ? "text-red-400" : "text-purple-400"
                  }`}
                />
                <span
                  className={`font-bold ${
                    timers[activeTab] < 10 ? "text-red-400" : "text-white"
                  }`}
                >
                  Time Left: {formatTime(timers[activeTab])}
                </span>
              </div>
            </div>

            {/* Join Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-4 py-3 rounded-lg font-medium ${
                  timers[activeTab] < 10
                    ? "bg-[#252547] border border-green-500/20 text-gray-400 cursor-not-allowed"
                    : "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                }`}
                disabled={timers[activeTab] < 10}
                onClick={() => setSelectedColor("green")}
              >
                Join Green
              </button>

              <button
                className={`px-4 py-3 rounded-lg font-medium ${
                  timers[activeTab] < 10
                    ? "bg-[#252547] border border-purple-500/20 text-gray-400 cursor-not-allowed"
                    : "bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                }`}
                disabled={timers[activeTab] < 10}
                onClick={() => setSelectedColor("voilet")}
              >
                Join Violet
              </button>

              <button
                className={`px-4 py-3 rounded-lg font-medium ${
                  timers[activeTab] < 10
                    ? "bg-[#252547] border border-red-500/20 text-gray-400 cursor-not-allowed"
                    : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                }`}
                disabled={timers[activeTab] < 10}
                onClick={() => setSelectedColor("red")}
              >
                Join Red
              </button>
            </div>

            {/* 0-9 Number Buttons */}
            <div className="p-2 bg-[#1A1A2E] rounded-lg border border-purple-500/10">
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => timers[activeTab] >= 10 && setSelectedNumber(i)}
                    disabled={timers[activeTab] < 10}
                    className={`relative px-0 py-3 text-white font-bold rounded-lg ${
                      timers[activeTab] < 10
                        ? "bg-[#252547] border border-gray-600/20 text-gray-500 cursor-not-allowed"
                        : i === 0 || i === 5
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        : [2, 4, 6, 8].includes(i)
                        ? "bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90"
                        : "bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Big & Small Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`px-4 py-3 rounded-lg font-medium ${
                  timers[activeTab] < 10
                    ? "bg-[#252547] border border-red-500/20 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90"
                }`}
                disabled={timers[activeTab] < 10}
                onClick={() => setSelectedSize("big")}
              >
                Big
              </button>
              <button
                className={`px-4 py-3 rounded-lg font-medium ${
                  timers[activeTab] < 10
                    ? "bg-[#252547] border border-green-500/20 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:opacity-90"
                }`}
                disabled={timers[activeTab] < 10}
                onClick={() => setSelectedSize("small")}
              >
                Small
              </button>
            </div>
          </div>

          {/* Right Column - Record Table */}
          <div className="  bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-purple-500/10">
              <h2 className="text-xl font-bold text-white">
                {selected} min Record
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                    <th className="py-4 px-6 font-medium">Period</th>
                    <th className="py-4 px-6 font-medium">Number</th>
                    <th className="py-4 px-6 font-medium">Result</th>
                    <th className="py-4 px-6 font-medium">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((record, index) => (
                      <tr
                        key={index}
                        className="border-b border-purple-500/10 text-white hover:bg-purple-500/5"
                      >
                        <td className="py-4 px-4">{record.period_number}</td>
                        <td className="py-4 px-4">{record.result_number}</td>
                        <td className="py-4 px-4">
                          {record.result_color === "voilet"
                            ? "🟣"
                            : record.result_color === "green"
                            ? "🟢"
                            : "🔴"}
                        </td>
                        <td className="py-4 px-4">{record.result_size}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400">
                        No records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-purple-500/10 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Showing {indexOfFirstRecord + 1}-
                {Math.min(indexOfLastRecord, records.length)} of {records.length}{" "}
                records
              </p>
              <div className="flex gap-2">
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 py-1 px-3 border border-purple-500/20 rounded-lg text-gray-200 hover:text-gray-400 transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      className={`py-1 px-3 rounded-lg ${
                        currentPage === pageToShow
                          ? "bg-purple-500/20 border border-purple-500/20 text-white"
                          : "bg-[#1A1A2E] border border-purple-500/20 text-gray-400 hover:text-white transition-colors"
                      }`}
                      onClick={() => setCurrentPage(pageToShow)}
                    >
                      {pageToShow}
                    </button>
                  );
                })}

                <button
                  className=" bg-gradient-to-r from-pink-600 to-purple-600  py-1 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-gray-200 hover:text-gray-400 transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for bet confirmation */}
      {(selectedNumber !== null || selectedColor || selectedSize) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-purple-500/10">
              <h2 className="text-xl font-bold text-white">
                {selectedNumber !== null
                  ? `Number ${selectedNumber} Selected`
                  : selectedColor
                    ? `${selectedColor} Selected`
                    : `${selectedSize} Selected`}
              </h2>
              <button
                onClick={() => {
                  setSelectedNumber(null);
                  setSelectedColor("");
                  setSelectedSize("");
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Contract Money</label>
                <input
                  min={10}
                  step={10}
                  type="number"
                  placeholder="Enter amount (Minimum ₹10)"
                  value={contractMoney || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 100000) {
                      setContractMoney(100000);
                    } else {
                      setContractMoney(value);
                    }
                  }}
                  className="w-full py-3 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Error Message or Success Message */}
              {contractMoney > 100000 ? (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                  Contract money cannot exceed ₹100,000
                </div>
              ) : contractMoney >= 10 ? (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
                  Total contract money is ₹{contractMoney}
                </div>
              ) : null}

              {/* Checkbox */}
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mr-3 cursor-pointer ${agreed
                      ? "bg-purple-600"
                      : "bg-[#1A1A2E] border border-purple-500/20"
                    }`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <Check className="w-4 h-4 text-white" />}
                </div>
                <label
                  className="text-sm text-gray-300 cursor-pointer"
                  onClick={() => setAgreed(!agreed)}
                >
                  I agree to the{" "}
                  <span className="text-purple-400">terms and conditions</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="p-5 border-t border-purple-500/10 flex gap-3">
              <button
                onClick={() => {
                  setSelectedNumber(null);
                  setSelectedColor("");
                  setSelectedSize("");
                }}
                className="flex-1 py-3 px-4 bg-[#1A1A2E] border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${agreed && contractMoney >= 10 && contractMoney <= 100000
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
                    : "bg-gray-600/50 cursor-not-allowed"
                  }`}
                disabled={
                  !agreed || contractMoney < 10 || contractMoney > 100000
                }
                onClick={handleBet}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for win/loss */}
      {winner && betHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-purple-500/10">
              <h2 className="text-xl font-bold text-white">
                {popup === "won" ? "You Won!" : "You Lost!"}
              </h2>
              <button
                onClick={() => setWinner(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-300">
                  {popup === "won" ? (
                    <>
                      Congratulations <br />
                      BetAmount: {betHistory.amount} <br />
                      AmountReceived: {betHistory.amountReceived}
                    </>
                  ) : (
                    <>
                      Better luck next time! <br />
                      BetAmount: {betHistory.amount}
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="p-5 border-t border-purple-500/10 flex gap-3">
              <button
                onClick={() => setWinner(false)}
                className="flex-1 py-3 px-4 bg-[#1A1A2E] border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add error message display */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 animate-fadeIn">
            <div className="flex items-center">
              <X className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default BigSmall;