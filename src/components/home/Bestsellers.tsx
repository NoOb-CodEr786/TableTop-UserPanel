"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cartStore";
import { useMenuStore } from "@/store/menuStore";

const Bestsellers: React.FC = () => {
  const [favorites, setFavorites] = useState(new Set<number>());

  // Use shared cart store - only get what we need to avoid unnecessary re-renders
  const { cartItems, addToCart, setHotelAndBranch: setCartHotelAndBranch } = useCartStore();

  // Use menu store for bestsellers - home page specific methods
  const {
    bestsellerItems,
    isLoadingBestsellers,
    homeError,
    isHomeDataLoaded,
    bestsellersLoaded,
    setHotelAndBranch,
    initializeBestsellers,
  } = useMenuStore();

  // Initialize hotel and branch IDs and load data once
  useEffect(() => {
    const hotelId = "68d13a52c10d4ebc29bfe787";
    const branchId = "68d13a9dc10d4ebc29bfe78f";

    setHotelAndBranch(hotelId, branchId);
    setCartHotelAndBranch(hotelId, branchId);
    
    // Load bestsellers data if not already loaded
    if (!bestsellersLoaded) {
      initializeBestsellers();
    }
  }, [setHotelAndBranch, setCartHotelAndBranch, initializeBestsellers, bestsellersLoaded]);

  const handleAddToCart = async (item: any) => {
    try {
      // Use the API-based addToCart method with the item's string ID
      await addToCart(item.id, 1);
      // The cart modal should automatically show because addToCart sets isCartVisible to true
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const toggleFavorite = (id: string) => {
    // Convert string ID to number for favorites set
    const numericId =
      parseInt(id.slice(-4), 16) || Math.floor(Math.random() * 10000);
    const newFavorites = new Set(favorites);
    if (newFavorites.has(numericId)) {
      newFavorites.delete(numericId);
    } else {
      newFavorites.add(numericId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="px-3 mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <h3 className="px-6 text-3xl font-serif italic text-gray-700">
          Bestsellers
        </h3>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Loading State */}
      {(isLoadingBestsellers || (!bestsellersLoaded && bestsellerItems.length === 0)) && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="overflow-hidden">
              {/* Image Skeleton */}
              <div className="aspect-square relative">
                <Skeleton className="w-full h-full rounded-2xl" />
              </div>

              {/* Card Content Skeleton */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-6 rounded-sm" />
                  </div>
                  <Skeleton className="w-16 h-4 rounded-full" />
                </div>

                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-lg" />
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

      {/* Bestseller Items - Grid Layout */}
      {!isLoadingBestsellers && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {bestsellerItems.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">No bestseller items available.</p>
            </div>
          ) : (
            bestsellerItems.map((item: any) => (
              <div key={item.id} className="overflow-hidden">
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                  {/* Discount Badge */}
                  {item.discountPrice && item.discountPrice !== item.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                      {item.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="py-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 px-2 py-2 rounded-sm border ${
                          item.foodType === "veg"
                            ? "bg-green-50 border-green-500"
                            : item.foodType === "non-veg"
                            ? "bg-red-50 border-red-500"
                            : "bg-gray-50 border-gray-500"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.foodType === "veg"
                              ? "bg-green-500"
                              : item.foodType === "non-veg"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                      </div>

                    </div>

                    <div className="flex items-center gap-1">
                      {item.isBestSeller && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                          Best Seller
                        </span>
                      )}{" "}
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{item.effectivePrice || item.price}
                      </span>
                      {item.discountPrice &&
                        item.discountPrice !== item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.price}
                          </span>
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
                            className="font-bold px-6 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-400 cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        );
                      }
                      
                      if (isInCart) {
                        return (
                          <div className="font-medium px-3 py-1 rounded-lg text-[10px] bg-green-500 text-white flex items-center gap-1">
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
                          className="font-medium px-6 py-1.5 rounded-lg text-[10px] bg-white border-1 border-gray-200 text-gray-500 hover:bg-gray-500 hover:text-white transition-colors"
                        >
                          Add
                        </button>
                      );
                    })()}
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

export default Bestsellers;
