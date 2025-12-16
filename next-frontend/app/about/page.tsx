'use client';

import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { Globe, Heart, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const teamMembers = [
    {
        name: 'Gakenye Ndiritu',
        role: 'Founder & CEO',
        image: '👨‍💼',
        bio: 'Passionate about building platforms that foster meaningful human connections.',
    },
    {
        name: 'Mwangaza',
        role: 'CTO & Lead Developer',
        image: '👨‍💻',
        bio: 'Full-stack engineer with expertise in real-time applications and scalable systems.',
    },
    {
        name: 'Enock',
        role: 'Product Lead',
        image: '👨‍💼',
        bio: 'User-focused product strategist dedicated to creating intuitive, delightful experiences.',
    },
];

const milestones = [
    {
        year: '2023',
        title: 'Perlme Founded',
        description: 'Started with a vision to revolutionize how people connect online',
        icon: Heart,
    },
    {
        year: '2024',
        title: 'Mobile App Launch',
        description: 'Released iOS and Android apps, reaching 100K+ downloads',
        icon: Zap,
    },
    {
        year: '2024',
        title: 'Web Platform Launch',
        description: 'Launched web version for seamless cross-device experience',
        icon: Globe,
    },
    {
        year: '2025',
        title: 'Expanding Global',
        description: 'Growing presence in 50+ countries with localized experiences',
        icon: TrendingUp,
    },
];

const values = [
    {
        title: 'Authenticity',
        description: 'We believe in genuine connections between real people. No bots, no fake profiles, just authentic interactions.',
        icon: Heart,
    },
    {
        title: 'Privacy First',
        description: 'Your data is yours. We use industry-leading encryption and never share personal information without consent.',
        icon: 'lock',
    },
    {
        title: 'Inclusivity',
        description: 'Everyone deserves to feel welcome. We celebrate diversity and foster an inclusive community for all.',
        icon: Users,
    },
    {
        title: 'Innovation',
        description: 'We continuously improve and innovate to provide the best connection experience possible.',
        icon: Zap,
    },
];

export default function AboutPage() {
    const [isDark, setIsDark] = useState(false);

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
    const surfaceColor = isDark ? '#1f2023' : '#f5f5f5';
    const borderColor = isDark ? '#333333' : '#e0e0e0';

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
                            About
                            <span style={{ color: '#ff3366' }} className="ml-2">Perlme</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-70 mb-8 leading-relaxed">
                            We're on a mission to revolutionize how people connect, one meaningful relationship at a time
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: surfaceColor,
                                    borderColor: borderColor,
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div
                                    style={{ backgroundColor: '#ff3366' }}
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                >
                                    <Heart className="text-white" size={24} />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="opacity-70 leading-relaxed mb-4">
                                    To create a safe, inclusive, and authentic platform where people from all walks of life can connect,
                                    build meaningful relationships, and grow together as a global community.
                                </p>
                                <p className="opacity-60 leading-relaxed">
                                    We believe that genuine human connection is fundamental to a fulfilling life, and technology should
                                    facilitate, not complicate, that connection.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    backgroundColor: surfaceColor,
                                    borderColor: borderColor,
                                }}
                                className="p-8 rounded-2xl border"
                            >
                                <div
                                    style={{ backgroundColor: '#0a7ea4' }}
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                >
                                    <Globe className="text-white" size={24} />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                <p className="opacity-70 leading-relaxed mb-4">
                                    To become the world's most trusted and beloved connection platform, recognized for putting people
                                    first and fostering authentic human relationships at scale.
                                </p>
                                <p className="opacity-60 leading-relaxed">
                                    A world where geographical boundaries don't limit connection, where everyone can find their tribe, and
                                    where technology empowers rather than replaces human interaction.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section
                className="py-20 px-4 border-t"
                style={{ borderColor: borderColor }}
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Our Story</h2>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: surfaceColor,
                                borderColor: borderColor,
                            }}
                            className="p-8 rounded-2xl border"
                        >
                            <h3 className="text-2xl font-semibold mb-4">The Beginning</h3>
                            <p className="opacity-70 leading-relaxed">
                                Perlme was born from a simple observation: existing social and dating platforms had become overcomplicated,
                                filled with fake profiles, and often felt unsafe. We believed there had to be a better way—a platform built
                                on authenticity, transparency, and genuine human connection.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: surfaceColor,
                                borderColor: borderColor,
                            }}
                            className="p-8 rounded-2xl border"
                        >
                            <h3 className="text-2xl font-semibold mb-4">The Development</h3>
                            <p className="opacity-70 leading-relaxed">
                                We spent over a year researching, prototyping, and iterating based on feedback from thousands of potential
                                users. We built Perlme with cutting-edge technology, privacy-first architecture, and a user experience
                                centered on what actually matters to people.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: surfaceColor,
                                borderColor: borderColor,
                            }}
                            className="p-8 rounded-2xl border"
                        >
                            <h3 className="text-2xl font-semibold mb-4">Today & Beyond</h3>
                            <p className="opacity-70 leading-relaxed">
                                Today, Perlme is a rapidly growing community of millions of users connecting authentically across the globe.
                                We're just getting started. Our roadmap includes advanced matching algorithms, more community features, and
                                expansion into new markets—all while maintaining our commitment to safety, privacy, and authenticity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Our Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{
                                        backgroundColor: surfaceColor,
                                        borderColor: borderColor,
                                    }}
                                    className="p-6 rounded-2xl border"
                                >
                                    {typeof Icon !== 'string' && (
                                        <div
                                            style={{
                                                backgroundColor: ['#ff3366', '#0a7ea4', '#06b6d4', '#f59e0b'][index],
                                            }}
                                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                        >
                                            <Icon className="text-white" size={24} />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                    <p className="opacity-60 text-sm leading-relaxed">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Milestones */}
            <section
                className="py-20 px-4 border-t"
                style={{ borderColor: borderColor }}
            >
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Our Journey</h2>

                    <div className="relative">
                        {/* Timeline line */}
                        <div
                            style={{ backgroundColor: borderColor }}
                            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
                        />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => {
                                const Icon = milestone.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:grid-cols-2'
                                            }`}
                                    >
                                        {/* Left side (even) */}
                                        <div className={index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:order-2 md:pl-8'}>
                                            <div
                                                style={{
                                                    backgroundColor: ['#ff3366', '#0a7ea4', '#06b6d4', '#f59e0b'][index],
                                                }}
                                                className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm"
                                            >
                                                {milestone.year}
                                            </div>
                                        </div>

                                        {/* Center dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:order-2">
                                            <div
                                                style={{
                                                    backgroundColor: ['#ff3366', '#0a7ea4', '#06b6d4', '#f59e0b'][index],
                                                }}
                                                className="w-12 h-12 rounded-full flex items-center justify-center border-4 md:w-16 md:h-16"
                                                style={{
                                                    backgroundColor: ['#ff3366', '#0a7ea4', '#06b6d4', '#f59e0b'][index],
                                                    borderColor: bgColor,
                                                }}
                                            >
                                                <Icon className="text-white" size={24} />
                                            </div>
                                        </div>

                                        {/* Right side (odd) */}
                                        <div
                                            className={`${index % 2 === 0
                                                    ? 'md:order-2 md:pl-8'
                                                    : 'md:pr-8 md:text-right'
                                                }`}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: surfaceColor,
                                                    borderColor: borderColor,
                                                }}
                                                className="p-6 rounded-xl border"
                                            >
                                                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                                                <p className="opacity-60 text-sm">{milestone.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Meet the Team</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                style={{
                                    backgroundColor: surfaceColor,
                                    borderColor: borderColor,
                                }}
                                className="rounded-2xl p-8 border text-center hover:shadow-lg transition-all duration-300"
                            >
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                                <p
                                    style={{ color: '#ff3366' }}
                                    className="text-sm font-semibold mb-4"
                                >
                                    {member.role}
                                </p>
                                <p className="opacity-60 text-sm leading-relaxed">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section
                className="py-20 px-4 border-t"
                style={{ borderColor: borderColor }}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { number: '100K+', label: 'Active Users' },
                            { number: '50+', label: 'Countries' },
                            { number: '10M+', label: 'Messages Daily' },
                            { number: '98%', label: 'User Satisfaction' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#ff3366' }}>
                                    {stat.number}
                                </div>
                                <p className="opacity-60">{stat.label}</p>
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
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Join Our Community
                        </h2>
                        <p className="text-lg opacity-70 mb-8">
                            Be part of something meaningful. Start connecting today.
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