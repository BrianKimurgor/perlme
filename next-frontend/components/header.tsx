'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart, Menu, Moon, Sun, X } from 'lucide-react'
import { motion, useScroll } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

const menuItems = [
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const { scrollYProgress } = useScroll()
    const { theme, setTheme } = useTheme()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full pt-2">
                <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-background/50 backdrop-blur-2xl')}>
                    <motion.div
                        key={1}
                        className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Heart className="h-6 w-6 text-pink-600 fill-pink-600" />
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400">
                                    Perlme
                                </span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {mounted && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="h-9 w-9 p-0 text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950"
                                        aria-label="Toggle theme">
                                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>
                                )}
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-950">
                                    <Link href="/auth/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600">
                                    <Link href="/auth/register">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    )
}
