'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'
import { MobileMenuProvider } from '@/lib/mobile-menu-context'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Sidebar />
        <div className="lg:ml-64 min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 pt-3 sm:pt-4 overflow-x-hidden" id="main-content" tabIndex={-1}>
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </div>
    </MobileMenuProvider>
  )
}
