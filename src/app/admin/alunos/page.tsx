import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate, maskCPF } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  INATIVO: 'warning',
  BLOQUEADO: 'destructive',
  PENDENTE: 'info',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  BLOQUEADO: 'Bloqueado',
  PENDENTE: 'Pendente',
}

interface AlunosPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AlunosPage({ searchParams }: AlunosPageProps) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const status = typeof searchParams.status === 'string' ? searchParams.status : ''

  const where: any = {
    usuario: { role: 'ALUNO' },
  }

  if (search) {
    where.OR = [
      { usuario: { nome: { contains: search } } },
      { usuario: { email: { contains: search } } },
      { usuario: { cpf: { contains: search } } },
    ]
  }

  if (status) {
    where.usuario = { ...where.usuario, status }
  }

  const alunos = await prisma.aluno.findMany({
    where,
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          status: true,
          telefone: true,
          avatarUrl: true,
        },
      },
      plano: {
        select: { nome: true, preco: true },
      },
      professor: {
        include: {
          usuario: {
            select: { nome: true },
          },
        },
      },
    },
    orderBy: { usuario: { nome: 'asc' } },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alunos</h1>
            <p className="text-gray-400 text-sm mt-1">
              Gerencie todos os alunos da academia
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Buscar por nome, email ou CPF..."
                  className="pl-10"
                  defaultValue={search}
                />
              </div>
              <select
                name="status"
                defaultValue={status}
                className="h-10 rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos os status</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="BLOQUEADO">Bloqueado</option>
                <option value="PENDENTE">Pendente</option>
              </select>
              <Button type="submit" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </form>
          </CardContent>
        </Card>

        {alunos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-center">Nenhum aluno encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alunos.map((aluno) => (
              <Link key={aluno.id} href={`/admin/alunos/${aluno.usuarioId}`}>
                <Card className="hover:border-red-500 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-red-600/20 text-red-400 text-xs">
                          {aluno.usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{aluno.usuario.nome}</p>
                        <p className="text-sm text-gray-400 truncate">{aluno.usuario.email}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 shrink-0">
                        <span>CPF: {aluno.usuario.cpf ? maskCPF(aluno.usuario.cpf) : '—'}</span>
                        <span>Plano: {aluno.plano?.nome || '—'}</span>
                        <span>Prof: {aluno.professor?.usuario?.nome || '—'}</span>
                      </div>
                      <Badge variant={statusVariant[aluno.usuario.status]} className="shrink-0">
                        {statusLabel[aluno.usuario.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
