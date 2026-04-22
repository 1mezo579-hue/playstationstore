import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Robust Prisma Factory for Cloud Deployment.
 */
function getPrismaClient() {
  try {
    return new PrismaClient({
      log: ['error'],
    });
  } catch (e) {
    console.error("Critical: Prisma construction failed", e);
    return null;
  }
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}
