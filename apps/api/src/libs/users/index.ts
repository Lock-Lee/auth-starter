import { Elysia } from 'elysia';
import { prisma } from '@/libs/prisma';
import { v4 as uuidv4 } from 'uuid';

type UserCreateInput = {
  name: string;
  email: string;
  password: string;
};

export const userRoute = new Elysia({ prefix: '/users', auth: true, name: 'user-route' })

  // Get all users
  .get('/', async () => await prisma.user.findMany(), {
    auth: true,
    detail: {
      tags: ['Users'],
      summary: 'Get all users',
      responses: {
        200: {
          description: 'List of users',
        },
      },
    },
  })

  // Get user by ID
  .get(
    '/:id',
    async ({ params }) => {
      const user = await prisma.user.findUnique({ where: { id: params.id } });
      return user ?? { error: 'User not found' };
    },
    {
      auth: true,
      detail: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        params: {
          id: {
            type: 'string',
            description: 'User ID',
            example: 'a1b2c3d4',
          },
        },
        responses: {
          200: {
            description: 'User data',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    }
  )

  // Create a new user
  .post(
    '/',
    async ({ body }: { body: UserCreateInput }) => {
      const newUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: body.email,
          name: body.name,
        },
      });
      return newUser;
    },
    {
      auth: true,
      detail: {
        tags: ['Users'],
        summary: 'Create a new user',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'securePass123' },
          },
          required: ['name', 'email', 'password'],
        },
        responses: {
          201: {
            description: 'User created successfully',
          },
          400: {
            description: 'Validation error',
          },
        },
      },
    }
  )

  // Update user name
  .put(
    '/:id',
    async ({ params, body }: { params: { id: string }; body: { name: string } }) => {
      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { name: body.name },
      });
      return updatedUser;
    },
    {
      auth: true,
      detail: {
        tags: ['Users'],
        summary: 'Update user name by ID',
        params: {
          id: {
            type: 'string',
            example: 'a1b2c3d4',
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'New Name' },
          },
          required: ['name'],
        },
        responses: {
          200: {
            description: 'User updated successfully',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    }
  )

  // Delete user
  .delete(
    '/:id',
    async ({ params }) => {
      await prisma.user.delete({ where: { id: params.id } });
      return { message: 'User deleted successfully' };
    },
    {
      auth: true,
      detail: {
        tags: ['Users'],
        summary: 'Delete a user by ID',
        params: {
          id: {
            type: 'string',
            example: 'a1b2c3d4',
          },
        },
        responses: {
          200: {
            description: 'User deleted',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    }
  );
