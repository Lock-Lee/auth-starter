'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/app/lib/auth-client';

// 1. Define schema with confirmPassword validation
const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
        });
        if (response.error) {
          alert('error :' + response?.error?.message);
          return;
        }
        router.push('/login');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
    [router]
  );

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-background'>
      <Card className='w-full max-w-md'>
        <CardContent className='py-8 px-6 space-y-6'>
          <h1 className='text-2xl font-semibold text-center'>Register</h1>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' {...register('name')} placeholder='Your name' />
              {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' {...register('email')} placeholder='you@example.com' />
              {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' {...register('password')} placeholder='••••••••' />
              {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input id='confirmPassword' type='password' {...register('confirmPassword')} placeholder='••••••••' />
              {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

            <Button type='button' variant='outline' className='w-full' onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
