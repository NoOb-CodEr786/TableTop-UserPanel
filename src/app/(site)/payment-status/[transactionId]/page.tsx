"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCcw,
  Loader2,
  CreditCard,
  IndianRupee,
  Calendar,
  Hash,
  Smartphone,
  Download,
  Mail,
} from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";
import { PaymentStatusResponse } from "@/api/payment.api";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-16 h-16 text-green-500" />;
    case "failed":
      return <XCircle className="w-16 h-16 text-red-500" />;
    case "cancelled":
      return <XCircle className="w-16 h-16 text-gray-500" />;
    case "pending":
    default:
      return <Clock className="w-16 h-16 text-amber-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "cancelled":
      return "bg-gray-500";
    case "pending":
    default:
      return "bg-amber-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "success":
      return "Payment Successful";
    case "failed":
      return "Payment Failed";
    case "cancelled":
      return "Payment Cancelled";
    case "pending":
    default:
      return "Payment Pending";
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case "success":
      return "Your payment has been processed successfully. A confirmation email has been sent to your registered email address.";
    case "failed":
      return "We were unable to process your payment. Please verify your payment details and try again.";
    case "cancelled":
      return "The payment transaction was cancelled. No amount has been charged.";
    case "pending":
    default:
      return "Your payment is being processed. This may take a few moments.";
  }
};

export default function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.transactionId as string;

  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const {
    paymentStatusData,
    isPaymentStatusLoading,
    error,
    checkPaymentStatus,
    clearError,
  } = usePaymentStore();

  useEffect(() => {
    if (transactionId && !hasInitialLoad) {
      checkPaymentStatus(transactionId);
      setHasInitialLoad(true);
    }
  }, [transactionId, hasInitialLoad, checkPaymentStatus]);

  const handleManualRefresh = () => {
    if (isPaymentStatusLoading) return;
    checkPaymentStatus(transactionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (isPaymentStatusLoading && !paymentStatusData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-theme-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 animate-spin text-theme-secondary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Checking Payment
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Please wait while we verify your payment status...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => {
              clearError();
              checkPaymentStatus(transactionId);
            }}
            className="w-full bg-theme-secondary text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:bg-theme-secondary-dark transition-all duration-200 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!paymentStatusData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hash className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Not Found</h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            No payment information found for this transaction.
          </p>
          <Link href="/">
            <button className="w-full bg-theme-secondary text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:bg-theme-secondary-dark transition-all duration-200 active:scale-95">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header - Android App Bar Style */}
      <div className=" pt-20">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Payment Status
              </h1>
              <p className="text-xs text-gray-500 font-mono">
                {transactionId.slice(-12)}
              </p>
            </div>
          </div>
          {paymentStatusData?.status === "pending" && (
            <button
              onClick={handleManualRefresh}
              disabled={isPaymentStatusLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 active:scale-95"
            >
              <RefreshCcw
                className={`w-5 h-5 text-gray-600 ${
                  isPaymentStatusLoading ? "animate-spin" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pb-6 space-y-4">
        {/* Main Status Card - Android Material Design */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mt-4">
          <div
            className={`${getStatusColor(paymentStatusData.status)} h-2`}
          ></div>
          <div className="p-6 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              {getStatusIcon(paymentStatusData.status)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getStatusText(paymentStatusData.status)}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
              {getStatusDescription(paymentStatusData.status)}
            </p>

            {paymentStatusData.status === "pending" && (
              <div className="mt-6 bg-amber-50 rounded-2xl p-4 inline-flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-amber-800">
                  Processing...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amount Card - Prominent Display */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
              Amount
            </p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <IndianRupee className="w-8 h-8 text-theme-secondary" />
              <span className="text-4xl font-bold text-gray-900">
                {paymentStatusData.amount}
              </span>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {paymentStatusData.currency}
            </p>
          </div>
        </div>

        {/* Transaction Details - Android List Style */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-3">
              <div className="w-8 h-8 bg-theme-secondary rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              Transaction Details
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Payment Method */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Payment Method
                  </p>
                  <p className="text-xs text-gray-500">via Razorpay</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 uppercase bg-gray-100 px-3 py-1 rounded-full">
                {paymentStatusData.method}
              </span>
            </div>

            {/* Transaction Date */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Date & Time
                  </p>
                  <p className="text-xs text-gray-500">Transaction date</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 text-right">
                {formatDate(paymentStatusData.createdAt)}
              </span>
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Hash className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Transaction ID
                  </p>
                  <p className="text-xs text-gray-500">Unique identifier</p>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {paymentStatusData.transactionId.slice(-12)}
              </span>
            </div>

            {/* Order ID */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Hash className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Order ID</p>
                  <p className="text-xs text-gray-500">Order reference</p>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {paymentStatusData.orderId.slice(-12)}
              </span>
            </div>

            {/* Razorpay Payment ID */}
            {paymentStatusData.razorpayPaymentId && (
              <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Hash className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Gateway Ref
                    </p>
                    <p className="text-xs text-gray-500">Payment gateway ID</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {paymentStatusData.razorpayPaymentId.slice(-12)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Android FAB Style */}
        <div className="space-y-3 mt-6">
          {paymentStatusData.status === "success" && (
            <>
              <Link href="/orders">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  View My Orders
                </button>
              </Link>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-2xl font-semibold border-2 border-gray-200 transition-all duration-200 active:scale-95 flex items-center justify-center gap-3">
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
            </>
          )}

          {paymentStatusData.status === "failed" && (
            <Link href="/cart">
              <button className="w-full bg-gradient-to-r from-theme-secondary to-theme-primary hover:from-theme-primary hover:to-theme-secondary text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3">
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
            </Link>
          )}

          {paymentStatusData.status === "pending" && (
            <button
              onClick={handleManualRefresh}
              disabled={isPaymentStatusLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <RefreshCcw
                className={`w-5 h-5 ${
                  isPaymentStatusLoading ? "animate-spin" : ""
                }`}
              />
              Check Status
            </button>
          )}
        </div>

        {/* Secondary Action */}
        <Link href="/home">
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-medium transition-all duration-200 active:scale-95 mt-3">
            Continue Shopping
          </button>
        </Link>

        {/* Support Section - Android Bottom Sheet Style */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mt-6 mb-20 overflow-hidden">
          <div className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                Need Help?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Contact our support team for assistance with your payment.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-md">
              Contact Support
            </button>
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
