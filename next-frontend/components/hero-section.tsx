import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
    return (
        <>
        <HeroHeader />
        <main className="overflow-x-hidden">
            <section className="relative">
            <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
                <div className="relative mx-auto max-w-7xl px-4">

                {/* LEFT-ALIGNED CONTENT WRAPPER */}
                <div className="max-w-2xl text-left">

                    {/* HEADLINE */}
                    <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400">
                    Find Real Love with Perlme
                    </h1>

                    {/* SUBTEXT */}
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    Beautiful, meaningful connections made simple. Meet people who truly match your vibe.
                    </p>

                    {/* BUTTONS — ALWAYS LEFT ALIGNED */}
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-start">

                    <Button
                        asChild
                        size="lg"
                        className="h-12 rounded-full bg-pink-600 px-8 text-base font-medium hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600"
                    >
                        <Link href="/signup">
                        Start Matching
                        <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-12 rounded-full px-8 text-base"
                    >
                        <Link href="#how-it-works">See How It Works</Link>
                    </Button>

                    </div>
                </div>
                </div>

                {/* BACKGROUND VIDEO */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                    poster="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80"
                >
                    <source
                    src="https://customer-9zq0xr5r8k0wf9u0.cloudflarestream.com/9f9b8e6f9f1e4d8a8f8e4d8a8f8e4d8a/manifest/video.m3u8"
                    type="application/x-mpegURL"
                    />
                    <source
                    src="https://videos.pexels.com/video-files/854195/854195-hd_1920_1080_30fps.mp4"
                    type="video/mp4"
                    />
                </video>
                </div>
            </div>
            </section>
        </main>
        </>
    )
}
