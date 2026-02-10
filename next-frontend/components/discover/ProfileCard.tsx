// components/discover/ProfileCard.tsx
'use client'

import { useState } from 'react'
import { X, RefreshCw, Star, Heart, Info, MapPin } from 'lucide-react'

interface ProfileCardProps {
  profile: any
  onSwipe?: (direction: 'right' | 'left') => void
}

export default function ProfileCard({ profile, onSwipe }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="relative h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-[#e0e0e0]">
      {/* Photos */}
      <div className="relative h-4/5">
        <img
          src={profile.photos?.[currentPhotoIndex] || '/default-profile.jpg'}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        {/* Photo indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {profile.photos?.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentPhotoIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentPhotoIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/70 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {profile.name}, {profile.age}
              {profile.verified && (
                <span className="ml-2 inline-flex items-center bg-[#0a7ea4] text-white text-xs px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </span>
              )}
            </h2>
            <p className="text-white/90 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {profile.distance} km away
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Info className="h-6 w-6" />
          </button>
        </div>

        {/* Bio/Info */}
        {showInfo && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-sm">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.interests?.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-white/20 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}