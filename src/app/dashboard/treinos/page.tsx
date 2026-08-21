import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  PAUSADO: 'warning',
  CONCLUIDO: 'info',
  CANCELADO: 'destructive',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

export default async function TreinosPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const treinos = await prisma.treino.findMany({
    where: { alunoId: session.user.id },
    include: {
      professor: {
        select: { nome: true },
      },
      exercicios: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Treinos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Acompanhe seus treinos e exercícios
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/treinos/novo">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Treino
          </Link>
        </Button>
      </div>

      {treinos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <p className="text-gray-400 text-center mb-4">Nenhum treino encontrado</p>
            <Button asChild>
              <Link href="/dashboard/treinos/novo">Criar Primeiro Treino</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treinos.map((treino) => (
            <Link key={treino.id} href={`/dashboard/treinos/${treino.id}`}>
              <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{treino.nome}</CardTitle>
                    <Badge variant={statusVariant[treino.status]}>
                      {statusLabel[treino.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {treino.descricao && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {treino.descricao}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {treino.professor.nome}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {treino.exercicios.length} exercício{treino.exercicios.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(treino.dataInicio)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
