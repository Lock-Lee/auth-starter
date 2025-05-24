import { PrismaClient } from './generated';

const prismaClientSingleton = () =>
  new PrismaClient({}).$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          // eslint-disable-next-line no-console
          console.log(
            `[Event] Operation: ${operation} - Model: ${model} - Time: ${time.toFixed(2)}ms - Args: ${JSON.stringify(args)}`
          );
          return result;
        },
      },
    },
  });

declare const globalThis: typeof global & {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export { prisma };
