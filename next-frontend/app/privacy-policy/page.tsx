'use client';

import React, { useEffect, useState } from 'react';
import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const sections = [
        {
            title: '1. Introduction',
            content:
                'Perlme ("we", "us", "our", or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
        },
        {
            title: '2. Information We Collect',
            content:
                'We may collect information about you in a variety of ways. The information we may collect on the Site includes:\n\n• Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.\n\n• Financial Data: Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase products or services from the Site.\n\n• Data From Social Networks: User information from social media platforms, including your name, your social media profile, and any publicly available information, consistent with your authorization.\n\n• Mobile Device Data: Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.',
        },
        {
            title: '3. Use of Your Information',
            content:
                'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n\n• Email you regarding your account or order.\n\n• Fulfill and manage purchases, orders, payments, and other transactions related to the Site.\n\n• Generate a personal profile about you in order to improve the content of the Site for you.\n\n• Increase the efficiency and operation of the Site.\n\n• Monitor and analyze usage and trends to improve the user experience with the Site.\n\n• Notify you of updates to the Site.\n\n• Offer new products, services, and/or recommendations to you.',
        },
        {
            title: '4. Disclosure of Your Information',
            content:
                'We may share information we have collected about you in certain situations:\n\n• By Law or to Protect Rights: If we believe the release of information about you is necessary to comply with the law, enforce our Site policies, or protect ours or others\' rights, property, or safety.\n\n• Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.\n\n• Business Transfers: If Perlme is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.',
        },
        {
            title: '5. Security of Your Information',
            content:
                'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.',
        },
        {
            title: '6. Contact Us',
            content:
                'If you have questions or comments about this Privacy Policy, please contact us at:\n\nPerlme\nEmail: privacy@perlme.com\nWebsite: www.perlme.com',
        },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: THEME_COLORS.light.background }}>
            <HeroHeader />

            <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl" style={{ color: THEME_COLORS.light.primary }}>
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Last updated: January 19, 2026
                    </p>
                </motion.div>

                {/* Content Sections */}
                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="rounded-lg border border-gray-200 p-8">
                            <h2
                                className="mb-4 text-2xl font-bold"
                                style={{ color: THEME_COLORS.light.primary }}>
                                {section.title}
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: sections.length * 0.1 }}
                    className="mt-16 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 p-8 text-center">
                    <p className="mb-4 text-gray-700">
                        Have questions about our privacy practices?
                    </p>
                    <Link
                        href="mailto:privacy@perlme.com"
                        className="inline-block rounded-lg px-6 py-3 font-semibold transition-all"
                        style={{
                            backgroundColor: THEME_COLORS.light.primary,
                            color: 'white',
                        }}>
                        Contact Us
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
