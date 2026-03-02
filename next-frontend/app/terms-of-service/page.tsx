'use client';

import { Footer } from '@/components/footer';
import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TermsOfService() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content:
                'By accessing or using the Perlme application ("App") and website ("Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the App or Site.\n\nThese Terms constitute a legally binding agreement between you ("User", "you", "your") and Perlme ("Company", "we", "us", "our"). We reserve the right to update or modify these Terms at any time. Your continued use of the App after any changes constitutes acceptance of the updated Terms.',
        },
        {
            title: '2. Eligibility',
            content:
                'You must be at least 18 years of age to create an account and use Perlme. By using the App, you represent and warrant that:\n\n• You are at least 18 years old.\n• You have the legal capacity to enter into a binding agreement.\n• You are not prohibited from using the App under applicable laws.\n• You have not been previously banned or removed from the platform.\n\nWe reserve the right to request verification of your age at any time and to terminate accounts that do not meet the age requirement.',
        },
        {
            title: '3. Account Registration & Security',
            content:
                'To use certain features of Perlme, you must register for an account. When registering, you agree to:\n\n• Provide accurate, current, and complete information.\n• Maintain and promptly update your account information.\n• Keep your password secure and confidential.\n• Accept responsibility for all activity that occurs under your account.\n• Notify us immediately of any unauthorized use of your account.\n\nYou may not create an account using false information, impersonate another person, or create multiple accounts. We reserve the right to suspend or terminate accounts that violate these requirements.',
        },
        {
            title: '4. User Conduct',
            content:
                'You agree to use Perlme responsibly and in compliance with all applicable laws. You agree NOT to:\n\n• Post or share content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.\n• Engage in any form of harassment, bullying, or stalking.\n• Impersonate any person or entity, or falsely state or misrepresent your identity.\n• Upload or transmit viruses, malware, or any other malicious code.\n• Attempt to access other users\' accounts without authorization.\n• Use the App for any commercial purpose without our written consent.\n• Scrape, crawl, or use automated means to collect data from the App.\n• Interfere with or disrupt the App\'s infrastructure or other users\' experiences.\n• Share sexually explicit content without appropriate classification.\n• Engage in fraudulent activity or money laundering.\n• Solicit personal information from minors.',
        },
        {
            title: '5. User-Generated Content',
            content:
                'Perlme allows users to create, post, share, and interact with content ("User Content"). By posting User Content, you:\n\n• Retain ownership of your content.\n• Grant Perlme a non-exclusive, worldwide, royalty-free, transferable license to use, display, reproduce, modify, and distribute your User Content in connection with operating and improving the App.\n• Represent that you have all rights necessary to grant this license.\n• Acknowledge that User Content may be visible to other users based on your privacy settings.\n\nWe do not endorse or guarantee the accuracy of any User Content. We reserve the right to remove any User Content that violates these Terms or our Community Guidelines.',
        },
        {
            title: '6. Privacy & Data Protection',
            content:
                'Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.\n\nBy using Perlme, you consent to:\n\n• The collection and processing of your personal data as described in our Privacy Policy.\n• Receiving communications from us related to your account and the App.\n\nYou can review our full Privacy Policy at perlme.com/privacy-policy.',
        },
        {
            title: '7. Messaging & Communication',
            content:
                'Perlme provides messaging features including direct messages and group chats. When using these features:\n\n• You are solely responsible for the content of your messages.\n• Messages may be stored on our servers as described in our Privacy Policy.\n• We may monitor messages to enforce our Terms and Community Guidelines.\n• You agree not to send spam, unsolicited messages, or automated messages.\n• We reserve the right to restrict messaging capabilities for users who violate these Terms.',
        },
        {
            title: '8. Reporting & Moderation',
            content:
                'Perlme maintains a moderation system to ensure a safe community. You may report users, posts, comments, or messages that violate our Terms.\n\n• Reports are reviewed by our moderation team.\n• We may take action including content removal, account suspension, or permanent bans.\n• False or malicious reporting may result in action against the reporting account.\n• Moderation decisions are at our sole discretion and are final.',
        },
        {
            title: '9. Account Suspension & Termination',
            content:
                'We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to:\n\n• Violation of these Terms or Community Guidelines.\n• Fraudulent, illegal, or harmful activity.\n• Extended period of inactivity.\n• Request by law enforcement or government agencies.\n\nYou may also delete your account at any time through the App settings or by visiting our Account Deletion page at perlme.com/account-deletion. Upon termination, your right to use the App ceases immediately.',
        },
        {
            title: '10. Intellectual Property',
            content:
                'The Perlme App, including its design, logos, trademarks, graphics, software, and all related content (excluding User Content), are owned by or licensed to Perlme and are protected by copyright, trademark, and other intellectual property laws.\n\nYou may not:\n\n• Copy, modify, or distribute any part of the App without written permission.\n• Use our trademarks or branding without authorization.\n• Reverse engineer, decompile, or disassemble the App.\n• Create derivative works based on the App.',
        },
        {
            title: '11. Disclaimers',
            content:
                'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.\n\nPerlme does not guarantee that:\n\n• The App will be available at all times or without interruption.\n• The App will be free from errors, bugs, or security vulnerabilities.\n• Any content on the App is accurate, reliable, or complete.\n• You will find a match or meaningful connection through the App.\n\nYour use of the App is at your sole risk.',
        },
        {
            title: '12. Limitation of Liability',
            content:
                'TO THE MAXIMUM EXTENT PERMITTED BY LAW, PERLME AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE APP.\n\nThis includes, but is not limited to, damages for loss of profits, data, goodwill, or other intangible losses, even if we have been advised of the possibility of such damages.\n\nOur total liability for any claims arising from or related to these Terms or the App shall not exceed the amount you paid to us, if any, in the 12 months preceding the claim.',
        },
        {
            title: '13. Indemnification',
            content:
                'You agree to indemnify, defend, and hold harmless Perlme and its officers, directors, employees, contractors, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of or related to:\n\n• Your use of the App.\n• Your violation of these Terms.\n• Your violation of any third-party rights.\n• Any User Content you post or share.',
        },
        {
            title: '14. Governing Law',
            content:
                'These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to conflict of law principles.\n\nAny disputes arising from these Terms or your use of the App shall be resolved through binding arbitration, except where prohibited by law. You agree to submit to the personal jurisdiction of the courts located in Nairobi, Kenya for any actions not subject to arbitration.',
        },
        {
            title: '15. Changes to Terms',
            content:
                'We may revise these Terms at any time by posting the updated version on our Site. Changes are effective immediately upon posting. We will notify you of material changes through the App or via email.\n\nYour continued use of the App after the revised Terms are posted constitutes your acceptance of the changes. If you do not agree to the updated Terms, you must stop using the App.',
        },
        {
            title: '16. Contact Us',
            content:
                'If you have any questions about these Terms of Service, please contact us at:\n\nPerlme\nEmail: legal@perlme.com\nSupport: support@perlme.com\nWebsite: www.perlme.com/support',
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
                        Terms of Service
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Last updated: March 2, 2026
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
                            className="rounded-lg border border-pink-100 dark:border-[#4a1942] dark:bg-[#2d1a2e] p-8">
                            <h2
                                className="mb-4 text-2xl font-bold"
                                style={{ color: THEME_COLORS.light.primary }}>
                                {section.title}
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
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
                    className="mt-16 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-[#2d1a2e] dark:to-[#1a0f15] p-8 text-center">
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Have questions about our Terms of Service?
                    </p>
                    <Link
                        href="mailto:legal@perlme.com"
                        className="inline-block rounded-lg px-6 py-3 font-semibold transition-all"
                        style={{
                            backgroundColor: THEME_COLORS.light.primary,
                            color: 'white',
                        }}>
                        Contact Legal Team
                    </Link>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
