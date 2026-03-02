'use client';

import { Footer } from '@/components/footer';
import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { AlertTriangle, CheckCircle, Clock, Mail, Shield, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function AccountDeletion() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmed) return;
        // In production, this would call the backend API
        setSubmitted(true);
    };

    const deletionSteps = [
        {
            icon: Mail,
            title: 'Submit Request',
            description: 'Fill out the form below with the email address associated with your Perlme account.',
        },
        {
            icon: Shield,
            title: 'Identity Verification',
            description: 'We will send a verification email to confirm your identity and the deletion request.',
        },
        {
            icon: Clock,
            title: 'Processing Period',
            description: 'Your request will be processed within 30 days. You may cancel during this period.',
        },
        {
            icon: Trash2,
            title: 'Account Deleted',
            description: 'After the processing period, your account and all associated data will be permanently deleted.',
        },
    ];

    const dataDeleted = [
        'Profile information (name, bio, photos, date of birth, gender, orientation)',
        'Posts, comments, and likes',
        'Direct messages and group messages',
        'Follow/follower relationships',
        'Location data',
        'User preferences and settings',
        'Report history',
        'Account credentials and authentication tokens',
        'Interest and interaction data',
    ];

    const dataRetained = [
        'Anonymized analytics data (cannot be linked back to you)',
        'Information required by law for legal compliance (may be retained for up to 90 days)',
        'Transaction records as required by financial regulations',
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
                        Account & Data Deletion
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Request the deletion of your Perlme account and all associated personal data.
                    </p>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16">
                    <h2 className="mb-8 text-2xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        How Account Deletion Works
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {deletionSteps.map((step, index) => (
                            <div
                                key={index}
                                className="relative rounded-lg border border-pink-100 dark:border-[#4a1942] dark:bg-[#2d1a2e] p-6 text-center">
                                <div
                                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${THEME_COLORS.light.primary}15` }}>
                                    <step.icon size={24} style={{ color: THEME_COLORS.light.primary }} />
                                </div>
                                <div
                                    className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                                    style={{ backgroundColor: THEME_COLORS.light.primary }}>
                                    {index + 1}
                                </div>
                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Data That Will Be Deleted */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-lg border border-pink-100 dark:border-[#4a1942] dark:bg-[#2d1a2e] p-8">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-red-600">
                            <Trash2 size={22} />
                            Data That Will Be Permanently Deleted
                        </h2>
                        <ul className="space-y-3">
                            {dataDeleted.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-pink-100 dark:border-[#4a1942] dark:bg-[#2d1a2e] p-8">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-600">
                            <AlertTriangle size={22} />
                            Data That May Be Retained
                        </h2>
                        <ul className="space-y-3">
                            {dataRetained.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                Retained data is kept only as required by law and cannot be used to identify you personally.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* In-App Deletion Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mb-16 rounded-lg border border-pink-200 dark:border-[#4a1942] bg-pink-50 dark:bg-[#2d1a2e] p-8">
                    <h2 className="mb-4 text-xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        Delete Your Account From the App
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        You can also delete your account directly from the Perlme mobile app:
                    </p>
                    <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Open the <strong>Perlme</strong> app on your device.</li>
                        <li>Go to <strong>Profile</strong> → <strong>Settings</strong>.</li>
                        <li>Scroll down and tap <strong>&quot;Delete Account&quot;</strong>.</li>
                        <li>Confirm your identity by entering your password.</li>
                        <li>Tap <strong>&quot;Permanently Delete My Account&quot;</strong> to confirm.</li>
                    </ol>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Your account will enter a 30-day grace period before permanent deletion. You can log back in during this period to cancel.
                    </p>
                </motion.div>

                {/* Deletion Request Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16 rounded-lg border border-pink-100 dark:border-[#4a1942] dark:bg-[#2d1a2e] p-8">
                    <h2 className="mb-6 text-2xl font-bold" style={{ color: THEME_COLORS.light.primary }}>
                        Request Account Deletion
                    </h2>

                    {submitted ? (
                        <div className="py-12 text-center">
                            <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Request Submitted Successfully</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We&apos;ve sent a verification email to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions to confirm your deletion request.
                            </p>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Your account will be permanently deleted within 30 days of confirmation.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Account Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter the email associated with your Perlme account"
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reason for Deletion (Optional)
                                </label>
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us why you're leaving (this helps us improve)"
                                    className="w-full resize-none rounded-lg border border-gray-300 dark:border-[#4a1942] px-4 py-3 text-gray-900 dark:text-gray-100 dark:bg-[#1a0f15] transition-colors focus:border-transparent focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': THEME_COLORS.light.primary } as React.CSSProperties}
                                />
                            </div>

                            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-red-800 dark:text-red-300">
                                        I understand that account deletion is <strong>permanent and irreversible</strong>.
                                        All my data, posts, messages, connections, and profile information will be permanently
                                        removed and cannot be recovered.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!confirmed || !email}
                                className="rounded-lg px-8 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    backgroundColor: confirmed && email ? '#dc2626' : '#9ca3af',
                                }}>
                                Submit Deletion Request
                            </button>
                        </form>
                    )}
                </motion.div>

                {/* Alternative Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-[#2d1a2e] dark:to-[#1a0f15] p-8 text-center">
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        Need help or have questions about data deletion?
                    </p>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        You can also email us directly at{' '}
                        <a href="mailto:privacy@perlme.com" className="font-medium underline" style={{ color: THEME_COLORS.light.primary }}>
                            privacy@perlme.com
                        </a>
                    </p>
                    <Link
                        href="/support"
                        className="inline-block rounded-lg px-6 py-3 font-semibold transition-all"
                        style={{
                            backgroundColor: THEME_COLORS.light.primary,
                            color: 'white',
                        }}>
                        Visit Support Center
                    </Link>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
