'use client';

import { HeroHeader } from '@/components/header';
import { THEME_COLORS } from '@/lib/theme';
import { Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const pricingPlans = [
    {
        name: 'Free',
        price: 0,
        period: 'Forever',
        description: 'Perfect for exploring Perlme',
        color: '#687076',
        features: [
            { text: 'Basic profile creation', included: true },
            { text: 'Browse other profiles', included: true },
            { text: 'Send & receive messages', included: true },
            { text: 'Create up to 1 group', included: true },
            { text: 'Limited daily discovery', included: true },
            { text: 'Standard notifications', included: true },
            { text: 'Advanced matching', included: false },
            { text: 'Profile boost', included: false },
            { text: 'Premium filter options', included: false },
            { text: 'Priority support', included: false },
        ],
        cta: 'Get Started Free',
        ctaVariant: 'secondary',
    },
    {
        name: 'Plus',
        price: 4.99,
        period: '/month',
        description: 'For active daters',
        color: '#0a7ea4',
        featured: true,
        features: [
            { text: 'Everything in Free', included: true },
            { text: 'Advanced matching algorithm', included: true },
            { text: 'Unlimited daily discovery', included: true },
            { text: 'See who likes you', included: true },
            { text: 'Create unlimited groups', included: true },
            { text: 'Premium notifications', included: true },
            { text: 'Advanced profile analytics', included: true },
            { text: 'Monthly profile boost', included: true },
            { text: 'Premium filter options', included: false },
            { text: 'Priority support', included: false },
        ],
        cta: 'Try Plus',
        ctaVariant: 'primary',
    },
    {
        name: 'Premium',
        price: 9.99,
        period: '/month',
        description: 'For serious connections',
        color: '#ff3366',
        features: [
            { text: 'Everything in Plus', included: true },
            { text: 'Premium filter options', included: true },
            { text: 'Show up first in searches', included: true },
            { text: 'Unlimited profile boosts', included: true },
            { text: 'Advanced safety features', included: true },
            { text: 'Verified badge on profile', included: true },
            { text: 'Detailed analytics & insights', included: true },
            { text: '24/7 priority support', included: true },
            { text: 'Exclusive features access', included: true },
            { text: 'VIP community access', included: true },
        ],
        cta: 'Go Premium',
        ctaVariant: 'primary',
    },
];

export default function PricingPage() {
    const [isDark, setIsDark] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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
                            Simple, Transparent
                            <span style={{ color: '#ff3366' }} className="ml-2">Pricing</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-70 mb-8 leading-relaxed">
                            Choose the plan that works best for you. No hidden fees, cancel anytime.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Toggle */}
            <section className="py-10 px-4 flex justify-center">
                <div
                    style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
                    className="inline-flex rounded-full p-1 border"
                >
                    {['monthly', 'yearly'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setBillingPeriod(period as 'monthly' | 'yearly')}
                            style={{
                                backgroundColor:
                                    billingPeriod === period ? '#ff3366' : 'transparent',
                                color: billingPeriod === period ? 'white' : 'inherit',
                            }}
                            className="px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize"
                        >
                            {period}
                            {period === 'yearly' && (
                                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                    Save 20%
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                style={{
                                    backgroundColor: plan.featured ? surfaceColor : 'transparent',
                                    borderColor: plan.featured ? plan.color : borderColor,
                                    borderWidth: plan.featured ? 2 : 1,
                                    boxShadow: plan.featured
                                        ? `0 0 30px ${plan.color}20, 0 8px 32px rgba(0,0,0,0.1)`
                                        : 'none',
                                }}
                                className="rounded-2xl p-8 border backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-xl"
                            >
                                {/* Featured Badge */}
                                {plan.featured && (
                                    <div
                                        style={{
                                            backgroundColor: plan.color,
                                            boxShadow: `0 0 20px ${plan.color}40`,
                                        }}
                                        className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30"
                                    />
                                )}

                                {plan.featured && (
                                    <div
                                        style={{ backgroundColor: plan.color }}
                                        className="absolute top-0 right-0 px-4 py-1 text-white text-xs font-semibold rounded-bl-lg"
                                    >
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="opacity-60 text-sm mb-6">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <div className="text-5xl font-bold mb-1">
                                            {plan.price === 0 ? (
                                                <span>Free</span>
                                            ) : (
                                                <>
                                                    ${plan.price}
                                                    <span className="text-lg opacity-60 ml-1">{plan.period}</span>
                                                </>
                                            )}
                                        </div>
                                        {plan.price === 0 && (
                                            <p className="opacity-60 text-sm">{plan.period}</p>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        style={{
                                            backgroundColor:
                                                plan.ctaVariant === 'primary'
                                                    ? plan.color
                                                    : 'transparent',
                                            color: plan.ctaVariant === 'primary' ? 'white' : plan.color,
                                            borderColor: plan.color,
                                            boxShadow:
                                                plan.ctaVariant === 'primary'
                                                    ? `0 0 20px ${plan.color}40`
                                                    : 'none',
                                        }}
                                        className="w-full py-3 rounded-lg font-semibold border-2 mb-8 transition-all duration-300 hover:scale-105"
                                    >
                                        {plan.cta}
                                    </button>

                                    {/* Features */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold opacity-60 mb-4">
                                            What's included:
                                        </p>
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start">
                                                {feature.included ? (
                                                    <Check
                                                        size={20}
                                                        style={{ color: plan.color }}
                                                        className="mr-3 flex-shrink-0 mt-0.5"
                                                    />
                                                ) : (
                                                    <X
                                                        size={20}
                                                        className="mr-3 opacity-30 flex-shrink-0 mt-0.5"
                                                    />
                                                )}
                                                <span
                                                    className={`text-sm ${feature.included ? '' : 'opacity-40'
                                                        }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section
                className="py-20 px-4 border-t"
                style={{ borderColor: borderColor }}
            >
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                q: 'Can I cancel my subscription anytime?',
                                a: 'Yes! You can cancel your subscription at any time. No questions asked. Your access will continue until the end of your billing period.',
                            },
                            {
                                q: 'What payment methods do you accept?',
                                a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. Payments are processed securely.',
                            },
                            {
                                q: 'Is there a free trial?',
                                a: 'Our Free plan is permanently free and gives you access to core features. You can upgrade to Plus or Premium anytime to unlock advanced features.',
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: 'We offer a 7-day money-back guarantee if you\'re not satisfied with your paid plan. Contact our support team to request a refund.',
                            },
                            {
                                q: 'What happens when I upgrade or downgrade?',
                                a: 'Upgrades are instant. If you downgrade, you\'ll lose access to premium features immediately, but your data will be preserved.',
                            },
                            {
                                q: 'Are there student or group discounts?',
                                a: 'We offer special discounts for students (20% off) and group subscriptions (10% off for 5+ accounts). Contact our sales team for details.',
                            },
                        ].map((faq, index) => (
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
                                className="p-6 rounded-xl border"
                            >
                                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                                <p className="opacity-70 leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                        Detailed Comparison
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: surfaceColor,
                                        borderColor: borderColor,
                                    }}
                                    className="border-b"
                                >
                                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                                    <th className="text-center py-4 px-4 font-semibold">Plus</th>
                                    <th className="text-center py-4 px-4 font-semibold">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'Daily Messages', free: 'Unlimited', plus: 'Unlimited', premium: 'Unlimited' },
                                    { feature: 'Groups Created', free: '1', plus: 'Unlimited', premium: 'Unlimited' },
                                    { feature: 'Profile Views', free: 'Limited', plus: 'Unlimited', premium: 'Unlimited' },
                                    { feature: 'Advanced Filters', free: 'No', plus: 'Basic', premium: 'Full' },
                                    { feature: 'See Who Likes', free: 'No', plus: 'Yes', premium: 'Yes' },
                                    { feature: 'Profile Boost', free: 'No', plus: '1/month', premium: 'Unlimited' },
                                    { feature: 'Analytics', free: 'Basic', plus: 'Advanced', premium: 'Detailed' },
                                    { feature: 'Priority Support', free: 'No', plus: 'No', premium: '24/7' },
                                ].map((row, index) => (
                                    <tr
                                        key={index}
                                        style={{ borderColor: borderColor }}
                                        className="border-b"
                                    >
                                        <td className="py-4 px-4 font-medium">{row.feature}</td>
                                        <td className="text-center py-4 px-4">
                                            {row.free === 'No' ? (
                                                <X size={20} className="mx-auto opacity-30" />
                                            ) : (
                                                row.free
                                            )}
                                        </td>
                                        <td className="text-center py-4 px-4">
                                            {row.plus === 'No' ? (
                                                <X size={20} className="mx-auto opacity-30" />
                                            ) : (
                                                row.plus
                                            )}
                                        </td>
                                        <td className="text-center py-4 px-4">
                                            {row.premium === 'No' ? (
                                                <X size={20} className="mx-auto opacity-30" />
                                            ) : (
                                                row.premium
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                            Choose Your Perfect Plan
                        </h2>
                        <p className="text-lg opacity-70 mb-8">
                            Start free, upgrade whenever you're ready. Cancel anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                            <button
                                style={{
                                    borderColor: '#ff3366',
                                    color: '#ff3366',
                                }}
                                className="px-8 py-3 rounded-lg font-semibold border-2 hover:opacity-80 transition-all duration-300"
                            >
                                Compare Plans
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
