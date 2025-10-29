"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Wifi,
  Battery,
  ArrowLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Info,
  Star,
  Mail,
} from "lucide-react";

const StaffSettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState("en");

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile Settings",
          description: "Update your personal information",
          action: "navigate",
          color: "blue",
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          description: "Manage your privacy settings",
          action: "navigate",
          color: "green",
        },
        {
          icon: Bell,
          label: "Notifications",
          description: "Push notifications",
          action: "toggle",
          value: notifications,
          onChange: setNotifications,
          color: "orange",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: "Dark Mode",
          description: "Toggle dark/light theme",
          action: "toggle",
          value: darkMode,
          onChange: setDarkMode,
          color: "purple",
        },
        {
          icon: sound ? Volume2 : VolumeX,
          label: "Sound Effects",
          description: "App sound feedback",
          action: "toggle",
          value: sound,
          onChange: setSound,
          color: "pink",
        },
        {
          icon: Globe,
          label: "Language",
          description: "English",
          action: "select",
          color: "indigo",
        },
      ],
    },
    {
      title: "Help & Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help and support",
          action: "navigate",
          color: "cyan",
        },
        {
          icon: Mail,
          label: "Contact Support",
          description: "Reach out to our team",
          action: "navigate",
          color: "teal",
        },
        {
          icon: Star,
          label: "Rate App",
          description: "Rate us on app store",
          action: "navigate",
          color: "yellow",
        },
        {
          icon: Info,
          label: "About",
          description: "App version 2.1.0",
          action: "navigate",
          color: "gray",
        },
      ],
    },
  ];

  const quickStats = [
    { label: "Orders Served", value: "234", icon: "📊" },
    { label: "Customer Rating", value: "4.8", icon: "⭐" },
    { label: "Hours Worked", value: "48", icon: "⏰" },
    { label: "Tips Earned", value: "₹1,240", icon: "💰" },
  ];

  interface SettingItemProps {
    item: {
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      description: string;
      action: string;
      value?: boolean;
      onChange?: (value: boolean) => void;
      color: string;
    };
  }

  const SettingItem: React.FC<SettingItemProps> = ({ item }) => {
    const getColorClasses = (color: string) => {
      const colors = {
        blue: "bg-blue-500/20 text-blue-400",
        green: "bg-green-500/20 text-green-400",
        orange: "bg-orange-500/20 text-orange-400",
        purple: "bg-purple-500/20 text-purple-400",
        pink: "bg-pink-500/20 text-pink-400",
        indigo: "bg-indigo-500/20 text-indigo-400",
        cyan: "bg-cyan-500/20 text-cyan-400",
        teal: "bg-teal-500/20 text-teal-400",
        yellow: "bg-yellow-500/20 text-yellow-400",
        gray: "bg-gray-500/20 text-gray-400",
      };
      return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getColorClasses(item.color)}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{item.label}</h3>
              <p className="text-white/60 text-xs">{item.description}</p>
            </div>
          </div>
          
          {item.action === "toggle" && (
            <button
              onClick={() => item.onChange?.(!item.value)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                item.value 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                  : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          )}
          
          {item.action === "navigate" && (
            <ChevronRight className="w-5 h-5 text-white/40" />
          )}
          
          {item.action === "select" && (
            <ChevronRight className="w-5 h-5 text-white/40" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="bg-theme-gradient-secondary relative overflow-hidden rounded-b-3xl mb-6">
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white text-xl font-bold">Settings</h1>
                <p className="text-white/80 text-sm">Manage your preferences</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-lg font-semibold">John Doe</h3>
                <p className="text-white/70 text-sm">Senior Waiter</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white/80 text-sm">4.8 Rating</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-white text-lg font-bold">{stat.value}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h2 className="text-white/80 text-sm font-semibold mb-3 px-2">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <SettingItem key={itemIndex} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* System Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            Device Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-sm">WiFi</span>
              </div>
              <span className="text-white text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70 text-sm">Battery</span>
              </div>
              <span className="text-white text-sm">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-white/70 text-sm">App Version</span>
              </div>
              <span className="text-white text-sm">2.1.0</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm rounded-2xl p-4 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200 flex items-center justify-center gap-3 mb-6">
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">Sign Out</span>
        </button>

        {/* App Info */}
        <div className="text-center text-white/40 text-xs mb-6">
          <p>TabletTop Staff App</p>
          <p>Version 2.1.0 • Build 1420</p>
          <p className="mt-2">© 2024 TabletTop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSettingsPage;