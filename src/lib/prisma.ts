import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export async function getPrisma(): Promise<PrismaClient> {
  if (typeof window !== 'undefined') throw new Error('PrismaClient should not be used on the client')
  if (!globalForPrisma.prisma) {
    const { PrismaClient: PC } = await import('@prisma/client')
    globalForPrisma.prisma = new PC({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (prop === Symbol.toPrimitive || prop === 'then' || prop === 'toJSON' || prop === 'thenable') return undefined
    const client = getPrisma()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
