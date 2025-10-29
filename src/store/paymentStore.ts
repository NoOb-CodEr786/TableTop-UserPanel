import { create } from 'zustand';
import { 
  paymentApi, 
  CheckoutRequest, 
  CheckoutResponse, 
  RazorpayInitiateRequest,
  RazorpayInitiateResponse,
  PaymentStatusResponse,
  PaymentMethod 
} from '@/api/payment.api';

// Checkout form data interface
export interface CheckoutFormData {
  tableId: string;
  paymentMethod: PaymentMethod;
  customerNote: string;
  coinsToUse: number;
  offerCode: string;
}

interface PaymentState {
  // Checkout data
  checkoutData: CheckoutResponse | null;
  checkoutFormData: CheckoutFormData | null;
  
  // Razorpay payment data
  paymentInitData: RazorpayInitiateResponse | null;
  
  // Payment status data
  paymentStatusData: PaymentStatusResponse | null;
  
  // Loading states
  isCheckoutLoading: boolean;
  isPaymentInitiating: boolean;
  isPaymentStatusLoading: boolean;
  
  // Error handling
  error: string | null;
  
  // Hotel and branch context (from cart)
  hotelId: string;
  branchId: string;
  
  // Actions
  setHotelAndBranch: (hotelId: string, branchId: string) => void;
  setCheckoutFormData: (formData: CheckoutFormData) => void;
  performCheckout: (formData: CheckoutFormData) => Promise<CheckoutResponse | null>;
  initiatePayment: (orderId: string, amount: number, userDetails: {
    userId: string;
    userPhone: string;
    userName: string;
    userEmail: string;
  }) => Promise<RazorpayInitiateResponse | null>;
  checkPaymentStatus: (transactionId: string) => Promise<PaymentStatusResponse | null>;
  clearCheckoutData: () => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Initial state
  checkoutData: null,
  checkoutFormData: null,
  paymentInitData: null,
  paymentStatusData: null,
  isCheckoutLoading: false,
  isPaymentInitiating: false,
  isPaymentStatusLoading: false,
  error: null,
  hotelId: '',
  branchId: '',

  // Set hotel and branch context
  setHotelAndBranch: (hotelId: string, branchId: string) => {
    set({ hotelId, branchId });
  },

  // Set checkout form data
  setCheckoutFormData: (formData: CheckoutFormData) => {
    set({ checkoutFormData: formData });
  },

  // Perform checkout
  performCheckout: async (formData: CheckoutFormData) => {
    const { hotelId, branchId } = get();
    
    if (!hotelId || !branchId) {
      set({ error: 'Hotel and branch not set' });
      return null;
    }

    set({ isCheckoutLoading: true, error: null });
    
    try {
      const checkoutRequest: CheckoutRequest = {
        hotelId,
        branchId,
        tableId: formData.tableId,
        paymentMethod: formData.paymentMethod,
        customerNote: formData.customerNote || undefined,
        coinsToUse: formData.coinsToUse || undefined,
        offerCode: formData.offerCode || undefined,
      };

      const response = await paymentApi.checkout(checkoutRequest);
      
      set({ 
        checkoutData: response.data,
        checkoutFormData: formData,
        isCheckoutLoading: false 
      });
      
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to process checkout', 
        isCheckoutLoading: false 
      });
      return null;
    }
  },

  // Initiate Razorpay payment
  initiatePayment: async (orderId: string, amount: number, userDetails) => {
    set({ isPaymentInitiating: true, error: null });
    
    try {
      const paymentRequest: RazorpayInitiateRequest = {
        orderId,
        amount,
        userId: userDetails.userId,
        userPhone: userDetails.userPhone,
        userName: userDetails.userName,
        userEmail: userDetails.userEmail,
      };

      const response = await paymentApi.initiateRazorpayPayment(paymentRequest);
      
      set({ 
        paymentInitData: response.data,
        isPaymentInitiating: false 
      });
      
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to initiate payment', 
        isPaymentInitiating: false 
      });
      return null;
    }
  },

  // Check payment status
  checkPaymentStatus: async (transactionId: string) => {
    set({ isPaymentStatusLoading: true, error: null });
    
    try {
      const response = await paymentApi.checkPaymentStatus(transactionId);
      
      set({ 
        paymentStatusData: response.data,
        isPaymentStatusLoading: false 
      });
      
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to check payment status', 
        isPaymentStatusLoading: false 
      });
      return null;
    }
  },

  // Clear checkout data
  clearCheckoutData: () => {
    set({ 
      checkoutData: null,
      checkoutFormData: null,
      paymentInitData: null,
      paymentStatusData: null,
      error: null 
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));