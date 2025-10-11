"use client"

import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { User } from 'lucide-react'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showOnlineStatus?: boolean
  fallbackEmoji?: string
  className?: string
  onClick?: () => void
  variant?: 'circle' | 'rounded'
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'md',
  showOnlineStatus = false,
  fallbackEmoji = '😎',
  className = '',
  onClick,
  variant = 'circle'
}) => {
  const { user, isAuthenticated } = useAuthStore()

  // Size configurations
  const sizeClasses = {
    sm: {
      outer: 'w-8 h-8',
      inner: 'w-6 h-6',
      text: 'text-xs',
      emoji: 'text-sm'
    },
    md: {
      outer: 'w-12 h-12',
      inner: 'w-10 h-10',
      text: 'text-sm',
      emoji: 'text-lg'
    },
    lg: {
      outer: 'w-16 h-16',
      inner: 'w-13 h-13',
      text: 'text-lg',
      emoji: 'text-3xl'
    },
    xl: {
      outer: 'w-20 h-20',
      inner: 'w-16 h-16',
      text: 'text-xl',
      emoji: 'text-4xl'
    }
  }

  const sizes = sizeClasses[size]
  const roundedClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg'
  
  // Get user initials
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Render profile image if available
  if (isAuthenticated && user?.profileImage) {
    return (
      <div 
        className={`${sizes.outer} ${roundedClass} bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 ${className}`}
        onClick={onClick}
      >
        <div className={`${sizes.inner} ${roundedClass} overflow-hidden border-2 border-white/20`}>
          <img
            src={user.profileImage}
            alt={user.name || 'User'}
            className="w-full h-full object-cover"
          />
        </div>
        {showOnlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    )
  }

  // Render user initials if authenticated but no image
  if (isAuthenticated && user) {
    return (
      <div 
        className={`${sizes.outer} ${roundedClass} bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 relative ${className}`}
        onClick={onClick}
      >
        <div className={`${sizes.inner} ${roundedClass} bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg`}>
          <span className={`${sizes.text} font-semibold text-white`}>
            {getInitials(user.name)}
          </span>
        </div>
        {showOnlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    )
  }

  // Fallback for non-authenticated users or no user data
  return (
    <div 
      className={`${sizes.outer} ${roundedClass} bg-orange-400/50 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 relative ${className}`}
      onClick={onClick}
    >
      <div className={`${sizes.inner} ${roundedClass} bg-orange-400/80 flex items-center justify-center shadow-lg`}>
        {fallbackEmoji ? (
          <span className={sizes.emoji}>{fallbackEmoji}</span>
        ) : (
          <User className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
        )}
      </div>
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
      )}
    </div>
  )
}

export default UserAvatar