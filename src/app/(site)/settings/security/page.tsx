"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { changePassword } from '@/api/profile.api'

const SecuritySettingsPage = () => {
  const router = useRouter()
  const { logout } = useAuthStore()
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long')
      return
    }

    setIsChangingPassword(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      })

      if (response.success) {
        setSuccessMessage('Password changed successfully! Please log in again.')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        setTimeout(() => {
          logout()
          router.push('/auth/signin')
        }, 2000)
      } else {
        setErrorMessage(response.message || 'Failed to change password')
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">


      {/* Messages */}
      {successMessage && (
        <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 pb-24 pt-20">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h4>
          
          <div className="space-y-5">
            <div>
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-2 block">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="h-12 rounded-xl border-gray-200 pr-12 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2 block">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="h-12 rounded-xl border-gray-200 pr-12 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="h-12 rounded-xl border-gray-200 pr-12 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl mt-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isChangingPassword ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </div>

        {/* Additional Security Options */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-5">Security Options</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors active:scale-95">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h5 className="font-medium text-gray-900">Login Alerts</h5>
                <p className="text-sm text-gray-500 mt-1">Get notified when your account is accessed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h5 className="font-medium text-gray-900">Device Management</h5>
                <p className="text-sm text-gray-500 mt-1">Manage devices that can access your account</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors active:scale-95">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettingsPage