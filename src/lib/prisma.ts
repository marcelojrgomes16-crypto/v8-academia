import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    try {
      const { PrismaClient } = require('@prisma/client')
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch {
      globalForPrisma.prisma = new Proxy({} as PrismaClient, {
        get: (_t, p) => {
          if (p === 'then' || p === 'toJSON') return undefined
          return (...args: any[]) => { throw new Error('Database not available') }
        }
      })
    }
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (typeof prop === 'symbol') return undefined
    if (prop === 'then' || prop === 'toJSON') return undefined
    const client = getPrismaClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
