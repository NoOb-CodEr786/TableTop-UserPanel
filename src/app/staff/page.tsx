"use client";

import React from "react";
import {
  Users,
  ClipboardList,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Bell,
  Star,
  Zap,
  Award,
} from "lucide-react";

const StaffDashboard = () => {
  // Sample data - replace with actual API calls
  const stats = [
    {
      title: "Active Tables",
      value: "12",
      total: "20",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      trend: "+2 from yesterday",
    },
    {
      title: "Pending Orders",
      value: "8",
      total: "24",
      icon: ClipboardList,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      trend: "-3 from last hour",
    },
    {
      title: "Avg. Service Time",
      value: "12",
      unit: "min",
      icon: Clock,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      trend: "-2 min improvement",
    },
    {
      title: "Today's Revenue",
      value: "₹15,240",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      trend: "+18% from yesterday",
    },
  ];

  const recentOrders = [
    {
      id: "#1234",
      table: "Table 5",
      items: "2x Biryani, 1x Dal Makhani",
      status: "preparing",
      time: "5 min ago",
      amount: "₹580",
      urgent: false,
    },
    {
      id: "#1235",
      table: "Table 8",
      items: "1x Butter Chicken, 2x Naan",
      status: "ready",
      time: "8 min ago",
      amount: "₹420",
      urgent: true,
    },
    {
      id: "#1236",
      table: "Table 2",
      items: "3x Masala Dosa, 1x Coffee",
      status: "served",
      time: "12 min ago",
      amount: "₹310",
      urgent: false,
    },
  ];

  const notifications = [
    {
      type: "order",
      message: "New order from Table 15",
      time: "2 min ago",
      urgent: true,
      icon: ClipboardList,
    },
    {
      type: "complaint",
      message: "Customer complaint at Table 7",
      time: "5 min ago",
      urgent: true,
      icon: AlertCircle,
    },
    {
      type: "inventory",
      message: "Low stock alert: Chicken items",
      time: "10 min ago",
      urgent: false,
      icon: Bell,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "ready":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "served":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile-style Header */}
      <div className="bg-theme-gradient-secondary relative overflow-hidden rounded-b-3xl mb-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        {/* Header Content */}
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
                <span className="text-white/90 text-xs font-medium">Staff Panel</span>
              </div>
              <h1 className="text-white text-2xl font-bold">Welcome Back!</h1>
              <p className="text-white/80 text-sm">Here's your restaurant overview</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            {stats.slice(0, 2).map((stat, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-300" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-white text-xl font-bold">{stat.value}</span>
                    {stat.unit && <span className="text-white/60 text-sm">{stat.unit}</span>}
                    {stat.total && <span className="text-white/60 text-sm">/{stat.total}</span>}
                  </div>
                  <p className="text-white/80 text-xs font-medium">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.slice(2).map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-lg font-bold">{stat.value}</span>
                    {stat.unit && <span className="text-white/60 text-xs">{stat.unit}</span>}
                  </div>
                </div>
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-6 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                Recent Orders
              </h2>
              <button className="text-blue-400 text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {recentOrders.map((order, index) => (
              <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{order.id}</span>
                    <span className="text-white/60 text-sm">{order.table}</span>
                    {order.urgent && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{order.amount}</div>
                    <div className="text-white/60 text-xs">{order.time}</div>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-3">{order.items}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.status === "ready" && (
                    <button className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
                      Mark Served
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-6">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-400" />
              Notifications
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">2</span>
            </h2>
          </div>
          <div className="divide-y divide-white/10 max-h-64 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 hover:bg-white/5 transition-colors ${
                  notification.urgent ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.urgent ? "bg-red-500/20" : "bg-blue-500/20"
                  }`}>
                    <notification.icon className={`w-4 h-4 ${
                      notification.urgent ? "text-red-400" : "text-blue-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium mb-1">
                      {notification.message}
                    </p>
                    <p className="text-white/60 text-xs">{notification.time}</p>
                  </div>
                  {notification.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 text-center group">
              <div className="bg-blue-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-medium text-sm">Manage Tables</p>
              <p className="text-white/60 text-xs">12 Active</p>
            </button>
            
            <button className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200 text-center group">
              <div className="bg-green-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <ClipboardList className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-white font-medium text-sm">New Order</p>
              <p className="text-white/60 text-xs">Take Order</p>
            </button>
            
            <button className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-200 text-center group">
              <div className="bg-orange-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-white font-medium text-sm">Report Issue</p>
              <p className="text-white/60 text-xs">Get Help</p>
            </button>
            
            <button className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 text-center group">
              <div className="bg-purple-500/20 p-3 rounded-2xl mx-auto mb-3 w-12 h-12 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-white font-medium text-sm">Analytics</p>
              <p className="text-white/60 text-xs">View Stats</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;