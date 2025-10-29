"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Star,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  ArrowLeft,
} from "lucide-react";

const StaffAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("today");
  const [viewType, setViewType] = useState("overview");

  // Sample analytics data - replace with actual API calls
  const todayStats = {
    revenue: { value: 15240, change: 18, trend: "up" },
    orders: { value: 47, change: -5, trend: "down" },
    avgOrderValue: { value: 324, change: 12, trend: "up" },
    customerSatisfaction: { value: 4.8, change: 0.2, trend: "up" },
    tableOccupancy: { value: 78, change: 15, trend: "up" },
    avgServiceTime: { value: 14, change: -3, trend: "up" },
  };

  const hourlyData = [
    { time: "9 AM", orders: 3, revenue: 890, percentage: 12 },
    { time: "10 AM", orders: 8, revenue: 2150, percentage: 32 },
    { time: "11 AM", orders: 12, revenue: 3240, percentage: 48 },
    { time: "12 PM", orders: 18, revenue: 4850, percentage: 72 },
    { time: "1 PM", orders: 22, revenue: 6720, percentage: 88 },
    { time: "2 PM", orders: 15, revenue: 4320, percentage: 60 },
    { time: "3 PM", orders: 8, revenue: 2180, percentage: 32 },
    { time: "4 PM", orders: 5, revenue: 1240, percentage: 20 },
  ];

  const topItems = [
    { name: "Chicken Biryani", orders: 18, revenue: 5760, percentage: 25 },
    { name: "Butter Chicken", orders: 15, revenue: 4200, percentage: 18 },
    { name: "Dal Makhani", orders: 12, revenue: 2160, percentage: 12 },
    { name: "Garlic Naan", orders: 25, revenue: 1125, percentage: 8 },
    { name: "Masala Dosa", orders: 10, revenue: 1500, percentage: 7 },
  ];

  interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    trend: "up" | "down";
    icon: React.ComponentType<{ className?: string }>;
    unit?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, unit = "" }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-white/10 p-2 rounded-xl">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <div className="text-right">
          <div className="text-white text-lg font-bold">
            {value}{unit}
          </div>
        </div>
      </div>
      <h3 className="text-white/80 text-sm font-medium mb-2">{title}</h3>
      <div className={`flex items-center gap-1 text-xs ${
        trend === "up" ? "text-green-400" : "text-red-400"
      }`}>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {change > 0 ? "+" : ""}{change}{unit === "%" ? "%" : unit === "min" ? " min" : "%"}
        <span className="text-white/50">vs yesterday</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="bg-theme-gradient-secondary relative overflow-hidden rounded-b-3xl mb-6">
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white text-xl font-bold">Analytics</h1>
                <p className="text-white/80 text-sm">Performance insights</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {["today", "week", "month", "quarter"].map((period) => (
              <button
                key={period}
                onClick={() => setDateRange(period)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  dateRange === period
                    ? "bg-white/30 text-white border border-white/40"
                    : "bg-white/10 text-white/70 border border-white/20"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Total Revenue"
            value="₹15,240"
            change={18}
            trend="up"
            icon={DollarSign}
          />
          <StatCard
            title="Total Orders"
            value={47}
            change={-5}
            trend="down"
            icon={BarChart3}
          />
          <StatCard
            title="Avg Order Value"
            value="₹324"
            change={12}
            trend="up"
            icon={TrendingUp}
          />
          <StatCard
            title="Customer Rating"
            value={4.8}
            change={0.2}
            trend="up"
            icon={Star}
          />
        </div>

        {/* Hourly Performance */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-6">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Hourly Performance
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {hourlyData.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-16">
                    <span className="text-white/80 text-sm font-medium">
                      {hour.time}
                    </span>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${hour.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-semibold">
                      {hour.orders}
                    </div>
                    <div className="text-white/60 text-xs">₹{hour.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-6">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-400" />
              Top Menu Items
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">
                        {item.name}
                      </h4>
                      <div className="bg-white/10 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${item.percentage * 4}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-white text-sm font-semibold">
                      {item.orders}
                    </div>
                    <div className="text-white/60 text-xs">₹{item.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Table Occupancy"
            value={78}
            change={15}
            trend="up"
            icon={Users}
            unit="%"
          />
          <StatCard
            title="Avg Service Time"
            value={14}
            change={-3}
            trend="up"
            icon={Clock}
            unit="min"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 text-center">
            <div className="bg-blue-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-white font-medium text-sm">Export Report</p>
            <p className="text-white/60 text-xs">Download PDF</p>
          </button>
          
          <button className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 text-center">
            <div className="bg-purple-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-white font-medium text-sm">Detailed View</p>
            <p className="text-white/60 text-xs">Full Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAnalyticsPage;