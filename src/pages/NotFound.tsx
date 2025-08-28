// src/components/404Page.tsx
import React from 'react'
import { isAuthenticated } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

// TODO: Fix this to match theming when we hook up the financial APIs, its good enough for now
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</CardTitle>
          <CardDescription className="text-xl text-gray-600 dark:text-gray-300">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription className="text-gray-700 dark:text-gray-200">
              Oops! The page you're looking for doesn't exist.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            It might have been moved or deleted. Double-check the URL or try navigating back to the
            homepage.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              if (isAuthenticated()) {
                window.location.href = '/home'
              } else {
                window.location.href = '/login'
              }
            }}
          >
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFoundPage
