import React, { useState } from "react";
import { Bell, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { createNotification } from "../../lib/services/notificationService";

const CustomNotification = () => {
  const [formData, setFormData] = useState({
    userId: "",
    heading: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.heading || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const notificationData = {
        userId: parseInt(formData.userId),
        heading: formData.heading,
        message: formData.message,
        type: "info"
      };

      const response = await createNotification(notificationData);
      
      if (response.success) {
        toast.success(response.message);
        setFormData({
          userId: "",
          heading: "",
          message: "",
        });
      } else {
        toast.error("Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("An error occurred while creating the notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Bell className="text-purple-400" size={24} />
          Custom Notification
        </h1>
        <p className="text-gray-400">
          Send custom notifications to users
        </p>
      </div>

      <div className="bg-[#1A1A2E]/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-2">
              User ID
            </label>
            <input
              type="number"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#252547] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              placeholder="Enter user ID"
              required
            />
          </div>

          <div>
            <label htmlFor="heading" className="block text-sm font-medium text-gray-300 mb-2">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#252547] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              placeholder="Enter notification heading"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#252547] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
              placeholder="Enter notification message"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {isLoading ? "Sending..." : "Notify User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomNotification;
