"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/UserAvatar'
import { 
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Coins,
  Calendar,
  LogOut,
  Smartphone,
  Globe,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  Edit3,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { 
  getCurrentUserProfile,
  editUserProfile,
  changePassword,
  logoutCurrentSession,
  logoutAllSessions
} from '@/api/profile.api'

const ProfilePage = () => {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateUser } = useAuthStore()
  const { profile, setProfile } = useProfileStore()
  
  // States
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    phone: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        username: profile.username || '',
        phone: profile.phone || ''
      })
    }
  }, [profile])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await getCurrentUserProfile()
      if (response.success && response.data) {
        setProfile(response.data)
      }
      // Ensure loading shows for at least 800ms for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
    } catch (err) {
      console.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const updateData: any = {}
      
      if (profileForm.name !== profile?.name) updateData.name = profileForm.name
      if (profileForm.username !== profile?.username) updateData.username = profileForm.username
      if (profileForm.phone !== profile?.phone) updateData.phone = profileForm.phone
      if (selectedImage) updateData.profileImage = selectedImage

      const response = await editUserProfile(updateData)
      
      if (response.success && response.data) {
        setProfile({ ...profile!, ...response.data })
        updateUser({ ...user!, ...response.data })
        setSuccessMessage('Profile updated successfully!')
        setIsEditing(false)
        setSelectedImage(null)
        setImagePreview(null)
      } else {
        setErrorMessage(response.message || 'Failed to update profile')
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

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

  if (!isAuthenticated || !user) {
    return null
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'sessions', label: 'Sessions', icon: Smartphone }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-serif italic text-gray-400 mb-1">
                Profile
              </h1>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Manage Your
              </h2>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Account
              </h2>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="w-16 h-16 rounded-full" />
          ) : (
            <UserAvatar 
              size="lg" 
              onClick={() => setActiveTab('profile')}
            />
          )}
        </div>

        {/* Image divider */}
        <div className="relative h-8 mt-6">
          <img
            src="/images/Vector1.png"
            alt="Divider"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mx-6 mt-6">
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mx-6 mt-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Overview Skeleton */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center mb-6">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" style={{ animationDelay: '0ms' }} />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" style={{ animationDelay: '100ms' }} />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" style={{ animationDelay: '200ms' }} />
                  <div className="flex items-center justify-center space-x-4">
                    <Skeleton className="h-6 w-20 rounded-full" style={{ animationDelay: '300ms' }} />
                    <Skeleton className="h-6 w-16 rounded-full" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" style={{ animationDelay: '500ms' }} />
                    <Skeleton className="h-8 w-16" style={{ animationDelay: '600ms' }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" style={{ animationDelay: '700ms' }} />
                      <Skeleton className="h-10 w-full" style={{ animationDelay: '800ms' }} />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" style={{ animationDelay: '900ms' }} />
                      <Skeleton className="h-10 w-full" style={{ animationDelay: '1000ms' }} />
                    </div>
                  </div>
                  
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" style={{ animationDelay: '1100ms' }} />
                    <Skeleton className="h-10 w-full" style={{ animationDelay: '1200ms' }} />
                    <Skeleton className="h-3 w-32 mt-1" style={{ animationDelay: '1300ms' }} />
                  </div>
                  
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" style={{ animationDelay: '1400ms' }} />
                    <Skeleton className="h-10 w-full" style={{ animationDelay: '1500ms' }} />
                  </div>
                </div>
              </div>

              {/* Account Info Skeleton */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <Skeleton className="h-6 w-36 mb-4" style={{ animationDelay: '1600ms' }} />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" style={{ animationDelay: '1700ms' }} />
                    <Skeleton className="h-4 w-20" style={{ animationDelay: '1800ms' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" style={{ animationDelay: '1900ms' }} />
                    <Skeleton className="h-4 w-16" style={{ animationDelay: '2000ms' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" style={{ animationDelay: '2100ms' }} />
                    <Skeleton className="h-4 w-12" style={{ animationDelay: '2200ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {!isLoading && activeTab === 'profile' && (
        <div className="mx-6 mt-6 space-y-6">
          {/* Profile Overview Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {imagePreview ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                    <img
                      src={imagePreview}
                      alt={profile?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <UserAvatar size="xl" />
                )}
                
                {isEditing && (
                  <>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mt-4">{profile?.name}</h3>
              <p className="text-gray-500">@{profile?.username}</p>
              
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.isEmailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Mail className="w-3 h-3 inline mr-1" />
                  {profile?.isEmailVerified ? 'Verified' : 'Unverified'}
                </div>
                <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  <Coins className="w-3 h-3 mr-1" />
                  {profile?.coins || 0} Coins
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setSelectedImage(null)
                        setImagePreview(null)
                        setProfileForm({
                          name: profile?.name || '',
                          username: profile?.username || '',
                          phone: profile?.phone || ''
                        })
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      {isSaving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-900">{new Date(profile?.createdAt || '').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account type</span>
                <span className="text-gray-900 capitalize">{profile?.authProvider || 'Local'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Role</span>
                <span className="text-gray-900 capitalize">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {!isLoading && activeTab === 'security' && (
        <div className="mx-6 mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Current Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="w-full bg-gray-900 hover:bg-gray-800 mt-6 text-white"
              >
                {isChangingPassword ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Changing Password...</span>
                  </div>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {!isLoading && activeTab === 'sessions' && (
        <div className="mx-6 mt-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h4>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Current Session</p>
                    <p className="text-sm text-gray-500">This device • Active now</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogout(false)}
                  className="border-gray-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
            
            <Button
              onClick={() => handleLogout(true)}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Sign Out from All Devices
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProfilePage