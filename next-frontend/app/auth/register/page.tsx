// app/auth/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, ArrowRight, Eye, EyeOff, Mail, Lock, User, Calendar, 
  Heart, Globe, FileText, Upload, X, Check, 
  User as MaleIcon, User as FemaleIcon, Smile,
  Users, UserCog, Sparkles, Rainbow
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegisterMutation } from '@/services/authApi'
import { HeroHeader } from '@/components/header'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Define step schemas separately
const step1Schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const step2Schema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required')
})

const step3Schema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  orientation: z.enum(['STRAIGHT', 'GAY', 'LESBIAN', 'BISEXUAL', 'PANSEXUAL', 'QUEER', 'OTHER'])
})

const step4Schema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must not exceed 500 characters'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  coverPhotoUrl: z.string().url().optional().or(z.literal(''))
})

type Step1FormValues = z.infer<typeof step1Schema>
type Step2FormValues = z.infer<typeof step2Schema>
type Step3FormValues = z.infer<typeof step3Schema>
type Step4FormValues = z.infer<typeof step4Schema>

const steps = [
  { id: 1, title: 'Account', icon: User },
  { id: 2, title: 'Profile', icon: Heart },
  { id: 3, title: 'Preferences', icon: Globe },
  { id: 4, title: 'Bio & Photos', icon: FileText },
]

const genderOptions = [
  { value: 'MALE', label: 'Male', icon: MaleIcon },
  { value: 'FEMALE', label: 'Female', icon: FemaleIcon },
  { value: 'OTHER', label: 'Other', icon: Smile }
] as const

const orientationOptions = [
  { value: 'STRAIGHT', label: 'Straight', icon: Users },
  { value: 'GAY', label: 'Gay', icon: User },
  { value: 'LESBIAN', label: 'Lesbian', icon: User },
  { value: 'BISEXUAL', label: 'Bisexual', icon: UserCog },
  { value: 'PANSEXUAL', label: 'Pansexual', icon: Sparkles },
  { value: 'QUEER', label: 'Queer', icon: Rainbow },
  { value: 'OTHER', label: 'Other', icon: UserCog }
] as const

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [success, setSuccess] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  const router = useRouter()
  const [register, { isLoading, error }] = useRegisterMutation()

  // Detect system theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  // React Hook Form for each step
  const step1Form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const step2Form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      dateOfBirth: ''
    }
  })

  const step3Form = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      gender: 'MALE',
      orientation: 'STRAIGHT'
    }
  })

  const step4Form = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      bio: '',
      avatarUrl: '',
      coverPhotoUrl: ''
    }
  })

  // Calculate age from date of birth
  const calculateAge = (dateString: string) => {
    if (!dateString) return 0
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Handle file upload
  const handleFileUpload = (type: 'avatar' | 'cover', file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      if (type === 'avatar') {
        setAvatarPreview(result)
        step4Form.setValue('avatarUrl', result, { shouldValidate: true })
      } else {
        setCoverPreview(result)
        step4Form.setValue('coverPhotoUrl', result, { shouldValidate: true })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle next step
  const handleNextStep = async () => {
    let isValid = false
    
    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger()
        if (isValid) {
          setCurrentStep(2)
        }
        break
      case 2:
        isValid = await step2Form.trigger()
        if (isValid) {
          const age = calculateAge(step2Form.getValues('dateOfBirth'))
          if (age < 18) {
            step2Form.setError('dateOfBirth', {
              type: 'manual',
              message: 'You must be at least 18 years old'
            })
            return
          }
          setCurrentStep(3)
        }
        break
      case 3:
        isValid = await step3Form.trigger()
        if (isValid) {
          setCurrentStep(4)
        }
        break
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Handle form submission
  const onSubmit = async () => {
    const isValid = await step4Form.trigger()
    if (!isValid) return

    if (!termsAccepted) {
      alert('Please accept the Terms of Service and Privacy Policy')
      return
    }

    // Get step 4 values
    const step4Values = step4Form.getValues()
    
    // Only include avatarUrl and coverPhotoUrl if they are actual HTTP/HTTPS URLs
    const filteredStep4Values: any = {
      bio: step4Values.bio
    }
    
    // Check if avatarUrl is a valid HTTP/HTTPS URL (not base64)
    if (step4Values.avatarUrl && step4Values.avatarUrl.startsWith('http')) {
      filteredStep4Values.avatarUrl = step4Values.avatarUrl
    }
    
    // Check if coverPhotoUrl is a valid HTTP/HTTPS URL (not base64)
    if (step4Values.coverPhotoUrl && step4Values.coverPhotoUrl.startsWith('http')) {
      filteredStep4Values.coverPhotoUrl = step4Values.coverPhotoUrl
    }

    // Combine all form data
    const formData: any = {
      ...step1Form.getValues(),
      ...step2Form.getValues(),
      ...step3Form.getValues(),
      ...filteredStep4Values,
      role: 'REGULAR'
    }

    try {
      const res = await register(formData).unwrap()
      
      localStorage.setItem('pendingVerificationEmail', formData.email)
      router.push('/auth/email-verification')
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  const bgColor = isDark ? '#151718' : '#ffffff'
  const textColor = isDark ? '#ECEDEE' : '#11181C'

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
              style={{ backgroundColor: bgColor }}
              className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
            >
              <div className="p-8 pb-6 text-center">
                <div className="w-16 h-16 bg-linear-to-r from-[#10b981] to-[#06b6d4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-xl font-semibold mb-2">Welcome to Perlme! 🎉</h1>
                <p className="text-sm opacity-70 mb-6">
                  Your account has been created successfully. Redirecting you to email verification...
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
          <div 
            className="m-auto w-full max-w-sm lg:max-w-2xl rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
            style={{ backgroundColor: bgColor }}
          >
            {/* Mobile Progress Bar */}
            <div className="lg:hidden p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70">Step {currentStep} of {steps.length}</span>
                <span className="text-sm font-medium">{steps[currentStep - 1].title}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#ff3366] to-[#0a7ea4] transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Desktop Progress Steps */}
            <div className="hidden lg:block p-6 border-b">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted ? 'bg-[#10b981] text-white' :
                          isCurrent ? 'bg-[#ff3366] text-white dark:text-white' :
                          'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          isCurrent ? 'text-gray-900 dark:text-white' : 'opacity-70'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-12 h-0.5 mx-4 ${
                          step.id < currentStep ? 'bg-[#10b981]' : 'bg-gray-200 dark:bg-gray-800'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 lg:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-lg lg:text-xl font-semibold">Create Your Account</h1>
                      <p className="text-sm opacity-70">Set up your login credentials</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          type="text"
                          {...step1Form.register('username')}
                        />
                        {step1Form.formState.errors.username && (
                          <p className="text-sm text-red-500">{step1Form.formState.errors.username.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...step1Form.register('email')}
                        />
                        {step1Form.formState.errors.email && (
                          <p className="text-sm text-red-500">{step1Form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...step1Form.register('password')}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 opacity-50" /> : <Eye className="h-4 w-4 opacity-50" />}
                          </button>
                        </div>
                        {step1Form.formState.errors.password && (
                          <p className="text-sm text-red-500">{step1Form.formState.errors.password.message}</p>
                        )}
                        <p className="text-xs opacity-70">Must be at least 8 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...step1Form.register('confirmPassword')}
                        />
                        {step1Form.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">{step1Form.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Profile Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-lg lg:text-xl font-semibold">Profile Information</h1>
                      <p className="text-sm opacity-70">Tell us about yourself</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...step2Form.register('dateOfBirth')}
                        />
                        {step2Form.formState.errors.dateOfBirth && (
                          <p className="text-sm text-red-500">{step2Form.formState.errors.dateOfBirth.message}</p>
                        )}
                        {step2Form.watch('dateOfBirth') && (
                          <p className="text-sm opacity-70">
                            You will be {calculateAge(step2Form.watch('dateOfBirth'))} years old
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium opacity-70">This helps us find better matches for you</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-lg lg:text-xl font-semibold">Your Preferences</h1>
                      <p className="text-sm opacity-70">Help us understand who you are</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Gender *</Label>
                        <div className="grid grid-cols-3 gap-2 lg:gap-3">
                          {genderOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = step3Form.watch('gender') === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => step3Form.setValue('gender', option.value)}
                                className={`p-3 lg:p-4 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-[#ff3366] bg-[#ff3366]/10 text-[#ff3366]'
                                    : 'hover:border-opacity-50'
                                }`}
                              >
                                <div className="flex flex-col items-center">
                                  <Icon className={`h-5 w-5 lg:h-6 lg:w-6 mb-1 lg:mb-2 ${isSelected ? 'text-[#ff3366]' : 'opacity-50'}`} />
                                  <div className="text-xs lg:text-sm font-medium">{option.label}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        {step3Form.formState.errors.gender && (
                          <p className="text-sm text-red-500">{step3Form.formState.errors.gender.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Orientation *</Label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                          {orientationOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = step3Form.watch('orientation') === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => step3Form.setValue('orientation', option.value)}
                                className={`p-2 lg:p-3 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-[#0a7ea4] bg-[#0a7ea4]/10 text-[#0a7ea4]'
                                    : 'hover:border-opacity-50'
                                }`}
                              >
                                <div className="flex flex-col items-center">
                                  <Icon className={`h-4 w-4 lg:h-5 lg:w-5 mb-1 ${isSelected ? 'text-[#0a7ea4]' : 'opacity-50'}`} />
                                  <div className="text-xs font-medium truncate w-full text-center">{option.label}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        {step3Form.formState.errors.orientation && (
                          <p className="text-sm text-red-500">{step3Form.formState.errors.orientation.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Bio & Photos */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-lg lg:text-xl font-semibold">Complete Your Profile</h1>
                      <p className="text-sm opacity-70">Add some personality to your profile</p>
                    </div>

                    <div className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                          <div className="flex justify-center lg:justify-start">
                            <div className="relative">
                              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                  <>
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAvatarPreview('')
                                        step4Form.setValue('avatarUrl', '')
                                      }}
                                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </>
                                ) : (
                                  <User className="h-12 w-12 opacity-30" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-center lg:text-left">
                            <label className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg cursor-pointer inline-flex items-center transition-colors">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload('avatar', file)
                                }}
                              />
                            </label>
                            <p className="text-xs opacity-70 mt-2">Recommended: Square image, 500x500px</p>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio *</Label>
                        <textarea
                          id="bio"
                          rows={4}
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3366] focus:border-transparent resize-none bg-transparent"
                          placeholder="Just a developer exploring PerlMe! Share something interesting about yourself..."
                          maxLength={500}
                          {...step4Form.register('bio')}
                        />
                        <div className="flex justify-between">
                          <p className="text-xs opacity-70">Tell others about yourself</p>
                          <p className="text-xs opacity-70">{step4Form.watch('bio')?.length || 0}/500</p>
                        </div>
                        {step4Form.formState.errors.bio && (
                          <p className="text-sm text-red-500">{step4Form.formState.errors.bio.message}</p>
                        )}
                      </div>

                      {/* Terms */}
                      <div className="flex items-start space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 h-4 w-4 text-[#ff3366] rounded focus:ring-[#ff3366] border-gray-300 dark:border-gray-700"
                        />
                        <label htmlFor="terms" className="text-sm opacity-70">
                          By creating an account, you agree to our{' '}
                          <Link href="/terms" className="text-[#0a7ea4] hover:underline">Terms of Service</Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-[#0a7ea4] hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500 text-center">
                    {'data' in error ? (error.data as any)?.message : 'Registration failed. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="p-4 lg:p-6 border-t">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="default"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || isLoading}
                  className="flex items-center text-sm lg:text-base"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="flex items-center text-sm lg:text-base"
                    style={{ backgroundColor: '#ff3366',}}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading || !termsAccepted}
                    className="text-sm lg:text-base"
                    style={{ backgroundColor: '#ff3366',}}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </span>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Login Link */}
            <div className="p-4 text-center border-t">
              <p className="text-sm opacity-70">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#ff3366] font-medium hover:text-[#ff3366]/80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}