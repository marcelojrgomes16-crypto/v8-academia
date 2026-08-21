'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-context'
import {
  LayoutDashboard, Users, Dumbbell, Calendar, BarChart3,
  CreditCard, Wallet, TrendingUp, FileText, ChevronDown,
  ChevronRight, Settings, LogOut, UserPlus, ClipboardList,
  DollarSign, AlertTriangle, UserCheck, List, Repeat
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const adminNavGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'CADASTROS',
    items: [
      { name: 'Alunos', href: '/admin/alunos', icon: Users },
      { name: 'Planos', href: '/admin/planos', icon: ClipboardList },
      { name: 'Funcionários', href: '/admin/funcionarios', icon: UserCheck },
      { name: 'Personal Trainers', href: '/admin/professores', icon: UserPlus },
    ],
  },
  {
    title: 'FINANCEIRO',
    items: [
      { name: 'Receitas', href: '/admin/receitas', icon: DollarSign },
      { name: 'Despesas', href: '/admin/despesas', icon: Wallet },
      { name: 'Cobranças', href: '/admin/cobrancas', icon: CreditCard },
    ],
  },
  {
    title: 'TREINOS',
    items: [
      { name: 'Exercícios', href: '/admin/exercicios', icon: Dumbbell },
      { name: 'Séries', href: '/admin/series', icon: List },
      { name: 'Agendamentos', href: '/admin/aulas', icon: Calendar },
    ],
  },
  {
    title: 'RELATÓRIO',
    items: [
      { name: 'Relatório Financeiro', href: '/admin/relatorios', icon: BarChart3 },
      { name: 'Relatório de Alunos', href: '/admin/relatorios/alunos', icon: Users },
      { name: 'Relatório de Presenças', href: '/admin/relatorios/presencas', icon: Repeat },
    ],
  },
]

const alunoNavGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'MEUS TREINOS',
    items: [
      { name: 'Meus Treinos', href: '/dashboard/treinos', icon: Dumbbell },
      { name: 'Agendamentos', href: '/dashboard/agendamentos', icon: Calendar },
      { name: 'Progresso', href: '/dashboard/progresso', icon: TrendingUp },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user: session, logout } = useSession()
  const isAdmin = session?.role === 'ADMIN'
  const groups = isAdmin ? adminNavGroups : alunoNavGroups
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    groups.forEach((g) => { if (g.title) initial[g.title] = true })
    return initial
  })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-red-900/20 bg-[#0a0a0a] flex flex-col">
      <div className="flex h-16 items-center justify-center border-b border-red-900/20 px-4">
        <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
          <svg viewBox="0 0 120 60" className="h-10" xmlns="http://www.w3.org/2000/svg">
            <text x="2" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="#dc2626" fontStyle="italic">V</text>
            <text x="48" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="white" fontStyle="italic">8</text>
            <text x="8" y="58" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="4">ACADEMIA</text>
          </svg>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Navegação principal">
        {groups.map((group) => (
          <div key={group.title || 'main'}>
            {group.title && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-bold tracking-widest text-gray-500 uppercase hover:text-gray-300 transition-colors"
              >
                {group.title}
                {openGroups[group.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            )}
            {(!group.title || openGroups[group.title]) && (
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-red-900/20 p-3 space-y-1">
        <Link
          href={isAdmin ? '/admin/configuracoes' : '/dashboard/configuracoes'}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Settings className="h-4.5 w-4.5" />
          Configurações
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  )
}
