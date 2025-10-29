import { create } from "zustand";
import { getAvailableOffers, Offer } from "@/api/offers.api";

interface OffersState {
  // State
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  selectedOffer: Offer | null;
  appliedOffer: Offer | null;
  hotelId: string | null;
  branchId: string | null;
  isDataLoaded: boolean;
  
  // Actions
  setHotelAndBranch: (hotelId: string, branchId: string) => void;
  fetchAvailableOffers: () => Promise<void>;
  initializeOffersData: () => Promise<void>;
  selectOffer: (offer: Offer) => void;
  clearSelectedOffer: () => void;
  applyOffer: (offer: Offer) => void;
  removeAppliedOffer: () => void;
  clearError: () => void;
}

export const useOffersStore = create<OffersState>((set, get) => ({
  // Initial state
  offers: [],
  isLoading: false,
  error: null,
  selectedOffer: null,
  appliedOffer: null,
  hotelId: null,
  branchId: null,
  isDataLoaded: false,

  setHotelAndBranch: (hotelId: string, branchId: string) => {
    set({ hotelId, branchId });
  },

  fetchAvailableOffers: async () => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ error: "Hotel ID and Branch ID are required" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await getAvailableOffers({ hotelId, branchId });
      const offers = response.data.data;
      
      set({
        offers,
        isLoading: false,
        error: null,
        isDataLoaded: true,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch offers";
      set({
        error: errorMessage,
        isLoading: false,
        offers: [],
      });
    }
  },

  initializeOffersData: async () => {
    const { isDataLoaded, hotelId, branchId } = get();
    
    // Only fetch if data hasn't been loaded yet
    if (!isDataLoaded && hotelId && branchId) {
      await get().fetchAvailableOffers();
    }
  },

  selectOffer: (offer: Offer) => {
    set({ selectedOffer: offer });
  },

  clearSelectedOffer: () => {
    set({ selectedOffer: null });
  },

  applyOffer: (offer: Offer) => {
    set({ appliedOffer: offer, selectedOffer: null });
  },

  removeAppliedOffer: () => {
    set({ appliedOffer: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
