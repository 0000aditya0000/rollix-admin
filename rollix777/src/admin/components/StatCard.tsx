import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-md flex items-center gap-4">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
      >
        <Icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
