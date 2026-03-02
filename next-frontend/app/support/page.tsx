'use client';

import { Footer } from '@/components/footer';
import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { CheckCircle, Clock, HelpCircle, Mail, MessageCircle, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function SupportPage() {
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would call the backend API
        setSubmitted(true);
    };

    const supportCategories = [
        {
            icon: HelpCircle,
            title: 'General Help',
            description: 'Questions about using Perlme, navigating features, or getting started.',
            color: '#db2777',
        },
        {
            icon: Shield,
            title: 'Safety & Privacy',
            description: 'Report abuse, harassment, or privacy concerns. Your safety is our priority.',
            color: '#e11d48',
        },
        {
            icon: MessageCircle,
            title: 'Account Issues',
            description: 'Problems with login, password reset, email verification, or account settings.',
            color: '#9333ea',
        },
        {
            icon: Mail,
            title: 'Feedback & Suggestions',
            description: 'Share ideas for new features or improvements to make Perlme better.',
            color: '#c026d3',
        },
    ];

    const faqs = [
        {
            question: 'How do I reset my password?',
            answer: 'Go to the login page and tap "Forgot Password". Enter your email address and we\'ll send you a password reset link.',
        },
        {
            question: 'How do I verify my email address?',
            answer: 'After registering, check your email for a verification code from Perlme. Enter this code in the app to verify your account.',
        },
        {
            question: 'How do I delete my account?',
            answer: 'You can delete your account from Settings in the app, or visit our Account Deletion page at perlme.com/account-deletion.',
        },
        {
            question: 'How do I report a user or inappropriate content?',
            answer: 'Tap the three dots (⋯) on any profile, post, or message, then select "Report". Choose the reason and submit. Our moderation team reviews all reports.',
        },
        {
            question: 'How do I block someone?',
            answer: 'Visit the user\'s profile, tap the three dots (⋯) menu, and select "Block". They will no longer be able to see your profile or contact you.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes. We use industry-standard encryption, secure authentication (JWT with bcrypt hashing), and follow best security practices. Read our Privacy Policy for full details.',
        },
        {
            question: 'How do I change my privacy settings?',
            answer: 'Go to Profile → Settings → Privacy. You can control profile visibility, location sharing, and who can message you.',
        },
        {
            question: 'What happens when I delete my account?',
            answer: 'Account deletion permanently removes all your data including your profile, posts, messages, and connections. There is a 30-day grace period to cancel.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50/40 to-white dark:from-[#1a0f15] dark:to-[#151718]">
            <HeroHeader />

            <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl" style={{ color: THEME_COLORS.light.primary }}>
                        Support Center
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        We&apos;re here to help. Find answers to common questions or get in touch with our team.
                    </p>
                </motion.div>

                {/* Support Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16">
                    <h2 className="mb-8 text-2xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        How Can We Help?
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {supportCategories.map((cat, index) => (
                            <div
                                key={index}
                                className="cursor-pointer rounded-lg border border-pink-100 dark:border-[#4a1942] p-6 transition-all hover:shadow-lg hover:shadow-pink-100/50 dark:hover:shadow-pink-900/20 bg-white dark:bg-[#2d1a2e]"
                                onClick={() => setCategory(cat.title)}>
                                <div
                                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${cat.color}15` }}>
                                    <cat.icon size={24} style={{ color: cat.color }} />
                                </div>
                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{cat.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mb-16 grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-pink-100 dark:border-[#4a1942] p-6 text-center">
                        <Mail size={32} className="mx-auto mb-3" style={{ color: THEME_COLORS.light.primary }} />
                        <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">Email Us</h3>
                        <a href="mailto:support@perlme.com" className="text-sm hover:underline" style={{ color: THEME_COLORS.light.primary }}>
                            support@perlme.com
                        </a>
                    </div>
                    <div className="rounded-lg border border-pink-100 dark:border-[#4a1942] p-6 text-center">
                        <Clock size={32} className="mx-auto mb-3" style={{ color: THEME_COLORS.light.primary }} />
                        <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">Response Time</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">We typically respond within 24-48 hours</p>
                    </div>
                    <div className="rounded-lg border border-pink-100 dark:border-[#4a1942] p-6 text-center">
                        <Shield size={32} className="mx-auto mb-3" style={{ color: '#e11d48' }} />
                        <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">Safety Reports</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Urgent safety concerns are prioritized</p>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16">
                    <h2 className="mb-8 text-2xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group rounded-lg border border-pink-100 dark:border-[#4a1942] [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-gray-900 dark:text-gray-100">
                                    {faq.question}
                                    <span className="ml-4 flex-shrink-0 text-pink-400 transition-transform group-open:rotate-180">
                                        ▾
                                    </span>
                                </summary>
                                <div className="border-t border-pink-100 dark:border-[#4a1942] px-6 pb-6 pt-4">
                                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">{faq.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16 rounded-lg border border-pink-100 dark:border-[#4a1942] p-8 dark:bg-[#2d1a2e]">
                    <h2 className="mb-6 text-2xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        Contact Us
                    </h2>

                    {submitted ? (
                        <div className="py-12 text-center">
                            <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Message Sent!</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Thank you for reaching out. We&apos;ll get back to you at <strong>{email}</strong> as soon as possible.
                            </p>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setName('');
                                    setEmail('');
                                    setSubject('');
                                    setMessage('');
                                    setCategory('');
                                }}
                                className="mt-6 rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                                style={{
                                    color: THEME_COLORS.light.primary,
                                    border: `1px solid ${THEME_COLORS.light.primary}`,
                                }}>
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                        style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="support-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="support-email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                        style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}>
                                    <option value="">Select a category</option>
                                    <option value="General Help">General Help</option>
                                    <option value="Safety & Privacy">Safety & Privacy</option>
                                    <option value="Account Issues">Account Issues</option>
                                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Briefly describe your issue"
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Describe your issue in detail..."
                                    className="w-full resize-none rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!name || !email || !subject || !message || !category}
                                className="rounded-lg px-8 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    backgroundColor: name && email && subject && message && category
                                        ? THEME_COLORS.light.primary
                                        : '#9ca3af',
                                }}>
                                Send Message
                            </button>
                        </form>
                    )}
                </motion.div>

                {/* Useful Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-[#2d1a2e] dark:to-[#1a0f15] p-8">
                    <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">Useful Links</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <Link href="/privacy-policy" className="rounded-lg bg-white dark:bg-[#2d1a2e] p-4 text-center shadow-sm transition-shadow hover:shadow-md">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Privacy Policy</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">How we handle your data</p>
                        </Link>
                        <Link href="/terms-of-service" className="rounded-lg bg-white dark:bg-[#2d1a2e] p-4 text-center shadow-sm transition-shadow hover:shadow-md">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Terms of Service</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Our usage agreements</p>
                        </Link>
                        <Link href="/account-deletion" className="rounded-lg bg-white dark:bg-[#2d1a2e] p-4 text-center shadow-sm transition-shadow hover:shadow-md">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Delete Account</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Request data deletion</p>
                        </Link>
                        <Link href="/about" className="rounded-lg bg-white dark:bg-[#2d1a2e] p-4 text-center shadow-sm transition-shadow hover:shadow-md">
                            <p className="font-medium text-gray-900 dark:text-gray-100">About Perlme</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Learn about our mission</p>
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
