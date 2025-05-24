'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '../../lib/auth-client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const res = await authClient.signIn.email(data);
        if (res.data?.user) {
          router.push('/admin');
        } else {
          // Handle other statuses or errors here if needed
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [router]
  );

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-background'>
      <Card className='w-full max-w-md'>
        <CardContent className='py-8 px-6 space-y-6'>
          <h1 className='text-2xl font-semibold text-center'>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='you@example.com' {...register('email')} />
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' placeholder='••••••••' {...register('password')} />
              {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Button type='button' variant='outline' className='w-full' onClick={() => router.push('/register')}>
            Don&apos;t have an account? Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
