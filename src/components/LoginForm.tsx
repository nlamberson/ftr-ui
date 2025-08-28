import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as setLoggedIn } from '../auth'
import { useLogin } from '@/hooks/mutationHooks/iam'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.username || !values.password) {
      setMessage('Please enter username and password')
      return
    }
    setMessage(null)
    try {
      const result = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      })
      // TODO: Recomended from CodeRabbit to not store in local storage, setup a plan to change this later
      localStorage.setItem('token', result.token)
      setLoggedIn()
      navigate('/home', { replace: true })
    } catch (err) {
      let msg = 'Login failed'
      if (err instanceof Error) {
        msg = err.message
      }
      setMessage(msg)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <a
                              href="/404"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Password"
                              {...field}
                              id="password"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
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
