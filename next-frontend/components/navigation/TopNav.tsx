'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Search, Bell, MessageCircle, Heart, User, Flame, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { clearCredentials as logout } from '@/store/slices/authSlice'

function NavLink({ href, active, children }: any) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-[#ff3366]/10 text-[#ff3366]'
          : 'text-[#687076] hover:text-[#11181C] hover:bg-[#f5f5f5]'
      }`}
    >
      {children}
    </Link>
  )
}

export default function TopNav() {
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Heart className="h-8 w-8 text-[#ff3366]" />
              <span className="ml-2 text-xl font-bold text-[#11181C] hidden sm:block">
                Perlme
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Center */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/dashboard" active={pathname === '/dashboard'}>
              <span className="flex items-center">
                <span className="mr-2">🔥</span> Discover
              </span>
            </NavLink>
            <NavLink href="/dashboard/matches" active={pathname === '/dashboard/matches'}>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Matches
              </span>
            </NavLink>
            <NavLink href="/dashboard/explore" active={pathname === '/dashboard/explore'}>
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Explore
              </span>
            </NavLink>
            <NavLink href="/dashboard/messages" active={pathname === '/dashboard/messages'}>
              <span className="flex items-center relative">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
                <span className="ml-1 bg-[#ff3366] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </span>
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Mobile) */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-[#687076] hover:text-[#11181C]"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Premium Button */}
            <Link
              href="/dashboard/premium"
              className="hidden sm:flex items-center px-4 py-2 rounded-full bg-linear-to-r from-[#ff3366] to-[#0a7ea4] text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              <Flame className="h-4 w-4 mr-1" />
              <span className="hidden lg:inline">Get Premium</span>
              <span className="lg:hidden">Premium</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-[#687076] hover:text-[#11181C]">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#ff3366] rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#f5f5f5] transition-colors"
              >
                <div className="relative">
                  <img
                    className="h-9 w-9 rounded-full object-cover border-2 border-[#ff3366]"
                    src={user?.profileImage || '/default-avatar.png'}
                    alt={user?.name || 'Profile'}
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#10b981] rounded-full border-2 border-white"></div>
                </div>
                <ChevronDown className={`h-4 w-4 text-[#687076] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0e0] py-1 z-50">
                  <div className="px-4 py-3 border-b border-[#f5f5f5]">
                    <p className="text-sm font-medium text-[#11181C] truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-[#687076] truncate">{user?.email || ''}</p>
                  </div>
                  
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-3 text-sm text-[#11181C] hover:bg-[#f5f5f5]"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4 mr-3 text-[#687076]" />
                    My Profile
                  </Link>
                  
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-3 text-sm text-[#11181C] hover:bg-[#f5f5f5]"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4 mr-3 text-[#687076]" />
                    Settings
                  </Link>
                  
                  <div className="border-t border-[#f5f5f5] my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-[#ef4444] hover:bg-[#f5f5f5]"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="pb-4 md:hidden">
            <div className="relative">
              <input
                type="search"
                className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3366] focus:border-transparent bg-white"
                placeholder="Search people, interests..."
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-[#687076]" />
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}