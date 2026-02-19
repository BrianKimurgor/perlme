'use client'

import { HeroHeader } from '@/components/header'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { THEME_COLORS } from '@/lib/theme'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/services/authApi'
import { loginSchema, LoginFormValues } from '@/lib/validators/auth'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/slices/authSlice'


export default function LoginPage() {
    const [isDark, setIsDark] = useState(false);
    const router = useRouter()
    const [login, { isLoading, error }] = useLoginMutation()
    const dispatch = useAppDispatch()

    const {register,handleSubmit,formState: { errors, isSubmitting },} = useForm<LoginFormValues>({resolver: zodResolver(loginSchema),})


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        } else {
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    const bgColor = isDark ? '#151718' : '#ffffff';
    const textColor = isDark ? '#ECEDEE' : '#11181C';

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data).unwrap()

            dispatch(
                setCredentials({
                    user: res.user,
                    refreshToken: res.accessToken,
                    userType: res.user.role,
                })
            );

            router.push('/dashboard')
        } catch(error) {
            console.error('There is an error',error);
        }
    }

    return (
        <div style={{ backgroundColor: bgColor, color: textColor }} className="transition-colors duration-300">
            <HeroHeader />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <section className="flex min-h-screen px-4 py-16 md:py-32">
                    <form
                    onSubmit={handleSubmit(onSubmit)}

                    style={{ backgroundColor: bgColor}}
                        action=""
                        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                        <div className="p-8 pb-6">
                            <div>
                                <Link
                                    href="/"
                                    aria-label="go home">
                                    <LogoIcon />
                                </Link>
                                <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Perlme</h1>
                                <p className="text-sm">Welcome back! Sign in to continue</p>
                            </div>

                            <hr className="my-4 border-dashed" />

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                <Button disabled={isLoading || isSubmitting} className="w-full" style={{ backgroundColor: '#ff3366',}}>  {isLoading ? 'Signing in…' : 'Sign In'}</Button>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg border p-3">
                            <p className="text-accent-foreground text-center text-sm">
                                Don't have an account ?
                                <Button
                                    asChild
                                    variant="link"
                                    className="px-2">
                                    <Link href="/auth/register">Create account</Link>
                                </Button>
                            </p>
                        </div>
                    </form>
                </section>
            </motion.div>
        </div>
    )
}
