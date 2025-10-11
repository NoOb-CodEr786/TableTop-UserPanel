'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Coins, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useQRScanStore } from '@/store/qrScanStore';
import { useCartStore } from '@/store/cartStore';

const TopNavbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { branch, table, hotel } = useQRScanStore();
  const { cart, initializeCart } = useCartStore();

  // Calculate total cart items
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Initialize cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      initializeCart();
    }
  }, [isAuthenticated, initializeCart]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-full mx-auto py-1 px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Side - Location Info */}
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {branch?.name || 'Select Branch'}
              </span>
              <span className="text-xs text-gray-500 truncate">
                Table {table?.tableNumber || 'N/A'}
              </span>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Coins Button */}
            <Link 
              href="/coins" 
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors duration-200 touch-manipulation"
              title="Coins"
            >
              <Coins className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            {/* Cart Button */}
            <Link 
              href="/cart" 
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors duration-200 touch-manipulation"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Button */}
            <Link 
              href="/profile" 
              className="flex items-center m-1 border p-0.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors duration-200 touch-manipulation"
              title="Profile"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name || 'User'}
                  className=" h-7 w-7 sm:h-6 sm:w-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;