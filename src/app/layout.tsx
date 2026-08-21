import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'V8 Academia - Painel Online',
    template: '%s | V8 Academia',
  },
  description: 'Painel exclusivo para alunos e professores da V8 Academia',
  keywords: ['academia', 'treino', 'fitness', 'musculação', 'personal trainer'],
  authors: [{ name: 'V8 Academia' }],
  creator: 'V8 Academia',
  publisher: 'V8 Academia',
  robots: 'noindex, nofollow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'V8 Academia',
    title: 'V8 Academia - Painel Online',
    description: 'Painel exclusivo para alunos e professores da V8 Academia',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gym-dark text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}