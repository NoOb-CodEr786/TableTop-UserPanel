import axiosInstance from './axiosInstance';

export interface CartItem {
  _id: string;
  foodItem: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    foodType: 'veg' | 'non-veg' | 'egg';
    spiceLevel?: string;
    isAvailable: boolean;
    category: {
      _id: string;
      name: string;
      id: string;
    };
    image: string;
    preparationTime?: number;
    quantityAvailable: number;
    effectivePrice: number;
    discountPercentage?: number;
    id: string;
  };
  quantity: number;
  price: number;
  totalPrice: number;
  customizations: {
    addOns: any[];
    removedIngredients: any[];
  };
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  hotel: {
    _id: string;
    name: string;
    id: string;
  };
  branch: {
    _id: string;
    name: string;
    id: string;
  };
  subtotal: number;
  totalItems: number;
  status: string;
  isValidated: boolean;
  expiresAt: string;
  validationErrors: any[];
  createdAt: string;
  updatedAt: string;
  totalDiscount: number;
  id: string;
}

export interface CartSummary {
  subtotal: number;
  totalItems: number;
  itemCount: number;
  isEmpty: boolean;
}

export interface AddToCartRequest {
  foodItem: string;
  quantity: number;
  hotel: string;
  branch: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  hotelId: string;
  branchId: string;
}

export interface RemoveCartItemRequest {
  hotelId: string;
  branchId: string;
}

export interface ClearCartRequest {
  hotelId: string;
  branchId: string;
}

export interface CheckoutRequest {
  hotelId: string;
  branchId: string;
}

export interface BulkUpdateCartRequest {
  updates: {
    itemId: string;
    quantity: number;
  }[];
  hotelId: string;
  branchId: string;
}

class CartApi {
  private baseUrl = '/user/cart';

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  // Get cart items
  async getCart(hotelId: string, branchId: string): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.get(`${this.baseUrl}/${hotelId}/${branchId}`);
    return response.data;
  }

  // Get cart summary
  async getCartSummary(hotelId: string, branchId: string): Promise<{ data: CartSummary; message: string; success: boolean }> {
    const response = await axiosInstance.get(`${this.baseUrl}/summary/${hotelId}/${branchId}`);
    return response.data;
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.put(`${this.baseUrl}/item/${itemId}`, data);
    return response.data;
  }

  // Remove specific item from cart
  async removeCartItem(itemId: string, data: RemoveCartItemRequest): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/item/${itemId}`, { data });
    return response.data;
  }

  // Clear all items from cart
  async clearCart(data: ClearCartRequest): Promise<{ message: string; success: boolean }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/clear`, { data });
    return response.data;
  }

  // Checkout cart
  async checkout(data: CheckoutRequest): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.post(`${this.baseUrl}/checkout`, data);
    return response.data;
  }

  // Bulk update cart quantities
  async bulkUpdateCart(data: BulkUpdateCartRequest): Promise<{ data: Cart; message: string; success: boolean }> {
    const response = await axiosInstance.put(`${this.baseUrl}/bulk-update`, data);
    return response.data;
  }
}

export const cartApi = new CartApi();