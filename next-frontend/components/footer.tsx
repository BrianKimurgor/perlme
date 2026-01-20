'use client';

import { THEME_COLORS } from '@/lib/theme';
import Link from 'next/link';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
    ];

    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <h3
                            className="text-lg font-semibold"
                            style={{ color: THEME_COLORS.primary }}>
                            Perlme
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Building meaningful connections online.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Contact</h4>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a
                                    href="mailto:support@perlme.com"
                                    className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                                    support@perlme.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-gray-200" />

                {/* Copyright */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-gray-600">
                        © {currentYear} Perlme. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
