"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  LogOut,
  Smartphone,
  Monitor,
  Tablet,
  Globe
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { 
  logoutCurrentSession,
  logoutAllSessions
} from '@/api/profile.api'

const SessionsSettingsPage = () => {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = async (allDevices = false) => {
    try {
      if (allDevices) {
        await logoutAllSessions()
      } else {
        await logoutCurrentSession()
      }
      logout()
      router.push('/auth/signin')
    } catch (err) {
      logout()
      router.push('/auth/signin')
    }
  }

  // Mock session data
  const sessions = [
    {
      id: 1,
      device: 'Current Device',
      deviceType: 'smartphone',
      location: 'New York, US',
      lastActive: 'Active now',
      isCurrent: true
    },
    {
      id: 2,
      device: 'MacBook Pro',
      deviceType: 'desktop',
      location: 'New York, US',
      lastActive: '2 hours ago',
      isCurrent: false
    },
    {
      id: 3,
      device: 'iPad',
      deviceType: 'tablet',
      location: 'New York, US',
      lastActive: '1 day ago',
      isCurrent: false
    }
  ]

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'smartphone':
        return <Smartphone className="h-6 w-6 text-indigo-600" />
      case 'desktop':
        return <Monitor className="h-6 w-6 text-indigo-600" />
      case 'tablet':
        return <Tablet className="h-6 w-6 text-indigo-600" />
      case 'browser':
        return <Globe className="h-6 w-6 text-indigo-600" />
      default:
        return <Smartphone className="h-6 w-6 text-indigo-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">


      {/* Content */}
      <div className="p-4 pb-24 pt-20">
        {/* Active Sessions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-5">Active Sessions</h4>
          
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 text-base">{session.device}</p>
                        {session.isCurrent && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">Current</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{session.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{session.lastActive}</p>
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <button className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors active:scale-95 border border-red-200 text-sm font-medium">
                      <LogOut className="h-4 w-4 mr-1" />
                      <span>End</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-15">
          <h4 className="text-lg font-semibold text-gray-900 mb-5">Session Management</h4>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogout(false)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors active:scale-95"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Sign Out Current Device</p>
                  <p className="text-sm text-gray-500">End your session on this device</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLogout(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors active:scale-95 border border-red-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-700">Sign Out All Devices</p>
                  <p className="text-sm text-red-500">End all active sessions everywhere</p>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SessionsSettingsPage