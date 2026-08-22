import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient: PC } = require('@prisma/client')
    return new PC({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch {
    return new Proxy({} as PrismaClient, {
      get(_t, p) {
        if (p === Symbol.toPrimitive || p === 'then' || p === 'toJSON') return undefined
        return (..._args: any[]) => {
          throw new Error('Database not available. Ensure DATABASE_URL is set and prisma generate has run.')
        }
      },
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
