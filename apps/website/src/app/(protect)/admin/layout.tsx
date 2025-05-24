'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Sidebar */}
      <aside className='w-64 h-screen bg-gray-900 text-white p-4 flex flex-col justify-between'>
        <div>
          <h2 className='text-xl font-bold mb-6'>Admin Panel</h2>
          <nav className='flex flex-col space-y-2'>
            <Link href='/admin' className='hover:underline'>
              Dashboard
            </Link>
            <Link href='/admin/users' className='hover:underline'>
              User List
            </Link>
          </nav>
        </div>

        <div>
          <Button variant='destructive' className='w-full' onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 bg-gray-50 p-6'>{children}</main>
    </div>
  );
}
