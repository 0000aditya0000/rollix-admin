import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchUserLogins } from "../../lib/services/userActivityService.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface UserLogin {
  id: number;
  user_id: number;
  phone: string;
  ip_address: string;
  login_datetime: string;
}

interface UserActivityResponse {
  success: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  data: UserLogin[];
}

const UserActivity = () => {
  const [activityData, setActivityData] = useState<UserLogin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UserActivityResponse = await fetchUserLogins();

      if (response.success) {
        setActivityData(response.data);
      } else {
        throw new Error("Failed to fetch user activity");
      }
    } catch (err: any) {
      const message = err.message || "Failed to fetch user activity.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const exportToExcel = () => {
    const worksheetData = activityData.map((entry) => ({
      ID: entry.id,
      "User ID": entry.user_id,
      Phone: entry.phone,
      "IP Address": entry.ip_address,
      "Login Date": new Date(entry.login_datetime).toLocaleDateString("en-IN", {
        dateStyle: "medium",
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Logins");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "user_login_activity.xlsx");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">User Login Activity</h1>
        <button
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
          onClick={exportToExcel}
        >
          Download
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
      ) : error ? (
        <div className="text-red-400 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="bg-[#1e1e3f] text-gray-300">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Login Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#2f2f5a] hover:bg-[#2f2f5a]"
                >
                  <td className="px-6 py-3">{entry.id}</td>
                  <td className="px-6 py-3">{entry.user_id}</td>
                  <td className="px-6 py-3">{entry.phone}</td>
                  <td className="px-6 py-3">{entry.ip_address}</td>
                  <td className="px-6 py-3">
                    {formatDate(entry.login_datetime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserActivity;
