import { create } from 'zustand';
import { 
  coinsApi, 
  CoinBalance, 
  CoinDetails, 
  CoinHistory, 
  CoinTransaction,
  PotentialEarnings,
  MaxUsableCoins,
  DiscountCalculation,
  ExpiringCoins,
  HotelCoinInfo,
  CalculateDiscountRequest
} from '@/api/coins.api';

interface CoinStore {
  // State
  balance: CoinBalance | null;
  coinDetails: CoinDetails | null;
  history: CoinHistory | null;
  expiringCoins: ExpiringCoins | null;
  hotelCoinInfo: HotelCoinInfo | null;
  
  // Calculation results
  potentialEarnings: PotentialEarnings | null;
  maxUsableCoins: MaxUsableCoins | null;
  discountCalculation: DiscountCalculation | null;
  
  // Loading states
  isLoading: boolean;
  isBalanceLoading: boolean;
  isHistoryLoading: boolean;
  isCalculatingEarnings: boolean;
  isCalculatingMaxUsable: boolean;
  isCalculatingDiscount: boolean;
  isHotelInfoLoading: boolean;
  
  // Error states
  error: string | null;
  calculationError: string | null;
  
  // Actions
  fetchCoinBalance: () => Promise<void>;
  fetchCoinDetails: () => Promise<void>;
  fetchCoinHistory: (page?: number, limit?: number) => Promise<void>;
  fetchExpiringCoins: (daysAhead?: number) => Promise<void>;
  fetchHotelCoinInfo: (hotelId: string) => Promise<void>;
  
  // Calculation actions
  calculatePotentialEarnings: (orderValue: number, hotelId: string, branchId: string) => Promise<void>;
  calculateMaxUsableCoins: (orderValue: number, hotelId: string, branchId: string) => Promise<void>;
  calculateDiscount: (data: CalculateDiscountRequest) => Promise<void>;
  
  // Utility actions
  clearCalculations: () => void;
  clearErrors: () => void;
  reset: () => void;
}

export const useCoinStore = create<CoinStore>((set, get) => ({
  // Initial state
  balance: null,
  coinDetails: null,
  history: null,
  expiringCoins: null,
  hotelCoinInfo: null,
  
  potentialEarnings: null,
  maxUsableCoins: null,
  discountCalculation: null,
  
  isLoading: false,
  isBalanceLoading: false,
  isHistoryLoading: false,
  isCalculatingEarnings: false,
  isCalculatingMaxUsable: false,
  isCalculatingDiscount: false,
  isHotelInfoLoading: false,
  
  error: null,
  calculationError: null,

  // Actions
  fetchCoinBalance: async () => {
    set({ isBalanceLoading: true, error: null });
    try {
      const balance = await coinsApi.getCoinBalance();
      set({ balance, isBalanceLoading: false });
    } catch (error) {
      console.error('Error fetching coin balance:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch coin balance',
        isBalanceLoading: false 
      });
    }
  },

  fetchCoinDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const coinDetails = await coinsApi.getCoinDetails();
      set({ 
        coinDetails, 
        balance: coinDetails.balance,
        history: coinDetails.history,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching coin details:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch coin details',
        isLoading: false 
      });
    }
  },

  fetchCoinHistory: async (page = 1, limit = 20) => {
    set({ isHistoryLoading: true, error: null });
    try {
      const history = await coinsApi.getCoinHistory(page, limit);
      set({ history, isHistoryLoading: false });
    } catch (error) {
      console.error('Error fetching coin history:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch coin history',
        isHistoryLoading: false 
      });
    }
  },

  fetchExpiringCoins: async (daysAhead = 30) => {
    set({ isLoading: true, error: null });
    try {
      const expiringCoins = await coinsApi.getExpiringCoins(daysAhead);
      set({ expiringCoins, isLoading: false });
    } catch (error) {
      console.error('Error fetching expiring coins:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch expiring coins',
        isLoading: false 
      });
    }
  },

  fetchHotelCoinInfo: async (hotelId: string) => {
    set({ isHotelInfoLoading: true, error: null });
    try {
      const hotelCoinInfo = await coinsApi.getHotelCoinInfo(hotelId);
      set({ hotelCoinInfo, isHotelInfoLoading: false });
    } catch (error) {
      console.error('Error fetching hotel coin info:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch hotel coin info',
        isHotelInfoLoading: false 
      });
    }
  },

  calculatePotentialEarnings: async (orderValue: number, hotelId: string, branchId: string) => {
    set({ isCalculatingEarnings: true, calculationError: null });
    try {
      const potentialEarnings = await coinsApi.calculatePotentialEarnings(orderValue, hotelId, branchId);
      set({ potentialEarnings, isCalculatingEarnings: false });
    } catch (error) {
      console.error('Error calculating potential earnings:', error);
      set({ 
        calculationError: error instanceof Error ? error.message : 'Failed to calculate potential earnings',
        isCalculatingEarnings: false 
      });
    }
  },

  calculateMaxUsableCoins: async (orderValue: number, hotelId: string, branchId: string) => {
    set({ isCalculatingMaxUsable: true, calculationError: null });
    try {
      const maxUsableCoins = await coinsApi.getMaxUsableCoins(orderValue, hotelId, branchId);
      set({ maxUsableCoins, isCalculatingMaxUsable: false });
    } catch (error) {
      console.error('Error calculating max usable coins:', error);
      set({ 
        calculationError: error instanceof Error ? error.message : 'Failed to calculate max usable coins',
        isCalculatingMaxUsable: false 
      });
    }
  },

  calculateDiscount: async (data: CalculateDiscountRequest) => {
    set({ isCalculatingDiscount: true, calculationError: null });
    try {
      const discountCalculation = await coinsApi.calculateDiscount(data);
      set({ discountCalculation, isCalculatingDiscount: false });
    } catch (error) {
      console.error('Error calculating discount:', error);
      set({ 
        calculationError: error instanceof Error ? error.message : 'Failed to calculate discount',
        isCalculatingDiscount: false 
      });
    }
  },

  clearCalculations: () => {
    set({
      potentialEarnings: null,
      maxUsableCoins: null,
      discountCalculation: null,
      calculationError: null
    });
  },

  clearErrors: () => {
    set({
      error: null,
      calculationError: null
    });
  },

  reset: () => {
    set({
      balance: null,
      coinDetails: null,
      history: null,
      expiringCoins: null,
      hotelCoinInfo: null,
      potentialEarnings: null,
      maxUsableCoins: null,
      discountCalculation: null,
      isLoading: false,
      isBalanceLoading: false,
      isHistoryLoading: false,
      isCalculatingEarnings: false,
      isCalculatingMaxUsable: false,
      isCalculatingDiscount: false,
      isHotelInfoLoading: false,
      error: null,
      calculationError: null
    });
  }
}));
