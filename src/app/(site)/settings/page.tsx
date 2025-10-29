"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  Lock,
  Smartphone,
  Settings,
  ChevronRight
} from 'lucide-react'

const SettingsPage = () => {
  const router = useRouter()

  const settingsTabs = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      description: 'Manage your personal information and avatar',
      href: '/settings/profile'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Lock, 
      description: 'Change password and security settings',
      href: '/settings/security'
    },
    { 
      id: 'sessions', 
      label: 'Sessions', 
      icon: Smartphone, 
      description: 'Manage your active device sessions',
      href: '/settings/sessions'
    }
  ]

  const handleTabClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-gray-100">


      {/* Settings Menu */}
      <div className="p-4 pb-24 pt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {settingsTabs.map((tab, index) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.href)}
                className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                  index !== settingsTabs.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">{tab.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tab.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            )
          })}
        </div>

        {/* Additional Settings Sections */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Privacy Settings</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Notifications</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Data & Storage</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Support</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Help & Support</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Terms of Service</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors">
                <span className="text-gray-700 font-medium">Privacy Policy</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center mb-15">
          <p className="text-sm text-gray-500">TableTop App</p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage