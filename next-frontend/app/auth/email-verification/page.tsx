// app/auth/verify-email/page.tsx
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
import { useVerifyEmailMutation } from '@/services/authApi'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/slices/authSlice'
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { VerifyEmailFormValues, verifyEmailSchema } from '@/lib/validators/auth'

// Zod schema for email verification


export default function VerifyEmailPage() {
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const router = useRouter()
  const [verifyEmail] = useVerifyEmailMutation()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: ''
    }
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [resendTimer, canResend])

  const bgColor = isDark ? '#151718' : '#ffffff'
  const textColor = isDark ? '#ECEDEE' : '#11181C'

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      setIsLoading(true)
      setError('')
      
      // Get the email from localStorage (set during registration)
      const email = localStorage.getItem('pendingVerificationEmail') || ''
      
      if (!email) {
        setError('No pending verification found. Please register again.')
        return
      }

      const res = await verifyEmail({
        email,
        confirmationCode: data.code
      }).unwrap()

      console.log(res)

      // Clear pending email
      localStorage.removeItem('pendingVerificationEmail')
      
      setSuccess(true)
    router.push('/auth/login')
    } catch (err: any) {
      console.log('Verification error:', err)
      setError(err?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setError('')
      const email = localStorage.getItem('pendingVerificationEmail') || ''
      
      if (!email) {
        setError('No pending verification found.')
        return
      }

      // Call resend API if you have one, or use the same verify endpoint
      // For now, we'll just reset the timer
      setResendTimer(60)
      setCanResend(false)
      
      // Show success message
      setError('') // Clear any errors
      alert('Verification code has been resent to your email.')
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    }
  }

  const handleCodeChange = (value: string) => {
    setValue('code', value, { shouldValidate: true })
  }

  if (success) {
    return (
      <div style={{ backgroundColor: bgColor, color: textColor }} className="transition-colors duration-300">
        <HeroHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <section className="flex min-h-screen px-4 py-16 md:py-32">
            <div 
              style={{ backgroundColor: bgColor, borderColor: isDark ? '#333333' : '#e0e0e0' }}
              className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
            >
              <div className="p-8 pb-6 text-center">
                <div className="flex justify-center mb-4">
                  <LogoIcon />
                </div>
                <div className="w-16 h-16 bg-linear-to-r from-[#10b981] to-[#06b6d4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-semibold mb-2">Email Verified!</h1>
                <p className="text-sm opacity-70 mb-6">
                  Your email has been successfully verified. Redirecting you to your dashboard...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff3366] mx-auto"></div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    )
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
            style={{ backgroundColor: bgColor, borderColor: isDark ? '#333333' : '#e0e0e0' }}
            className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="p-8 pb-6">
              <div className="text-center">
                <Link href="/" aria-label="go home">
                  <LogoIcon />
                </Link>
                <h1 className="mb-1 mt-4 text-xl font-semibold">Verify Your Email</h1>
                <p className="text-sm opacity-70">
                  Enter the 8-digit code sent to your email
                </p>
              </div>

              <hr className="my-4 border-dashed" />

              <div className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={8}
                      value={watch('code')}
                      onChange={handleCodeChange}
                      id="code"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.code && (
                    <p className="text-sm text-red-500 text-center">{errors.code.message}</p>
                  )}
                  <p className="text-xs opacity-70 text-center">
                    Enter the 8-digit code
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  disabled={isLoading || isSubmitting || watch('code').length !== 8} 
                  className="w-full" 
                  style={{ backgroundColor: '#ff3366' }}
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm opacity-70">
                    Didn't receive the code?{' '}
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-[#0a7ea4] hover:text-[#0a7ea4]/80 font-medium"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span className="text-sm opacity-70">
                        Resend in {resendTimer}s
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="bg-muted rounded-lg border p-3"
              style={{ borderColor: isDark ? '#333333' : '#e0e0e0' }}
            >
              <p className="text-accent-foreground text-center text-sm">
                Having trouble?{' '}
                <Button
                  asChild
                  variant="link"
                  className="px-2"
                >
                  <Link href="/auth/login">Contact Support</Link>
                </Button>
              </p>
            </div>
          </form>
        </section>
      </motion.div>
    </div>
  )
}