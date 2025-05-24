'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Eye, Trash2, Plus } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
};

const mockUsers: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
];

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | 'create' | null>(null);

  const openModal = (type: typeof modalType, user: User | null = null) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
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
        <CardContent className='p-4'>
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
            <form className='space-y-4'>
              <div>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' defaultValue={selectedUser?.name || ''} />
              </div>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' defaultValue={selectedUser?.email || ''} />
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
                    setUsers(users.filter((u) => u.id !== selectedUser.id));
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
