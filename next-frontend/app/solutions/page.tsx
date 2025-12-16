'use client';

import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { BarChart3, BookOpen, Heart, Lightbulb, Target } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const solutions = [
    {
        icon: Heart,
        title: 'Find Your Perfect Match',
        description: 'Looking for meaningful connections? Our intelligent matching algorithm analyzes your interests, values, and preferences to connect you with compatible people in your area.',
        benefits: [
            'AI-powered compatibility scoring',
            'Personalized recommendations',
            'Real-time match notifications',
            'Interest-based filtering',
        ],
        color: '#ff3366',
    },
    {
        icon: Target,
        title: 'Build Your Community',
        description: 'Connect with like-minded individuals and build vibrant communities around shared interests. Create group chats, organize events, and foster meaningful relationships.',
        benefits: [
            'Easy group creation and management',
            'Role-based permissions',
            'Group discovery by interests',
            'Community moderation tools',
        ],
        color: '#0a7ea4',
    },
    {
        icon: Target,
        title: 'Express Yourself',
        description: 'Share your thoughts, photos, and experiences with your network. Create engaging posts, engage with content, and build your personal brand on the platform.',
        benefits: [
            'Rich media support',
            'Engagement metrics',
            'Trending content discovery',
            'Post scheduling',
        ],
        color: '#06b6d4',
    },
    {
        icon: Lightbulb,
        title: 'Discover What Matters',
        description: 'Explore trending topics, discover communities aligned with your interests, and stay updated with what matters most to you in real-time.',
        benefits: [
            'Personalized feed algorithm',
            'Trending topics and hashtags',
            'Interest-based recommendations',
            'Smart notifications',
        ],
        color: '#f59e0b',
    },
    {
        icon: BarChart3,
        title: 'Measure Your Impact',
        description: 'Track your engagement, monitor follower growth, and understand your influence within the Perlme community with detailed analytics.',
        benefits: [
            'Engagement statistics',
            'Follower insights',
            'Content performance metrics',
            'Growth analytics',
        ],
        color: '#10b981',
    },
    {
        icon: BookOpen,
        title: 'Learn & Grow',
        description: 'Access resources, guides, and tips to make the most of Perlme. Learn about online safety, community guidelines, and best practices for meaningful connections.',
        benefits: [
            'Safety guides and tips',
            'Community guidelines',
            'Feature tutorials',
            'Best practice articles',
        ],
        color: '#8b5cf6',
    },
];

export default function SolutionsPage() {
    const [isDark, setIsDark] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
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
                            Solutions for Every
                            <span style={{ color: '#ff3366' }} className="ml-2">Connection Goal</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-70 mb-8 leading-relaxed">
                            Whether you're looking for romance, friendship, or community, Perlme has the perfect solution for you
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((solution, index) => {
                            const Icon = solution.icon;
                            const isExpanded = expandedIndex === index;

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
                                    className="rounded-2xl border overflow-hidden backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300"
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                >
                                    <div className="p-6">
                                        <div
                                            style={{
                                                backgroundColor: solution.color,
                                                boxShadow: `0 0 20px ${solution.color}40`,
                                            }}
                                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                                        >
                                            <Icon className="text-white" size={28} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                                        <p className="opacity-60 text-sm leading-relaxed mb-4">
                                            {solution.description}
                                        </p>

                                        {/* Benefits List */}
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: isExpanded ? 'auto' : 0,
                                                opacity: isExpanded ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 border-t" style={{ borderColor: isDark ? '#333333' : '#e0e0e0' }}>
                                                <p className="text-sm font-semibold mb-3 opacity-70">Key Benefits:</p>
                                                <ul className="space-y-2">
                                                    {solution.benefits.map((benefit, i) => (
                                                        <li key={i} className="text-sm opacity-60 flex items-start">
                                                            <span
                                                                style={{ color: solution.color }}
                                                                className="mr-2 font-bold"
                                                            >
                                                                ✓
                                                            </span>
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>

                                        <button
                                            style={{ color: solution.color }}
                                            className="text-sm font-semibold mt-4 hover:opacity-70 transition-opacity"
                                        >
                                            {isExpanded ? 'Show less' : 'Learn more'} →
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 border-t" style={{ borderColor: isDark ? '#333333' : '#e0e0e0' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">How Perlme Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Create Your Profile',
                                description: 'Sign up and tell us about yourself, your interests, and what you\'re looking for.',
                            },
                            {
                                step: '2',
                                title: 'Set Your Preferences',
                                description: 'Define your preferences based on interests, location, age, and orientation.',
                            },
                            {
                                step: '3',
                                title: 'Discover & Connect',
                                description: 'Browse recommendations and connect with people who match your criteria.',
                            },
                            {
                                step: '4',
                                title: 'Build Your Network',
                                description: 'Message, group chat, and grow your community of meaningful connections.',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div
                                    style={{
                                        backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                        borderColor: isDark ? '#333333' : '#e0e0e0',
                                    }}
                                    className="p-6 rounded-2xl border h-full"
                                >
                                    <div
                                        style={{ backgroundColor: '#ff3366' }}
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                                    >
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                    <p className="opacity-60 text-sm">{item.description}</p>
                                </div>

                                {/* Arrow between steps */}
                                {index < 3 && (
                                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                                        <div style={{ color: '#ff3366' }} className="text-2xl">→</div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Perfect For</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Finding Love & Romance',
                                description: 'Meet compatible singles who share your values and interests. Find your perfect match with our advanced matching system.',
                            },
                            {
                                title: 'Making New Friends',
                                description: 'Expand your social circle and find friends who genuinely connect with you on shared interests and hobbies.',
                            },
                            {
                                title: 'Building Communities',
                                description: 'Create and manage groups around your favorite interests. Foster engaged communities of like-minded individuals.',
                            },
                            {
                                title: 'Networking & Growth',
                                description: 'Grow your professional and personal network, share knowledge, and collaborate with inspiring people.',
                            },
                        ].map((useCase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div
                                    style={{
                                        backgroundColor: isDark ? '#1f2023' : '#f5f5f5',
                                        borderColor: isDark ? '#333333' : '#e0e0e0',
                                    }}
                                    className="p-8 rounded-2xl border h-full hover:shadow-lg transition-all duration-300"
                                >
                                    <div
                                        className="w-1 h-8 rounded mb-4"
                                        style={{ backgroundColor: '#ff3366' }}
                                    />
                                    <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                                    <p className="opacity-70 leading-relaxed">{useCase.description}</p>
                                </div>
                            </motion.div>
                        ))}
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
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Find Your Solution Today</h2>
                        <p className="text-lg opacity-70 mb-8">
                            Join thousands of users finding meaningful connections on Perlme
                        </p>
                        <Link href="/auth/login">
                            <button
                                style={{
                                    backgroundColor: '#ff3366',
                                    boxShadow: '0 0 20px #ff336640',
                                }}
                                className="px-8 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                Start Now
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
