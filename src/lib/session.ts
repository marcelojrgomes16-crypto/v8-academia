import { cookies } from 'next/headers'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  matricula?: string
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie?.value) {
      return null
    }

    const user = JSON.parse(sessionCookie.value) as SessionUser
    return { user }
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth()

  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }

  return user
}
