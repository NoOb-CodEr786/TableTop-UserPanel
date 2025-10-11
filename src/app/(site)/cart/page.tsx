"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import { useCartStore } from "@/store/cartStore";
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
    clearCart
  } = useCartStore();

  // Local state to manage quantities in frontend only
  const [localQuantities, setLocalQuantities] = useState<{[key: number]: number}>({});
  // Local state for checkout error messages
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Initialize cart page with optimized single API call
  useEffect(() => {
    const defaultHotelId = "68d13a52c10d4ebc29bfe787";
    const defaultBranchId = "68d13a9dc10d4ebc29bfe78f";
    
    // Set hotel and branch, then initialize cart page
    setHotelAndBranch(defaultHotelId, defaultBranchId);
    
    // Initialize cart page data (fetch once strategy)
    initializeCartPage();
  }, [setHotelAndBranch, initializeCartPage]);

  // Initialize local quantities when cart items change
  useEffect(() => {
    const initialQuantities: {[key: number]: number} = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setLocalQuantities(initialQuantities);
  }, [cartItems]);

  const removeItemHandler = (id: number) => {
    removeFromCart(id);
  };

  // Frontend quantity handlers (no API integration)
  const handleQuantityIncrease = (itemId: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1
    }));
  };

  const handleQuantityDecrease = (itemId: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1)
    }));
  };

  // Get the current quantity for display (local state or original)
  const getCurrentQuantity = (itemId: number, originalQuantity: number) => {
    return localQuantities[itemId] !== undefined ? localQuantities[itemId] : originalQuantity;
  };

  // Helper function to get quantity changes summary
  const getQuantityChangesSummary = () => {
    const changes = cartItems.map(item => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      const hasChanged = currentQuantity !== item.quantity;
      return {
        itemId: item.id,
        name: item.name,
        originalQuantity: item.quantity,
        currentQuantity: currentQuantity,
        hasChanged: hasChanged,
        difference: currentQuantity - item.quantity
      };
    }).filter(change => change.hasChanged);

    return {
      hasChanges: changes.length > 0,
      changedItems: changes,
      totalChanges: changes.length
    };
  };

  const clearCartHandler = async () => {
    await clearCart();
  };

  const handleCheckout = async () => {
    try {
      // Clear any previous checkout errors
      setCheckoutError(null);
      
      // Step 1: Check if there are any quantity changes
      const changesSummary = getQuantityChangesSummary();
      const hasQuantityChanges = changesSummary.hasChanges;

      // Step 2: Only prepare bulk update data if there are actual changes
      const updates = hasQuantityChanges 
        ? cartItems.map(item => ({
            itemId: item.originalId || '', // Use the original cart item _id
            quantity: getCurrentQuantity(item.id, item.quantity)
          })).filter(update => update.itemId !== '') // Filter out items without originalId
        : []; // Empty array if no changes

      // Step 3: Navigate immediately for better UX
      console.log('Navigating to checkout page...');
      console.log(`Quantity changes detected: ${hasQuantityChanges}`);
      console.log(`Changed items: ${changesSummary.totalChanges}`);
      console.log(`Updates to process: ${updates.length}`);
      
      if (hasQuantityChanges) {
        console.log('Changes summary:', changesSummary.changedItems);
      } else {
        console.log('No quantity changes - skipping bulk update API');
      }
      
      // Store checkout data in localStorage for the checkout page to process
      const checkoutPayload = {
        updates: updates, // Will be empty array if no changes
        hasQuantityChanges: hasQuantityChanges,
        changesSummary: changesSummary,
        cartItems: cartItems.map(item => ({
          ...item,
          quantity: getCurrentQuantity(item.id, item.quantity)
        })),
        hotelId,
        branchId,
        timestamp: Date.now()
      };
      
      localStorage.setItem('pendingCheckout', JSON.stringify(checkoutPayload));
      
      // Navigate immediately - no delay, no loading states
      router.push('/checkout');
      
    } catch (error: any) {
      console.error('Failed to prepare checkout:', error);
      setCheckoutError('Failed to prepare checkout. Please try again.');
    }
  };

  // Calculate totals based on local quantities
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      return sum + (item.price * currentQuantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((sum, item) => {
      const currentQuantity = getCurrentQuantity(item.id, item.quantity);
      return sum + currentQuantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;
  const totalItems = calculateTotalItems();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif italic text-gray-400 mb-1">
              Your?
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Cart Items
            </h2>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-400/50 flex items-center justify-center ">
            <div className="w-13 h-13 rounded-full bg-orange-400/80 flex items-center justify-center shadow">
              <span className="text-3xl">�</span>
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

      {/* Loading State */}
      {isLoading && (
        <div className="px-6 pb-6">
          {/* Back to Menu Button Skeleton */}
          <div className="mb-6 flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          
          {/* Cart Items Skeleton */}
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm border border-gray-100">
                <div className="flex gap-4 p-4">
                  {/* Image Skeleton */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                      
                      <Skeleton className="h-4 w-40 mb-3" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <Skeleton className="h-6 w-16 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-5 h-6" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-6 shadow border border-orange-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="border-t border-orange-200 pt-3 mt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-7 w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button Skeleton */}
          <div className="space-y-3">
            <Skeleton className="w-full h-14 rounded-2xl" />
            <Skeleton className="h-4 w-64 mx-auto" />
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

      {/* Checkout Error State */}
      {checkoutError && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded p-4 flex items-center justify-between">
            <p className="text-red-600 text-sm">{checkoutError}</p>
            <button 
              onClick={() => setCheckoutError(null)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && cartItems.length === 0 ? (
        <div className="px-6 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Looks like you haven't added anything to your cart yet. Explore our delicious menu!
            </p>
            <Link href="/menu">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium shadow transform hover:scale-105 transition-all duration-200">
                Explore Menu
              </button>
            </Link>
          </div>
        </div>
      ) : !isLoading && cartItems.length > 0 ? (
        <div className="px-6 pb-6">
          {/* Back to Menu Button */}
          <div className="mb-6 flex justify-between items-center">
            <Link href="/menu" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            
            <button
              onClick={clearCartHandler}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded overflow-hidden shadow-sm border border-gray-100">
                <div className="flex gap-4 p-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Food type indicator */}
                    <div className={`absolute top-2 left-2 w-4 h-4 border-1 rounded flex items-center justify-center bg-white ${
                      item.isVeg ? 'border-green-600' : 'border-red-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded ${
                        item.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItemHandler(item.id)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-lg">
                          ₹{item.price}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Total: ₹{item.price * getCurrentQuantity(item.id, item.quantity)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityDecrease(item.id)}
                          disabled={getCurrentQuantity(item.id, item.quantity) <= 1}
                          className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[20px] text-center">
                          {getCurrentQuantity(item.id, item.quantity)}
                        </span>
                        <button
                          onClick={() => handleQuantityIncrease(item.id)}
                          className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-6 shadow border border-orange-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">📋</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="border-t border-orange-200 pt-3 mt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>
            </div>
           
          </div>

          {/* Checkout Button */}
          <div className="space-y-3">
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-bold text-lg shadow transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Move to Checkout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
            
            <p className="text-center text-gray-500 text-sm">
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      ) : null}
      
      <BottomNavigation />
    </div>
  );
}