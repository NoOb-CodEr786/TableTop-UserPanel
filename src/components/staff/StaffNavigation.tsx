"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  User,
  LogOut,
} from "lucide-react";

const StaffNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { href: "/staff", icon: Home, label: "Dashboard", exact: true },
    { href: "/staff/orders", icon: ClipboardList, label: "Orders" },
    { href: "/staff/tables", icon: Users, label: "Tables" },
    { href: "/staff/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/staff/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TableTop Staff
                </h1>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.href, item.exact)
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Staff Member</p>
                  <p className="text-gray-500 text-xs">Online</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TableTop Staff
              </h1>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    isActive(item.href, item.exact)
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Staff Member</p>
                    <p className="text-gray-500 text-sm">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 rounded-lg">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default StaffNavigation;