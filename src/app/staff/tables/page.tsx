"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  DollarSign,
  Eye,
  UserPlus,
  UserX,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  Bell,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const StaffTablesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");

  // Sample tables data - replace with actual API calls
  const tables = [
    {
      id: "T001",
      number: 1,
      capacity: 4,
      status: "occupied",
      customerName: "John Doe",
      partySize: 3,
      occupiedSince: "1:30 PM",
      estimatedTime: "30 min",
      currentBill: 450,
      orders: ["#1234", "#1235"],
      waiter: "Sarah",
      requests: ["Water refill", "Extra napkins"],
    },
    {
      id: "T002",
      number: 2,
      capacity: 2,
      status: "available",
      customerName: null,
      partySize: 0,
      occupiedSince: null,
      estimatedTime: null,
      currentBill: 0,
      orders: [],
      waiter: null,
      requests: [],
    },
    {
      id: "T003",
      number: 3,
      capacity: 6,
      status: "reserved",
      customerName: "Emily Wilson",
      partySize: 5,
      occupiedSince: null,
      estimatedTime: "3:00 PM",
      currentBill: 0,
      orders: [],
      waiter: "Mike",
      requests: [],
    },
    {
      id: "T004",
      number: 4,
      capacity: 8,
      status: "occupied",
      customerName: "Robert Smith",
      partySize: 6,
      occupiedSince: "12:45 PM",
      estimatedTime: "45 min",
      currentBill: 890,
      orders: ["#1240", "#1241"],
      waiter: "Lisa",
      requests: ["Bill requested"],
    },
    {
      id: "T005",
      number: 5,
      capacity: 4,
      status: "cleaning",
      customerName: null,
      partySize: 0,
      occupiedSince: null,
      estimatedTime: "10 min",
      currentBill: 0,
      orders: [],
      waiter: "Tom",
      requests: [],
    },
    {
      id: "T006",
      number: 6,
      capacity: 2,
      status: "available",
      customerName: null,
      partySize: 0,
      occupiedSince: null,
      estimatedTime: null,
      currentBill: 0,
      orders: [],
      waiter: null,
      requests: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "occupied":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "reserved":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "cleaning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />;
      case "occupied":
        return <Users className="w-4 h-4" />;
      case "reserved":
        return <Clock className="w-4 h-4" />;
      case "cleaning":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredTables = tables.filter((table) => {
    const matchesSearch = 
      table.number.toString().includes(searchTerm) ||
      (table.customerName && table.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (table.waiter && table.waiter.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    const matchesCapacity = capacityFilter === "all" || 
      (capacityFilter === "small" && table.capacity <= 2) ||
      (capacityFilter === "medium" && table.capacity > 2 && table.capacity <= 4) ||
      (capacityFilter === "large" && table.capacity > 4);
    
    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const tableStats = {
    total: tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    reserved: tables.filter(t => t.status === "reserved").length,
    cleaning: tables.filter(t => t.status === "cleaning").length,
  };

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
                <h1 className="text-white text-xl font-bold">Tables</h1>
                <p className="text-white/80 text-sm">Monitor table status</p>
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
                placeholder="Search tables, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-white placeholder-white/70 bg-transparent focus:outline-none"
              />
              <Filter className="w-5 h-5 text-white/80" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
              <div className="text-white text-lg font-bold">{tableStats.available}</div>
              <div className="text-green-300 text-xs">Available</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
              <div className="text-white text-lg font-bold">{tableStats.occupied}</div>
              <div className="text-red-300 text-xs">Occupied</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
              <div className="text-white text-lg font-bold">{tableStats.reserved}</div>
              <div className="text-blue-300 text-xs">Reserved</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
              <div className="text-white text-lg font-bold">{tableStats.cleaning}</div>
              <div className="text-orange-300 text-xs">Cleaning</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          {["all", "available", "occupied", "reserved", "cleaning"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === status
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-white/70 border border-white/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredTables.map((table, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-200"
            >
              {/* Table Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-xl p-2">
                      <Users className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Table {table.number}</h3>
                      <p className="text-white/60 text-sm">Seats {table.capacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {table.requests.length > 0 && (
                      <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
                        <Bell className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-300 text-xs">{table.requests.length}</span>
                      </div>
                    )}
                    <button className="p-1 text-white/40 hover:text-white/70 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-1 ${getStatusColor(table.status)}`}>
                    {getStatusIcon(table.status)}
                    {table.status}
                  </span>
                  {table.currentBill > 0 && (
                    <div className="text-white font-semibold">₹{table.currentBill}</div>
                  )}
                </div>
              </div>

              {/* Table Details */}
              <div className="p-4">
                {table.status === "occupied" && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Customer:</span>
                      <span className="text-white text-sm font-medium">{table.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Party Size:</span>
                      <span className="text-white text-sm font-medium">{table.partySize}/{table.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Since:</span>
                      <span className="text-white text-sm font-medium">{table.occupiedSince}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Waiter:</span>
                      <span className="text-white text-sm font-medium">{table.waiter}</span>
                    </div>
                  </div>
                )}

                {table.status === "reserved" && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Reserved for:</span>
                      <span className="text-white text-sm font-medium">{table.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Party Size:</span>
                      <span className="text-white text-sm font-medium">{table.partySize}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Time:</span>
                      <span className="text-white text-sm font-medium">{table.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Waiter:</span>
                      <span className="text-white text-sm font-medium">{table.waiter}</span>
                    </div>
                  </div>
                )}

                {table.status === "cleaning" && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Cleaning by:</span>
                      <span className="text-white text-sm font-medium">{table.waiter}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Est. completion:</span>
                      <span className="text-white text-sm font-medium">{table.estimatedTime}</span>
                    </div>
                  </div>
                )}

                {table.status === "available" && (
                  <div className="text-center py-6">
                    <div className="text-green-400 mb-2">
                      <CheckCircle className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-white/60 text-sm">Ready for customers</p>
                  </div>
                )}

                {/* Special Requests */}
                {table.requests.length > 0 && (
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-orange-300 text-sm font-medium">Customer Requests:</p>
                        <ul className="text-orange-200 text-sm mt-1">
                          {table.requests.map((request, i) => (
                            <li key={i}>• {request}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {table.status === "available" && (
                    <button className="flex-1 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                      <UserPlus className="w-4 h-4" />
                      Seat
                    </button>
                  )}
                  
                  {table.status === "occupied" && (
                    <button className="flex-1 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-sm">
                      <UserX className="w-4 h-4" />
                      Check Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTables.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No tables found</h3>
            <p className="text-white/60 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTablesPage;