import { create } from 'zustand'
import { UserProfileResponse } from '@/api/profile.api'

interface ProfileState {
  profile: UserProfileResponse | null
  isLoading: boolean
  error: string | null
  setProfile: (profile: UserProfileResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearProfile: () => void
  updateProfile: (updates: Partial<UserProfileResponse>) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => {
    set({ profile, error: null })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  setError: (error) => {
    set({ error, isLoading: false })
  },

  clearProfile: () => {
    set({ profile: null, error: null, isLoading: false })
  },

  updateProfile: (updates) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    }))
  },
}))