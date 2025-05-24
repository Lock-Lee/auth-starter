'use client';

import { authClient } from '@/app/lib/auth-client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null; // แก้ตรงนี้ ให้รองรับได้
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserAndVerifyEmail = async () => {
      try {
        const result = await authClient.getSession();
        if (result.data?.user) setUser(result.data?.user);
      } catch (error) {
        console.error('Email verification failed:', error);
      }
    };

    getUserAndVerifyEmail();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Welcome to Admin </h1>

      <div className='bg-white shadow rounded-lg p-6 w-full max-w-md'>
        <div className='flex items-center space-x-4'>
          <div>
            <h2 className='text-lg font-semibold'>{user.name}</h2>
            <p className='text-sm text-gray-600'>{user.email}</p>
          </div>
        </div>
        <div className='mt-4 text-sm text-gray-500'>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
