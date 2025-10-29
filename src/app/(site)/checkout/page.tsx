"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Loader2,
  Gift,
  Receipt,
  IndianRupee,
} from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";
import { useCartStore } from "@/store/cartStore";
import { CheckoutResponse } from "@/api/payment.api";

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localCheckoutData, setLocalCheckoutData] =
    useState<CheckoutResponse | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [checkoutProcessed, setCheckoutProcessed] = useState(false);
  const checkoutInitiated = useRef(false);

  const {
    checkoutData,
    isCheckoutLoading,
    isPaymentInitiating,
    error,
    performCheckout,
    initiatePayment,
    clearError,
  } = usePaymentStore();

  // Remove clearCartLocal import since we're not clearing cart anymore

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const processCheckout = async () => {
      // Prevent multiple executions using both state and ref
      if (checkoutProcessed || isProcessing || checkoutInitiated.current) {
        console.log('Checkout already processed or in progress, skipping...', { 
          checkoutProcessed, 
          isProcessing, 
          checkoutInitiated: checkoutInitiated.current 
        });
        return;
      }
      
      // Mark checkout as initiated immediately
      checkoutInitiated.current = true;
      
      try {
        const storedData = localStorage.getItem("pendingCheckout");
        if (storedData) {
          console.log('Processing checkout with stored data:', storedData);
          const { formData } = JSON.parse(storedData);
          setIsProcessing(true);
          setCheckoutProcessed(true);
          console.log('Calling performCheckout API...');
          const result = await performCheckout(formData);
          if (result) {
            console.log('Checkout successful:', result);
            setLocalCheckoutData(result);
            localStorage.removeItem("pendingCheckout");
            console.log("Checkout completed successfully");
          }
        } else {
          console.log('No pending checkout data found, redirecting to cart');
          router.push("/cart");
        }
      } catch (error) {
        console.error("Checkout failed:", error);
        setCheckoutProcessed(false); // Reset on error to allow retry
        checkoutInitiated.current = false; // Reset ref on error
      } finally {
        setIsProcessing(false);
      }
    };

    console.log('useEffect triggered for checkout processing');
    processCheckout();
    
    // Cleanup function to prevent duplicate calls if component unmounts
    return () => {
      console.log('Checkout useEffect cleanup');
    };
  }, []); // Removed all dependencies to prevent re-runs

  const handlePayment = async () => {
    if (!localCheckoutData || !razorpayLoaded) return;

    const order = localCheckoutData.order;
    const userDetails = {
      userId: order.user._id,
      userPhone: order.user.phone,
      userName: order.user.name,
      userEmail: order.user.email,
    };

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(order.totalPrice * 100);

    const paymentResult = await initiatePayment(
      order.id,
      amountInPaise,
      userDetails
    );

    if (paymentResult) {
      const options = {
        key: paymentResult.key,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        name: paymentResult.name,
        description: paymentResult.description,
        order_id: paymentResult.order_id,
        handler: function (response: any) {
          // Payment successful - redirect to payment status page
          console.log("Payment successful:", response);
          router.push(`/payment-status/${paymentResult.transactionId}`);
        },
        prefill: {
          name: order.user.name,
          email: order.user.email,
          contact: order.user.phone,
        },
        theme: paymentResult.theme,
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            // Redirect to payment status page even if modal is dismissed
            router.push(`/payment-status/${paymentResult.transactionId}`);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  const data = localCheckoutData || checkoutData;

  if (isProcessing || isCheckoutLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-theme-secondary" />
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Checkout Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              clearError();
              router.push("/cart");
            }}
            className="w-full bg-theme-secondary text-white py-3 rounded-lg font-medium hover:bg-theme-secondary-dark transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Order Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please start your order from the cart.
          </p>
          <Link href="/cart">
            <button className="w-full bg-theme-secondary text-white py-3 rounded-lg font-medium hover:bg-theme-secondary-dark transition-colors">
              Go to Cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="px-4 py-6 space-y-6 pb-32 pt-20">
        {/* Order Status Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 shadow-lg border border-green-200">
          {/* <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-800">Order Placed Successfully!</h2>
              <p className="text-green-700 text-sm">{data.checkout.message}</p>
            </div>
          </div> */}

          <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Estimated Delivery
                </p>
                <p className="text-xs text-green-600">
                  Your order will be ready soon
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-800">
                {data.order.estimatedTime}
              </span>
              <span className="text-sm text-green-600 ml-1">mins</span>
            </div>
          </div>
        </div>

        {/* Restaurant & Table Details */}
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-theme-secondary rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            Restaurant Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {data.order.hotel.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {data.order.branch.name}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{data.order.branch.location.address}</p>
                  <p>
                    {data.order.branch.location.city},{" "}
                    {data.order.branch.location.state}{" "}
                    {data.order.branch.location.pincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-theme-secondary/10 to-theme-secondary/5 rounded-xl border border-theme-secondary/20">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Table {data.order.table.tableNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Capacity: {data.order.table.capacity} people
                  </p>
                </div>
              </div>
              <div className="text-theme-secondary font-bold text-lg">
                #{data.order.table.tableNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            Order Items ({data.order.totalItems}{" "}
            {data.order.totalItems === 1 ? "item" : "items"})
          </h3>

          <div className="space-y-3">
            {data.order.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.foodItemName}
                    </h4>
                    <div
                      className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                        item.foodType === "veg"
                          ? "border-green-500"
                          : "border-red-500"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.foodType === "veg"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 capitalize mb-2">
                    {item.foodType}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {item.price} each
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-theme-secondary" />
                    <p className="font-bold text-gray-900 text-lg">
                      {item.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            Pricing Breakdown
          </h3>

          <div className="space-y-4">
            {/* Items Subtotal */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">
                Items Subtotal ({data.order.totalItems} items)
              </span>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  {data.pricingBreakdown.step1_itemsSubtotal.amount}
                </span>
              </div>
            </div>

            {/* Offer Discount */}
            {data.pricingBreakdown.step2_afterOfferDiscount.discountAmount >
              0 && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="flex items-center gap-2 text-green-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Offer Discount</span>
                </span>
                <div className="flex items-center gap-1 text-green-600">
                  <span>-</span>
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-semibold">
                    {
                      data.pricingBreakdown.step2_afterOfferDiscount
                        .discountAmount
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Coin Discount */}
            {data.pricingBreakdown.step3_afterCoinDiscount.coinDiscountAmount >
              0 && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="flex items-center gap-2 text-blue-600">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">🪙</span>
                  </div>
                  <span>
                    Coins Used (
                    {data.pricingBreakdown.step3_afterCoinDiscount.coinsUsed})
                  </span>
                </span>
                <div className="flex items-center gap-1 text-blue-600">
                  <span>-</span>
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-semibold">
                    {
                      data.pricingBreakdown.step3_afterCoinDiscount
                        .coinDiscountAmount
                    }
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {/* GST */}
              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  GST ({data.pricingBreakdown.step4_taxesAndCharges.gstRate})
                </span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {data.pricingBreakdown.step4_taxesAndCharges.gstAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Service Charge */}
              {data.pricingBreakdown.step4_taxesAndCharges.serviceCharge >
                0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Service Charge</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {
                        data.pricingBreakdown.step4_taxesAndCharges
                          .serviceCharge
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4 mt-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-theme-secondary/10 to-theme-secondary/5 rounded-xl">
                <span className="text-xl font-bold text-gray-900">
                  Total Amount
                </span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-6 h-6 text-theme-secondary" />
                  <span className="text-2xl font-bold text-theme-secondary">
                    {data.pricingBreakdown.step5_finalTotal.finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {data.pricingBreakdown.step5_finalTotal.calculation}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            Customer Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-red-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="font-semibold text-gray-900 truncate">
                  {data.order.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Phone Number
                </p>
                <p className="font-semibold text-gray-900 truncate">
                  {data.order.user.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email Address
                </p>
                <p className="font-semibold text-gray-900 truncate">
                  {data.order.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">
                Payment Details
              </h3>
              <p className="text-sm text-gray-500">
                Method:{" "}
                <span className="font-medium text-gray-700">
                  {data.order.payment.paymentMethod.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {data.order.payment.paymentMethod === "razorpay" || data.order.payment.paymentMethod === "upi" || data.order.payment.paymentMethod === "card" || data.order.payment.paymentMethod === "wallet" ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Amount to Pay
                  </span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-gray-900" />
                    <span className="text-2xl font-bold text-gray-900">
                      {data.order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>🔒</span>
                  <span>Secure payment powered by Razorpay</span>
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isPaymentInitiating || !razorpayLoaded}
                className="w-full bg-theme-secondary hover:bg-theme-secondary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isPaymentInitiating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay ₹{data.order.totalPrice.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>100% Secure & Encrypted</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>Multiple Payment Options</span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-800 text-lg mb-1">
                    Cash Payment Selected
                  </p>
                  <p className="text-sm text-green-700">
                    {data.checkout.paymentRequired ? 'Payment required on delivery' : 'No payment required at checkout'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Amount to Pay on Delivery
                  </span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-green-800" />
                    <span className="text-2xl font-bold text-green-800">
                      {data.order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Order confirmed - prepare exact change if needed</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 text-sm">💡</span>
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Cash Payment Tips:</p>
                    <ul className="space-y-1">
                      <li>• Keep exact change ready for faster service</li>
                      <li>• Our delivery person will have change for ₹500 notes</li>
                      <li>• You can also pay via UPI on delivery if preferred</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Continue Button for Cash Payment */}
              <div className="mt-6">
                <button
                  onClick={() => router.push('/menu')}
                  className="w-full bg-theme-secondary hover:bg-theme-secondary-dark text-white py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Continue Shopping</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <p className="text-center text-gray-500 text-xs mt-3">
                  Your order is confirmed! Continue browsing our menu for future orders.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Reward Points */}
        {data.order.rewardCoins > 0 && (
          <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
              Reward Coins
            </h3>
            
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Coins to be earned</p>
                  <p className="font-semibold text-yellow-800">
                    <span className="text-2xl font-bold">{data.order.rewardCoins}</span> coins
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-yellow-700" />
                    <span className="font-semibold text-yellow-800">{data.order.rewardCoins}</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">value</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-yellow-200">
                Coins will be credited after order completion. 1 coin = ₹1 discount on future orders
              </p>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {data.order.specialInstructions && (
          <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
              Special Instructions
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.order.specialInstructions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
