import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  const isOnAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnAdmin = pathname.startsWith('/admin')
  const isOnApi = pathname.startsWith('/api')

  if (isOnApi) {
    return NextResponse.next()
  }

  if (isOnAuth) {
    if (session) {
      try {
        const user = JSON.parse(session.value)
        if (user.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch {
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  if (isOnDashboard || isOnAdmin) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      const user = JSON.parse(session.value)
      if (isOnAdmin && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
