import React, { useEffect, useState } from "react";
import {
  getRechargeBonusConfig,
  addRechargeBonusConfig,
  disableRechargeBonusConfig,
  updateRechargeBonusConfig,
} from "../../lib/services/InvitationService.js";
import toast from "react-hot-toast";

interface BonusRule {
  bonus_level: number;
  bonus_amount: number;
  required_invitees: number;
  required_recharge_per_person: number;
  updated_at?: string;
  is_disable?: boolean;
}

const InvitationBonus: React.FC = () => {
  const [invitees, setInvitees] = useState("");
  const [rechargePerPerson, setRechargePerPerson] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [bonusList, setBonusList] = useState<BonusRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);

  // 🟣 Fetch All Bonus Rules
  const fetchBonusList = async () => {
    try {
      setLoading(true);
      const data = await getRechargeBonusConfig();
      setBonusList(data.data);
    } catch (error) {
      console.error("Error fetching bonus list:", error);
      toast.error("Failed to load bonus list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusList();
  }, []);

  // 🟢 Add or Update Bonus Rule
  const handleAddBonus = async () => {
    if (!invitees || !rechargePerPerson || !bonusAmount) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      bonus_amount: Number(bonusAmount),
      required_invitees: Number(invitees),
      required_recharge_per_person: Number(rechargePerPerson),
    };

    try {
      setAdding(true);

      if (editingLevel) {
        // Update existing rule
        const response = await updateRechargeBonusConfig({
          bonus_level: editingLevel,
          ...payload,
        });

        if (response.success || response.status === "success") {
          toast.success("Bonus rule updated successfully!");
          setEditingLevel(null);
        } else {
          toast.error("Failed to update bonus rule.");
        }
      } else {
        // Add new rule
        const response = await addRechargeBonusConfig(payload);

        if (response.success || response.status === "success") {
          toast.success("Bonus rule added successfully!");
        } else {
          toast.error("Failed to add bonus rule.");
        }
      }

      await fetchBonusList();
      setInvitees("");
      setRechargePerPerson("");
      setBonusAmount("");
    } catch (error) {
      console.error("Error adding/updating bonus rule:", error);
      toast.error("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  // Edit Button Handler
  const handleEdit = (item: BonusRule) => {
    setInvitees(item.required_invitees.toString());
    setRechargePerPerson(item.required_recharge_per_person.toString());
    setBonusAmount(item.bonus_amount.toString());
    setEditingLevel(item.bonus_level);
  };

  // Enable/Disable Toggle Handler
  const handleToggleDisable = async (item: BonusRule) => {
    try {
      const payload = {
        bonus_level: item.bonus_level,
        is_disable: !item.is_disable,
      };

      const response = await disableRechargeBonusConfig(payload);

      if (response.success || response.status === "success") {
        toast.success(
          `Bonus level ${item.bonus_level} ${
            item.is_disable ? "enabled" : "disabled"
          } successfully!`
        );
        fetchBonusList();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error toggling disable:", error);
      toast.error("Error updating status.");
    }
  };

  return (
    <div className="p-6 bg-[#1a1a3d] rounded-lg shadow-md text-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-purple-300">
        Invitation Bonus Configuration
      </h2>

      {/* Input Fields */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            No. of Invitees
          </label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={invitees}
            onChange={(e) => setInvitees(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#252547] border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Recharge per Person (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 200"
            value={rechargePerPerson}
            onChange={(e) => setRechargePerPerson(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#252547] border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Bonus Amount (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 100"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#252547] border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleAddBonus}
            disabled={adding}
            className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition text-sm whitespace-nowrap"
          >
            {editingLevel
              ? adding
                ? "Updating..."
                : "Update Rule"
              : adding
              ? "Adding..."
              : "Add Bonus Rule"}
          </button>
        </div>
      </div>

      {/* Bonus Rules Table */}
      {loading ? (
        <p className="text-gray-400">Loading bonus rules...</p>
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">
            Bonus Rules
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300 border border-purple-500/20 rounded-lg">
              <thead className="bg-[#252547]/70 text-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    #
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    No. of Invitees
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    Recharge per Person (₹)
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    Bonus Amount (₹)
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    Updated At
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left border-b border-purple-500/20">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bonusList.length > 0 ? (
                  bonusList.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#2a2a4b]/70 transition-colors"
                    >
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        {item.required_invitees}
                      </td>
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        ₹{item.required_recharge_per_person}
                      </td>
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        ₹{item.bonus_amount}
                      </td>
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2 border-b border-purple-500/20">
                        <span
                          onClick={() => handleToggleDisable(item)}
                          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            item.is_disable
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          }`}
                        >
                          {item.is_disable ? "Disabled" : "Enabled"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 border-b border-purple-500/20 flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2 py-1 bg-blue-600/70 hover:bg-blue-700 text-white text-xs rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-400 py-4 border-t border-purple-500/20"
                    >
                      No bonus rules added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationBonus;
