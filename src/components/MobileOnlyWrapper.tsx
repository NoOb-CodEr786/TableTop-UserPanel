"use client";

import React, { useEffect, useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileOnlyWrapperProps {
  children: React.ReactNode;
}

export default function MobileOnlyWrapper({ children }: MobileOnlyWrapperProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      // Check if screen width is mobile/tablet (less than 1024px)
      const isMobileDevice = window.innerWidth < 1024;
      setIsMobile(isMobileDevice);
      setIsLoading(false);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Show loading state initially
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Smartphone className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show desktop restriction message
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-10 h-10 text-orange-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Mobile Experience Only
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            TableTop is designed for mobile devices to provide the best dining experience. 
            Please access our app using your smartphone or tablet.
          </p>
          
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Recommended</span>
              </div>
              <p className="text-sm text-orange-700">
                Scan the QR code at your table or visit on mobile
              </p>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Optimized for touch interactions</p>
              <p>• Better restaurant experience</p>
              <p>• Mobile-first design</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              TableTop - Mobile Dining Experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show mobile content
  return <>{children}</>;
}