"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useQRScanStore } from '@/store/qrScanStore';
import { qrScanAPI } from '@/api/qrScan.api';

export default function QRScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated: userAuthenticated, accessToken } = useAuthStore();
  const { 
    setScanResult, 
    setLoading, 
    setError: setScanError, 
    clearScanData,
    setCurrentScanParams 
  } = useQRScanStore();

  useEffect(() => {
    const processQRScan = async () => {
      try {
        // Get QR scan parameters from URL
        const hotelId = searchParams.get('hotelId');
        const branchId = searchParams.get('branchId');
        const tableNo = searchParams.get('tableNo');

        // Validate required parameters
        if (!hotelId || !branchId || !tableNo) {
          setError('Invalid QR code: Missing required parameters');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
          return;
        }

        // Store current scan parameters
        setCurrentScanParams({ hotelId, branchId, tableNo });
        setLoading(true);

        // Check if user has access token
        if (!accessToken) {
          // No access token, redirect to sign in
          clearScanData();
          router.push('/auth/signin');
          return;
        }

        // Call the scan API
        const response = await qrScanAPI.scanQR({
          hotelId,
          branchId,
          tableNo,
        });

        if (response.success && response.data.authenticated) {
          // User is authenticated, store scan data and redirect to home
          setScanResult(response.data);
          router.push('/(site)/home');
        } else {
          // Authentication failed, clear data and redirect to sign in
          clearScanData();
          setScanError('Authentication failed. Please sign in to continue.');
          router.push('/auth/signin');
        }

      } catch (error: any) {
        console.error('QR Scan error:', error);
        
        // Handle different error scenarios
        if (error.response?.status === 401) {
          // Unauthorized - redirect to sign in
          clearScanData();
          setScanError('Session expired. Please sign in again.');
          router.push('/auth/signin');
        } else {
          // Other errors
          const errorMessage = error.response?.data?.message || 'Failed to process QR scan';
          setError(errorMessage);
          setScanError(errorMessage);
          
          // Redirect to sign in after showing error
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        }
      } finally {
        setIsProcessing(false);
        setLoading(false);
      }
    };

    processQRScan();
  }, [searchParams, accessToken, router, setScanResult, setLoading, setScanError, clearScanData, setCurrentScanParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processing QR Code...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your access
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            QR Scan Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  // This should not normally be reached due to redirects
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Redirecting...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}