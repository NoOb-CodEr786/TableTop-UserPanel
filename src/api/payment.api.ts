import axiosInstance from "./axiosInstance";

// Payment method types
export type PaymentMethod = "cash" | "card" | "upi" | "wallet" | "razorpay";

// Checkout request interface
export interface CheckoutRequest {
  hotelId: string;
  branchId: string;
  tableId: string;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  coinsToUse?: number;
  offerCode?: string;
}

// Razorpay initiate request interface
export interface RazorpayInitiateRequest {
  orderId: string;
  amount: number;
  userId: string;
  userPhone: string;
  userName: string;
  userEmail: string;
}

// Order interface
export interface Order {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    coins: number;
  };
  hotel: {
    _id: string;
    name: string;
    hotelId: string;
    id: string;
  };
  branch: {
    location: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      address: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
    _id: string;
    name: string;
    branchId: string;
    id: string;
  };
  table: {
    _id: string;
    tableNumber: string;
    capacity: number;
    identifier: string;
    qrScanData: {
      tableNo: string;
      tableId: string;
    };
    id: string;
  };
  tableNumber: string;
  items: Array<{
    foodItem: string;
    quantity: number;
    price: number;
    totalPrice: number;
    customizations: {
      addOns: any[];
      removedIngredients: any[];
    };
    foodItemName: string;
    foodType: string;
    _id: string;
    id: string;
  }>;
  status: string;
  subtotal: number;
  taxes: number;
  serviceCharge: number;
  originalPrice: number;
  coinDiscount: number;
  coinsUsed: number;
  totalPrice: number;
  payment: {
    paymentMethod: PaymentMethod;
    paymentStatus: string;
  };
  estimatedTime: number;
  specialInstructions: string;
  orderSource: string;
  rewardCoins: number;
  rewardPointsUsed: number;
  _id: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    _id: string;
    id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  orderDuration: any;
  totalItems: number;
  id: string;
}

// Checkout response interface
export interface CheckoutResponse {
  order: Order;
  checkout: {
    cartId: string;
    paymentRequired: boolean;
    orderConfirmed: boolean;
    message: string;
  };
  pricingBreakdown: {
    step1_itemsSubtotal: {
      description: string;
      amount: number;
      currency: string;
    };
    step2_afterOfferDiscount: {
      description: string;
      offerApplied: any;
      discountAmount: number;
      amountAfterOffer: number;
      currency: string;
    };
    step3_afterCoinDiscount: {
      description: string;
      coinsAvailable: number;
      coinsUsed: number;
      coinDiscountAmount: number;
      amountAfterCoins: number;
      currency: string;
    };
    step4_taxesAndCharges: {
      description: string;
      baseAmount: number;
      gstRate: string;
      gstAmount: number;
      serviceCharge: number;
      totalTaxesAndCharges: number;
      currency: string;
    };
    step5_finalTotal: {
      description: string;
      calculation: string;
      finalAmount: number;
      currency: string;
    };
    summary: {
      originalAmount: number;
      totalSavings: number;
      offerSavings: number;
      coinSavings: number;
      taxesAndCharges: number;
      amountToPay: number;
      currency: string;
    };
  };
}

// Razorpay response interface
export interface RazorpayInitiateResponse {
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  name: string;
  description: string;
  order_id: string;
  callback_url: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Payment status response interface
export interface PaymentStatusResponse {
  transactionId: string;
  orderId: string;
  razorpayPaymentId: string | null;
  status: "pending" | "success" | "failed" | "cancelled";
  amount: number;
  currency: string;
  method: string;
  createdAt: string;
}

class PaymentApi {
  private baseUrl = "/user/cart";
  private paymentBaseUrl = "/payment";

  // Cart checkout API
  async checkout(data: CheckoutRequest): Promise<{
    statusCode: number;
    data: CheckoutResponse;
    message: string;
    success: boolean;
  }> {
    const response = await axiosInstance.post(`${this.baseUrl}/checkout`, data);
    return response.data;
  }

  // Razorpay payment initiation API
  async initiateRazorpayPayment(data: RazorpayInitiateRequest): Promise<{
    statusCode: number;
    data: RazorpayInitiateResponse;
    message: string;
    success: boolean;
  }> {
    const response = await axiosInstance.post(
      `${this.paymentBaseUrl}/razorpay/initiate`,
      data
    );
    return response.data;
  }

  // Razorpay payment status check API
  async checkPaymentStatus(transactionId: string): Promise<{
    statusCode: number;
    data: PaymentStatusResponse;
    message: string;
    success: boolean;
  }> {
    const response = await axiosInstance.get(
      `${this.paymentBaseUrl}/razorpay/status/${transactionId}`
    );
    return response.data;
  }
}

export const paymentApi = new PaymentApi();
