"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartModal from "@/components/CartModal";
import UserAvatar from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuStore } from "@/store/menuStore";
import { useCartStore } from "@/store/cartStore";
import { FoodItem } from "@/api/menu.api";

export default function MenuPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState(new Set<number>());
  
  // Local state for simple filtering UI (for visual feedback only)
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Use shared cart store - only get what we need to avoid unnecessary re-renders
  const { cartItems, addToCart: addToCartStore, setCartVisible, setHotelAndBranch: setCartHotelAndBranch, initializeCart } = useCartStore();

  // Menu store - menu page specific methods
  const {
    menuPageItems,
    menuPageCategories,
    isLoadingMenuPageItems,
    isLoadingMenuPageCategories,
    menuPageSelectedCategory,
    menuPageSearchQuery,
    menuPageError,
    isMenuPageDataLoaded,
    setHotelAndBranch,
    setMenuPageSelectedCategory,
    setMenuPageSearchQuery,
    initializeMenuPageData,
    filterMenuPageByCategory,
    searchMenuPageItems,
    filterMenuPageByType,
    getMenuPageDisplayItems,
  } = useMenuStore();

  // Initialize with hotel and branch IDs and load data once
  useEffect(() => {
    const initializeData = async () => {
      const hotelId = "68d13a52c10d4ebc29bfe787";
      const branchId = "68d13a9dc10d4ebc29bfe78f";
      
      setHotelAndBranch(hotelId, branchId);
      setCartHotelAndBranch(hotelId, branchId);
      
      // Initialize cart data (will only fetch if not already loaded)
      await initializeCart();
      
      // Load menu data
      initializeMenuPageData();
    };

    initializeData();
  }, [setHotelAndBranch, setCartHotelAndBranch, initializeCart, initializeMenuPageData]);

  // Handle search with server-side filtering
  const handleSearch = async (query: string) => {
    setMenuPageSearchQuery(query);
    if (query.trim()) {
      await searchMenuPageItems(query);
    } else {
      // Reset to show all items
      await filterMenuPageByCategory(null);
    }
  };

  // Handle category selection with server-side filtering
  const handleCategorySelect = async (categoryId: string | null) => {
    setMenuPageSelectedCategory(categoryId);
    await filterMenuPageByCategory(categoryId);
  };

  const addToCart = async (item: FoodItem) => {
    try {
      // Use the API-based addToCart method
      await addToCartStore(item.id, 1);
      // The cart modal should automatically show because addToCart sets isCartVisible to true
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleAvatarClick = () => {
    router.push("/profile");
  };

  // Get display items from store
  const displayItems = getMenuPageDisplayItems();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-gray-400 mb-1">
              Our?
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Great Menu
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

      {/* Search and Filter Section */}
      <div className="px-4 sm:px-6 mb-6">
        {/* Search Field */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for dishes..."
            value={menuPageSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Quick Filter Pills - Server-side filtering */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={async () => {
              setActiveFilter('all');
              await filterMenuPageByCategory(null);
            }}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          <button
            onClick={async () => {
              setActiveFilter('veg');
              await filterMenuPageByType('veg');
            }}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === 'veg'
                ? 'bg-green-500 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Veg Only
          </button>
          <button
            onClick={async () => {
              setActiveFilter('non-veg');
              await filterMenuPageByType('non-veg');
            }}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === 'non-veg'
                ? 'bg-red-500 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Non-Veg
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 mb-8">
        {/* Category Tabs */}
        <div className="flex gap-4 sm:gap-6 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`pb-3 font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${
              !menuPageSelectedCategory
                ? 'text-gray-900 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            All Items
          </button>
          {menuPageCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategorySelect(category._id)}
              className={`pb-3 font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${
                menuPageSelectedCategory === category._id
                  ? 'text-gray-900 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State - Show skeleton only for initial load */}
        {((isLoadingMenuPageCategories || isLoadingMenuPageItems) || (isLoadingMenuPageItems && displayItems.length === 0)) && (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border-1 border-zinc-200 overflow-hidden">
                <div className="flex gap-3 sm:gap-4 p-3">
                  {/* Image Skeleton */}
                  <Skeleton className="w-30 h-30 flex-shrink-0 rounded-xl" />
                  
                  {/* Content Skeleton */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 min-w-3 sm:min-w-4 rounded mt-1" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 sm:h-5 w-3/4 mb-1" />
                          <div className="flex gap-1 sm:gap-2 mt-1">
                            <Skeleton className="h-3 w-16 rounded-full" />
                            <Skeleton className="h-3 w-14 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 sm:ml-6 mt-1">
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 sm:h-6 w-16" />
                        <Skeleton className="h-3 sm:h-4 w-12" />
                      </div>
                      <Skeleton className="h-8 w-16 sm:w-20 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {menuPageError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{menuPageError}</p>
          </div>
        )}

        {/* Menu Items */}
        {!(isLoadingMenuPageCategories || isLoadingMenuPageItems) && (
          <div className="relative space-y-4">
            {/* Loading overlay for filtering */}
            {isLoadingMenuPageItems && displayItems.length > 0 && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Filtering...</span>
                </div>
              </div>
            )}
            
            {displayItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found matching your criteria.</p>
              </div>
            ) : (
              displayItems.map((item: FoodItem) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border-1 border-zinc-200 overflow-hidden"
                >
                  <div className="flex gap-3 sm:gap-4 p-3">
                    {/* Image */}
                     <div className="w-30 h-30 flex-shrink-0 rounded-xl overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Discount Badge */}
                    {item.discountPrice && item.discountPrice !== item.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                        {item.discountPercentage}% OFF
                      </div>
                    )}
                  </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      {/* Title and Description */}
                      <div>
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 min-w-3 sm:min-w-4 border-1 rounded flex items-center justify-center mt-1 ${
                            item.foodType === 'veg' 
                              ? 'border-green-600' 
                              : item.foodType === 'non-veg'
                              ? 'border-red-600'
                              : 'border-blue-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-sm ${
                              item.foodType === 'veg' 
                                ? 'bg-green-600' 
                                : item.foodType === 'non-veg'
                                ? 'bg-red-600'
                                : 'bg-blue-600'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-md font-bold text-gray-900 leading-tight truncate">
                              {item.name}
                            </h4>
                            {/* Recommended and Best Seller badges below the name */}
                            <div className="flex gap-1 sm:gap-2 mt-1">
                              {item.isRecommended && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                  Recommended
                                </span>
                              )}
                              {item.isBestSeller && (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 sm:ml-6 mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <span>⏱ {item.preparationTime}min</span>
                          {item.spiceLevel && (
                            <span className="flex items-center gap-1">
                              🌶 {item.spiceLevel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price and Add Button */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            ₹ {item.effectivePrice || item.price}
                          </span>
                          {item.discountPrice && item.discountPrice !== item.price && (
                            <>
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ₹ {item.price}
                              </span>
                            </>
                          )}
                        </div>
                        {(() => {
                          // Check if item is in cart by comparing with the cart data
                          const isInCart = cartItems.length > 0 && cartItems.some(cartItem => {
                            // Use name comparison for reliability
                            return cartItem.name === item.name;
                          });
                          
                          if (!item.isAvailable) {
                            return (
                              <button
                                disabled
                                className="font-bold px-4 sm:px-6 py-1.5 rounded-lg text-xs sm:text-sm bg-gray-200 text-gray-400 cursor-not-allowed"
                              >
                                Unavailable
                              </button>
                            );
                          }
                          
                          if (isInCart) {
                            return (
                              <div className="font-bold px-4 sm:px-6 py-1.5 rounded-lg text-xs sm:text-sm bg-green-500 text-white flex items-center gap-2">
                                <span>Added</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            );
                          }
                          
                          return (
                            <button
                              onClick={() => addToCart(item)}
                              className="font-bold px-4 sm:px-6 py-1.5 rounded-lg text-xs sm:text-sm bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                            >
                              Add
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal onClose={() => setCartVisible(false)} />
      
   
    </div>
  );
}
