"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  User,
  DollarSign,
  Eye,
  CheckCircle,
  AlertCircle,
  Utensils,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const StaffOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Sample orders data - replace with actual API calls
  const orders = [
    {
      id: "#1245",
      table: "Table 8",
      customer: "John Doe",
      items: [
        { name: "Chicken Biryani", quantity: 2, price: 320 },
        { name: "Dal Makhani", quantity: 1, price: 180 },
        { name: "Garlic Naan", quantity: 3, price: 45 },
      ],
      status: "preparing",
      orderTime: "2:15 PM",
      estimatedTime: "15 min",
      total: 545,
      paymentStatus: "paid",
      special: "Extra spicy, no onions",
      priority: "high",
    },
    {
      id: "#1244",
      table: "Table 5",
      customer: "Sarah Wilson",
      items: [
        { name: "Masala Dosa", quantity: 2, price: 150 },
        { name: "Filter Coffee", quantity: 2, price: 80 },
        { name: "Sambar", quantity: 1, price: 60 },
      ],
      status: "ready",
      orderTime: "2:10 PM",
      estimatedTime: "Ready",
      total: 290,
      paymentStatus: "paid",
      special: "",
      priority: "normal",
    },
    {
      id: "#1243",
      table: "Table 12",
      customer: "Mike Johnson",
      items: [
        { name: "Paneer Butter Masala", quantity: 1, price: 280 },
        { name: "Butter Naan", quantity: 2, price: 60 },
        { name: "Jeera Rice", quantity: 1, price: 120 },
      ],
      status: "served",
      orderTime: "1:45 PM",
      estimatedTime: "Served",
      total: 460,
      paymentStatus: "paid",
      special: "Medium spice level",
      priority: "normal",
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
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-400";
      case "pending":
        return "text-orange-400";
      case "refunded":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id.localeCompare(a.id);
      case "oldest":
        return a.id.localeCompare(b.id);
      case "amount":
        return b.total - a.total;
      default:
        return 0;
    }
  });

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
                <h1 className="text-white text-xl font-bold">Orders</h1>
                <p className="text-white/80 text-sm">Manage all orders</p>
              </div>
            </div>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-white/80" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-white placeholder-white/70 bg-transparent focus:outline-none"
              />
              <Filter className="w-5 h-5 text-white/80" />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {["all", "preparing", "ready", "served"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? "bg-white/30 text-white border border-white/40"
                    : "bg-white/10 text-white/70 border border-white/20"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Orders List */}
        <div className="space-y-4 mb-6">
          {sortedOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-200"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{order.id}</h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)}`}></div>
                    </div>
                    <span className="text-white/60 text-sm">{order.table}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold flex items-center gap-1">
                      ₹{order.total}
                    </div>
                    <div className={`text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {order.customer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {order.orderTime}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 2).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-1">
                      <div className="flex-1">
                        <span className="text-white text-sm">{item.name}</span>
                        <span className="text-white/60 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-white/80 text-sm">₹{item.price}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-white/60 text-sm">
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>

                {order.special && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-yellow-300 text-sm font-medium">Special Instructions:</p>
                        <p className="text-yellow-200 text-sm">{order.special}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  
                  {order.status === "preparing" && (
                    <button className="flex-1 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Mark Ready
                    </button>
                  )}
                  
                  {order.status === "ready" && (
                    <button className="flex-1 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Mark Served
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No orders found</h3>
            <p className="text-white/60 text-sm">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "New orders will appear here"
              }
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-white text-2xl font-bold">8</div>
            <div className="text-white/60 text-sm">Preparing</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-white text-2xl font-bold">3</div>
            <div className="text-white/60 text-sm">Ready</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-white text-2xl font-bold">47</div>
            <div className="text-white/60 text-sm">Total Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOrdersPage;