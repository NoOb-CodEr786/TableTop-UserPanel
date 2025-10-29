import instance from "./axiosInstance";
import axios from "axios";

const plainInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

export interface OfferLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface OfferHotel {
  _id: string;
  name: string;
  hotelId: string;
}

export interface OfferBranch {
  _id: string;
  name: string;
  location: OfferLocation;
  branchId: string;
}

export interface Offer {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  hotel: OfferHotel;
  branch: OfferBranch;
  validDays: string[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  usageLimit?: number;
  usedCount?: number;
}

export interface GetAvailableOffersParams {
  hotelId: string;
  branchId: string;
}

export interface CartItem {
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface UserCart {
  totalAmount: number;
  itemCount: number;
  items: CartItem[];
}

export interface Recommendation {
  isRecommended: boolean;
  eligibilityStatus: "eligible" | "not_eligible";
  reason: string;
  recommendation: string;
  potentialSavings: number;
  minOrderValue: number;
  shortfall: number;
}

export interface OfferWithRecommendation extends Offer {
  recommendation: Recommendation;
}

export interface OfferRecommendationsResponse {
  userCart: UserCart;
  recommended: {
    count: number;
    offers: OfferWithRecommendation[];
  };
  nonRecommended: {
    count: number;
    offers: OfferWithRecommendation[];
  };
  metadata: {
    totalOffersAvailable: number;
    scannedLocation: {
      hotelId: string;
      branchId: string;
    };
  };
}

/**
 * Get available offers for a specific hotel and branch (No Auth required)
 */
export const getAvailableOffers = async (params: GetAvailableOffersParams) => {
  return plainInstance.get(`/user/offers/available/${params.hotelId}/${params.branchId}`);
};

/**
 * Get offer recommendations based on user's cart (Auth required)
 */
export const getOfferRecommendations = async (params: GetAvailableOffersParams) => {
  return instance.get(`/user/offers/recommendations/${params.hotelId}/${params.branchId}`);
};
