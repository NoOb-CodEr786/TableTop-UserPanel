"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useQRScanStore } from '@/store/qrScanStore';
import { useAuthStore } from '@/store/authStore';

interface QRScanContextType {
  isQRAuthenticated: boolean;
  qrScanData: any;
  clearQRData: () => void;
}

const QRScanContext = createContext<QRScanContextType | null>(null);

export const useQRScan = () => {
  const context = useContext(QRScanContext);
  if (!context) {
    throw new Error('useQRScan must be used within a QRScanProvider');
  }
  return context;
};

interface QRScanProviderProps {
  children: React.ReactNode;
}

export const QRScanProvider: React.FC<QRScanProviderProps> = ({ children }) => {
  const { 
    isAuthenticated: qrAuthenticated, 
    scanData, 
    clearScanData,
    hotel,
    branch,
    table,
    user: qrUser
  } = useQRScanStore();
  
  const { isAuthenticated: authAuthenticated } = useAuthStore();

  // Clean up QR scan data if user logs out
  useEffect(() => {
    if (!authAuthenticated && qrAuthenticated) {
      clearScanData();
    }
  }, [authAuthenticated, qrAuthenticated, clearScanData]);

  const contextValue: QRScanContextType = {
    isQRAuthenticated: qrAuthenticated && authAuthenticated,
    qrScanData: {
      scanData,
      hotel,
      branch,
      table,
      user: qrUser
    },
    clearQRData: clearScanData,
  };

  return (
    <QRScanContext.Provider value={contextValue}>
      {children}
    </QRScanContext.Provider>
  );
};