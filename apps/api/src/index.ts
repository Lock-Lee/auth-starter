/* eslint-disable no-console */
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { auth, authOpenAPI } from '@/libs/auth';
import cors from '@elysiajs/cors';
import { userRoute } from './libs/users';

const PORT = process.env.PORT || 3001;

const betterAuth = new Elysia({ name: 'better-auth' }).mount(auth.handler).macro({
  auth: {
    async resolve({ error, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session) return error(401);

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      maxAge: 7200,
      preflight: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
    })
  )
  .use(betterAuth)
  .get('/', async () => {
    const openAPISchema = await auth.api.generateOpenAPISchema();
    console.log(openAPISchema);
  })
  .get('/profile', ({ user }) => user, {
    auth: true,
  })

  .use(userRoute)
  .use(
    swagger({
      documentation: {
        components: await authOpenAPI.components,
        paths: await authOpenAPI.getPaths(),
        info: {
          title: 'API Documentation',
          version: '1.0.0',
        },
      },
      scalarConfig: {
        spec: { url: '/docs/json' },
        defaultHttpClient: {
          clientKey: 'fetch',
          targetKey: 'javascript',
        },
      },
      path: '/docs',
      exclude: ['/docs', '/docs/json'],
    })
  )
  .listen(PORT);

console.log(`🦊 Elysia is running at ${app.server?.url}`);
console.log(`📖 API documentation is available at ${app.server?.url}docs`);
