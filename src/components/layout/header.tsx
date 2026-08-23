'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Bell, Menu, X, LogOut, Settings, User } from 'lucide-react'
import { useSession } from '@/lib/auth-context'
import { useMobileMenu } from '@/lib/mobile-menu-context'

export function Header() {
  const { user: session, logout } = useSession()
  const { open: menuOpen, setOpen: setMenuOpen } = useMobileMenu()

  const isAdmin = session?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 border-b border-red-900/20 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 lg:ml-64 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-white h-10 w-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center text-white">1</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-[#141414] border-red-900/20">
              <DropdownMenuLabel className="text-white">Notificacoes</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-red-900/20" />
              <DropdownMenuItem className="text-sm text-gray-300 focus:bg-red-600/10">
                <div>
                  <p className="font-medium">Novo treino disponivel</p>
                  <p className="text-gray-500 text-xs">Seu professor enviou um novo treino</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-gray-300 focus:bg-red-600/10">
                <div>
                  <p className="font-medium">Pagamento vencendo</p>
                  <p className="text-gray-500 text-xs">Sua mensalidade vence em 3 dias</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-red-900/20" />
              <DropdownMenuItem asChild>
                <Link href={isAdmin ? '/admin/notificacoes' : '/dashboard/notificacoes'} className="flex w-full items-center justify-center text-red-400 hover:text-red-300">
                  Ver todas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 sm:gap-3 h-10 px-2 rounded-xl hover:bg-white/5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.image || ''} alt={session?.name || ''} />
                  <AvatarFallback className="bg-red-600/20 text-red-400 text-xs">{session?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <p className="text-sm font-medium text-white">{session?.name || 'Administrador'}</p>
                  <p className="text-[11px] text-red-400 capitalize">{session?.role === 'ADMIN' ? 'Superior Admin' : session?.role?.toLowerCase()}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#141414] border-red-900/20">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.image || ''} alt="" />
                    <AvatarFallback className="bg-red-600/20 text-red-400 text-xs">{session?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{session?.name}</p>
                    <p className="text-xs text-gray-500">{session?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-red-900/20" />
              <DropdownMenuItem asChild className="text-gray-300 focus:bg-red-600/10">
                <Link href={isAdmin ? '/admin/configuracoes' : '/dashboard/perfil'} className="flex w-full items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuracoes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-gray-300 focus:bg-red-600/10">
                <Link href={isAdmin ? '/admin' : '/dashboard/perfil'} className="flex w-full items-center gap-2">
                  <User className="h-4 w-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-red-900/20" />
              <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-300 focus:bg-red-600/10">
                <LogOut className="mr-2 h-4 w-4" />
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
