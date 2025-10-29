"use client";

import React, { useState } from 'react';
import { Clock, MapPin, Star, RotateCcw, CheckCircle, Truck, Package } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  estimatedTime?: string;
  rating?: number;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'TT-2024-001',
      date: '2024-10-06T14:30:00',
      status: 'out_for_delivery',
      total: 34.97,
      estimatedTime: '25 mins',
      items: [
        { id: 1, name: 'Margherita Pizza', quantity: 1, price: 14.99, image: '🍕' },
        { id: 2, name: 'Caesar Salad', quantity: 2, price: 8.99, image: '🥗' },
        { id: 3, name: 'Chocolate Cake', quantity: 1, price: 7.99, image: '🍰' }
      ],
      deliveryAddress: '123 Main St, Apartment 4B, New York, NY 10001'
    },
    {
      id: '2',
      orderNumber: 'TT-2024-002',
      date: '2024-10-06T12:15:00',
      status: 'preparing',
      total: 28.98,
      estimatedTime: '35 mins',
      items: [
        { id: 4, name: 'Grilled Salmon', quantity: 1, price: 22.99, image: '🐟' },
        { id: 5, name: 'Fresh Orange Juice', quantity: 2, price: 4.99, image: '🍊' }
      ],
      deliveryAddress: '456 Oak Avenue, Suite 12, Brooklyn, NY 11201'
    },
    {
      id: '3',
      orderNumber: 'TT-2024-003',
      date: '2024-10-05T19:45:00',
      status: 'delivered',
      total: 42.96,
      rating: 5,
      items: [
        { id: 6, name: 'Beef Burger', quantity: 2, price: 16.99, image: '🍔' },
        { id: 7, name: 'Chicken Wings', quantity: 1, price: 12.99, image: '🍗' },
        { id: 8, name: 'Tiramisu', quantity: 2, price: 6.99, image: '🍮' }
      ],
      deliveryAddress: '789 Pine Street, Floor 3, Manhattan, NY 10003'
    },
    {
      id: '4',
      orderNumber: 'TT-2024-004',
      date: '2024-10-04T18:20:00',
      status: 'delivered',
      total: 25.97,
      rating: 4,
      items: [
        { id: 9, name: 'Indian Thali Special', quantity: 1, price: 12.99, image: '🍛' },
        { id: 10, name: 'BBQ Ribs Platter', quantity: 1, price: 18.49, image: '🍖' }
      ],
      deliveryAddress: '321 Elm Street, Apartment 2A, Queens, NY 11375'
    }
  ];

  const currentOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
  );
  
  const orderHistory = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <RotateCcw className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span>{getStatusText(order.status)}</span>
            </div>
            {order.estimatedTime && (
              <p className="text-sm text-gray-500 mt-1">ETA: {order.estimatedTime}</p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="text-2xl">{item.image}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="flex items-start space-x-2 mb-4 p-3 bg-gray-50 rounded">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Delivery Address</p>
            <p className="text-xs text-gray-600">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {order.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{order.rating}/5</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          {order.status === 'delivered' && !order.rating && (
            <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              Rate Order
            </button>
          )}
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
            Reorder
          </button>
          {['pending', 'confirmed'].includes(order.status) && (
            <button className="flex-1 border border-red-300 hover:bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your current orders and view order history</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'current'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'history'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Order History ({orderHistory.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6 pb-15">
          {activeTab === 'current' && (
            <>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No current orders
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any active orders right now.
                  </p>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Order Now
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No order history
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your previous orders will appear here.
                  </p>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Start Ordering
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}