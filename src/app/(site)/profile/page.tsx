"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProfilePage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/settings')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Settings...</p>
      </div>
    </div>
  )
}

export default ProfilePage