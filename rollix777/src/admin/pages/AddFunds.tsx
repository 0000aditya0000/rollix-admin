import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { addFunds } from "../../lib/services/addFundService";

const AddFunds: React.FC = () => {
  const [userIds, setUserIds] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const parseUserIds = (input: string): number[] => {
    if (!input.trim()) return [];

    return input
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  };

  const handleAddFunds = async () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    const parsedUserIds = parseUserIds(userIds);

    // Validate user IDs if provided
    if (userIds.trim() && parsedUserIds.length === 0) {
      toast.error("Please enter valid user IDs");
      return;
    }

    setLoading(true);
    try {
      // If no user IDs provided, send empty array (for all users)
      const payload = {
        userIds: parsedUserIds,
        amount: parseInt(amount, 10),
      };

      await addFunds(payload.amount, payload.userIds);

      toast.success(
        parsedUserIds.length > 0
          ? `Funds added to users: ${parsedUserIds.join(", ")}`
          : "Funds added to all users"
      );

      setUserIds("");
      setAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  const parsedUserIds = parseUserIds(userIds);
  const isValidInput = amount && (!userIds.trim() || parsedUserIds.length > 0);

  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-[#1A1A2E]/90 border border-purple-500/30 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Add Funds
      </h2>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            User IDs (optional)
          </label>
          <input
            type="text"
            placeholder="Enter user IDs separated by commas"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#252547] border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave empty to add funds to all users
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Amount *
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#252547] border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Preview Section */}
      {amount && (
        <div className="bg-[#252547]/70 border border-purple-500/20 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-medium mb-2 text-purple-300">Preview:</h3>
          <div className="text-sm">
            <p className="mb-1">
              <span className="text-gray-400">Target:</span>{" "}
              <span className="text-white">
                {parsedUserIds.length > 0
                  ? `Users ${parsedUserIds.join(", ")}`
                  : "All Users"}
              </span>
            </p>
            <p>
              <span className="text-gray-400">Amount:</span>{" "}
              <span className="text-pink-400 font-semibold">₹{amount}</span>
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleAddFunds}
        disabled={!isValidInput || loading}
        className={`w-full px-4 py-3 rounded-lg font-medium transition ${
          isValidInput && !loading
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            : "bg-gray-600 text-gray-300 cursor-not-allowed"
        }`}
      >
        {loading
          ? "Processing..."
          : parsedUserIds.length > 0
          ? `Add ₹${amount || 0} to Selected Users`
          : `Add ₹${amount || 0} to All Users`}
      </button>
    </div>
  );
};

export default AddFunds;
