'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Account Deletion', href: '/account-deletion' },
        { name: 'Support', href: '/support' },
    ];

    const companyLinks = [
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Solutions', href: '/solutions' },
    ];

    return (
        <footer className="border-t border-pink-100 bg-gradient-to-b from-pink-50/60 to-white dark:from-[#1a0f15] dark:to-[#151718] dark:border-pink-900/30">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-pink-600 fill-pink-600" />
                            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                                Perlme
                            </h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Building meaningful connections online.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Company</h4>
                        <ul className="mt-4 space-y-2">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Contact</h4>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a
                                    href="mailto:support@perlme.com"
                                    className="text-sm text-gray-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400">
                                    support@perlme.com
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/support"
                                    className="text-sm text-gray-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400">
                                    Support Center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-pink-100 dark:border-pink-900/30" />

                {/* Copyright */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        &copy; {currentYear} Perlme. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                        Made with <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" /> for meaningful connections
                    </p>
                </div>
            </div>
        </footer>
    );
};
