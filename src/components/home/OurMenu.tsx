"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cartStore";
import { useMenuStore } from "@/store/menuStore";

interface OurMenuProps {}

const OurMenu: React.FC<OurMenuProps> = () => {
  // Use shared cart store - only get what we need to avoid unnecessary re-renders
  const { cartItems, addToCart, setHotelAndBranch: setCartHotelAndBranch } = useCartStore();
  
  // Use menu store - home page specific methods
  const { 
    homeFoodItems,
    homeCategories,
    isLoadingHomeItems,
    isLoadingHomeCategories,
    homeError,
    homeSelectedCategory,
    isHomeDataLoaded,
    setHotelAndBranch,
    setHomeSelectedCategory,
    initializeHomeData,
    filterHomeByCateogry,
    getHomeDisplayItems,
  } = useMenuStore();

  // Initialize hotel and branch IDs and load data once
  useEffect(() => {
    const hotelId = "68d13a52c10d4ebc29bfe787";
    const branchId = "68d13a9dc10d4ebc29bfe78f";
    
    setHotelAndBranch(hotelId, branchId);
    setCartHotelAndBranch(hotelId, branchId);
    
    // Load data once - avoid duplicate calls
    if (!isHomeDataLoaded) {
      initializeHomeData();
    }
  }, [setHotelAndBranch, setCartHotelAndBranch, initializeHomeData, isHomeDataLoaded]);

  // External category filtering removed to prevent race conditions
  // Component now manages its own category state independently

  const handleAddToCart = async (item: any) => {
    try {
      // Use the API-based addToCart method
      await addToCart(item.id, 1);
      // The cart modal should automatically show because addToCart sets isCartVisible to true
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleCategorySelect = async (categoryId: string | null) => {
    // Avoid unnecessary API calls if selecting the same category
    if (categoryId === homeSelectedCategory) {
      return;
    }
    
    setHomeSelectedCategory(categoryId);
    
    // Use server-side filtering
    await filterHomeByCateogry(categoryId);
  };

  // Get display items from store
  const displayItems = getHomeDisplayItems();

  return (
    <div id="our-menu-section" className="px-3 mb-8 bg-gray-50 pb-24">

      
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <h3 className="px-6 text-3xl font-serif italic text-gray-700">
          Our Menu
        </h3>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => handleCategorySelect(null)}
            className={`pb-3 font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${
            !homeSelectedCategory
              ? 'text-gray-900 border-b-2 border-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          All Items
        </button>
        {isLoadingHomeCategories ? (
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pb-3">
                <Skeleton className="w-20 h-4" />
              </div>
            ))}
          </div>
        ) : (
          homeCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategorySelect(category._id)}
              className={`pb-3 font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${
                homeSelectedCategory === category._id
                  ? 'text-gray-900 border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      {/* Loading State - Show skeleton only for initial load */}
      {(isLoadingHomeCategories || (isLoadingHomeItems && displayItems.length === 0)) && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border-1 border-zinc-200 overflow-hidden">
              <div className="flex gap-4 p-3">
                {/* Image Skeleton */}
                <Skeleton className="w-30 h-30 flex-shrink-0 rounded-xl" />
                
                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col justify-between">
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
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {homeError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{homeError}</p>
        </div>
      )}

      {/* Menu Items */}
      {!isLoadingHomeCategories && (
        <div className="space-y-4">
          {/* Show skeleton during filtering instead of overlay */}
          {isLoadingHomeItems ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border-1 border-zinc-200 overflow-hidden">
                  <div className="flex gap-4 p-3">
                    {/* Image Skeleton */}
                    <Skeleton className="w-30 h-30 flex-shrink-0 rounded-xl" />
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 flex flex-col justify-between">
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
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items available.</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border-1 border-zinc-200 overflow-hidden"
              >
                <div className="flex gap-4 p-3">
                  {/* Image */}
                  <div className="w-27 h-27 flex-shrink-0 rounded-xl overflow-hidden relative">
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
                        // Check if item is in cart by comparing with the original API data
                        const isInCart = cartItems.length > 0 && cartItems.some(cartItem => {
                          // Since cart items have converted numeric IDs, we need to check against the API cart data
                          // For now, we'll use a more reliable method by checking the food item name
                          return cartItem.name === item.name;
                        });
                        
                        if (!item.isAvailable) {
                          return (
                            <button
                              disabled
                              className="font-bold px-6 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-400 cursor-not-allowed"
                            >
                              Unavailable
                            </button>
                          );
                        }
                        
                        if (isInCart) {
                          return (
                            <div className="font-medium px-3 py-1.5 rounded-lg text-sm bg-green-500 text-white flex items-center gap-1">
                              <span>Added</span>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          );
                        }
                        
                        return (
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className="font-medium px-6 py-1.5 rounded-lg text-sm bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-500 hover:text-white transition-colors"
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
  );
};

export default OurMenu;
