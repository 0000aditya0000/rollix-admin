import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getAllGateways,
  toggleGatewayStatus,
} from "../../lib/services/paymentService.js";

interface Gateway {
  id: number;
  name: string;
  label: string;
  min_amount: number;
  max_amount: number;
  status: "active" | "inactive";
}

const PaymentGateways: React.FC = () => {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch gateways from backend API
  const fetchGateways = async () => {
    try {
      setLoading(true);
      const res = await getAllGateways();
      setGateways(res.data);
    } catch (error) {
      console.error("Error fetching gateways:", error);
      toast.error("Failed to load gateways");
    } finally {
      setLoading(false);
    }
  };

  // Toggle gateway status
  const toggleGateway = async (gateway: Gateway) => {
    try {
      const newStatus = gateway.status === "active" ? "inactive" : "active";
      await toggleGatewayStatus(gateway.name, newStatus);

      setGateways((prev) =>
        prev.map((g) => (g.id === gateway.id ? { ...g, status: newStatus } : g))
      );

      toast.success(
        `${gateway.label} ${newStatus === "active" ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling gateway:", error);
      toast.error("Failed to update gateway");
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  return (
    <div className="p-6 bg-[#0F0F1E] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">💳 Manage Payment Gateways</h1>

      {loading ? (
        <p className="text-gray-400">Loading gateways...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways &&
            gateways.map((gateway) => (
              <div
                key={gateway.id}
                className="bg-[#1A1A2E] border border-green-500/20 rounded-2xl shadow-md p-5 flex flex-col gap-4 hover:border-green-400/40 transition"
              >
                {/* Header row with label + toggle */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{gateway.label}</h2>

                  {/* Custom Toggle */}
                  <button
                    onClick={() => toggleGateway(gateway)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                      gateway.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full flex items-center justify-center transform transition ${
                        gateway.status === "active"
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    >
                      {gateway.status === "active" ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-500" />
                      )}
                    </span>
                  </button>
                </div>

                {/* Info Section */}
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    💰 Min:{" "}
                    <span className="text-green-400">
                      ₹{gateway.min_amount}
                    </span>
                  </p>
                  <p>
                    💰 Max:{" "}
                    <span className="text-green-400">
                      ₹{gateway.max_amount}
                    </span>
                  </p>
                  <p>
                    ⚡ Status:{" "}
                    <span
                      className={
                        gateway.status === "active"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {gateway.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PaymentGateways;
