import { create } from 'zustand';
import { menuApi, FoodItem, Category, MenuFilters, MenuStats } from '@/api/menu.api';

interface MenuState {
  // Data - Separate datasets for different components
  allFoodItems: FoodItem[]; // Complete dataset - loaded once
  
  // Home page data (OurMenu component)
  homeFoodItems: FoodItem[]; // Items for home page display
  homeCategories: Category[];
  homeSelectedCategory: string | null;
  
  // Menu page data (Menu page component)
  menuPageItems: FoodItem[]; // Items for menu page display
  menuPageCategories: Category[];
  menuPageSelectedCategory: string | null;
  menuPageSearchQuery: string;
  
  // Shared data
  bestsellerItems: FoodItem[];
  stats: MenuStats | null;
  
  // Loading states - Separate for each component
  isLoadingHomeItems: boolean;
  isLoadingHomeCategories: boolean;
  isLoadingMenuPageItems: boolean;
  isLoadingMenuPageCategories: boolean;
  isLoadingBestsellers: boolean;
  isInitialLoading: boolean;
  
  // Hotel/Branch context
  hotelId: string | null;
  branchId: string | null;
  
  // Error states
  homeError: string | null;
  menuPageError: string | null;
  
  // Cache flags
  isHomeDataLoaded: boolean;
  isMenuPageDataLoaded: boolean;
  bestsellersLoaded: boolean;
  
  // Actions
  setHotelAndBranch: (hotelId: string, branchId: string) => void;
  
  // Home page actions (OurMenu component)
  setHomeSelectedCategory: (categoryId: string | null) => void;
  initializeHomeData: () => Promise<void>;
  filterHomeByCateogry: (categoryId: string | null) => Promise<void>;
  getHomeDisplayItems: () => FoodItem[];
  
  // Menu page actions (Menu page component)
  setMenuPageSelectedCategory: (categoryId: string | null) => void;
  setMenuPageSearchQuery: (query: string) => void;
  initializeMenuPageData: () => Promise<void>;
  filterMenuPageByCategory: (categoryId: string | null) => Promise<void>;
  searchMenuPageItems: (query: string) => Promise<void>;
  filterMenuPageByType: (foodType: 'veg' | 'non-veg' | null) => Promise<void>;
  getMenuPageDisplayItems: () => FoodItem[];
  
  // Shared actions
  initializeBestsellers: () => Promise<void>;
}

const initialFilters: MenuFilters = {};

export const useMenuStore = create<MenuState>((set, get) => ({
  // Initial state
  allFoodItems: [],
  
  // Home page data
  homeFoodItems: [],
  homeCategories: [],
  homeSelectedCategory: null,
  
  // Menu page data
  menuPageItems: [],
  menuPageCategories: [],
  menuPageSelectedCategory: null,
  menuPageSearchQuery: '',
  
  // Shared data
  bestsellerItems: [],
  stats: null,
  
  // Loading states
  isLoadingHomeItems: false,
  isLoadingHomeCategories: false,
  isLoadingMenuPageItems: false,
  isLoadingMenuPageCategories: false,
  isLoadingBestsellers: false,
  isInitialLoading: false,
  
  // Hotel/Branch context
  hotelId: null,
  branchId: null,
  
  // Error states
  homeError: null,
  menuPageError: null,
  
  // Cache flags
  isHomeDataLoaded: false,
  isMenuPageDataLoaded: false,
  bestsellersLoaded: false,

  // Actions
  setHotelAndBranch: (hotelId: string, branchId: string) => {
    set({ hotelId, branchId });
  },

  // Home page actions
  setHomeSelectedCategory: (categoryId: string | null) => {
    set({ 
      homeSelectedCategory: categoryId,
      homeError: null 
    });
  },

  // Menu page actions
  setMenuPageSelectedCategory: (categoryId: string | null) => {
    set({ 
      menuPageSelectedCategory: categoryId,
      menuPageError: null 
    });
  },

  setMenuPageSearchQuery: (query: string) => {
    set({ 
      menuPageSearchQuery: query,
      menuPageError: null 
    });
  },

  // Home page API actions (OurMenu component)
  initializeHomeData: async () => {
    const { hotelId, branchId, isHomeDataLoaded } = get();
    
    if (!hotelId || !branchId) {
      set({ homeError: 'Hotel ID and Branch ID are required' });
      return;
    }

    // Skip if data is already loaded
    if (isHomeDataLoaded) {
      return;
    }

    set({ isLoadingHomeItems: true, isLoadingHomeCategories: true, homeError: null });

    try {
      // Load home page data in parallel
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuApi.getMenuItems(hotelId, branchId, {}), // All items for home
        menuApi.getCategories(hotelId, branchId)
      ]);

      if (menuResponse.success && categoriesResponse.success) {
        set({ 
          allFoodItems: menuResponse.data.foodItems,
          homeFoodItems: menuResponse.data.foodItems, // Initially show all
          homeCategories: categoriesResponse.data.categories,
          stats: menuResponse.data.stats,
          isHomeDataLoaded: true,
          isLoadingHomeItems: false,
          isLoadingHomeCategories: false
        });
      } else {
        const errorMsg = menuResponse.message || categoriesResponse.message || 'Failed to load home data';
        set({ 
          homeError: errorMsg,
          isLoadingHomeItems: false,
          isLoadingHomeCategories: false
        });
      }
    } catch (error) {
      console.error('Error initializing home data:', error);
      set({ 
        homeError: 'Failed to load home data',
        isLoadingHomeItems: false,
        isLoadingHomeCategories: false
      });
    }
  },

  filterHomeByCateogry: async (categoryId: string | null) => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ homeError: 'Hotel ID and Branch ID are required' });
      return;
    }

    set({ isLoadingHomeItems: true, homeError: null, homeSelectedCategory: categoryId });

    try {
      const filters = categoryId ? { category: categoryId } : {};
      const response = await menuApi.getMenuItems(hotelId, branchId, filters);
      
      if (response.success) {
        set({ 
          homeFoodItems: response.data.foodItems,
          stats: response.data.stats,
          isLoadingHomeItems: false 
        });
      } else {
        set({ 
          homeError: response.message || 'Failed to filter home items',
          isLoadingHomeItems: false 
        });
      }
    } catch (error) {
      console.error('Error filtering home by category:', error);
      set({ 
        homeError: 'Failed to filter home items',
        isLoadingHomeItems: false 
      });
    }
  },

  getHomeDisplayItems: () => {
    return get().homeFoodItems;
  },

  // Menu page API actions (Menu page component)
  initializeMenuPageData: async () => {
    const { hotelId, branchId, isMenuPageDataLoaded } = get();
    
    if (!hotelId || !branchId) {
      set({ menuPageError: 'Hotel ID and Branch ID are required' });
      return;
    }

    // Skip if data is already loaded
    if (isMenuPageDataLoaded) {
      return;
    }

    set({ isLoadingMenuPageItems: true, isLoadingMenuPageCategories: true, menuPageError: null });

    try {
      // Load menu page data in parallel
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuApi.getMenuItems(hotelId, branchId, {}), // All items for menu page
        menuApi.getCategories(hotelId, branchId)
      ]);

      if (menuResponse.success && categoriesResponse.success) {
        set({ 
          allFoodItems: menuResponse.data.foodItems,
          menuPageItems: menuResponse.data.foodItems, // Initially show all
          menuPageCategories: categoriesResponse.data.categories,
          stats: menuResponse.data.stats,
          isMenuPageDataLoaded: true,
          isLoadingMenuPageItems: false,
          isLoadingMenuPageCategories: false
        });
      } else {
        const errorMsg = menuResponse.message || categoriesResponse.message || 'Failed to load menu page data';
        set({ 
          menuPageError: errorMsg,
          isLoadingMenuPageItems: false,
          isLoadingMenuPageCategories: false
        });
      }
    } catch (error) {
      console.error('Error initializing menu page data:', error);
      set({ 
        menuPageError: 'Failed to load menu page data',
        isLoadingMenuPageItems: false,
        isLoadingMenuPageCategories: false
      });
    }
  },

  filterMenuPageByCategory: async (categoryId: string | null) => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ menuPageError: 'Hotel ID and Branch ID are required' });
      return;
    }

    set({ isLoadingMenuPageItems: true, menuPageError: null, menuPageSelectedCategory: categoryId });

    try {
      const filters = categoryId ? { category: categoryId } : {};
      const response = await menuApi.getMenuItems(hotelId, branchId, filters);
      
      if (response.success) {
        set({ 
          menuPageItems: response.data.foodItems,
          stats: response.data.stats,
          isLoadingMenuPageItems: false 
        });
      } else {
        set({ 
          menuPageError: response.message || 'Failed to filter menu page items',
          isLoadingMenuPageItems: false 
        });
      }
    } catch (error) {
      console.error('Error filtering menu page by category:', error);
      set({ 
        menuPageError: 'Failed to filter menu page items',
        isLoadingMenuPageItems: false 
      });
    }
  },

  searchMenuPageItems: async (query: string) => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ menuPageError: 'Hotel ID and Branch ID are required' });
      return;
    }

    set({ isLoadingMenuPageItems: true, menuPageError: null, menuPageSearchQuery: query });

    try {
      const filters = { search: query || undefined };
      const response = await menuApi.getMenuItems(hotelId, branchId, filters);
      
      if (response.success) {
        set({ 
          menuPageItems: response.data.foodItems,
          stats: response.data.stats,
          isLoadingMenuPageItems: false 
        });
      } else {
        set({ 
          menuPageError: response.message || 'Failed to search menu page items',
          isLoadingMenuPageItems: false 
        });
      }
    } catch (error) {
      console.error('Error searching menu page items:', error);
      set({ 
        menuPageError: 'Failed to search menu page items',
        isLoadingMenuPageItems: false 
      });
    }
  },

  filterMenuPageByType: async (foodType: 'veg' | 'non-veg' | null) => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ menuPageError: 'Hotel ID and Branch ID are required' });
      return;
    }

    set({ isLoadingMenuPageItems: true, menuPageError: null });

    try {
      const filters = foodType ? { foodType } : {};
      const response = await menuApi.getMenuItems(hotelId, branchId, filters);
      
      if (response.success) {
        set({ 
          menuPageItems: response.data.foodItems,
          stats: response.data.stats,
          isLoadingMenuPageItems: false 
        });
      } else {
        set({ 
          menuPageError: response.message || 'Failed to filter menu page items by type',
          isLoadingMenuPageItems: false 
        });
      }
    } catch (error) {
      console.error('Error filtering menu page items by type:', error);
      set({ 
        menuPageError: 'Failed to filter menu page items by type',
        isLoadingMenuPageItems: false 
      });
    }
  },

  getMenuPageDisplayItems: () => {
    return get().menuPageItems;
  },

  // Shared actions
  initializeBestsellers: async () => {
    const { hotelId, branchId, bestsellersLoaded } = get();
    
    if (!hotelId || !branchId) {
      return;
    }

    // Skip if data is already loaded
    if (bestsellersLoaded) {
      return;
    }

    set({ isLoadingBestsellers: true });

    try {
      const response = await menuApi.getMenuItems(hotelId, branchId, { isBestSeller: true });
      
      if (response.success) {
        set({ 
          bestsellerItems: response.data.foodItems,
          bestsellersLoaded: true,
          isLoadingBestsellers: false 
        });
      } else {
        set({ 
          isLoadingBestsellers: false 
        });
      }
    } catch (error) {
      console.error('Error loading bestsellers:', error);
      set({ 
        isLoadingBestsellers: false 
      });
    }
  },
}));