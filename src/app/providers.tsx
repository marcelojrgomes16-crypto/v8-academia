'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { SessionProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
