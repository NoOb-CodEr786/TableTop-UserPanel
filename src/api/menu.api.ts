import axiosInstance from './axiosInstance';

// Types
export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  foodType: 'veg' | 'non-veg' | 'vegan';
  spiceLevel: 'mild' | 'medium' | 'hot';
  isAvailable: boolean;
  isRecommended: boolean;
  isBestSeller: boolean;
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
    id: string;
  };
  image: string;
  images: string[];
  preparationTime: number;
  allergens: string[];
  displayOrder: number;
  averageRating: number;
  createdAt: string;
  effectivePrice: number;
  discountPercentage: number;
  id: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  categoryId: string;
  displayOrder: number;
  itemCount: number;
}

export interface MenuStats {
  totalCategories: number;
  totalItems: number;
  vegItems: number;
  nonVegItems: number;
  veganItems: number;
  recommendedItems: number;
  bestSellerItems: number;
}

export interface MenuResponse {
  statusCode: number;
  data: {
    foodItems: FoodItem[];
    stats: MenuStats;
    lastUpdated: string;
  };
  message: string;
  success: boolean;
}

export interface CategoriesResponse {
  statusCode: number;
  data: {
    categories: Category[];
    totalCategories: number;
    foodType?: string;
    hotelId: string;
    branchId: string;
    filteredAt: string;
  };
  message: string;
  success: boolean;
}

export interface MenuFilters {
  foodType?: 'veg' | 'non-veg' | 'vegan';
  isRecommended?: boolean;
  isBestSeller?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  search?: string;
  category?: string;
}

// API functions
export const menuApi = {
  /**
   * Get menu items for a specific hotel branch with optional filters
   */
  getMenuItems: async (
    hotelId: string,
    branchId: string,
    filters?: MenuFilters
  ): Promise<MenuResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.foodType) params.append('foodType', filters.foodType);
    if (filters?.isRecommended) params.append('isRecommended', filters.isRecommended.toString());
    if (filters?.isBestSeller) params.append('isBestSeller', filters.isBestSeller.toString());
    if (filters?.spiceLevel) params.append('spiceLevel', filters.spiceLevel);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);

    const queryString = params.toString();
    const url = `/user/menu/location/${hotelId}/${branchId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get<MenuResponse>(url);
    return response.data;
  },

  /**
   * Get categories for a specific hotel branch with optional food type filter
   */
  getCategories: async (
    hotelId: string,
    branchId: string,
    foodType?: 'veg' | 'non-veg' | 'vegan'
  ): Promise<CategoriesResponse> => {
    const params = new URLSearchParams();
    
    if (foodType) params.append('foodType', foodType);

    const queryString = params.toString();
    const url = `/user/menu/categories/hotel/${hotelId}/${branchId}/${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get<CategoriesResponse>(url);
    return response.data;
  },
};