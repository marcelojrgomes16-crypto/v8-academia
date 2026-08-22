/* eslint-disable @typescript-eslint/no-require-imports */

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function createClient() {
  try {
    const { PrismaClient } = require('@prisma/client')
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    return client
  } catch {
    return new Proxy({} as any, {
      get(_t, p) {
        if (p === Symbol.toPrimitive || p === 'then' || p === 'toJSON') return undefined
        return (..._args: any[]) => {
          throw new Error('Database not connected. Ensure DATABASE_URL is set.')
        }
      },
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
