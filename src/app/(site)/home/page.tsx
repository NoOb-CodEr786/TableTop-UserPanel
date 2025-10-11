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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* QR Scan Info Banner */}
      {showQRInfo && qrAuthenticated && hotel && table && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🍽️</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Welcome to {hotel.name}</p>
                <p className="text-xs opacity-90">
                  {branch?.name} • Table {table.tableNumber} • Capacity:{" "}
                  {table.capacity}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearQRData}
                className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleCloseQRInfo}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
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
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif italic text-gray-400 mb-1">
              Hungry?
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Explore Our
            </h2>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Curated Menu
            </h2>
          </div>
          <UserAvatar
            size="lg"
            onClick={handleAvatarClick}
            fallbackEmoji="😎"
          />
        </div>

        {/* Image divider */}
        <div className="relative h-8 mt-6">
          <img
            src="/images/Vector1.png"
            alt="Divider"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {/* Components */}
      <Categories />
      <PromotionalBanner />
      <Bestsellers />
      <OurMenu />
      <BottomNavigation />
      
      {/* Global Cart Modal - Single instance to avoid duplicate renders */}
      <CartModal onClose={() => setCartVisible(false)} />
    </div>
  );
}
