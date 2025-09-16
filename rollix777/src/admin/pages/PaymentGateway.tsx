import React, { useEffect, useState } from "react";
import { Check, X, CreditCard, Wallet } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getAllGateways,
  updateGateway,
} from "../../lib/services/paymentService.js";

interface Gateway {
  id: number;
  name: string;
  label: string;
  min_amount: number;
  max_amount: number;
  status: "active" | "inactive";
  display_order: number;
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
      let payload: any = { name: gateway.name, status: newStatus };

      if (newStatus === "active" && !gateway.display_order) {
        // find the first free order number
        const usedOrders = gateways
          .filter((g) => g.status === "active")
          .map((g) => g.display_order);
        const nextFree = Array.from(
          { length: gateways.length },
          (_, i) => i + 1
        ).find((num) => !usedOrders.includes(num));

        if (nextFree) {
          payload.display_order = nextFree;
        }
      }

      await updateGateway(payload);

      setGateways((prev) =>
        prev.map((g) =>
          g.id === gateway.id
            ? {
                ...g,
                status: newStatus,
                display_order: payload.display_order ?? g.display_order,
              }
            : g
        )
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

  const handleOrderChange = async (gatewayId: number, newOrder: number) => {
    const gateway = gateways.find((g) => g.id === gatewayId);
    if (!gateway) return;

    try {
      // Find if some other gateway already has this order
      const conflictGateway = gateways.find(
        (g) => g.display_order === newOrder && g.id !== gatewayId
      );

      // First, remove order from the conflicting gateway
      if (conflictGateway) {
        await updateGateway({
          name: conflictGateway.name,
          display_order: null,
        });
      }

      // Then, update the selected gateway with the new order
      await updateGateway({ name: gateway.name, display_order: newOrder });

      // Update state locally
      setGateways((prev) =>
        prev.map((g) => {
          if (g.id === gatewayId) {
            return { ...g, display_order: newOrder };
          }
          if (conflictGateway && g.id === conflictGateway.id) {
            return { ...g, display_order: 0 };
          }
          return g;
        })
      );

      toast.success(`${gateway.label} order set to ${newOrder}`);
    } catch (error) {
      console.error("Error updating display_order:", error);
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="p-6 bg-[#0F0F1E] min-h-screen text-white">
      <div className="flex items-center gap-2">
        <Wallet />
        <h1 className="text-2xl font-bold">Manage Payment Gateways</h1>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading gateways...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {gateways &&
            gateways.map((gateway, idx) => (
              <div
                key={gateway.id}
                className="bg-[#1A1A2E] border border-green-500/20 rounded-2xl shadow-md p-5 flex flex-col gap-4 hover:border-green-400/40 transition"
              >
                {/* Header row with label + toggle */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold">{gateway.label}</h2>
                  </div>

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

                {/* Order Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-300 text-sm">Order:</label>
                  <select
                    value={gateway.display_order || ""}
                    onChange={(e) =>
                      handleOrderChange(gateway.id, Number(e.target.value))
                    }
                    className="bg-[#111827] text-gray-200 border border-green-500/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Order</option>
                    {Array.from(
                      { length: gateways.length },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PaymentGateways;
