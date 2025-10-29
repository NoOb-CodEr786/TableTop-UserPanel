"use client";

import React, { useState } from "react";
import {
  Home,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Filter,
  X,
  TrendingUp,
  Clock,
  Bell,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const StaffBottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "dashboard":
        router.push("/staff");
        break;
      case "orders":
        router.push("/staff/orders");
        break;
      case "tables":
        router.push("/staff/tables");
        break;
      case "analytics":
        router.push("/staff/analytics");
        break;
      case "settings":
        router.push("/staff/settings");
        break;
      case "filter":
        setIsFilterModalOpen(true);
        break;
      default:
        router.push("/staff");
    }
  };

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    setIsFilterModalOpen(false);
    
    switch (action) {
      case "new-order":
        router.push("/staff/orders?action=new");
        break;
      case "table-status":
        router.push("/staff/tables");
        break;
      case "today-stats":
        router.push("/staff/analytics?period=today");
        break;
      case "notifications":
        // Handle notifications
        break;
      case "urgent-tasks":
        router.push("/staff?filter=urgent");
        break;
      case "reports":
        router.push("/staff/analytics?view=reports");
        break;
    }
  };

  const getActiveTab = () => {
    if (pathname === "/staff") return "dashboard";
    if (pathname.includes("/staff/orders")) return "orders";
    if (pathname.includes("/staff/tables")) return "tables";
    if (pathname.includes("/staff/analytics")) return "analytics";
    if (pathname.includes("/staff/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  return (
    <div className="max-w-xl mx-auto fixed bottom-0 left-0 right-0 z-50">
      <div className="relative">
        {/* Curved background with staff theme */}
        <svg
          className="w-full h-20"
          viewBox="0 0 375 80"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 0 H130 Q140 0 150 10 L160 20 Q170 30 187.5 30 Q205 30 215 20 L225 10 Q235 0 245 0 H375 V80 H0 V0 Z"
            fill="url(#staffBottomNavGradient)"
          />
          <defs>
            <linearGradient id="staffBottomNavGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3730a3" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Center Button (Quick Actions) */}
        <button
          onClick={() => handleTabChange("filter")}
          className="absolute left-1/2 -translate-x-1/2 -top-10 w-15 h-15 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-200 border-4 border-white/20"
        >
          <Filter className="w-7 h-7 text-white" />
        </button>

        {/* Navigation Items */}
        <div className="absolute inset-0 flex items-end justify-between px-8 pb-4">
          {/* Dashboard */}
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "dashboard" ? "text-white scale-110" : "text-blue-200"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => handleTabChange("orders")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "orders" ? "text-white scale-110" : "text-blue-200"
            }`}
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs font-medium">Orders</span>
          </button>

          {/* Tables */}
          <button
            onClick={() => handleTabChange("tables")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "tables" ? "text-white scale-110" : "text-blue-200"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Tables</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => handleTabChange("analytics")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "analytics" ? "text-white scale-110" : "text-blue-200"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>

        {/* Quick Actions Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-40 flex items-end justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsFilterModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-slate-900/95 to-indigo-900/95 backdrop-blur-md rounded-2xl w-full max-w-xs mx-4 p-4 mb-24 transform transition-transform duration-300 ease-out max-h-[50vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              {/* Quick Action Options */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="space-y-2 pr-1">
                  <button
                    onClick={() => handleQuickAction("new-order")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">New Order</h4>
                        <p className="text-xs text-gray-300">Take new order</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-green-500/20 px-2 py-1 rounded-full">
                      Fast
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("table-status")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Table Status</h4>
                        <p className="text-xs text-gray-300">Check all tables</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-blue-500/20 px-2 py-1 rounded-full">
                      Live
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("today-stats")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Today's Stats</h4>
                        <p className="text-xs text-gray-300">View performance</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-purple-500/20 px-2 py-1 rounded-full">
                      Real-time
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("notifications")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Notifications</h4>
                        <p className="text-xs text-gray-300">Check alerts</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-orange-500/20 px-2 py-1 rounded-full">
                      3
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("urgent-tasks")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Urgent Tasks</h4>
                        <p className="text-xs text-gray-300">Priority items</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-red-500/20 px-2 py-1 rounded-full">
                      5
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("reports")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Reports</h4>
                        <p className="text-xs text-gray-300">Generate reports</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 bg-indigo-500/20 px-2 py-1 rounded-full">
                      Export
                    </span>
                  </button>
                </div>
              </div>

              {/* Settings Button */}
              <div className="flex-shrink-0 mt-4">
                <button
                  onClick={() => handleTabChange("settings")}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Staff Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffBottomNavigation;