"use client";

import React, { useState } from 'react';
import { Clock, Copy, CheckCircle, Star, Percent, Tag, Gift } from 'lucide-react';

interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  code: string;
  image: string;
  validUntil: string;
  minOrder?: number;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_delivery';
  isActive: boolean;
}

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers: Offer[] = [
    {
      id: 1,
      title: 'Welcome Offer',
      description: 'Get 20% off on your first order',
      discount: '20% OFF',
      code: 'WELCOME20',
      image: '🎉',
      validUntil: '2024-12-31',
      minOrder: 25,
      type: 'percentage',
      isActive: true
    },
    {
      id: 2,
      title: 'Free Delivery',
      description: 'Free delivery on orders above $30',
      discount: 'FREE DELIVERY',
      code: 'FREEDEL30',
      image: '🚚',
      validUntil: '2024-11-30',
      minOrder: 30,
      type: 'free_delivery',
      isActive: true
    },
    {
      id: 3,
      title: 'Weekend Special',
      description: 'Buy one main course, get one appetizer free',
      discount: 'BOGO',
      code: 'WEEKEND2024',
      image: '🍽️',
      validUntil: '2024-10-20',
      type: 'bogo',
      isActive: true
    },
    {
      id: 4,
      title: 'Student Discount',
      description: '$5 off on any order',
      discount: '$5 OFF',
      code: 'STUDENT5',
      image: '🎓',
      validUntil: '2024-12-25',
      minOrder: 20,
      type: 'fixed',
      isActive: true
    },
    {
      id: 5,
      title: 'Lunch Special',
      description: '15% off on lunch orders between 11 AM - 3 PM',
      discount: '15% OFF',
      code: 'LUNCH15',
      image: '🌞',
      validUntil: '2024-10-15',
      minOrder: 15,
      type: 'percentage',
      isActive: false
    },
    {
      id: 6,
      title: 'Family Feast',
      description: '25% off on orders above $60',
      discount: '25% OFF',
      code: 'FAMILY25',
      image: '👨‍👩‍👧‍👦',
      validUntil: '2024-11-15',
      minOrder: 60,
      type: 'percentage',
      isActive: true
    }
  ];

  const activeOffers = offers.filter(offer => offer.isActive);
  const expiredOffers = offers.filter(offer => !offer.isActive);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferIcon = (type: Offer['type']) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5" />;
      case 'fixed':
        return <Tag className="w-5 h-5" />;
      case 'bogo':
        return <Gift className="w-5 h-5" />;
      case 'free_delivery':
        return <Tag className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => (
    <div className={`bg-white rounded-xl overflow-hidden shadow-lg ${!offer.isActive ? 'opacity-60' : ''}`}>
      <div className="relative">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{offer.image}</div>
            <div className="flex items-center space-x-1 text-orange-100">
              {getOfferIcon(offer.type)}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
          <p className="text-orange-100 text-sm">{offer.description}</p>
        </div>
        
        {!offer.isActive && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            Expired
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-orange-600">
            {offer.discount}
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Valid until {formatDate(offer.validUntil)}</span>
          </div>
        </div>

        {offer.minOrder && (
          <p className="text-sm text-gray-600 mb-4">
            Minimum order: ${offer.minOrder}
          </p>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-100 rounded-lg p-3 font-mono text-center">
            <span className="text-lg font-bold">{offer.code}</span>
          </div>
          <button
            onClick={() => copyToClipboard(offer.code)}
            disabled={!offer.isActive}
            className={`px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              offer.isActive
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {copiedCode === offer.code ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h1>
          <p className="text-gray-600">
            Save money with our exclusive deals and promotions
          </p>
        </div>

        {/* Active Offers */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Gift className="w-6 h-6 text-orange-600" />
            <span>Active Offers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {activeOffers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No active offers right now
              </h3>
              <p className="text-gray-600">
                Check back later for exciting deals and promotions!
              </p>
            </div>
          )}
        </div>

        {/* Expired Offers */}
        {expiredOffers.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-gray-500" />
              <span>Recently Expired</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="mt-12 bg-white rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use Promo Codes</h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-1 mt-1">
                <span className="text-orange-600 font-bold text-sm">1</span>
              </div>
              <p>Copy the promo code from the offer card</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-1 mt-1">
                <span className="text-orange-600 font-bold text-sm">2</span>
              </div>
              <p>Add items to your cart and proceed to checkout</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-1 mt-1">
                <span className="text-orange-600 font-bold text-sm">3</span>
              </div>
              <p>Enter the promo code in the designated field</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-1 mt-1">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <p>Enjoy your discounted meal!</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}