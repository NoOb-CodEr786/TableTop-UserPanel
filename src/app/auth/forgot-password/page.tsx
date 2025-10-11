"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Loader2, 
  ArrowRight, 
  AlertCircle,
  Clock,
  HelpCircle,
  RefreshCw
} from 'lucide-react'

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate validation error
    if (email === 'notfound@example.com') {
      setError('No account found with this email address')
      setIsLoading(false)
      return
    }
    
    console.log('Reset password for:', email)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  const handleTryAgain = () => {
    setIsSubmitted(false)
    setEmail('')
    setError('')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Check your email
            </h1>
            <p className="text-sm text-gray-600 mt-1">Password reset link sent</p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Email sent successfully
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                We've sent a password reset link to
                <br />
                <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                  {email}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Next steps
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox for the reset link</li>
                  <li>• Click the link to create a new password</li>
                  <li>• The link will expire in 24 hours</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleTryAgain}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Send another email
                </Button>
                
                <a
                  href="/auth/signin"
                  className="inline-flex items-center justify-center w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Sign In
                </a>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Didn't receive the email? Check your spam folder or{' '}
                  <a href="mailto:support@tabletop.com" className="font-medium text-blue-600 hover:text-blue-700">
                    contact support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            TableTop
          </h1>
          <p className="text-sm text-gray-600 mt-1">Reset your password</p>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address and we'll send you a secure link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    required
                    className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="mt-6 text-center">
              <a
                href="/auth/signin"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
              </a>
            </div>
            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Still having trouble?{' '}
                  <a 
                    href="mailto:support@tabletop.com" 
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact our support team
                  </a>
                </p>
                <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                  <Shield className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  <span>We typically respond within 2 hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            For your security, password reset links expire after 24 hours.{' '}
            <a href="/security" className="underline hover:text-gray-700">Learn more</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage