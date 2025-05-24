import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/libs/prisma';
import { bearer, openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  basePath: '/auth',
  plugins: [bearer(), openAPI()],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['*'],
});

const getSchema = async () => auth.api.generateOpenAPISchema();

export const authOpenAPI = {
  getPaths: (prefix = '/auth') =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        const pathValue = paths[path];
        if (pathValue) {
          reference[key] = pathValue;

          for (const method of Object.keys(pathValue)) {
            const operation = (reference[key] as Record<string, unknown>)[method];
            (operation as { tags?: string[] }).tags = ['Better Auth'];
          }
        }
      }

      return reference;
    }) as Promise<Record<string, Record<string, unknown>>>,
  components: getSchema().then(({ components }) => components) as Promise<Record<string, unknown>>,
} as const;
