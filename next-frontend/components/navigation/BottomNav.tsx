// components/navigation/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeartIcon,Search,MessageCircle,User, HomeIcon, SearchIcon} from 'lucide-react'
import {Home as HomeSolid, Heart as HeartSolid,Search as SearchSolid,MessageCircle as MessageCircleSolid,User as UserSolid} from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Discover',
      href: '/dashboard',
      icon: pathname === '/dashboard' ? HomeSolid : HomeIcon,
      active: pathname === '/dashboard'
    },
    {
      name: 'Matches',
      href: '/dashboard/matches',
      icon: pathname === '/dashboard/matches' ? HeartSolid : HeartIcon,
      active: pathname === '/dashboard/matches'
    },
    {
      name: 'Explore',
      href: '/dashboard/explore',
      icon: pathname === '/dashboard/explore' ? Search : SearchSolid,
      active: pathname === '/dashboard/explore'
    },
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: pathname === '/dashboard/messages' ? MessageCircle : MessageCircleSolid,
      active: pathname === '/dashboard/messages',
      badge: 3
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: pathname === '/dashboard/profile' ? User : UserSolid,
      active: pathname === '/dashboard/profile'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 relative"
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${item.active ? 'text-pink-500' : 'text-gray-400'}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${item.active ? 'text-pink-500 font-medium' : 'text-gray-500'}`}>
                {item.name}
              </span>
              {item.active && (
                <div className="absolute top-0 w-12 h-1 bg-pink-500 rounded-b-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}