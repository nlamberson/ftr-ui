'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/mutationHooks/iam'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/PasswordInput'

const formSchema = z
  .object({
    username: z.string().trim().min(2, 'Min 2 chars').max(50, 'Max 50 chars'),
    email: z.string().trim().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const registerMutation = useRegister()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values)
    // if (!values.username || !values.email || !values.password || !values.confirmPassword) {
    //   setMessage('Please fill all fields')
    //   return
    // }
    // if (values.password !== values.confirmPassword) {
    //   setMessage('Passwords do not match')
    //   return
    // }
    setMessage(null)
    try {
      const res = await registerMutation.mutateAsync({
        username: values.username,
        email: values.email,
        password: values.password,
      })
      if (res.status === 200 && res.data) {
        setMessage('Account created! You can now log in.')
        setTimeout(
          () =>
            navigate(`/registration-success?username=${encodeURIComponent(values.username)}`, {
              replace: true,
            }),
          800
        )
      } else {
        setMessage(res.message || 'Registration failed')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setMessage(msg)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>Create a new account for you to use!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input id="username" placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="mail@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline">
                  Login
                </a>
              </div>
              {message && (
                <p className="mt-4 text-center text-sm" style={{ color: '#ff6b6b' }}>
                  {message}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/404">Terms of Service</a> and{' '}
        <a href="/404">Privacy Policy</a>.
      </div>
    </div>
  )
}
