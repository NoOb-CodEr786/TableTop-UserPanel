import { create } from 'zustand';
import { cartApi, Cart, CartItem as ApiCartItem, CartSummary } from '@/api/cart.api';

// Local cart item interface for compatibility
export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
  category: string;
  originalId?: string; // Store the original cart item _id for API operations
}

interface CartState {
  // API-based cart data
  cart: Cart | null;
  cartSummary: CartSummary | null;
  checkoutData: Cart | null; // Store checkout API response separately
  isLoading: boolean;
  isCheckoutLoading: boolean; // Separate loading state for checkout operations
  isCartLoaded: boolean; // Track if cart has been loaded at least once
  isCartPageInitialized: boolean; // Track if cart page has been initialized
  error: string | null;
  
  // UI state
  isCartVisible: boolean;
  
  // Hotel and branch context
  hotelId: string;
  branchId: string;
  
  // Actions
  setHotelAndBranch: (hotelId: string, branchId: string) => void;
  addToCart: (foodItemId: string, quantity?: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  initializeCart: () => Promise<void>; // Fetch cart only if not already loaded
  initializeCartPage: () => Promise<void>; // Initialize cart page with both cart and summary
  fetchCartSummary: () => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartLocal: () => void; // Clear cart locally without API call
  bulkUpdateCart: (updates: { itemId: string; quantity: number }[]) => Promise<void>;
  checkout: () => Promise<Cart | null>;
  setCartVisible: (visible: boolean) => void;
  
  // Legacy methods for compatibility
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

// Helper function to transform cart data
const transformCartItems = (cart: Cart | null): CartItem[] => {
  if (!cart || !cart.items) return [];
  
  return cart.items.map((item) => ({
    id: parseInt(item._id.slice(-8), 16) || Math.floor(Math.random() * 10000),
    name: item.foodItem.name,
    description: `${item.foodItem.category.name} • ${item.foodItem.preparationTime || 0}min prep`,
    price: item.price,
    image: item.foodItem.image,
    quantity: item.quantity,
    isVeg: item.foodItem.foodType === 'veg',
    category: item.foodItem.category.name,
    // Store the original cart item _id for API operations
    originalId: item._id,
  }));
};

export const useCartStore = create<CartState>((set, get) => ({
  // API-based cart data
  cart: null,
  cartSummary: null,
  checkoutData: null,
  isLoading: false,
  isCheckoutLoading: false,
  isCartLoaded: false,
  isCartPageInitialized: false,
  error: null,
  
  // Legacy compatibility
  cartItems: [],
  
  // UI state
  isCartVisible: false,
  
  // Hotel and branch context
  hotelId: '',
  branchId: '',
  
  // Set hotel and branch IDs
  setHotelAndBranch: (hotelId: string, branchId: string) => {
    set({ hotelId, branchId });
  },

  // Add item to cart
  addToCart: async (foodItemId: string, quantity: number = 1) => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) {
      set({ error: 'Hotel and branch not set' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.addToCart({
        foodItem: foodItemId,
        quantity,
        hotel: hotelId,
        branch: branchId
      });
      
      set({ 
        cart: response.data, 
        cartItems: transformCartItems(response.data),
        isLoading: false,
        isCartVisible: true,
        isCartPageInitialized: false // Reset initialization flag when cart changes
      });
      
      // Also fetch cart summary
      get().fetchCartSummary();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add item to cart', 
        isLoading: false 
      });
    }
  },

  // Fetch cart
  fetchCart: async () => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.getCart(hotelId, branchId);
      set({ 
        cart: response.data, 
        cartItems: transformCartItems(response.data),
        isLoading: false,
        isCartLoaded: true // Mark cart as loaded after successful fetch
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch cart', 
        isLoading: false,
        isCartLoaded: false // Don't mark as loaded if there was an error
      });
    }
  },

  // Initialize cart data - fetch only if not already loaded
  initializeCart: async () => {
    const { isCartLoaded, fetchCart } = get();
    
    // Skip if cart is already loaded
    if (isCartLoaded) {
      return;
    }
    
    // Fetch cart data for the first time
    await fetchCart();
  },

  // Initialize cart page - fetch cart and summary only if not already initialized
  initializeCartPage: async () => {
    const { isCartPageInitialized, hotelId, branchId } = get();
    
    // Skip if cart page is already initialized
    if (isCartPageInitialized) {
      return;
    }

    if (!hotelId || !branchId) {
      set({ error: 'Hotel and branch not set' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Fetch both cart and cart summary in parallel
      const [cartResponse, summaryResponse] = await Promise.all([
        cartApi.getCart(hotelId, branchId),
        cartApi.getCartSummary(hotelId, branchId)
      ]);

      set({ 
        cart: cartResponse.data, 
        cartItems: transformCartItems(cartResponse.data),
        cartSummary: summaryResponse.data,
        isLoading: false,
        isCartLoaded: true,
        isCartPageInitialized: true // Mark cart page as initialized
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to initialize cart page', 
        isLoading: false,
        isCartPageInitialized: false
      });
    }
  },

  // Fetch cart summary
  fetchCartSummary: async () => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    try {
      const response = await cartApi.getCartSummary(hotelId, branchId);
      set({ cartSummary: response.data });
    } catch (error: any) {
      console.error('Failed to fetch cart summary:', error);
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (itemId: string, quantity: number) => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.updateCartItem(itemId, {
        quantity,
        hotelId,
        branchId
      });
      
      set({ 
        cart: response.data, 
        cartItems: transformCartItems(response.data),
        isLoading: false 
      });
      get().fetchCartSummary();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update item quantity', 
        isLoading: false 
      });
    }
  },

  // Remove cart item
  removeCartItem: async (itemId: string) => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.removeCartItem(itemId, {
        hotelId,
        branchId
      });
      
      set({ 
        cart: response.data, 
        cartItems: transformCartItems(response.data),
        isLoading: false 
      });
      get().fetchCartSummary();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove item', 
        isLoading: false 
      });
    }
  },

  // Clear cart
  clearCart: async () => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    set({ isLoading: true, error: null });
    try {
      await cartApi.clearCart({ hotelId, branchId });
      set({ 
        cart: null, 
        cartItems: [],
        cartSummary: null, 
        isLoading: false,
        isCartPageInitialized: false // Reset initialization flag when cart is cleared
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to clear cart', 
        isLoading: false 
      });
    }
  },

  // Clear cart locally without API call (for post-checkout cleanup)
  clearCartLocal: () => {
    set({ 
      cart: null, 
      cartItems: [],
      cartSummary: null,
      isCartPageInitialized: false // Reset initialization flag when cart is cleared
    });
  },

  // Bulk update cart quantities
  bulkUpdateCart: async (updates: { itemId: string; quantity: number }[]) => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.bulkUpdateCart({
        updates,
        hotelId,
        branchId
      });
      
      set({ 
        cart: response.data, 
        cartItems: transformCartItems(response.data),
        isLoading: false 
      });
      get().fetchCartSummary();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to bulk update cart', 
        isLoading: false 
      });
    }
  },

  // Checkout cart
  checkout: async () => {
    const { hotelId, branchId } = get();
    if (!hotelId || !branchId) return null;

    set({ isCheckoutLoading: true, error: null });
    try {
      const response = await cartApi.checkout({ hotelId, branchId });
      set({ 
        checkoutData: response.data, // Store checkout data separately
        isCheckoutLoading: false 
      });
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to checkout cart', 
        isCheckoutLoading: false 
      });
      return null;
    }
  },

  // Set cart visibility
  setCartVisible: (visible: boolean) => {
    set({ isCartVisible: visible });
  },

  removeFromCart: (id: number) => {
    const { cartItems } = get();
    const item = cartItems.find(item => item.id === id);
    if (item && item.originalId) {
      get().removeCartItem(item.originalId);
    }
  },

  updateQuantity: (id: number, quantity: number) => {
    const { cartItems } = get();
    const item = cartItems.find(item => item.id === id);
    if (item && item.originalId) {
      if (quantity <= 0) {
        get().removeCartItem(item.originalId);
      } else {
        get().updateCartItemQuantity(item.originalId, quantity);
      }
    }
  },

  getTotalItems: () => {
    const { cartSummary } = get();
    return cartSummary?.totalItems || 0;
  },

  getTotalAmount: () => {
    const { cartSummary } = get();
    return cartSummary?.subtotal || 0;
  }
}));