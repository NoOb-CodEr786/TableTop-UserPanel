import axiosInstance from './axiosInstance';

// Interfaces
export interface CoinBalance {
  currentBalance: number;
  totalEarned: number;
  totalUsed: number;
  netGain: number;
  lastActivity: string | null;
  note?: string;
}

export interface CoinTransaction {
  _id: string;
  user: string;
  type: 'earned' | 'used' | 'expired';
  amount: number;
  balanceAfter: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  expiresAt: string;
  affectsExpiry: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    orderValue?: number;
    coinsRate?: number;
    coinValue?: number;
  };
  order?: {
    _id: string;
    totalPrice: number;
    createdAt: string;
    orderDuration: number | null;
    totalItems: number;
    id: string;
  };
}

export interface CoinHistory {
  docs: CoinTransaction[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface CoinDetails {
  balance: CoinBalance;
  history: CoinHistory;
  expiringCoins: CoinTransaction[];
}

export interface PotentialEarnings {
  orderValue: number;
  coinsEarned: number;
  coinValue: number;
  coinsPerRupee: number;
  minimumOrderValue: number;
  maxCoinsPerOrder: number;
  eligible: boolean;
  coinExpiry: string;
  context: {
    location: string;
    hotelId: string;
    branchId: string;
  };
}

export interface MaxUsableCoins {
  orderValue: number;
  userCoinBalance: number;
  maxCoinsUsable: number;
  systemMaxCoins: number;
  maxDiscount: number;
  coinValue: number;
  maxUsagePercent: number;
}

export interface DiscountCalculation {
  coinsToUse: number;
  discount: number;
  coinValue: number;
  finalOrderValue: number;
  maxCoinsUsable: number;
  userCoinBalance: number;
}

export interface ExpiringCoins {
  expiringCoins: CoinTransaction[];
  totalExpiringAmount: number;
  daysAhead: number;
}

export interface HotelCoinInfo {
  isActive: boolean;
  minimumOrderValue: number;
  coinValue: number;
  coinsPerRupee: number;
  maxCoinsPerOrder: number;
  maxCoinUsagePercent: number;
  coinExpiryDays: number;
  rules: {
    earning: string;
    usage: string;
    value: string;
    expiry: string;
  };
}

export interface CalculateDiscountRequest {
  orderValue: number;
  coinsToUse: number;
  hotelId: string;
  branchId: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

class CoinsApi {
  // Get current coin balance
  async getCoinBalance(): Promise<CoinBalance> {
    const response = await axiosInstance.get<ApiResponse<CoinBalance>>('/user/coins/balance');
    return response.data.data;
  }

  // Get detailed coin information including balance and history
  async getCoinDetails(): Promise<CoinDetails> {
    const response = await axiosInstance.get<ApiResponse<CoinDetails>>('/user/coins/details');
    return response.data.data;
  }

  // Calculate potential earnings for an order
  async calculatePotentialEarnings(
    orderValue: number,
    hotelId: string,
    branchId: string
  ): Promise<PotentialEarnings> {
    const response = await axiosInstance.get<ApiResponse<PotentialEarnings>>(
      `/user/coins/calculate-earning?orderValue=${orderValue}&hotelId=${hotelId}&branchId=${branchId}`
    );
    return response.data.data;
  }

  // Check maximum usable coins for an order
  async getMaxUsableCoins(
    orderValue: number,
    hotelId: string,
    branchId: string
  ): Promise<MaxUsableCoins> {
    const response = await axiosInstance.get<ApiResponse<MaxUsableCoins>>(
      `/user/coins/max-usable?orderValue=${orderValue}&hotelId=${hotelId}&branchId=${branchId}`
    );
    return response.data.data;
  }

  // Calculate specific discount based on coins to use
  async calculateDiscount(data: CalculateDiscountRequest): Promise<DiscountCalculation> {
    const response = await axiosInstance.post<ApiResponse<DiscountCalculation>>(
      '/user/coins/calculate-discount',
      data
    );
    return response.data.data;
  }

  // Get transaction history
  async getCoinHistory(page: number = 1, limit: number = 20): Promise<CoinHistory> {
    const response = await axiosInstance.get<ApiResponse<CoinHistory>>(
      `/user/coins/history?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  // Get coins about to expire
  async getExpiringCoins(daysAhead: number = 30): Promise<ExpiringCoins> {
    const response = await axiosInstance.get<ApiResponse<ExpiringCoins>>(
      `/user/coins/expiring?daysAhead=${daysAhead}`
    );
    return response.data.data;
  }

  // Get hotel coin system information
  async getHotelCoinInfo(hotelId: string): Promise<HotelCoinInfo> {
    const response = await axiosInstance.get<ApiResponse<HotelCoinInfo>>(
      `/user/coins/info?hotelId=${hotelId}`
    );
    return response.data.data;
  }
}

export const coinsApi = new CoinsApi();
