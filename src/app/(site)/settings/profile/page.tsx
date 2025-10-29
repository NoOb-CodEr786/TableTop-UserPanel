"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/UserAvatar'
import { 
  ArrowLeft,
  Camera,
  Mail,
  Coins,
  CheckCircle2,
  Shield,
  Edit3
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { 
  getCurrentUserProfile,
  editUserProfile
} from '@/api/profile.api'

const ProfileSettingsPage = () => {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const { profile, setProfile } = useProfileStore()
  
  // States
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    phone: ''
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

  if (!isAuthenticated || !user) {
    return null
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
      <div className="p-4 space-y-4 pb-24 pt-20">
        {/* Loading Skeleton */}
        {isLoading ? (
          <>
            {/* Profile Overview Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-36 mx-auto mb-2" />
                <Skeleton className="h-4 w-28 mx-auto mb-4" />
                <div className="flex items-center justify-center space-x-4">
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-9 w-20" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-28 mb-3" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-3 w-40 mt-2" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-28 mb-3" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>

            {/* Account Info Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-40 mb-5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Profile Overview Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {imagePreview ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100">
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
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors active:scale-95">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                    </>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mt-4">{profile?.name}</h3>
                <p className="text-gray-500 text-base">@{profile?.username}</p>
                
                <div className="flex items-center justify-center space-x-3 mt-4">
                  <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    profile?.isEmailVerified 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile?.isEmailVerified ? 'Verified' : 'Unverified'}
                  </div>
                  <div className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-medium">
                    <Coins className="w-4 h-4 mr-2" />
                    {profile?.coins || 0} Coins
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors active:scale-95 border border-gray-200"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      <span className="font-medium">Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
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
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors active:scale-95 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className={`h-12 rounded-xl border-gray-200 ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-indigo-500'}`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      className={`h-12 rounded-xl border-gray-200 ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-indigo-500'}`}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="h-12 rounded-xl bg-gray-50 border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className={`h-12 rounded-xl border-gray-200 ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-indigo-500'}`}
                  />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-15">
              <h4 className="text-lg font-semibold text-gray-900 mb-5">Account Information</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">Member since</span>
                  <span className="text-gray-900 font-semibold">{new Date(profile?.createdAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">Account type</span>
                  <span className="text-gray-900 font-semibold capitalize">{profile?.authProvider || 'Local'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">Role</span>
                  <span className="text-indigo-600 font-semibold capitalize bg-indigo-50 px-3 py-1 rounded-full text-sm">{profile?.role}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileSettingsPage