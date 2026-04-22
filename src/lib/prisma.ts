import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Safe Prisma instance for Cloud Deployment.
 * If the environment variable is missing, it won't crash the whole app on load.
 */
let prismaInstance: PrismaClient | null = null;

try {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
  } else {
    // Only instantiate if we have a URL or we are in a context that allows it
    prismaInstance = new PrismaClient({
      log: ['error']
    });
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch (e) {
  console.error("Prisma failed to initialize. Database features will be unavailable.");
}

export const prisma = prismaInstance as PrismaClient;
