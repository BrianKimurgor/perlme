'use client'

import { useEffect, useState } from 'react'
import ProfileCard from '@/components/discover/ProfileCard'
import SwipeControls from '@/components/discover/SwipeControls'
import FiltersSheet from '@/components/discover/FiltersSheet'
import { Heart, MountainSnowIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useGetDiscoverProfilesQuery, useLikeUserMutation, useRejectUserMutation } from '@/services/userApi'

export default function DiscoverPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showFilters, setShowFilters] = useState(false)
    const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null)
    const [isDark, setIsDark] = useState(false);
  
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        } else {
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);
    const bgColor = isDark ? '#151718' : '#ffffff';
    const textColor = isDark ? '#ECEDEE' : '#11181C';
  
    // RTK Query hooks
    const { data: potentialMatches = [], isLoading, refetch } = useGetDiscoverProfilesQuery()
    const [likeUser] = useLikeUserMutation()
    const [rejectUser] = useRejectUserMutation()

  const handleSwipe = async (direction: 'right' | 'left') => {
    if (potentialMatches.length === 0 || currentIndex >= potentialMatches.length) return
    
    setSwipeDirection(direction)
    
    // Animate swipe
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const profile = potentialMatches[currentIndex]
    
    try {
        if (direction === 'right') {
            await likeUser(profile.id).unwrap()
        } else {
            await rejectUser(profile.id).unwrap()
        }
        } catch (error) {
            console.error('Swipe action failed:', error)
        }
        
        // Update local state
        if (currentIndex < potentialMatches.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            // Refetch new profiles
            refetch()
            setCurrentIndex(0)
        }
        
        setSwipeDirection(null)
    }

    if (isLoading) {
        return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff3366] mx-auto"></div>
                <p className="mt-4 text-[#687076]">Loading profiles...</p>
            </div>
            </div>
        </div>
        )
    }

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }} className="transition-colors duration-300">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
        <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
            <div>
            <h1 className="text-2xl font-bold text-[#11181C]">Discover</h1>
            <p className="text-[#687076]">
                {potentialMatches.length} people near you
            </p>
            </div>
            
            <button
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-[#e0e0e0] rounded-full hover:bg-[#f5f5f5] transition-colors"
            >
            <span className="text-[#11181C]">Filters</span>
            <span className="bg-[#ff3366]/10 text-[#ff3366] text-xs px-2 py-1 rounded-full">
                3
            </span>
            </button>
        </div>

        {/* Profile Stack */}
        <div className="relative h-[500px] md:h-[550px]">
            {potentialMatches.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-sm">
                <div className="w-24 h-24 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-4">
                <Heart className="h-12 w-12 text-[#687076]" />
                </div>
                <h3 className="text-xl font-semibold text-[#11181C] mb-2">
                No profiles found
                </h3>
                <p className="text-[#687076] mb-6">
                Try adjusting your filters or check back later
                </p>
                <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-[#ff3366] text-white rounded-full font-medium hover:bg-[#ff3366]/90 transition-colors"
                >
                Refresh
                </button>
            </div>
            ) : (
            <>
                {/* Next profiles in stack */}
                {potentialMatches.slice(currentIndex + 1, currentIndex + 3).map((profile: any, index: any) => (
                <div
                    key={profile.id}
                    className="absolute inset-0 transition-transform duration-300"
                    style={{
                    transform: `scale(${0.9 - index * 0.05}) translateY(${index * 20}px)`,
                    zIndex: 10 - index
                    }}
                >
                    <ProfileCard profile={profile} />
                </div>
                ))}

                {/* Current profile with swipe animation */}
                {potentialMatches[currentIndex] && (
                <div
                    className={`absolute inset-0 transition-transform duration-300 ${
                    swipeDirection === 'right' ? 'translate-x-full rotate-12 opacity-0' :
                    swipeDirection === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
                    }`}
                    style={{ zIndex: 20 }}
                >
                    <ProfileCard 
                    profile={potentialMatches[currentIndex]}
                    onSwipe={handleSwipe}
                    />
                </div>
                )}
            </>
            )}

            {/* Swipe indicators */}
            <div className="absolute top-8 left-8 z-30">
            <div className={`px-4 py-2 rounded-full bg-[#ef4444] text-white font-bold transform -rotate-12 ${
                swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}>
                NOPE
            </div>
            </div>
            <div className="absolute top-8 right-8 z-30">
            <div className={`px-4 py-2 rounded-full bg-[#10b981] text-white font-bold transform rotate-12 ${
                swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}>
                LIKE
            </div>
            </div>
        </div>

        {/* Swipe Controls */}
        <div className="mt-8">
            <SwipeControls onSwipe={handleSwipe} />
        </div>

        {/* Stats Bar */}
        <div className="mt-8 grid grid-cols-4 gap-2">
            <div className="text-center p-3 bg-[#f5f5f5] rounded-xl">
            <div className="text-lg font-bold text-[#11181C]">42</div>
            <div className="text-xs text-[#687076]">Views</div>
            </div>
            <div className="text-center p-3 bg-[#f5f5f5] rounded-xl">
            <div className="text-lg font-bold text-[#10b981]">0</div>
            <div className="text-xs text-[#687076]">Matches</div>
            </div>
            <div className="text-center p-3 bg-[#f5f5f5] rounded-xl">
            <div className="text-lg font-bold text-[#0a7ea4]">8</div>
            <div className="text-xs text-[#687076]">Messages</div>
            </div>
            <div className="text-center p-3 bg-[#f5f5f5] rounded-xl">
            <div className="text-lg font-bold text-[#ff3366]">3</div>
            <div className="text-xs text-[#687076]">Likes</div>
            </div>
        </div>

        {/* Premium CTA - FIXED: bg-linear-to-r → bg-gradient-to-r with correct colors */}
        <div className="mt-8 bg-linear-to-r from-[#ff3366] to-[#0a7ea4] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold">Get Unlimited Likes</h3>
                <p className="text-white/80 text-sm mt-1">
                See who likes you & more
                </p>
            </div>
            <button className="px-6 py-2 bg-white text-[#ff3366] font-bold rounded-full hover:bg-gray-100 transition-colors">
                Upgrade
            </button>
            </div>
        </div>

        {/* Filters Sheet */}
        <FiltersSheet 
            isOpen={showFilters} 
            onClose={() => setShowFilters(false)} 
        />
        </div>
        </motion.div>
    </div>
  )
}