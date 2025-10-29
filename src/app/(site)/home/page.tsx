"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Categories from "@/components/home/Categories";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import Bestsellers from "@/components/home/Bestsellers";
import OurMenu from "@/components/home/OurMenu";
import BottomNavigation from "@/components/BottomNavigation";
import UserAvatar from "@/components/UserAvatar";
import CartModal from "@/components/CartModal";
import { useAuthStore } from "@/store/authStore";
import { useQRScanStore } from "@/store/qrScanStore";
import { useCartStore } from "@/store/cartStore";

export default function FoodDeliveryApp() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const {
    isAuthenticated: qrAuthenticated,
    hotel,
    branch,
    table,
    scanData,
    clearScanData,
  } = useQRScanStore();

  // Cart store - initialize cart data only once
  const { setHotelAndBranch, setCartVisible, initializeCart } = useCartStore();

  const [showQRInfo, setShowQRInfo] = useState(false);

  // Initialize cart store with hotel/branch IDs and fetch cart data only once
  useEffect(() => {
    const initializeCartData = async () => {
      const hotelId = "68d13a52c10d4ebc29bfe787";
      const branchId = "68d13a9dc10d4ebc29bfe78f";

      // Set hotel and branch IDs
      setHotelAndBranch(hotelId, branchId);

      // Initialize cart data (will only fetch if not already loaded)
      await initializeCart();
    };

    initializeCartData();
  }, [setHotelAndBranch, initializeCart]);

  // Check authentication and QR scan status on page load
  useEffect(() => {
    // Show QR info banner if QR scan data is available
    if (qrAuthenticated && hotel && table) {
      setShowQRInfo(true);
      // Auto-hide the banner after 5 seconds
      const timer = setTimeout(() => {
        setShowQRInfo(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, qrAuthenticated, hotel, table, router]);

  const handleAvatarClick = () => {
    router.push("/profile");
  };

  const handleCloseQRInfo = () => {
    setShowQRInfo(false);
  };

  const handleClearQRData = () => {
    clearScanData();
    setShowQRInfo(false);
  };

  // Removed external category filtering logic to prevent race conditions
  // Categories and OurMenu components now handle filtering independently

  return (
    <div className="min-h-screen pb-24">
      {/* Premium Hero Section */}
      <div className="bg-theme-gradient-secondary relative overflow-hidden rounded-b-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
        </div>

        {/* QR Banner Integration */}
        {showQRInfo && qrAuthenticated && hotel && table && (
          <div className="relative z-10 bg-green-500/20 backdrop-blur-sm border-b border-white/20 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    Welcome to {hotel.name}
                  </p>
                  <p className="text-xs text-white/80">
                    {branch?.name} • Table {table.tableNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearQRData}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors text-white"
                >
                  Reset
                </button>
                <button
                  onClick={handleCloseQRInfo}
                  className="text-white hover:text-white/70 transition-colors p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Hero Content */}
        <div className="relative z-10 px-6  pb-5 pt-18">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4">
              <span className="text-white/90 text-[10px] font-medium">
                TableTop
              </span>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2 leading-tight">
              What are you
              <br />
              <span className="text-indigo-300  text-3xl">Craving today?</span>
            </h1>
            <p className="text-white/80 text-sm max-w-sm mx-auto">
              Discover delicious meals crafted with love, delivered fresh to
              your table
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for dishes, cuisines..."
                  className="flex-1 text-gray-100 placeholder-gray-100 bg-transparent focus:outline-none"
                />
                <button className="btn-theme-secondary p-2 rounded-xl">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Premium Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Offers Card */}
            <div className="bg-gradient-to-br from-blue-600/40 to-indigo-600/40 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">🎁</span>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">New</span>
                </div>
                <p className="text-white font-bold text-sm leading-tight">5 Offers</p>
                <p className="text-blue-100 text-xs opacity-90">Available</p>
              </div>
            </div>

            {/* Coins Card */}
            <div className="bg-gradient-to-br from-blue-600/40 to-indigo-600/40 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-3 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">🪙</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                    <span className="text-xs text-indigo-100">+50</span>
                  </div>
                </div>
                <p className="text-white font-bold text-sm leading-tight">1,250</p>
                <p className="text-indigo-100 text-xs opacity-90">Coins</p>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="bg-gradient-to-br from-blue-600/40 to-indigo-600/40 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-3 relative overflow-hidden">
              <div className="absolute top-1 left-1 w-3 h-3 bg-white/20 rotate-45"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/10 rounded-tl-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">⭐</span>
                  <div className="flex items-center space-x-0.5">
                    <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-baseline space-x-1">
                  <p className="text-white font-bold text-sm leading-tight">4.8</p>
                  <span className="text-xs text-blue-100 opacity-75">/5</span>
                </div>
                <p className="text-blue-100 text-xs opacity-90">2.4k Reviews</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
         

          {/* Quick Actions */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/menu")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🍽️</div>
                <p className="text-white font-medium text-sm">Browse Menu</p>
                <p className="text-white/70 text-xs">Explore all dishes</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/offers")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-white font-medium text-sm">Today's Offers</p>
                <p className="text-white/70 text-xs">Save more money</p>
              </div>
            </button>
          </div> */}
        </div>
      </div>

      <Categories />

      {/* Other Components */}
      <PromotionalBanner />
      <Bestsellers />
      <OurMenu />
      <BottomNavigation />

      {/* Global Cart Modal - Single instance to avoid duplicate renders */}
      <CartModal onClose={() => setCartVisible(false)} />
    </div>
  );
}
