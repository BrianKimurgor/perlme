'use client'

import { useState } from 'react'
import { X, Filter, MapPin, Users, Calendar, Globe } from 'lucide-react'

interface FiltersSheetProps {
    isOpen: boolean
    onClose: () => void
}

export default function FiltersSheet({ isOpen, onClose }: FiltersSheetProps) {
    const [filters, setFilters] = useState({
        ageRange: [18, 35],
        distance: 50,
        gender: 'any',
        interests: [] as string[],
        lookingFor: [] as string[],
    })

    const interests = [
        'Hiking', 'Coffee', 'Photography', 'Travel', 'Music',
        'Cooking', 'Fitness', 'Reading', 'Art', 'Movies'
    ]

    const lookingForOptions = [
        'Relationship', 'Casual', 'Friendship', 'Networking', 'Not sure yet'
    ]

    const handleApplyFilters = () => {
        // Apply filters logic here
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        />
        
        {/* Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center p-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                </div>
                <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                >
                <X className="h-5 w-5 text-gray-600" />
                </button>
            </div>
            <p className="text-gray-500 mt-1">
                Customize your discovery preferences
            </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Age Range */}
            <div>
                <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <label className="font-medium text-gray-900">Age Range</label>
                </div>
                <div className="px-2">
                <input
                    type="range"
                    min="18"
                    max="60"
                    value={filters.ageRange[0]}
                    onChange={(e) => setFilters({
                    ...filters,
                    ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{filters.ageRange[0]} years</span>
                    <span>{filters.ageRange[1]} years</span>
                </div>
                </div>
            </div>

            {/* Distance */}
            <div>
                <div className="flex items-center mb-3">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <label className="font-medium text-gray-900">Distance</label>
                </div>
                <div className="px-2">
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={filters.distance}
                    onChange={(e) => setFilters({
                    ...filters,
                    distance: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 text-sm text-gray-600">
                    Within {filters.distance} km
                </div>
                </div>
            </div>

            {/* Gender */}
            <div>
                <div className="flex items-center mb-3">
                <Users className="h-4 w-4 text-gray-500 mr-2" />
                <label className="font-medium text-gray-900">Show me</label>
                </div>
                <div className="flex space-x-2">
                {['Women', 'Men', 'Everyone'].map((option) => (
                    <button
                    key={option}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.gender === option.toLowerCase()
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilters({
                        ...filters,
                        gender: option.toLowerCase()
                    })}
                    >
                    {option}
                    </button>
                ))}
                </div>
            </div>

            {/* Looking For */}
            <div>
                <label className="font-medium text-gray-900 mb-3 block">
                Looking For
                </label>
                <div className="flex flex-wrap gap-2">
                {lookingForOptions.map((option) => (
                    <button
                    key={option}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.lookingFor.includes(option)
                        ? 'bg-blue-100 text-blue-600 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                        const newLookingFor = filters.lookingFor.includes(option)
                        ? filters.lookingFor.filter(item => item !== option)
                        : [...filters.lookingFor, option]
                        setFilters({ ...filters, lookingFor: newLookingFor })
                    }}
                    >
                    {option}
                    </button>
                ))}
                </div>
            </div>

            {/* Interests */}
            <div>
                <label className="font-medium text-gray-900 mb-3 block">
                Interests
                </label>
                <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                    <button
                    key={interest}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.interests.includes(interest)
                        ? 'bg-purple-100 text-purple-600 border border-purple-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                        const newInterests = filters.interests.includes(interest)
                        ? filters.interests.filter(item => item !== interest)
                        : [...filters.interests, interest]
                        setFilters({ ...filters, interests: newInterests })
                    }}
                    >
                    {interest}
                    </button>
                ))}
                </div>
            </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
                <button
                onClick={() => setFilters({
                    ageRange: [18, 35],
                    distance: 50,
                    gender: 'any',
                    interests: [],
                    lookingFor: [],
                })}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                Reset
                </button>
                <button
                onClick={handleApplyFilters}
                className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600"
                >
                Apply Filters
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}