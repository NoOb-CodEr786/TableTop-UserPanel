"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  Copy,
  Check,
  Percent,
  Tag,
  Gift,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useOffersStore } from "@/store/offersStore";
import { Offer } from "@/api/offers.api";

export default function OffersPage() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const {
    offers,
    isLoading,
    error,
    setHotelAndBranch,
    initializeOffersData,
    fetchAvailableOffers,
    applyOffer,
  } = useOffersStore();

  // Initialize with hotel and branch IDs and load data once
  useEffect(() => {
    const initializeData = async () => {
      const hotelId = "HTL-2025-00001";
      const branchId = "BRN-HTL1001-00001";

      setHotelAndBranch(hotelId, branchId);

      // Load offers data (will only fetch if not already loaded)
      await initializeOffersData();
    };

    initializeData();
  }, [setHotelAndBranch, initializeOffersData]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyOffer = (offer: Offer) => {
    applyOffer(offer);
    router.push("/menu");
  };

  const getDiscountText = (offer: Offer) => {
    if (offer.discountType === "percent") {
      return `${offer.discountValue}% OFF`;
    }
    return `₹${offer.discountValue} OFF`;
  };

  const calculateSavings = (
    offer: Offer,
    orderValue: number = offer.minOrderValue
  ) => {
    if (offer.discountType === "percent") {
      const discount = (orderValue * offer.discountValue) / 100;
      return Math.min(discount, offer.maxDiscountAmount);
    }
    return Math.min(offer.discountValue, offer.maxDiscountAmount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Exclusive Offers
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-theme-primary animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              Loading amazing offers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Exclusive Offers
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchAvailableOffers()}
              className="px-5 py-2.5 bg-theme-primary text-white rounded-full text-sm font-semibold hover:bg-theme-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-20">
      <div className="pt-20">
        <div className="px-4 py-4 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              Exclusive Offers
            </h1>
            <p className="text-xs text-gray-500">
              {offers.length} offers available
            </p>
          </div>
          {offers.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-theme-gradient rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">
                Limited Time
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {offers.length > 0 ? (
          <>
            <div className="relative overflow-hidden rounded-xl bg-theme-gradient p-4 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm font-medium">
                    Best Offer
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Save up to ₹{offers[0].maxDiscountAmount}
                </h2>
                <p className="text-white/90 text-sm mb-4">
                  On orders above ₹{offers[0].minOrderValue}
                </p>
                <button
                  onClick={() => handleApplyOffer(offers[0])}
                  className="px-5 py-2.5 bg-white text-theme-primary rounded-full font-semibold text-sm hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2"
                >
                  Apply Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Max Savings
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.max(...offers.map((o) => o.maxDiscountAmount))}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 text-theme-secondary" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Active Deals
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.length}
                </p>
              </div>
            </div>
          </>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-lg mt-10 font-bold text-gray-900 flex items-center gap-2 px-1">
            <Sparkles className="w-5 h-5 text-theme-primary" />
            All Offers
          </h3>

          {offers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No offers available
              </h3>
              <p className="text-gray-500 mb-6">
                Check back later for exciting deals!
              </p>
              <button
                onClick={() => router.push("/menu")}
                className="px-6 py-3 bg-theme-primary text-white rounded-full text-xs font-semibold hover:bg-theme-primary-dark transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="relative bg-theme-gradient p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                        <span className="text-xs font-bold text-white">
                          {getDiscountText(offer)}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">
                        {offer.title}
                      </h4>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                    <div className="w-13 h-13 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">You Save</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{calculateSavings(offer)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-0.5">Min Order</p>
                      <p className="text-sm font-bold text-gray-900">
                        ₹{offer.minOrderValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Max: ₹{offer.maxDiscountAmount}</span>
                    </div>
                    {offer.validDays && offer.validDays.length > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Valid: {offer.validDays.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"></div>
                      <div className="relative px-4 py-3 border-2 border-dashed border-theme-primary/30 rounded-lg bg-white/50 backdrop-blur-sm">
                        <p className="text-xs text-gray-500 mb-1">Promo Code</p>
                        <p className="text-base font-bold text-theme-primary font-mono tracking-wider">
                          {offer.code}
                        </p>
                      </div>
                    </div>
                    {/* <button onClick={() => copyToClipboard(offer.code)} className={`px-4 py-3 rounded-xl font-semibold transition-all shadow-sm min-w-[80px] ${copiedCode === offer.code ? 'bg-green-500 text-white' : 'bg-theme-gradient text-white hover:shadow-lg'}`}>
                      {copiedCode === offer.code ? <Check className="w-5 h-5 mx-auto" /> : <Copy className="w-5 h-5 mx-auto" />}
                    </button> */}
                  </div>

                  {/* <button onClick={() => router.push('/coupons')} className="w-full py-3.5 bg-theme-gradient text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Apply Coupon
                    <ChevronRight className="w-4 h-4" />
                  </button> */}

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{offer.hotel.name}</span>
                      <span>•</span>
                      <span>{offer.branch.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-theme-secondary-lighter rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-theme-secondary" />
            </div>
            How to Use Offers
          </h3>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Copy the Code",
                desc: "Tap on copy button to save the promo code",
              },
              {
                step: 2,
                title: "Add Items to Cart",
                desc: "Browse menu and add your favorite items",
              },
              {
                step: 3,
                title: "Apply at Checkout",
                desc: "Paste the code and enjoy your discount",
              },
              {
                step: 4,
                title: "Enjoy Your Meal",
                desc: "Save money and enjoy delicious food",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 bg-theme-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{step}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {title}
                  </p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 border border-gray-100 mb-15">
          <p className="text-xs text-gray-500 leading-relaxed">
            * Offers are subject to availability and may vary by location. Terms
            and conditions apply. Cannot be combined with other offers. Please
            check minimum order value and validity before applying.
          </p>
        </div>
      </div>
    </div>
  );
}
