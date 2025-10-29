'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Coins, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useQRScanStore } from '@/store/qrScanStore';
import { useCartStore } from '@/store/cartStore';

const TopNavbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { branch, table, hotel } = useQRScanStore();
  const { cart, initializeCart } = useCartStore();
  const pathname = usePathname();

  // Check if current page is home screen
  const isHomeScreen = pathname === '/' || pathname === '/home';

  // Scroll state for premium navbar effect
  const [scrolled, setScrolled] = useState(false);

  // Calculate total cart items
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Initialize cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      initializeCart();
    }
  }, [isAuthenticated, initializeCart]);

  // Handle scroll effect for premium navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-xl mx-auto  fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg ' 
          : 'bg-transparent'
      }`}
    >
      <div className="py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Side - Location Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-2 rounded-xl transition-all duration-300 ${
                scrolled 
                  ? 'bg-orange-50 shadow-sm' 
                  : isHomeScreen
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                    : 'bg-orange-50 shadow-sm'
              }`}
            >
              <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-colors duration-300 ${
                scrolled 
                  ? 'text-orange-600' 
                  : isHomeScreen
                    ? 'text-orange-600'
                    : 'text-orange-600'
              }`} />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs sm:text-sm font-semibold truncate transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-900' 
                  : isHomeScreen 
                    ? 'text-gray-100' 
                    : 'text-gray-900'
              }`}>
                {branch?.name || 'Select Branch'}
              </span>
              <span className={`text-xs truncate transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-800' 
                  : isHomeScreen 
                    ? 'text-gray-200' 
                    : 'text-gray-700'
              }`}>
                Table {table?.tableNumber || 'N/A'}
              </span>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Coins Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/coins" 
                className={`relative p-2.5 sm:p-3 rounded-2xl transition-all duration-300 touch-manipulation group ${
                  scrolled 
                    ? 'text-gray-600 hover:text-theme-primary' 
                    : isHomeScreen
                      ? 'text-gray-100 hover:text-theme-secondary'
                      : 'text-gray-600 hover:text-theme-primary'
                }`}
                title="Coins"
              >
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
              </Link>
            </motion.div>

            {/* Cart Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/cart" 
                className={`relative p-2.5 sm:p-3 rounded-2xl transition-all duration-300 touch-manipulation group ${
                  scrolled 
                    ? 'text-gray-600 hover:text-theme-primary' 
                    : isHomeScreen
                      ? 'text-gray-100 hover:text-theme-secondary'
                      : 'text-gray-600 hover:text-theme-primary'
                }`}
                title="Cart"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-11 -right-1 bg-theme-secondary text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-pulse"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* User Profile Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/profile" 
                className={`relative p-2.5 sm:p-3 rounded-2xl transition-all duration-300 touch-manipulation group ${
                  scrolled 
                    ? 'text-gray-600 hover:text-theme-primary' 
                    : isHomeScreen
                      ? 'text-gray-100 hover:text-theme-secondary'
                      : 'text-gray-600 hover:text-theme-primary'
                }`}
                title="Profile"
              >
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name || 'User'}
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl object-cover ring-2 ring-white/30 transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <User className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
                )}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavbar;