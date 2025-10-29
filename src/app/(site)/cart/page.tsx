"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Tag,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Check,
  Coins as CoinsIcon,
  Gift,
  Info,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { usePaymentStore, CheckoutFormData } from "@/store/paymentStore";
import { useCoinStore } from "@/store/coinStore";
import { PaymentMethod } from "@/api/payment.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    cartSummary,
    isLoading,
    error,
    cartItems,
    hotelId,
    branchId,
    setHotelAndBranch,
    initializeCartPage,
    removeFromCart,
    updateCartItemQuantity,
  } = useCartStore();

  const { setHotelAndBranch: setPaymentHotelAndBranch, setCheckoutFormData } =
    usePaymentStore();

  // Coin store
  const {
    balance,
    maxUsableCoins,
    discountCalculation,
    hotelCoinInfo,
    isBalanceLoading,
    isCalculatingMaxUsable,
    isCalculatingDiscount,
    isHotelInfoLoading,
    fetchCoinBalance,
    calculateMaxUsableCoins,
    calculateDiscount,
    fetchHotelCoinInfo,
    clearCalculations,
  } = useCoinStore();

  // Local state to manage quantities in frontend only
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number;
  }>({});

  // Checkout form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [customerNote, setCustomerNote] = useState("");
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [coinsInputValue, setCoinsInputValue] = useState("");
  const [coinDiscount, setCoinDiscount] = useState(0);
  const [showCoinInfo, setShowCoinInfo] = useState(false);
  const [isCoinSectionExpanded, setIsCoinSectionExpanded] = useState(false);
  const [offerCode, setOfferCode] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  
  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  
  // Track which items are being updated
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  
  // Debounce timer for API calls
  const updateTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Dropdown state for payment method
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize cart page with optimized single API call
  useEffect(() => {
    const defaultHotelId = "68d13a52c10d4ebc29bfe787";
    const defaultBranchId = "68d13a9dc10d4ebc29bfe78f";

    // Set hotel and branch, then initialize cart page
    setHotelAndBranch(defaultHotelId, defaultBranchId);

    // Initialize cart page data (fetch once strategy)
    initializeCartPage();

    // Fetch coin balance and hotel coin info
    fetchCoinBalance();
    fetchHotelCoinInfo(defaultHotelId);
  }, [setHotelAndBranch, initializeCartPage, fetchCoinBalance, fetchHotelCoinInfo]);

  // Initialize local quantities when cart items change
  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity;
    });
    setLocalQuantities(initialQuantities);
  }, [cartItems]);

  // Check for applied coupon from coupons page
  useEffect(() => {
    const checkAppliedCoupon = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const appliedOfferCode = urlParams.get('appliedOffer');
      
      if (appliedOfferCode) {
        // Get coupon details from localStorage (set by coupons page)
        const couponData = localStorage.getItem('appliedCouponData');
        if (couponData) {
          const parsedCoupon = JSON.parse(couponData);
          setAppliedCoupon(parsedCoupon);
          setOfferCode(appliedOfferCode);
          
          // Calculate discount
          const subtotal = calculateSubtotalAmount();
          const discountAmount = calculateDiscountAmount(parsedCoupon, subtotal);
          setDiscount(discountAmount);
          
          // Clear URL params and localStorage
          window.history.replaceState({}, '', '/cart');
          localStorage.removeItem('appliedCouponData');
        }
      }
    };

    checkAppliedCoupon();
  }, [cartItems]);

  // Calculate max usable coins when cart subtotal changes
  useEffect(() => {
    if (cartItems.length > 0 && hotelId && branchId) {
      const subtotal = calculateSubtotalAmount();
      if (subtotal > 0) {
        calculateMaxUsableCoins(subtotal, hotelId, branchId);
      }
    }
  }, [cartItems, hotelId, branchId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      updateTimeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      updateTimeouts.current.clear();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to calculate subtotal
  const calculateSubtotalAmount = () => {
    return cartItems.reduce((sum, item) => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      return sum + item.price * currentQuantity;
    }, 0);
  };

  // Helper function to calculate discount
  const calculateDiscountAmount = (coupon: any, subtotal: number) => {
    if (!coupon) return 0;
    
    if (coupon.discountType === 'percent') {
      const discount = (subtotal * coupon.discountValue) / 100;
      return Math.min(discount, coupon.maxDiscountAmount);
    }
    return Math.min(coupon.discountValue, coupon.maxDiscountAmount);
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setOfferCode("");
    setDiscount(0);
  };

  // Handle coin input change with validation
  const handleCoinsInput = async (value: string) => {
    setCoinsInputValue(value);
    
    const coinsValue = parseInt(value);
    
    // Reset if empty or invalid
    if (!value || value === '' || isNaN(coinsValue) || coinsValue <= 0) {
      setCoinsToUse(0);
      setCoinDiscount(0);
      // Don't clear calculations, just reset the discount
      return;
    }
    
    // Validate against balance
    if (balance && coinsValue > balance.currentBalance) {
      alert(`You only have ${balance.currentBalance} coins available`);
      return;
    }
    
    // Validate against max usable
    if (maxUsableCoins && coinsValue > maxUsableCoins.maxCoinsUsable) {
      alert(`Maximum ${maxUsableCoins.maxCoinsUsable} coins can be used for this order`);
      return;
    }
    
    // Calculate discount
    const subtotal = calculateSubtotalAmount();
    if (subtotal > 0 && hotelId && branchId) {
      setCoinsToUse(coinsValue);
      await calculateDiscount({
        orderValue: subtotal,
        coinsToUse: coinsValue,
        hotelId,
        branchId
      });
    }
  };

  // Use maximum coins available
  const useMaxCoins = () => {
    if (maxUsableCoins) {
      const maxCoins = maxUsableCoins.maxCoinsUsable;
      setCoinsInputValue(maxCoins.toString());
      handleCoinsInput(maxCoins.toString());
    }
  };

  // Update coin discount when calculation completes
  useEffect(() => {
    if (discountCalculation) {
      setCoinDiscount(discountCalculation.discount);
    }
  }, [discountCalculation]);

  const removeItemHandler = (id: number) => {
    removeFromCart(id);
    
    // Reset coin inputs when cart changes
    setCoinsInputValue('');
    setCoinsToUse(0);
    setCoinDiscount(0);
  };

  // Payment method options
  const paymentOptions = [
    { value: "razorpay", label: "Razorpay", icon: "💳", description: "Secure Payment" },
    // { value: "upi", label: "UPI Payment", icon: "📱", description: "Google Pay, PhonePe" },
    // { value: "card", label: "Card Payment", icon: "💳", description: "Credit/Debit Card" },
    // { value: "wallet", label: "Digital Wallet", icon: "👛", description: "Paytm, Amazon Pay" },
    { value: "cash", label: "Cash Payment", icon: "💵", description: "Pay at counter" },
  ];

  const selectedPaymentOption = paymentOptions.find(option => option.value === paymentMethod);

  // API-based quantity handlers with debouncing for better performance
  const handleQuantityIncrease = async (itemId: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.originalId) {
      const newQuantity = getCurrentQuantity(itemId, item.quantity) + 1;
      
      // Update local state immediately for instant feedback
      setLocalQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
      
      // Add item to updating set
      setUpdatingItems(prev => new Set([...prev, itemId]));
      
      // Clear existing timeout for this item
      const existingTimeout = updateTimeouts.current.get(itemId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      // Set new timeout for API call (debounced)
      const timeout = setTimeout(async () => {
        try {
          await updateCartItemQuantity(item.originalId!, newQuantity);
          console.log(`Updated item ${item.originalId} quantity to ${newQuantity}`);
        } catch (error) {
          // Revert local state on error
          setLocalQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity - 1,
          }));
          console.error('Failed to update quantity:', error);
        } finally {
          // Remove item from updating set
          setUpdatingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
          updateTimeouts.current.delete(itemId);
        }
      }, 500); // 500ms delay
      
      updateTimeouts.current.set(itemId, timeout);
    }
  };

  const handleQuantityDecrease = async (itemId: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.originalId) {
      const currentQuantity = getCurrentQuantity(itemId, item.quantity);
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        
        // Update local state immediately for instant feedback
        setLocalQuantities((prev) => ({
          ...prev,
          [itemId]: newQuantity,
        }));
        
        // Add item to updating set
        setUpdatingItems(prev => new Set([...prev, itemId]));
        
        // Clear existing timeout for this item
        const existingTimeout = updateTimeouts.current.get(itemId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        // Set new timeout for API call (debounced)
        const timeout = setTimeout(async () => {
          try {
            await updateCartItemQuantity(item.originalId!, newQuantity);
            console.log(`Updated item ${item.originalId} quantity to ${newQuantity}`);
          } catch (error) {
            // Revert local state on error
            setLocalQuantities((prev) => ({
              ...prev,
              [itemId]: newQuantity + 1,
            }));
            console.error('Failed to update quantity:', error);
          } finally {
            // Remove item from updating set
            setUpdatingItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(itemId);
              return newSet;
            });
            updateTimeouts.current.delete(itemId);
          }
        }, 500); // 500ms delay
        
        updateTimeouts.current.set(itemId, timeout);
      }
    }
  };

  // Get the current quantity for display (local state or original)
  const getCurrentQuantity = (itemId: number, originalQuantity: number) => {
    return localQuantities[itemId] !== undefined
      ? localQuantities[itemId]
      : originalQuantity;
  };

  const handleCheckout = async () => {
    // Prevent multiple clicks
    if (isCheckoutProcessing) return;
    
    try {
      setIsCheckoutProcessing(true);
      setCheckoutError(null);

      // Since we're now updating quantities in real-time, no need for bulk updates
      // Just proceed directly to checkout preparation

      // Step 1: Prepare checkout form data
      const defaultTableId = "68e4ce5cec4c9891a66329b4"; // You can make this dynamic

      const checkoutFormData: CheckoutFormData = {
        tableId: defaultTableId,
        paymentMethod,
        customerNote,
        coinsToUse,
        offerCode,
      };

      // Step 2: Set payment store context and form data
      setPaymentHotelAndBranch(hotelId, branchId);
      setCheckoutFormData(checkoutFormData);

      // Step 3: Store data in localStorage for checkout page
      const checkoutPayload = {
        formData: checkoutFormData,
        hotelId,
        branchId,
        timestamp: Date.now(),
        source: "cart_checkout",
      };

      localStorage.setItem("pendingCheckout", JSON.stringify(checkoutPayload));

      // Step 4: Navigate to checkout page
      console.log("Navigating to checkout page with form data...");
      router.push("/checkout");
    } catch (error: any) {
      console.error("Failed to prepare checkout:", error);
      setCheckoutError("Failed to prepare checkout. Please try again.");
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  // Calculate totals based on local quantities
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      return sum + item.price * currentQuantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((sum, item) => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      return sum + currentQuantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const totalItems = calculateTotalItems();
  
  // Check if coin feature is available for this order
  const isCoinFeatureActive = hotelCoinInfo?.isActive || false;
  const meetsMinimumOrder = hotelCoinInfo ? subtotal >= hotelCoinInfo.minimumOrderValue : false;
  const canUseCoins = isCoinFeatureActive && meetsMinimumOrder && (balance?.currentBalance || 0) > 0;
  
  // Apply coupon discount first, then coin discount, then calculate GST
  const afterCouponDiscount = Math.max(0, subtotal - discount);
  const afterCoinDiscount = Math.max(0, afterCouponDiscount - coinDiscount);
  const gstAmount = (afterCoinDiscount * 18) / 100; // 18% GST on final discounted amount
  const total = afterCoinDiscount + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}

      {/* Loading State */}
      {isLoading && (
        <div className="px-4 py-6">
          {/* Cart Items Skeleton */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex gap-4">
                  {/* Image Skeleton */}
                  <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-full ml-3" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-16" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-6 h-6" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sheet Skeleton */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="w-full h-12 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Empty Cart State */}
      {!isLoading && !error && cartItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-theme-secondary-light to-theme-secondary rounded-full flex items-center border border-zinc-200 justify-center mb-6 shadow-lg">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Your cart is empty
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-sm leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our
            delicious menu and discover your favorites!
          </p>
          <Link href="/menu" className="w-full max-w-xs">
            <button className="w-full  border-2 border-gray-200 bg-gradient-to-r from-theme-secondary to-theme-secondary-dark hover:from-theme-secondary-dark hover:to-theme-secondary-darker text-black px-8 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              <span>Explore Menu</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
        </div>
      )}

      {/* Cart Items Section */}
      {!isLoading && cartItems.length > 0 && (
        <div className="px-4 py-4 space-y-4">
          {/* Cart Items */}

          {/* Savings Corner */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-gray-400 text-sm font-semibold mb-3 tracking-wider">
              SAVINGS CORNER
            </h3>
            <button 
              onClick={() => router.push('/coupons')}
              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Apply Coupon</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Coin Usage Section */}
          {isCoinFeatureActive && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow border border-indigo-200 overflow-hidden">
              {/* Collapsible Header - Always Visible */}
              <button
                onClick={() => setIsCoinSectionExpanded(!isCoinSectionExpanded)}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CoinsIcon className="w-6 h-6" />
                    <div className="text-left">
                      <h3 className="font-bold text-lg">Use Coins</h3>
                      {isBalanceLoading ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="text-xs text-indigo-100">Loading...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-indigo-100">
                          {balance?.currentBalance || 0} coins available
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!isBalanceLoading && maxUsableCoins && (
                      <div className="text-right">
                        <p className="text-xs text-indigo-100">Max Usable</p>
                        <p className="font-bold text-base">{maxUsableCoins.maxCoinsUsable} coins</p>
                      </div>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isCoinSectionExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Expandable Content */}
              {isCoinSectionExpanded && (
                <>
                  {/* Additional Info in Header Area */}
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 pb-4 text-white border-t border-indigo-400/30">
                    {!isBalanceLoading && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm text-indigo-100">Total Worth</p>
                            <p className="text-xl font-semibold">
                              ₹{hotelCoinInfo ? (balance?.currentBalance || 0) * hotelCoinInfo.coinValue : 0}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCoinInfo(!showCoinInfo);
                            }}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Earning Potential */}
                        {meetsMinimumOrder && hotelCoinInfo && (
                          <div className="pt-2 border-t border-indigo-400/30">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-indigo-100">Earn from this order:</span>
                              <span className="font-bold text-white">
                                +{Math.floor(subtotal * hotelCoinInfo.coinsPerRupee)} coins 
                                <span className="text-indigo-100 ml-1">(~₹{Math.floor(subtotal * hotelCoinInfo.coinsPerRupee * hotelCoinInfo.coinValue)})</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Coin System Rules Info */}
                  {showCoinInfo && hotelCoinInfo && (
                    <div className="bg-blue-50 border-b border-blue-200 p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-800 text-sm mb-2">Coin System Rules</h4>
                            <div className="space-y-2 text-xs text-blue-700">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                                <div>
                                  <span className="font-medium">Earning:</span> {hotelCoinInfo.rules.earning}
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Gift className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-600" />
                                <div>
                                  <span className="font-medium">Usage:</span> {hotelCoinInfo.rules.usage}
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CoinsIcon className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                                <div>
                                  <span className="font-medium">Value:</span> {hotelCoinInfo.rules.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Stats */}
                        {maxUsableCoins && (
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-[10px] text-blue-600 uppercase">Max Usable</p>
                              <p className="text-sm font-bold text-blue-800">{maxUsableCoins.maxCoinsUsable} coins</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-[10px] text-blue-600 uppercase">Max Discount</p>
                              <p className="text-sm font-bold text-blue-800">₹{maxUsableCoins.maxDiscount}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Minimum Order Warning */}
                  {!meetsMinimumOrder && hotelCoinInfo && (
                    <div className="bg-orange-50 border-b border-orange-200 p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-orange-800">
                          <p className="font-medium mb-1">Minimum order not met</p>
                          <p>Add ₹{(hotelCoinInfo.minimumOrderValue - subtotal).toFixed(2)} more to use coins (Min: ₹{hotelCoinInfo.minimumOrderValue})</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coin Input */}
                  <div className="p-4">
                    {isHotelInfoLoading || isCalculatingMaxUsable ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        <span className="ml-2 text-sm text-gray-600">
                          {isHotelInfoLoading ? 'Loading coin info...' : 'Calculating...'}
                        </span>
                      </div>
                    ) : !meetsMinimumOrder ? (
                      <div className="text-center py-4">
                        <CoinsIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Add more items to use coins
                        </p>
                        <p className="text-xs text-gray-500">
                          Minimum order: ₹{hotelCoinInfo?.minimumOrderValue || 0}
                        </p>
                        <Link href="/menu">
                          <button className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-100 px-3 py-1.5 rounded-md">
                            Browse Menu →
                          </button>
                        </Link>
                      </div>
                    ) : maxUsableCoins && maxUsableCoins.maxCoinsUsable > 0 ? (
                    <>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Coins to Use
                          </label>
                          <button
                            onClick={useMaxCoins}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 bg-indigo-100 rounded-md transition-colors"
                          >
                            Use Max ({maxUsableCoins.maxCoinsUsable})
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={coinsInputValue}
                            onChange={(e) => handleCoinsInput(e.target.value)}
                            placeholder="0"
                            min="0"
                            max={maxUsableCoins.maxCoinsUsable}
                            className="w-full px-4 py-3 pr-16 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500">
                            <CoinsIcon className="w-4 h-4" />
                            <span className="text-sm">coins</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Max usable: {maxUsableCoins.maxCoinsUsable} coins (₹{maxUsableCoins.maxDiscount} off)
                        </p>
                      </div>

                      {/* Discount Display */}
                      {isCalculatingDiscount ? (
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-600">Calculating discount...</span>
                        </div>
                      ) : coinDiscount > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gift className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  Coin Discount Applied!
                                </p>
                                <p className="text-xs text-green-600">
                                  Using {coinsToUse} coins
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-700">
                                -₹{coinDiscount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Coin Options */}
                      {maxUsableCoins.maxCoinsUsable >= 10 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 mb-2">Quick Select:</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[25, 50, 75, 100].map((percent) => {
                              const coins = Math.floor((maxUsableCoins.maxCoinsUsable * percent) / 100);
                              if (coins > 0) {
                                return (
                                  <button
                                    key={percent}
                                    onClick={() => {
                                      setCoinsInputValue(coins.toString());
                                      handleCoinsInput(coins.toString());
                                    }}
                                    className="px-2 py-1.5 bg-white border border-indigo-300 rounded-md text-xs font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                                  >
                                    {percent}%
                                    <br />
                                    <span className="text-[10px] text-gray-500">{coins}c</span>
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <CoinsIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {balance && balance.currentBalance === 0
                          ? "You don't have any coins yet"
                          : "Coins cannot be used for this order"}
                      </p>
                      <Link href="/coins">
                        <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                          Learn More →
                        </button>
                      </Link>
                    </div>
                  )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="bg-gray-50">
            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-b-0 pb-4 mb-4 last:mb-0"
                  >
                    <div className="flex gap-4">
                      {/* Food Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-23 h-23 rounded-lg object-cover"
                        />
                        {/* Veg/Non-veg indicator */}
                        <div
                          className={`absolute top-2 left-2 w-4 h-4 border-2 rounded-sm flex items-center justify-center bg-white ${
                            item.isVeg ? "border-green-600" : "border-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-sm ${
                              item.isVeg ? "bg-green-600" : "bg-red-600"
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 pr-2">
                            <h3 className="font-semibold mb-1 text-base">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeItemHandler(item.id)}
                            className="p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm">
                              ₹{item.price}
                            </span>
                            <span className={`text-gray-500 text-xs mt-1 transition-all duration-200 ${
                              updatingItems.has(item.id) ? 'opacity-50' : ''
                            }`}>
                              Total: ₹
                              {item.price *
                                getCurrentQuantity(item.id, item.quantity)}
                              {updatingItems.has(item.id) && (
                                <Loader2 className="w-3 h-3 animate-spin inline ml-1 text-blue-500" />
                              )}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className={`relative flex items-center gap-3 bg-gray-100 rounded-lg p-1 transition-all duration-300 ${
                            updatingItems.has(item.id) 
                              ? 'ring-2 ring-blue-200 bg-blue-50 shadow-md' 
                              : 'hover:bg-gray-200'
                          }`}>
                            {updatingItems.has(item.id) && (
                              <div className="absolute inset-0 bg-blue-100 rounded-lg animate-pulse opacity-30"></div>
                            )}
                            <button
                              onClick={() => handleQuantityDecrease(item.id)}
                              disabled={
                                getCurrentQuantity(item.id, item.quantity) <= 1 ||
                                updatingItems.has(item.id)
                              }
                              className="relative z-10 w-7 h-7 bg-white rounded-md flex items-center justify-center disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              {updatingItems.has(item.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </button>
                            <span className={`relative z-10 font-bold text-gray-900 min-w-[32px] text-center text-lg transition-all duration-200 ${
                              updatingItems.has(item.id) ? 'text-blue-700 scale-105' : ''
                            }`}>
                              {getCurrentQuantity(item.id, item.quantity)}
                            </span>
                            <button
                              onClick={() => handleQuantityIncrease(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="relative z-10 w-7 h-7 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              {updatingItems.has(item.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Forms and Summary */}
            <div className="pb-20">
              {/* Bill Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">
                    BILL DETAILS
                  </h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="font-medium">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Applied Coupon Section */}
                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">
                            Coupon Applied: {appliedCoupon.code}
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mb-1">{appliedCoupon.title}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Discount</span>
                        <span className="text-sm font-bold text-green-700">-₹{discount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Coin Discount Section */}
                  {coinDiscount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <CoinsIcon className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700">
                            Coin Discount ({coinsToUse} coins)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCoinsToUse(0);
                            setCoinsInputValue("");
                            setCoinDiscount(0);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-600">
                          ₹{maxUsableCoins?.coinValue || 0} × {coinsToUse} coins
                        </span>
                        <span className="text-sm font-bold text-amber-700">-₹{coinDiscount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Show amount after all discounts */}
                  {(appliedCoupon || coinDiscount > 0) && (
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span className="font-medium">Amount after discounts</span>
                      <span className="font-semibold">₹{afterCoinDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* GST Section */}
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium text-sm">
                      GST (18%)
                    </span>
                    <span className="font-semibold text-sm">₹{gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-md font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-theme-secondary">₹{total.toFixed(2)}</span>
                    </div>
                    {(discount > 0 || coinDiscount > 0) && (
                      <div className="text-xs text-green-600 mt-1 text-right">
                        You saved ₹{(discount + coinDiscount).toFixed(2)}!
                        {coinDiscount > 0 && (
                          <span className="ml-1">
                            (including ₹{coinDiscount.toFixed(2)} from coins)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Preferences */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Order Preferences
                  </h3>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-800 mb-4">
                    Select Payment Method
                  </label>
                  
                  {/* Custom Dropdown */}
                  <div className="relative" ref={paymentDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left transition-all duration-200 hover:border-gray-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedPaymentOption?.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{selectedPaymentOption?.label}</div>
                            <div className="text-sm text-gray-500">{selectedPaymentOption?.description}</div>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            isPaymentDropdownOpen ? 'transform rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isPaymentDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                        {paymentOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(option.value as PaymentMethod);
                              setIsPaymentDropdownOpen(false);
                            }}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0 ${
                              paymentMethod === option.value ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                  <div className="font-semibold text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-500">{option.description}</div>
                                </div>
                              </div>
                              {paymentMethod === option.value && (
                                <Check className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Method Info */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-blue-700">
                        {paymentMethod === "razorpay" && "Razorpay offers secure payment with multiple options including UPI, cards, and wallets."}
                        {paymentMethod === "upi" && "Pay instantly using UPI apps like Google Pay, PhonePe, or Paytm."}
                        {paymentMethod === "card" && "We accept all major credit and debit cards with secure encryption."}
                        {paymentMethod === "wallet" && "Use your favorite digital wallet for quick and secure payments."}
                        {paymentMethod === "cash" && "Pay with cash at the restaurant counter when you arrive."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Special Instructions
                  </label>
                  <div className="relative">
                    <textarea
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="Any cooking preferences, allergies, or special requests..."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-all duration-200"
                      rows={4}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {customerNote.length}/500
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Help our chefs prepare your meal exactly how you like it
                  </p>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <h4 className="font-semibold text-green-800 text-sm mb-1">Quick Tips</h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Your order will be prepared fresh after payment confirmation</li>
                        <li>• Estimated preparation time: 15-20 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Error */}
              {checkoutError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-red-600 text-sm font-medium">
                      {checkoutError}
                    </p>
                    <button
                      onClick={() => setCheckoutError(null)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Normal Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckoutProcessing}
                className="w-full bg-theme-secondary hover:bg-theme-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isCheckoutProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs mt-3 mb-10">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}