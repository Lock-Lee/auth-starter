'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Eye, Trash2, Plus } from 'lucide-react';
import { userService } from '@/app/services/userService';
import { authClient } from '@/app/lib/auth-client';

type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

const userSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Password is required' }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | 'create' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const openModal = (type: typeof modalType, user: User | null = null) => {
    setSelectedUser(user);
    setModalType(type);
    reset(user ? { name: user.name, email: user.email } : { name: '', email: '' });
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
    reset();
  };

  const getUserAll = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAll();
  }, []);

  const createUser = async (data: UserFormData) => {
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
      getUserAll();
    } catch (error) {
      console.error(error);
    }
  };

  const EditUser = async (data: UserFormData) => {
    try {
      if (!data.id) return;
      await userService.update(data.id, { name: data.name });
      getUserAll();
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteUser = async (id: string) => {
    try {
      if (!id) return;
      await userService.remove(id);
      getUserAll();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (modalType === 'create') {
        const newUser = { ...data };
        createUser(newUser);
      } else if (modalType === 'edit' && selectedUser) {
        const newData = {
          id: selectedUser?.id,
          email: data.email,
          name: data.name,
          password: selectedUser.password,
        };

        EditUser(newData);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>User Management</h1>
        <Button onClick={() => openModal('create')}>
          <Plus className='mr-2 h-4 w-4' /> Create User
        </Button>
      </div>
      <Card>
        <CardContent className='p-4 overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-left border-b'>
                <th className='py-2'>Name</th>
                <th>Email</th>
                <th className='text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className='border-b hover:bg-muted/50'>
                  <td className='py-2'>{user.name}</td>
                  <td>{user.email}</td>
                  <td className='text-right space-x-2'>
                    <Button size='icon' variant='ghost' onClick={() => openModal('view', user)}>
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button size='icon' variant='ghost' onClick={() => openModal('edit', user)}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button size='icon' variant='ghost' onClick={() => openModal('delete', user)}>
                      <Trash2 className='w-4 h-4 text-red-500' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!modalType} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'view' && 'View User'}
              {modalType === 'edit' && 'Edit User'}
              {modalType === 'create' && 'Create User'}
              {modalType === 'delete' && 'Delete User'}
            </DialogTitle>
          </DialogHeader>

          {(modalType === 'edit' || modalType === 'create') && (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' {...register('name')} />
                {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' disabled={modalType === 'edit'} type='email' {...register('email')} />
                {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' disabled={modalType === 'edit'} type='password' {...register('password')} />
                {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
              </div>
              <DialogFooter>
                <Button type='submit'>{modalType === 'create' ? 'Create' : 'Save'}</Button>
              </DialogFooter>
            </form>
          )}

          {modalType === 'view' && selectedUser && (
            <div className='space-y-2'>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
            </div>
          )}

          {modalType === 'delete' && selectedUser && (
            <div className='space-y-4'>
              <p>
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
              </p>
              <DialogFooter>
                <Button
                  variant='destructive'
                  onClick={() => {
                    if (!selectedUser.id) return;
                    DeleteUser(selectedUser?.id);
                    closeModal();
                  }}
                >
                  Delete
                </Button>
                <Button variant='outline' onClick={closeModal}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
