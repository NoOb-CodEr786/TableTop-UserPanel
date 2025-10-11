"use client";

import React, { useState } from "react";
import {
  Home,
  Menu,
  BadgePercent,
  ShoppingCart,
  Filter,
  X,
  Star,
  Award,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCartStore();
  const cartCount = cartItems.length;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "home":
        router.push("/home");
        break;
      case "menu":
        router.push("/menu");
        break;
      case "offers":
        router.push("/offers");
        break;
      case "orders":
        router.push("/orders");
        break;
      case "filter":
        setIsFilterModalOpen(true);
        break;
      default:
        router.push("/home");
    }
  };

  const handleFilterSelect = (filterType: string) => {
    console.log("Filter selected:", filterType);
    // Here you can implement the actual filtering logic
    // For example, navigate to menu with filter parameters
    // router.push(`/menu?filter=${filterType}`);
    setIsFilterModalOpen(false);
  };

  const getActiveTab = () => {
    if (pathname.includes("/home")) return "home";
    if (pathname.includes("/menu")) return "menu";
    if (pathname.includes("/offers")) return "offers";
    if (pathname.includes("/orders")) return "orders";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative">
        {/* Curved background */}
        <svg
          className="w-full h-20"
          viewBox="0 0 375 80"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 0 H130 Q140 0 150 10 L160 20 Q170 30 187.5 30 Q205 30 215 20 L225 10 Q235 0 245 0 H375 V80 H0 V0 Z"
            fill="#1E1A1A"
          />
        </svg>

        {/* Floating Center Button (Filter) */}
        <button
          onClick={() => handleTabChange("filter")}
          className="absolute left-1/2 -translate-x-1/2 -top-10 w-15 h-15 bg-[#1E1A1A] rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200"
        >
          <Filter className="w-7 h-7 text-white" />
        </button>

        {/* Navigation Items */}
        <div className="absolute inset-0 flex items-end justify-between px-8 pb-4">
          {/* Home */}
          <button
            onClick={() => handleTabChange("home")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "home" ? "text-white" : "text-[#9B8E8E]"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => handleTabChange("menu")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "menu" ? "text-white" : "text-[#9B8E8E]"
            }`}
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>

          {/* Offers */}
          <button
            onClick={() => handleTabChange("offers")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              activeTab === "offers" ? "text-white" : "text-[#9B8E8E]"
            }`}
          >
            <BadgePercent className="w-6 h-6" />
            <span className="text-xs font-medium">Offers</span>
          </button>

          {/* Orders */}
          <div className="relative">
            <button
              onClick={() => handleTabChange("orders")}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                activeTab === "orders" ? "text-white" : "text-[#9B8E8E]"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-medium">Orders</span>
            </button>

            {/* Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-40 flex items-end justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsFilterModalOpen(false)}
            />

            {/* Modal Content - Positioned above navigation */}
            <div className="relative bg-[#1E1A1A]/95 backdrop-blur-md rounded-2xl w-full max-w-xs mx-4 p-4 mb-34 transform transition-transform duration-300 ease-out max-h-[40vh] flex flex-col">
              <style jsx>{`
                @keyframes slideUp {
                  from {
                    transform: translateY(100%);
                    opacity: 0;
                  }
                  to {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }
                .animate-slide-up {
                  animation: slideUp 0.3s ease-out;
                }
              `}</style>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-100">Filters</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Filter Options - Scrollable */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="space-y-1 pr-1">
                  <button
                    onClick={() => handleFilterSelect("top-ratings")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Top Ratings
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      24
                    </span>
                  </button>

                  <button
                    onClick={() => handleFilterSelect("recommended")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Recommended
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      18
                    </span>
                  </button>

                  <button
                    onClick={() => handleFilterSelect("bestseller")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Bestseller
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      12
                    </span>
                  </button>

                  <button
                    onClick={() => handleFilterSelect("quick-bites")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Quick Bites
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      36
                    </span>
                  </button>

                  <button
                    onClick={() => handleFilterSelect("veg-only")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Veg Only
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      42
                    </span>
                  </button>

                  <button
                    onClick={() => handleFilterSelect("non-veg")}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-100 text-sm">
                        Non-Veg
                      </h4>
                    </div>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                      28
                    </span>
                  </button>
                </div>
              </div>

              {/* Clear Filters Button - Fixed at bottom */}
              <div className="flex-shrink-0 mt-4">
                <button
                  onClick={() => handleFilterSelect("clear-all")}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-gray-100 text-sm transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
