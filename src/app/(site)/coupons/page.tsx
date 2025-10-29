"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  ShoppingCart, 
  Percent, 
  Clock, 
  Tag, 
  Copy, 
  Check, 
  ChevronRight,
  AlertCircle,
  Loader2,
  Plus,
  TrendingUp,
  Star
} from 'lucide-react';
import { getOfferRecommendations, OfferRecommendationsResponse, OfferWithRecommendation } from '@/api/offers.api';

export default function CouponsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OfferRecommendationsResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const hotelId = "HTL-2025-00001";
  const branchId = "BRN-HTL1001-00001";

  useEffect(() => {
    fetchOfferRecommendations();
  }, []);

  const fetchOfferRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOfferRecommendations({ hotelId, branchId });
      setData(response.data.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch offer recommendations";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountText = (offer: OfferWithRecommendation) => {
    if (offer.discountType === 'percent') {
      return `${offer.discountValue}% OFF`;
    }
    return `₹${offer.discountValue} OFF`;
  };

  const handleApplyOffer = (offer: OfferWithRecommendation) => {
    // Store coupon data in localStorage for cart page to pick up
    const couponData = {
      _id: offer._id,
      code: offer.code,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      maxDiscountAmount: offer.maxDiscountAmount,
      minOrderValue: offer.minOrderValue,
      timestamp: Date.now()
    };
    
    localStorage.setItem('appliedCouponData', JSON.stringify(couponData));
    
    // Navigate back to cart with applied offer parameter
    router.push('/cart?appliedOffer=' + offer.code);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Apply Coupons</h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-theme-primary animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Finding best offers for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Apply Coupons</h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchOfferRecommendations} className="px-5 py-2.5 bg-theme-primary text-white rounded-full text-sm font-semibold hover:bg-theme-primary-dark transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Apply Coupons</h1>
            <p className="text-xs text-gray-500">
              {data?.metadata.totalOffersAvailable || 0} offers available
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-theme-gradient rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Smart Pick</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cart Summary */}
        {data?.userCart && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-theme-secondary-lighter rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-theme-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">Your Cart</h3>
                <p className="text-xs text-gray-500">{data.userCart.itemCount} items</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{data.userCart.totalAmount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Offers */}
        {data?.recommended && data.recommended.count > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Star className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
            </div>
            
            {data.recommended.offers.map((offer) => (
              <div key={offer._id} className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-green-200 hover:shadow-md transition-all">
                {/* Recommended Badge */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">BEST MATCH</span>
                    <span className="ml-auto text-white/90 text-xs">Save ₹{Math.round(offer.recommendation.potentialSavings)}</span>
                  </div>
                </div>

                <div className="relative bg-theme-gradient p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                        <Percent className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-bold text-white">{getDiscountText(offer)}</span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">{offer.title}</h4>
                      <p className="text-white/80 text-sm line-clamp-2">{offer.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Recommendation Info */}
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-sm font-semibold text-green-700 mb-1">
                      {offer.recommendation.reason}
                    </p>
                    <p className="text-xs text-green-600">
                      {offer.recommendation.recommendation}
                    </p>
                  </div>

                  {/* Offer Details */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Max: ₹{offer.maxDiscountAmount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Min: ₹{offer.minOrderValue}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"></div>
                      <div className="relative px-4 py-3 border-2 border-dashed border-theme-primary/30 rounded-xl bg-white/50 backdrop-blur-sm">
                        <p className="text-xs text-gray-500 mb-1">Promo Code</p>
                        <p className="text-lg font-bold text-theme-primary font-mono tracking-wider">{offer.code}</p>
                      </div>
                    </div>
                    {/* <button 
                      onClick={() => copyToClipboard(offer.code)} 
                      className={`px-4 py-3 rounded-xl font-semibold transition-all shadow-sm min-w-[80px] ${
                        copiedCode === offer.code 
                          ? 'bg-green-500 text-white' 
                          : 'bg-theme-gradient text-white hover:shadow-lg'
                      }`}
                    >
                      {copiedCode === offer.code ? <Check className="w-5 h-5 mx-auto" /> : <Copy className="w-5 h-5 mx-auto" />}
                    </button> */}
                  </div>

                  <button 
                    onClick={() => handleApplyOffer(offer)} 
                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Apply Coupon
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Non-Recommended Offers */}
        {data?.nonRecommended && data.nonRecommended.count > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1 mt-6">
              <Gift className="w-5 h-5 text-theme-primary" />
              <h3 className="text-lg font-bold text-gray-900">Other Offers</h3>
            </div>
            
            {data.nonRecommended.offers.map((offer) => (
              <div key={offer._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative bg-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-500/20 backdrop-blur-sm rounded-full mb-2">
                        <Percent className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-xs font-bold text-gray-600">{getDiscountText(offer)}</span>
                      </div>
                      <h4 className="text-gray-800 font-bold text-lg mb-1 line-clamp-2">{offer.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Not Eligible Info */}
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Plus className="w-4 h-4 text-orange-600" />
                      <p className="text-sm font-semibold text-orange-700">
                        {offer.recommendation.reason}
                      </p>
                    </div>
                    <p className="text-xs text-orange-600">
                      {offer.recommendation.recommendation}
                    </p>
                  </div>

                  {/* Offer Details */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Max: ₹{offer.maxDiscountAmount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Min: ₹{offer.minOrderValue}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"></div>
                      <div className="relative px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm">
                        <p className="text-xs text-gray-500 mb-1">Promo Code</p>
                        <p className="text-lg font-bold text-gray-600 font-mono tracking-wider">{offer.code}</p>
                      </div>
                    </div>
                    {/* <button 
                      onClick={() => copyToClipboard(offer.code)} 
                      className={`px-4 py-3 rounded-xl font-semibold transition-all shadow-sm min-w-[80px] ${
                        copiedCode === offer.code 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      {copiedCode === offer.code ? <Check className="w-5 h-5 mx-auto" /> : <Copy className="w-5 h-5 mx-auto" />}
                    </button> */}
                  </div>

                  <button 
                    onClick={() => handleApplyOffer(offer)}
                    disabled={offer.recommendation.eligibilityStatus === 'not_eligible'}
                    className="w-full py-3.5 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {offer.recommendation.eligibilityStatus === 'not_eligible' ? 'Not Eligible' : 'Apply Coupon'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Offers State */}
        {(!data?.recommended || data.recommended.count === 0) && (!data?.nonRecommended || data.nonRecommended.count === 0) && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 mt-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No coupons available</h3>
            <p className="text-gray-500 mb-6">Add items to your cart to see available offers!</p>
            <button onClick={() => router.push('/menu')} className="px-6 py-3 bg-theme-primary text-white rounded-full font-semibold hover:bg-theme-primary-dark transition-colors">
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}