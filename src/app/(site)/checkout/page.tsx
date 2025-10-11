"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    cartSummary, 
    checkoutData,
    isLoading, 
    error,
    cartItems,
    hotelId,
    branchId,
    setHotelAndBranch,
    fetchCart,
    bulkUpdateCart,
    checkout,
    clearCartLocal
  } = useCartStore();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Transform checkout data to display format
  const checkoutItems = checkoutData?.items?.map((item) => ({
    id: parseInt(item._id.slice(-8), 16) || Math.floor(Math.random() * 10000),
    name: item.foodItem.name,
    description: `${item.foodItem.category.name} • ${item.foodItem.preparationTime || 0}min prep`,
    price: item.price,
    image: item.foodItem.image,
    quantity: item.quantity,
    isVeg: item.foodItem.foodType === 'veg',
    category: item.foodItem.category.name,
    totalPrice: item.totalPrice,
    originalId: item._id,
  })) || [];

  // Initialize with default hotel and branch IDs
  useEffect(() => {
    const defaultHotelId = "68d13a52c10d4ebc29bfe787";
    const defaultBranchId = "68d13a9dc10d4ebc29bfe78f";
    
    setHotelAndBranch(defaultHotelId, defaultBranchId);
  }, [setHotelAndBranch]);

  // Process pending checkout from localStorage
  useEffect(() => {
    const processPendingCheckout = async () => {
      try {
        const pendingCheckoutData = localStorage.getItem('pendingCheckout');
        
        if (pendingCheckoutData && !checkoutData && !processingCheckout) {
          setProcessingCheckout(true);
          setCheckoutError(null);
          
          const payload = JSON.parse(pendingCheckoutData);
          console.log('Processing pending checkout:', payload);
          console.log(`Has quantity changes: ${payload.hasQuantityChanges}`);
          console.log(`Updates to process: ${payload.updates?.length || 0}`);
          
          // Step 1: Bulk update cart quantities ONLY if there are actual changes
          if (payload.hasQuantityChanges && payload.updates && payload.updates.length > 0) {
            console.log('Updating cart quantities:', payload.updates);
            await bulkUpdateCart(payload.updates);
          } else {
            console.log('No quantity changes detected, skipping bulk update API');
          }

          // Step 2: Process checkout
          console.log('Processing checkout...');
          const result = await checkout();
          
          if (result) {
            // Step 3: Clear cart locally
            console.log('Checkout successful, clearing cart locally...');
            clearCartLocal();
            
            // Step 4: Clear pending checkout data
            localStorage.removeItem('pendingCheckout');
            
            console.log('Checkout process completed successfully');
          } else {
            throw new Error('Checkout failed: No data returned');
          }
          
          setProcessingCheckout(false);
        }
      } catch (error: any) {
        console.error('Failed to process pending checkout:', error);
        setCheckoutError('Failed to process checkout. Please try again.');
        setProcessingCheckout(false);
        
        // Redirect back to cart on error
        setTimeout(() => {
          router.push('/cart');
        }, 3000);
      }
    };

    processPendingCheckout();
  }, [checkoutData, processingCheckout, bulkUpdateCart, checkout, clearCartLocal, router]);

  // Check if checkout data is available, if not redirect to cart (but allow time for processing)
  useEffect(() => {
    if (!checkoutData && !isLoading && !processingCheckout) {
      const pendingCheckoutData = localStorage.getItem('pendingCheckout');
      if (!pendingCheckoutData) {
        router.push('/cart');
      }
    }
  }, [checkoutData, isLoading, processingCheckout, router]);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    // Here you would typically call an order placement API
    setTimeout(() => {
      router.push('/orders'); // Redirect to orders page after successful placement
    }, 3000);
  };

  // Show processing state
  if (processingCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-orange-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Checkout...</h2>
          <p className="text-gray-600 mb-6">
            Please wait while we process your order. This should only take a moment.
          </p>
          {checkoutError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{checkoutError}</p>
              <p className="text-gray-500 text-xs mt-2">Redirecting back to cart...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and is being prepared. You'll receive updates on the status.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-700 text-sm font-medium">
              Estimated preparation time: 25-30 minutes
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Redirecting to orders page...
          </p>
        </div>
      </div>
    );
  }

  const subtotal = checkoutData?.subtotal || 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif italic text-gray-400 mb-1">
              Review &
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Checkout
            </h2>
          </div>
          <div className="w-16 h-16 rounded-full bg-green-400/50 flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-green-400/80 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
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

      <div className="px-6 pb-6">
        {/* Back to Cart Button */}
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>

        {/* Order Status */}
        {checkoutData?.status === 'checkout' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Order Ready for Payment</h3>
                <p className="text-green-600 text-sm">Your cart has been transferred to checkout successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant & Table Info */}
        {checkoutData?.hotel && checkoutData?.branch && (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{checkoutData.hotel.name}</h3>
                <p className="text-gray-600 text-sm">{checkoutData.branch.name}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires: {new Date(checkoutData.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            Order Items ({checkoutData?.totalItems || 0})
          </h3>
          <div className="space-y-3">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-xs">{item.category}</p>
                  <div className={`inline-flex items-center gap-1 mt-1`}>
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                      item.isVeg ? 'border-green-600' : 'border-red-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-sm ${
                        item.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                    <span className="text-xs text-gray-500">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{item.price} × {item.quantity}</p>
                  <p className="text-gray-500 text-xs">Total: ₹{item.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm border border-orange-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">💰</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Payment Summary</h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Subtotal ({checkoutData?.totalItems || 0} items)</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            {checkoutData?.totalDiscount && checkoutData.totalDiscount >= 0 && (
              <div className="flex justify-between text-orange-600">
                <span className="font-medium">Discount</span>
                <span className="font-semibold">-₹{checkoutData.totalDiscount}</span>
              </div>
            )}
            <div className="border-t border-green-200 pt-3 mt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Place Order Button */}
        <div className="space-y-3">
          <button 
            onClick={handlePlaceOrder}
            disabled={isLoading || !checkoutData || checkoutItems.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Place Order • ₹{total}</span>
            <CheckCircle className="w-5 h-5" />
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            🔒 By placing this order, you agree to our terms and conditions
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}