"use client";

import React, { useEffect, useState } from "react";
import { 
  Coins, 
  Gift, 
  Star, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Plus,
  Calculator,
  CreditCard,
  Smartphone,
  Award,
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar
} from "lucide-react";
import { useCoinStore } from "@/store/coinStore";
import { useQRScanStore } from "@/store/qrScanStore";
import { useAuthStore } from "@/store/authStore";

export default function CoinsPage() {
  const { isAuthenticated } = useAuthStore();
  const { hotel, branch } = useQRScanStore();
  const {
    balance,
    history,
    hotelCoinInfo,
    expiringCoins,
    potentialEarnings,
    maxUsableCoins,
    discountCalculation,
    isLoading,
    isBalanceLoading,
    isHistoryLoading,
    isCalculatingEarnings,
    isCalculatingMaxUsable,
    isCalculatingDiscount,
    error,
    calculationError,
    fetchCoinBalance,
    fetchCoinDetails, 
    fetchHotelCoinInfo,
    fetchExpiringCoins,
    calculatePotentialEarnings,
    calculateMaxUsableCoins,
    calculateDiscount,
    clearCalculations,
    clearErrors
  } = useCoinStore();

  // Calculator states
  const [calculatorTab, setCalculatorTab] = useState<'earnings' | 'usable' | 'discount'>('earnings');
  const [orderValue, setOrderValue] = useState<string>('');
  const [coinsToUse, setCoinsToUse] = useState<string>('');

  // Default hotel and branch IDs (fallback values)
  const defaultHotelId = "68d13a52c10d4ebc29bfe787";
  const defaultBranchId = "68d13a9dc10d4ebc29bfe78f";

  // Get hotel and branch IDs with fallback
  const currentHotelId = hotel?.id || defaultHotelId;
  const currentBranchId = branch?.id || defaultBranchId;

  // Initialize data
  useEffect(() => {
    if (isAuthenticated) {
      fetchCoinDetails();
      fetchExpiringCoins();
      
      // Always fetch hotel coin info with fallback ID
      fetchHotelCoinInfo(currentHotelId);
    }
  }, [isAuthenticated, currentHotelId]);

  // Handle calculations with better validation
  const handleCalculateEarnings = () => {
    const orderVal = parseFloat(orderValue);
    if (!orderValue || isNaN(orderVal) || orderVal <= 0) {
      alert('Please enter a valid order value');
      return;
    }
    
    console.log('Calculating earnings with:', {
      orderValue: orderVal,
      hotelId: currentHotelId,
      branchId: currentBranchId
    });
    
    calculatePotentialEarnings(orderVal, currentHotelId, currentBranchId);
  };

  const handleCalculateMaxUsable = () => {
    const orderVal = parseFloat(orderValue);
    if (!orderValue || isNaN(orderVal) || orderVal <= 0) {
      alert('Please enter a valid order value');
      return;
    }
    
    console.log('Calculating max usable with:', {
      orderValue: orderVal,
      hotelId: currentHotelId,
      branchId: currentBranchId
    });
    
    calculateMaxUsableCoins(orderVal, currentHotelId, currentBranchId);
  };

  const handleCalculateDiscount = () => {
    const orderVal = parseFloat(orderValue);
    const coinsVal = parseInt(coinsToUse);
    
    if (!orderValue || isNaN(orderVal) || orderVal <= 0) {
      alert('Please enter a valid order value');
      return;
    }
    
    if (!coinsToUse || isNaN(coinsVal) || coinsVal <= 0) {
      alert('Please enter valid coins to use');
      return;
    }
    
    if (coinsVal > (balance?.currentBalance || 0)) {
      alert('You cannot use more coins than your current balance');
      return;
    }
    
    console.log('Calculating discount with:', {
      orderValue: orderVal,
      coinsToUse: coinsVal,
      hotelId: currentHotelId,
      branchId: currentBranchId
    });
    
    calculateDiscount({
      orderValue: orderVal,
      coinsToUse: coinsVal,
      hotelId: currentHotelId,
      branchId: currentBranchId
    });
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Format coin type for display
  const formatCoinType = (type: string) => {
    switch(type) {
      case 'earned': return { text: 'Earned', color: 'text-green-600', bg: 'bg-green-100' };
      case 'used': return { text: 'Used', color: 'text-red-600', bg: 'bg-red-100' };
      case 'expired': return { text: 'Expired', color: 'text-blue-600', bg: 'bg-blue-100' };
      default: return { text: type, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your coins</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Coins</h1>
          <p className="text-gray-600">Earn coins and redeem amazing rewards</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Coins Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
          {isBalanceLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                <div className="flex items-center space-x-2">
                  <Coins className="h-8 w-8" />
                  <span className="text-3xl font-bold">{balance?.currentBalance || 0}</span>
                  <span className="text-lg">Coins</span>
                </div>
                <p className="text-blue-100 text-xs mt-2">
                  Total Earned: {balance?.totalEarned || 0} | Total Used: {balance?.totalUsed || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Worth</p>
                <p className="text-xl font-semibold">
                  ₹{hotelCoinInfo ? (balance?.currentBalance || 0) * hotelCoinInfo.coinValue : 'Loading...'}
                </p>
                {hotelCoinInfo && (
                  <p className="text-blue-100 text-xs">1 coin = ₹{hotelCoinInfo.coinValue}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expiring Coins Alert */}
        {expiringCoins && expiringCoins.totalExpiringAmount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-amber-800 font-medium">
                  {expiringCoins.totalExpiringAmount} coins expiring soon!
                </p>
                <p className="text-amber-600 text-sm">
                  Use them within the next {expiringCoins.daysAhead} days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Coin Calculator */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Coin Calculator</h2>
          
          {/* Current Location Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Calculation Context</span>
            </div>
            <div className="text-sm text-blue-700">
              <p><span className="font-medium">Hotel:</span> {hotel?.name || 'Default Hotel'}</p>
              <p><span className="font-medium">Branch:</span> {branch?.name || 'Default Branch'}</p>
              <p><span className="font-medium">Table:</span> {branch?.name ? `Table ${branch.name}` : 'Not scanned'}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Calculator Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCalculatorTab('earnings')}
                className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors ${
                  calculatorTab === 'earnings'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Potential Earnings
              </button>
              <button
                onClick={() => setCalculatorTab('usable')}
                className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors ${
                  calculatorTab === 'usable'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Max Usable
              </button>
              <button
                onClick={() => setCalculatorTab('discount')}
                className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors ${
                  calculatorTab === 'discount'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Discount Calculator
              </button>
            </div>

            {/* Calculator Content */}
            <div className="space-y-4">
              {/* Order Value Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Value (₹)
                </label>
                <input
                  type="number"
                  value={orderValue}
                  onChange={(e) => setOrderValue(e.target.value)}
                  placeholder="Enter order value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Coins to Use Input (only for discount calculator) */}
              {calculatorTab === 'discount' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coins to Use
                  </label>
                  <input
                    type="number"
                    value={coinsToUse}
                    onChange={(e) => setCoinsToUse(e.target.value)}
                    placeholder="Enter coins to use"
                    max={balance?.currentBalance || 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {balance?.currentBalance || 0} coins
                  </p>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={() => {
                  clearCalculations();
                  clearErrors();
                  if (calculatorTab === 'earnings') handleCalculateEarnings();
                  else if (calculatorTab === 'usable') handleCalculateMaxUsable();
                  else if (calculatorTab === 'discount') handleCalculateDiscount();
                }}
                disabled={
                  isCalculatingEarnings || 
                  isCalculatingMaxUsable || 
                  isCalculatingDiscount
                }
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {(isCalculatingEarnings || isCalculatingMaxUsable || isCalculatingDiscount) ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Calculator className="h-5 w-5" />
                )}
                <span>
                  {calculatorTab === 'earnings' && 'Calculate Earnings'}
                  {calculatorTab === 'usable' && 'Calculate Max Usable'}
                  {calculatorTab === 'discount' && 'Calculate Discount'}
                </span>
              </button>

              {/* Requirements Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 text-sm mb-2">Requirements:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${orderValue ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Order Value: {orderValue || 'Not entered'}</span>
                  </li>
                  {calculatorTab === 'discount' && (
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${coinsToUse ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>Coins to Use: {coinsToUse || 'Not entered'}</span>
                    </li>
                  )}
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Hotel ID: {currentHotelId}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Branch ID: {currentBranchId}</span>
                  </li>
                </ul>
              </div>

              {/* Calculation Error */}
              {calculationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{calculationError}</p>
                </div>
              )}

              {/* Results */}
              {calculatorTab === 'earnings' && potentialEarnings && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Potential Earnings Results</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Order Value:</span>
                      <span className="font-medium text-green-800">₹{potentialEarnings.orderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Coins Earned:</span>
                      <span className="font-medium text-green-800">{potentialEarnings.coinsEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Coin Worth:</span>
                      <span className="font-medium text-green-800">₹{potentialEarnings.coinsEarned * potentialEarnings.coinValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Earning Rate:</span>
                      <span className="font-medium text-green-800">{potentialEarnings.coinsPerRupee}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Min Order Required:</span>
                      <span className="font-medium text-green-800">₹{potentialEarnings.minimumOrderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Max Coins/Order:</span>
                      <span className="font-medium text-green-800">{potentialEarnings.maxCoinsPerOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Eligible:</span>
                      <span className={`font-medium ${potentialEarnings.eligible ? 'text-green-800' : 'text-red-600'}`}>
                        {potentialEarnings.eligible ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Coin Expiry:</span>
                      <span className="font-medium text-green-800">{potentialEarnings.coinExpiry}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-600">
                      Location: {potentialEarnings.context.location}
                    </p>
                  </div>
                </div>
              )}

              {calculatorTab === 'usable' && maxUsableCoins && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Maximum Usable Coins Results</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Order Value:</span>
                      <span className="font-medium text-blue-800">₹{maxUsableCoins.orderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Your Coin Balance:</span>
                      <span className="font-medium text-blue-800">{maxUsableCoins.userCoinBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Max Coins Usable:</span>
                      <span className="font-medium text-blue-800">{maxUsableCoins.maxCoinsUsable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">System Max Coins:</span>
                      <span className="font-medium text-blue-800">{maxUsableCoins.systemMaxCoins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Max Discount:</span>
                      <span className="font-medium text-blue-800">₹{maxUsableCoins.maxDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Coin Value:</span>
                      <span className="font-medium text-blue-800">₹{maxUsableCoins.coinValue} per coin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Usage Limit:</span>
                      <span className="font-medium text-blue-800">{maxUsableCoins.maxUsagePercent}% of order value</span>
                    </div>
                  </div>
                </div>
              )}

              {calculatorTab === 'discount' && discountCalculation && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Discount Calculation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Coins Used:</span>
                      <span className="font-medium text-purple-800">{discountCalculation.coinsToUse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Discount:</span>
                      <span className="font-medium text-purple-800">₹{discountCalculation.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Final Order Value:</span>
                      <span className="font-medium text-purple-800">₹{discountCalculation.finalOrderValue}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hotel Coin Rules */}
        {hotelCoinInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Coin System Rules</h2>
            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Earning</h3>
                    <p className="text-sm text-gray-600">{hotelCoinInfo.rules.earning}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Gift className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Usage</h3>
                    <p className="text-sm text-gray-600">{hotelCoinInfo.rules.usage}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Value</h3>
                    <p className="text-sm text-gray-600">{hotelCoinInfo.rules.value}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expiry</h3>
                    <p className="text-sm text-gray-600">{hotelCoinInfo.rules.expiry}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">₹{hotelCoinInfo.minimumOrderValue}</p>
                    <p className="text-xs text-blue-700">Min Order</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{hotelCoinInfo.maxCoinsPerOrder}</p>
                    <p className="text-xs text-blue-700">Max Coins/Order</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{hotelCoinInfo.maxCoinUsagePercent}%</p>
                    <p className="text-xs text-blue-700">Max Usage</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{hotelCoinInfo.coinExpiryDays}</p>
                    <p className="text-xs text-blue-700">Days to Expire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="mb-6 pb-25">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
          <div className="bg-white rounded-xl border border-gray-200">
            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : history && history.docs.length > 0 ? (
              <>
                {history.docs.map((transaction, index) => {
                  const { date, time } = formatDate(transaction.createdAt);
                  const typeFormat = formatCoinType(transaction.type);
                  
                  return (
                    <div
                      key={transaction._id}
                      className={`p-4 flex items-center justify-between ${
                        index !== history.docs.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${typeFormat.bg} ${typeFormat.color}`}>
                          <Coins className="h-4 w-4" />
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{date}</span>
                            <span>•</span>
                            <span>{time}</span>
                            <span>•</span>
                            <span className={`font-medium ${typeFormat.color}`}>
                              {typeFormat.text}
                            </span>
                          </div>
                          {transaction.order && (
                            <p className="text-xs text-gray-400 mt-1">
                              Order #...{transaction.order._id.slice(-8)} - ₹{transaction.order.totalPrice}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span
                          className={`font-bold ${
                            transaction.type === 'earned' ? 'text-green-600' : 
                            transaction.type === 'used' ? 'text-red-600' : 'text-blue-600'
                          }`}
                        >
                          {transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.amount)}
                        </span>
                        <p className="text-xs text-gray-500">coins</p>
                        <p className="text-xs text-gray-400">Balance: {transaction.balanceAfter}</p>
                      </div>
                    </div>
                  );
                })}
                
                {/* Pagination Info */}
                {history.totalPages > 1 && (
                  <div className="p-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Page {history.page} of {history.totalPages} • {history.totalDocs} total transactions
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <Coins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transaction history yet</p>
                <p className="text-sm text-gray-400">Start earning coins by placing orders!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}