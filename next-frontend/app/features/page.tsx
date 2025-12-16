'use client';

import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { Globe, Heart, Lock, MessageSquare, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const features = [
    {
        icon: Heart,
        title: 'Smart Matching',
        description: 'AI-powered matching algorithm that connects you with like-minded people based on interests, preferences, and values.',
        color: '#ff3366',
    },
    {
        icon: MessageSquare,
        title: 'Real-Time Messaging',
        description: 'Instant messaging with read receipts, typing indicators, and media sharing. Connect immediately without delays.',
        color: '#0a7ea4',
    },
    {
        icon: Users,
        title: 'Group Communities',
        description: 'Create or join group chats based on shared interests. Build communities around topics you care about.',
        color: '#06b6d4',
    },
    {
        icon: Globe,
        title: 'Location-Based Discovery',
        description: 'Find people nearby and explore your local community with privacy-controlled location sharing.',
        color: '#10b981',
    },
    {
        icon: Lock,
        title: 'Privacy & Security',
        description: 'Your data is encrypted and protected. Control who sees your profile, location, and activity.',
        color: '#8b5cf6',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance ensures smooth interactions even with thousands of users online.',
        color: '#f59e0b',
    },
    {
        icon: Shield,
        title: 'Safe Community',
        description: 'Moderation system with reporting, blocking, and verification to keep the community safe.',
        color: '#ef4444',
    },
    {
        icon: TrendingUp,
        title: 'Engagement Metrics',
        description: 'Track your profile engagement, see trending content, and understand your impact in the community.',
        color: '#ec4899',
    },
];

export default function FeaturesPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        } else {
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    const bgColor = isDark ? '#151718' : '#ffffff';
    const textColor = isDark ? '#ECEDEE' : '#11181C';

    return (
        <div style={{ backgroundColor: bgColor, color: textColor }} className="transition-colors duration-300">
            <HeroHeader />

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center pt-32 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Powerful Features for
                            <span style={{ color: '#ff3366' }} className="ml-2">Connection</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-70 mb-8 leading-relaxed">
                            Discover what makes Perlme the ultimate platform for meaningful connections and community building
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{
                                        backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                        borderColor: isDark ? '#333333' : '#e0e0e0',
                                    }}
                                    className="p-6 rounded-2xl border backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                >
                                    <div
                                        style={{
                                            backgroundColor: feature.color,
                                            boxShadow: `0 0 20px ${feature.color}40`,
                                        }}
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                                    >
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="opacity-60 text-sm leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-20 px-4 border-t" style={{ borderColor: isDark ? '#333333' : '#e0e0e0' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Why Choose Perlme?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                    borderColor: isDark ? '#333333' : '#e0e0e0',
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-4">
                                    <Heart className="text-white" size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Authentic Connections</h3>
                                <p className="opacity-70 leading-relaxed">
                                    Our verification system and community guidelines ensure you`&apos;`re connecting with real people who share your values and interests.
                                </p>
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                    borderColor: isDark ? '#333333' : '#e0e0e0',
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4">
                                    <Lock className="text-white" size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Complete Privacy Control</h3>
                                <p className="opacity-70 leading-relaxed">
                                    Choose what to share, who can contact you, and manage your visibility with granular privacy settings.
                                </p>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                    borderColor: isDark ? '#333333' : '#e0e0e0',
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4">
                                    <Zap className="text-white" size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Always Lightning Fast</h3>
                                <p className="opacity-70 leading-relaxed">
                                    Optimized infrastructure ensures instant notifications, seamless messaging, and zero lag during your interactions.
                                </p>
                            </div>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                    borderColor: isDark ? '#333333' : '#e0e0e0',
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4">
                                    <Users className="text-white" size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Vibrant Communities</h3>
                                <p className="opacity-70 leading-relaxed">
                                    Join interest-based groups, discover like-minded people, and build meaningful communities around shared passions.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Connect?</h2>
                        <p className="text-lg opacity-70 mb-8">
                            Start your journey to meaningful connections with Perlme today
                        </p>
                        <Link href="/auth/login">
                            <button
                                style={{
                                    backgroundColor: '#ff3366',
                                    boxShadow: '0 0 20px #ff336640',
                                }}
                                className="px-8 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
