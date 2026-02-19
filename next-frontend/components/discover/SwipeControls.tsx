import { X, RefreshCw, Star, Heart, Bolt } from 'lucide-react'

interface SwipeControlsProps {
  onSwipe: (direction: 'right' | 'left') => void
}

export default function SwipeControls({ onSwipe }: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Rewind */}
      <button
        className="p-4 bg-[#f5f5f5] rounded-full hover:bg-[#e0e0e0] transition-colors"
        onClick={() => {/* Handle rewind */}}
      >
        <RefreshCw className="h-6 w-6 text-[#687076]" />
      </button>

      {/* Dislike */}
      <button
        className="p-5 bg-white border-2 border-[#ef4444]/30 rounded-full hover:shadow-lg transition-all hover:scale-105"
        onClick={() => onSwipe('left')}
      >
        <X className="h-8 w-8 text-[#ef4444]" />
      </button>

      {/* Super Like */}
      <button
        className="p-5 bg-white border-2 border-[#0a7ea4]/30 rounded-full hover:shadow-lg transition-all hover:scale-105"
        onClick={() => {/* Handle super like */}}
      >
        <Star className="h-8 w-8 text-[#0a7ea4]" />
      </button>

      {/* Like */}
      <button
        className="p-5 bg-white border-2 border-[#10b981]/30 rounded-full hover:shadow-lg transition-all hover:scale-105"
        onClick={() => onSwipe('right')}
      >
        <Heart className="h-8 w-8 text-[#10b981]" />
      </button>

      {/* Boost */}
      <button
        className="p-4 bg-linear-to-r from-[#ff3366] to-[#0a7ea4] rounded-full hover:shadow-lg transition-all hover:scale-105"
        onClick={() => {/* Handle boost */}}
      >
        <Bolt className="h-6 w-6 text-white" />
      </button>
    </div>
  )
}